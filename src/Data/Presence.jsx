import { useEffect } from 'react'
import { getCurrentUser } from './Accounts.jsx'
import { supabase } from '../lib/supabaseClient.js'

// ---------------------------------------------------------------------------
// "Active now" / "Active 5m ago"
//
// While a signed-in person has the app open AND visible, a small heartbeat
// saves the time they were last active in `profiles.last_seen_at`. The chat shows
// the other person's status from that column. Database rules only let you read
// the profile of someone you share an application with, so only the person you
// are chatting with is ever shown, never a public list.
//
// describePresence() is synchronous: it reads a small in-memory copy that
// loadPresence() fills (Messaging.jsx calls it after each refresh).
// ---------------------------------------------------------------------------

const BEAT_MS = 30000 // how often we record activity while the app is visible
const ONLINE_WINDOW_MS = 90000 // seen within this long ago = "Active now" (3 missed beats)
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // older than a week: show nothing

const lastSeen = new Map() // user id -> ms since epoch

/** Records "active right now" for this user. */
export async function touchPresence(user = getCurrentUser()) {
  if (!user) return false
  const now = Date.now()
  lastSeen.set(user.id, now)
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ last_seen_at: new Date(now).toISOString() })
      .eq('id', user.id)
    if (error) {
      console.error('Failed to save presence', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Failed to save presence', error)
    return false
  }
}

/** Loads when these people were last active (only people you share an application with are returned). */
export async function loadPresence(userIds) {
  const ids = [...new Set((userIds || []).filter(Boolean))]
  if (ids.length === 0) return false
  try {
    const { data, error } = await supabase.from('profiles').select('id, last_seen_at').in('id', ids)
    if (error) {
      console.error('Failed to load presence', error)
      return false
    }
    ;(data || []).forEach((row) => {
      if (row.last_seen_at) lastSeen.set(row.id, new Date(row.last_seen_at).getTime())
    })
    return true
  } catch (error) {
    console.error('Failed to load presence', error)
    return false
  }
}

/** When this user was last active (ms since epoch), or null if never. */
export function getLastSeen(userId) {
  const value = userId ? lastSeen.get(userId) : null
  return typeof value === 'number' ? value : null
}

/**
 * { online: boolean, label: string } for a user. `label` is '' when there is
 * nothing worth showing (never seen, or more than a week ago).
 */
export function describePresence(userId, now = Date.now()) {
  const seen = getLastSeen(userId)
  if (seen === null) return { online: false, label: '' }
  const age = Math.max(0, now - seen)
  if (age < ONLINE_WINDOW_MS) return { online: true, label: 'Active now' }
  if (age > MAX_AGE_MS) return { online: false, label: '' }

  const minutes = Math.max(1, Math.floor(age / 60000))
  if (minutes < 60) return { online: false, label: `Active ${minutes}m ago` }
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return { online: false, label: `Active ${hours}h ago` }
  const days = Math.floor(hours / 24)
  return { online: false, label: days === 1 ? 'Active yesterday' : `Active ${days}d ago` }
}

/**
 * Call once at the top of each dashboard. Keeps this person's "last active"
 * fresh while the app is open and visible; stops when the tab is hidden.
 */
export function usePresenceHeartbeat() {
  useEffect(() => {
    let lastBeat = 0
    const beat = (force) => {
      if (document.visibilityState !== 'visible') return
      const now = Date.now()
      if (!force && now - lastBeat < 20000) return // throttle busy input events
      lastBeat = now
      touchPresence()
    }
    const onActivity = () => beat(false)

    beat(true)
    const timer = setInterval(() => beat(true), BEAT_MS)
    window.addEventListener('focus', onActivity)
    window.addEventListener('pointerdown', onActivity)
    window.addEventListener('keydown', onActivity)
    document.addEventListener('visibilitychange', onActivity)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', onActivity)
      window.removeEventListener('pointerdown', onActivity)
      window.removeEventListener('keydown', onActivity)
      document.removeEventListener('visibilitychange', onActivity)
    }
  }, [])
}
