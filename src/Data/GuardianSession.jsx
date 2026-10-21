import { getCurrentUser } from './Accounts.jsx'
import { getRequestsCache, isUuid, loadRequests } from './Requests.jsx'
import { supabase } from '../lib/supabaseClient.js'

// DEMO-ONLY stand-in for real authentication. There's no backend auth yet, so
// this just remembers which guardian_id (from the survey dataset, e.g. "G001")
// the person is "logged in" as, so the dashboard knows which guardian to ask
// the recommender API about.
//
// Swap this out for real auth (JWT/session from a login endpoint) once that
// exists -- the read/write shape below (getGuardianId / setGuardianId) can
// stay the same so callers don't need to change.

const STORAGE_KEY = 'furpectMatch.demoGuardianId'
const DEFAULT_GUARDIAN_ID = 'G001'

export function getGuardianId() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_GUARDIAN_ID
  } catch (error) {
    console.error('Failed to read guardian id from storage', error)
    return DEFAULT_GUARDIAN_ID
  }
}

export function setGuardianId(guardianId) {
  try {
    window.localStorage.setItem(STORAGE_KEY, guardianId)
    return true
  } catch (error) {
    console.error('Failed to save guardian id to storage', error)
    return false
  }
}

// ---------------------------------------------------------------------------
// Adoption requests -- stored in the Supabase `applications` table
//
// The reads below are synchronous: they use the copy kept by Requests.jsx
// (refreshed by startRequestsSync / loadRequests). Sending and withdrawing a
// request talk to the database, so those two are async.
// ---------------------------------------------------------------------------

// Requests belong to the signed-in ACCOUNT. (The dataset guardian_id above is
// only for the recommender.)
function getOwnerId() {
  return getCurrentUser()?.id ?? getGuardianId()
}

/** This guardian's requests, newest first. */
export function getAdoptionRequests(ownerId = getOwnerId()) {
  return getRequestsCache()
    .filter((request) => request.guardianId === ownerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/** Has this guardian already sent a request for this pet? */
export function hasRequestedPet(petId, ownerId = getOwnerId()) {
  return getRequestsCache().some((request) => request.guardianId === ownerId && request.petId === petId)
}

/**
 * The pets-table id for a pet the UI shows: provider listings already use it; pets
 * from the recommender dataset are looked up by their dataset id (external_id).
 */
async function resolvePetId(pet) {
  if (isUuid(pet.id)) return pet.id
  const { data, error } = await supabase
    .from('pets')
    .select('id')
    .eq('external_id', String(pet.id))
    .maybeSingle()
  if (error) throw error
  return data?.id ?? null
}

/**
 * Sends a request for `pet` (the mapped pet object the UI uses).
 * Resolves { ok: true, request } or
 * { ok: false, reason: 'auth' | 'role' | 'session' | 'duplicate' | 'unavailable' | 'notready' | 'server' }.
 * The database enforces the rules too: guardian accounts only, the pet must still be
 * available, and one request per guardian per pet.
 */
export async function addAdoptionRequest(pet) {
  const user = getCurrentUser()
  if (!user) return { ok: false, reason: 'auth' }
  if (user.role !== 'guardian') return { ok: false, reason: 'role' }
  if (hasRequestedPet(pet.id, user.id)) return { ok: false, reason: 'duplicate' }

  try {
    // Tabs in the same browser can share one saved login. If another tab signed in as someone
    // else, the database would see that person, not this guardian -- so stop and say so.
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData?.session?.user?.id !== user.id) return { ok: false, reason: 'session' }

    const petId = await resolvePetId(pet)
    if (!petId) return { ok: false, reason: 'notready' } // a dataset pet that isn't in the database

    const { data, error } = await supabase
      .from('applications')
      .insert({
        pet_id: petId,
        guardian_id: user.id,
        // The model's match at the moment of applying (only known for recommended pets).
        match_percent: pet.matchScore !== undefined ? Math.round(pet.matchScore * 100) : null,
      })
      .select('id')
      .single()
    if (error) {
      if (error.code === '23505') return { ok: false, reason: 'duplicate' }
      console.error('Sending adoption request failed', error)
      // A row-level-security refusal means the rules said no (pet not available, not a guardian).
      // A plain "permission denied for table" is a database setup problem, not the pet.
      if (error.code === '42501' && /row-level security/i.test(error.message || '')) {
        return { ok: false, reason: 'unavailable' }
      }
      return { ok: false, reason: 'server' }
    }
    await loadRequests()
    return { ok: true, request: getRequestsCache().find((request) => request.id === data.id) ?? null }
  } catch (error) {
    console.error('Sending adoption request failed', error)
    return { ok: false, reason: 'server' }
  }
}

/** Cancels (removes) one request by its id. Resolves true if something was removed. */
export async function withdrawAdoptionRequest(requestId) {
  const user = getCurrentUser()
  if (!user) return false
  try {
    const { data, error } = await supabase
      .from('applications')
      .delete()
      .eq('id', requestId)
      .eq('guardian_id', user.id)
      .select('id')
    if (error) {
      console.error('Withdrawing adoption request failed', error)
      return false
    }
    await loadRequests()
    return Boolean(data && data.length > 0)
  } catch (error) {
    console.error('Withdrawing adoption request failed', error)
    return false
  }
}
