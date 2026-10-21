import { getCurrentUser } from './Accounts.jsx'
import { getApplicantProfile, getRequestsCache, markSeenLocally } from './Requests.jsx'
import { supabase } from '../lib/supabaseClient.js'
import { describePresence, loadPresence } from './Presence.jsx'

// ---------------------------------------------------------------------------
// Messaging -- stored in the Supabase `messages` table
//
// One conversation per adoption request, shared by the guardian who applied and
// the provider who owns the pet. A chat opens when the provider APPROVES the
// request (the database adds the "approved" notice itself). If the request is
// later set to anything else, the history stays visible but nobody can send new
// messages. The database enforces all of this too: only the two people in a
// request can read or write its messages, and only while it is Approved.
//
// The screens read synchronously from an in-memory copy (messageRows). Call
// startMessagesSync() while a dashboard is open to keep it fresh (live updates
// through Supabase Realtime, plus a short poll as a fallback). Photos are kept in
// the private `chat-images` Storage bucket and shown through short-lived links.
// ---------------------------------------------------------------------------

export const MAX_MESSAGE_LENGTH = 1000 // matches the database limit
// The chat shrinks photos before sending (see ChatPanel); this is the hard ceiling
// on what a single message may carry (~330 KB of image data).
export const MAX_IMAGE_CHARS = 450000
const IMAGE_PATTERN = /^data:image\/(jpeg|png|webp|gif);base64,/
const IMAGE_BUCKET = 'chat-images'
const SIGNED_URL_SECONDS = 3600
const MAX_LOADED_MESSAGES = 2000

let messageRows = [] // raw rows from `messages` that this user may see
let messagesOwner = null
const signedUrls = new Map() // image_path -> { url, at }
const localImages = new Map() // message id -> data URL of photos this user just sent
const listeners = new Set()
let running = null
let queued = null

const byTime = (a, b) => new Date(a.createdAt) - new Date(b.createdAt)

function ownRows() {
  return messagesOwner && messagesOwner === getCurrentUser()?.id ? messageRows : []
}

export function getRequest(requestId) {
  return getRequestsCache().find((request) => request.id === requestId) || null
}

/** 'guardian' | 'provider' | null -- this user's side of this request. */
function roleIn(request, user) {
  if (!request || !user) return null
  if (request.guardianId === user.id) return 'guardian'
  if (request.providerId === user.id) return 'provider'
  return null
}

/** A database row -> the message shape the chat screens use. */
function toMessage(row, request) {
  const senderRole =
    row.kind === 'system' ? 'system' : row.sender_id === request.guardianId ? 'guardian' : 'provider'
  return {
    id: row.id,
    requestId: row.application_id,
    senderRole,
    senderId: row.sender_id,
    text: row.body || '',
    image: row.image_path ? localImages.get(row.id) ?? signedUrls.get(row.image_path)?.url ?? null : null,
    createdAt: row.created_at,
    read: row.read_at != null, // read by the OTHER person yet?
  }
}

// ---------------------------------------------------------------------------
// Loading + live updates
// ---------------------------------------------------------------------------

async function ensureSignedUrls(rows) {
  const now = Date.now()
  const stale = [
    ...new Set(
      rows
        .map((row) => row.image_path)
        .filter((path) => path && (!signedUrls.has(path) || now - signedUrls.get(path).at > 50 * 60 * 1000))
    ),
  ]
  if (stale.length === 0) return
  const { data, error } = await supabase.storage.from(IMAGE_BUCKET).createSignedUrls(stale, SIGNED_URL_SECONDS)
  if (error) {
    console.error('Failed to prepare chat photos', error)
    return
  }
  ;(data || []).forEach((item) => {
    if (item.signedUrl && item.path) signedUrls.set(item.path, { url: item.signedUrl, at: now })
  })
}

async function doLoad() {
  const user = getCurrentUser()
  if (!user) {
    messageRows = []
    messagesOwner = null
    return { ok: false, reason: 'auth' }
  }
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(MAX_LOADED_MESSAGES)
    if (error) {
      console.error('Failed to load messages', error)
      return { ok: false, reason: 'server' }
    }
    const rows = (data || []).reverse()
    await ensureSignedUrls(rows)
    messageRows = rows
    messagesOwner = user.id

    // "Active now" for the people this user is chatting with.
    const others = getRequestsCache().map((request) =>
      user.role === 'provider' ? request.guardianId : request.providerId
    )
    loadPresence(others)
    return { ok: true }
  } catch (error) {
    console.error('Failed to load messages', error)
    return { ok: false, reason: 'server' }
  }
}

