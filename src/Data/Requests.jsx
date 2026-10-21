import { getCurrentUser } from './Accounts.jsx'
import { supabase } from '../lib/supabaseClient.js'

// ---------------------------------------------------------------------------
// Adoption requests -- shared in-memory copy of the Supabase `applications` table
//
// Guardians see the requests they sent; providers see the requests for their pets
// (row-level security decides: guardians see their own requests, providers see
// the requests for pets they own).
// The screens read requests synchronously from this copy; loadRequests() refreshes
// it from the database, and startRequestsSync() keeps it fresh while a dashboard
// is open.
// ---------------------------------------------------------------------------

const PHOTO_BUCKET = 'pet-photos'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Pets a provider listed have uuid ids; pets from the recommender dataset don't. */
export const isUuid = (value) => typeof value === 'string' && UUID_RE.test(value)

let requestsCache = []
let cacheOwner = null
let applicants = new Map() // guardian id -> { fullName, email, phone, location } (provider side)
const locallySeen = new Set() // approval notices the guardian has just dismissed
const listeners = new Set()
let running = null
let queued = null

const photoUrl = (path) => {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl
}

function normalize(row, pet) {
  return {
    id: row.id,
    guardianId: row.guardian_id,
    providerId: pet?.provider_id ?? null,
    // Pets from the recommender dataset are identified in the UI by their dataset id.
    petId: pet?.source === 'dataset' && pet.external_id ? pet.external_id : row.pet_id,
    petName: pet?.name ?? 'Unnamed',
    petBreed: pet?.breed ?? null,
    petSpecies: pet?.species ?? null,
    petGender: pet?.gender ?? null,
    petSize: pet?.size ?? null,
    petAge: pet?.age ?? null,
    petImage: pet ? photoUrl(pet.photo_path) : null,
    area: pet?.area ?? null,
    listedBy: pet?.provider_name ?? null,
    matchPercent: row.match_percent ?? null,
    status: row.status || 'Pending',
    note: row.note || '',
    message: '',
    createdAt: row.created_at,
    decidedAt: row.decided_at,
    approvalSeenAt: row.approval_seen_at || (locallySeen.has(row.id) ? new Date().toISOString() : null),
  }
}

function notify() {
  listeners.forEach((listener) => {
    try {
      listener()
    } catch (error) {
      console.error(error)
    }
  })
}

async function doLoad() {
  const user = getCurrentUser()
  if (!user) {
    requestsCache = []
    cacheOwner = null
    applicants = new Map()
    return { ok: false, reason: 'auth' }
  }
  try {
    const { data: rows, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Failed to load adoption requests', error)
      return { ok: false, reason: 'server' }
    }

    const petIds = [...new Set(rows.map((row) => row.pet_id).filter(Boolean))]
    const guardianIds = [...new Set(rows.map((row) => row.guardian_id))].filter((id) => id !== user.id)

    const [petsResult, profilesResult] = await Promise.all([
      petIds.length
        ? supabase
            .from('pets')
            .select('id, provider_id, provider_name, source, external_id, name, species, breed, age, gender, size, area, photo_path')
            .in('id', petIds)
        : Promise.resolve({ data: [] }),
      user.role === 'provider' && guardianIds.length
        ? supabase.from('profiles').select('id, full_name, phone, location').in('id', guardianIds)
        : Promise.resolve({ data: [] }),
    ])
    if (petsResult.error) console.error('Failed to load pets for requests', petsResult.error)
    if (profilesResult.error) console.error('Failed to load applicant profiles', profilesResult.error)

    const petsById = new Map((petsResult.data || []).map((pet) => [pet.id, pet]))
    applicants = new Map(
      (profilesResult.data || []).map((profile) => [
        profile.id,
        {
          fullName: profile.full_name,
          email: '', // not stored on profiles
          phone: profile.phone || '',
          location: profile.location || '',
        },
      ])
    )
    requestsCache = rows.map((row) => normalize(row, petsById.get(row.pet_id)))
    cacheOwner = user.id
    return { ok: true }
  } catch (error) {
    console.error('Failed to load adoption requests', error)
    return { ok: false, reason: 'server' }
  }
}

function start() {
  running = doLoad().finally(() => {
    running = null
    notify()
  })
  return running
}

/**
 * Reloads this user's requests from Supabase. Resolves { ok: true } or { ok: false, reason }.
 * If a load is already running it may have started before the latest change, so
 * exactly one more load runs after it (callers always get data at least as new as the call).
 */
export function loadRequests() {
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
 * Keeps the requests fresh while a dashboard is open (on open, on window focus,
 * and every few seconds). `onChange` is called after each refresh.
 * Returns a function that stops it.
 */
export function startRequestsSync(onChange) {
  if (onChange) listeners.add(onChange)
  loadRequests()
  const timer = setInterval(() => {
    if (!document.hidden) loadRequests()
  }, 5000)
  const onFocus = () => loadRequests()
  window.addEventListener('focus', onFocus)
  return () => {
    clearInterval(timer)
    window.removeEventListener('focus', onFocus)
    if (onChange) listeners.delete(onChange)
  }
}

/** Every request the signed-in user can see (the last loaded copy). */
export function getRequestsCache() {
  return cacheOwner && cacheOwner === getCurrentUser()?.id ? requestsCache : []
}

/** Profile details of a guardian who applied to the signed-in provider's pet. */
export function getApplicantProfile(guardianId) {
  return applicants.get(guardianId) || null
}

/** Marks an approval notice as seen in the local copy right away (the database call follows). */
export function markSeenLocally(requestId) {
  locallySeen.add(requestId)
  requestsCache = requestsCache.map((request) =>
    request.id === requestId ? { ...request, approvalSeenAt: new Date().toISOString() } : request
  )
}