function start() {
  running = doLoad().finally(() => {
    running = null
    listeners.forEach((listener) => {
      try {
        listener()
      } catch (error) {
        console.error(error)
      }
    })
  })
  return running
}

/** Reloads this user's messages. A load already running may be older than the latest change, so one more runs after it. */
export function loadMessages() {
  if (!running) return start()
  if (!queued) {
    queued = running.then(() => {
      queued = null
      return start()
    })
  }
  return queued
}

/**
 * Keeps messages fresh while a dashboard is open: live (Supabase Realtime), on window
 * focus, and every few seconds as a fallback. `onChange` runs after each refresh.
 * Returns a function that stops it.
 */
export function startMessagesSync(onChange) {
  if (onChange) listeners.add(onChange)
  loadMessages()
  const timer = setInterval(() => {
    if (!document.hidden) loadMessages()
  }, 4000)
  const onFocus = () => loadMessages()
  window.addEventListener('focus', onFocus)

  let channel = null
  try {
    channel = supabase
      .channel(`messages-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => loadMessages())
      .subscribe()
  } catch (error) {
    console.error('Live chat updates unavailable (falling back to refreshing)', error)
  }

  return () => {
    clearInterval(timer)
    window.removeEventListener('focus', onFocus)
    if (onChange) listeners.delete(onChange)
    if (channel) supabase.removeChannel(channel)
  }
}

// ---------------------------------------------------------------------------
// Threads
// ---------------------------------------------------------------------------

/** Messages of one conversation, oldest first. Empty unless this user is part of it. */
export function getThread(requestId, user = getCurrentUser()) {
  const request = getRequest(requestId)
  if (!roleIn(request, user)) return []
  return ownRows()
    .filter((row) => row.application_id === requestId)
    .map((row) => toMessage(row, request))
    .sort(byTime)
}

async function uploadImage(dataUrl, requestId) {
  const blob = await (await fetch(dataUrl)).blob()
  const extension = (blob.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg')
  const path = `${requestId}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, blob, { contentType: blob.type || 'image/jpeg', upsert: false })
  if (error) throw error
  return path
}

/**
 * Sends a message as the signed-in user: text, a photo (data URL), or both.
 * Resolves { ok: true, message } or
 * { ok: false, reason: 'auth' | 'missing' | 'forbidden' | 'closed' | 'empty' | 'toolong' | 'badimage' | 'photo' | 'server' }.
 */
export async function sendMessage(requestId, text, user = getCurrentUser(), image = null) {
  if (!user) return { ok: false, reason: 'auth' }
  const request = getRequest(requestId)
  if (!request) return { ok: false, reason: 'missing' }
  if (!roleIn(request, user)) return { ok: false, reason: 'forbidden' }
  if (request.status !== 'Approved') return { ok: false, reason: 'closed' }

  const trimmed = (text || '').trim()
  if (!trimmed && !image) return { ok: false, reason: 'empty' }
  if (trimmed.length > MAX_MESSAGE_LENGTH) return { ok: false, reason: 'toolong' }
  if (image && (typeof image !== 'string' || !IMAGE_PATTERN.test(image) || image.length > MAX_IMAGE_CHARS)) {
    return { ok: false, reason: 'badimage' }
  }

  try {
    // Tabs in the same browser can share one saved login; make sure it's this user's.
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData?.session?.user?.id !== user.id) return { ok: false, reason: 'auth' }

    let imagePath = null
    if (image) {
      try {
        imagePath = await uploadImage(image, requestId)
      } catch (error) {
        console.error('Uploading chat photo failed', error)
        return { ok: false, reason: 'photo' }
      }
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        application_id: requestId,
        sender_id: user.id,
        kind: 'user',
        body: trimmed,
        image_path: imagePath,
      })
      .select()
      .single()
    if (error) {
      console.error('Sending message failed', error)
      if (imagePath) supabase.storage.from(IMAGE_BUCKET).remove([imagePath]).catch(() => {})
      return { ok: false, reason: error.code === '42501' ? 'closed' : 'server' }
    }

    if (image) localImages.set(data.id, image) // show the photo straight away
    messagesOwner = user.id
    messageRows = [...ownRows(), data]
    return { ok: true, message: toMessage(data, request) }
  } catch (error) {
    console.error('Sending message failed', error)
    return { ok: false, reason: 'server' }
  }
}

/**
 * Kept so the provider screen's call still works: the database now puts the
 * "application approved" notice at the top of the chat itself, so this just
 * refreshes the messages.
 */
export function startApprovedThread() {
  loadMessages()
  return true
}

/** Marks the other person's messages in this conversation as read. */
export function markThreadRead(requestId, user = getCurrentUser()) {
  const request = getRequest(requestId)
  if (!user || !roleIn(request, user)) return
  const unread = ownRows().filter(
    (row) => row.application_id === requestId && !row.read_at && row.sender_id !== user.id
  )
  if (unread.length === 0) return

  // Update the local copy right away (so the badge clears), then tell the database.
  const ids = new Set(unread.map((row) => row.id))
  const stamp = new Date().toISOString()
  messageRows = messageRows.map((row) => (ids.has(row.id) ? { ...row, read_at: stamp } : row))
  supabase
    .rpc('mark_thread_read', { p_application_id: requestId })
    .then(({ error }) => {
      if (error) console.error('Marking messages as read failed', error)
    })
}

// ---------------------------------------------------------------------------
// Conversation list
// ---------------------------------------------------------------------------

/**
 * This user's conversations, most recent first. A conversation is listed while
 * its request is Approved, or if it already has messages (history stays
 * readable if the request is later changed, but is marked closed).
 */
export function getConversations(user = getCurrentUser()) {
  if (!user) return []
  const requests = getRequestsCache()

  const rowsByRequest = new Map()
  ownRows().forEach((row) => {
    if (!rowsByRequest.has(row.application_id)) rowsByRequest.set(row.application_id, [])
    rowsByRequest.get(row.application_id).push(row)
  })

  let mine
  let role
  if (user.role === 'provider') {
    role = 'provider'
    mine = requests.filter((request) => request.providerId === user.id)
  } else {
    role = 'guardian'
    mine = requests.filter((request) => request.guardianId === user.id)
  }

  return mine
    .map((request) => {
      const thread = (rowsByRequest.get(request.id) || []).map((row) => toMessage(row, request)).sort(byTime)
      const real = thread.filter((message) => message.senderRole !== 'system')
      if (request.status !== 'Approved' && real.length === 0) return null
      const last = thread[thread.length - 1]
      const otherId = role === 'provider' ? request.guardianId : request.providerId
      return {
        requestId: request.id,
        petId: request.petId,
        petName: request.petName,
        petImage: request.petImage || null,
        otherName:
          role === 'provider'
            ? getApplicantProfile(request.guardianId)?.fullName || 'Guardian'
            : request.listedBy || 'Pet provider',
        otherId,
        presence: describePresence(otherId),
        open: request.status === 'Approved',
        lastText: last ? last.text || (last.image ? 'Sent a photo' : '') : '',
        lastAt: last ? last.createdAt : request.decidedAt || request.createdAt,
        unread: real.filter((message) => !message.read && message.senderRole !== role).length,
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt))
}

/** Total unread messages across this user's conversations. */
export function getUnreadCount(user = getCurrentUser()) {
  return getConversations(user).reduce((sum, conversation) => sum + conversation.unread, 0)
}

// ---------------------------------------------------------------------------
// "Your application was approved" notice (guardian side)
// ---------------------------------------------------------------------------

/** This guardian's approved requests that they haven't been told about yet. */
export function getUnseenApprovals(user = getCurrentUser()) {
  if (!user) return []
  return getRequestsCache()
    .filter((request) => request.guardianId === user.id && request.status === 'Approved' && !request.approvalSeenAt)
    .sort((a, b) => new Date(a.decidedAt || a.createdAt) - new Date(b.decidedAt || b.createdAt))
}

/**
 * Records that the guardian has seen the approval notice, so it shows only once.
 * The local copy updates immediately (so the notice closes right away); the
 * database update follows. Resolves true if the database was updated.
 */
export async function markApprovalSeen(requestId, user = getCurrentUser()) {
  if (!user) return false
  const request = getRequest(requestId)
  if (!request || request.guardianId !== user.id) return false
  markSeenLocally(requestId)
  try {
    const { error } = await supabase.rpc('mark_approval_seen', { p_application_id: requestId })
    if (error) {
      console.error('Saving the approval notice failed', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Saving the approval notice failed', error)
    return false
  }
}
