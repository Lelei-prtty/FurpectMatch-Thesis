// A guardian's pet adoption preferences / lifestyle answers, saved in Supabase
// (`guardian_profiles.preferences`), so they follow the account to any device.
//
// getPetPreferences() / hasPetPreferences() stay synchronous: they read an
// in-memory copy. Call `await loadPetPreferences()` once when a screen opens to fill
// it. savePetPreferences() updates that copy immediately and then saves to the
// database; it resolves true/false, so callers that care should `await` it.
//
// Answers an earlier version kept in this browser's localStorage are moved to the
// account the first time they're loaded.
import { getCurrentUser } from './Accounts.jsx'
import { supabase } from '../lib/supabaseClient.js'

const LEGACY_BASE_KEY = 'furpectMatch.guardianPetPreferences'
const legacyKey = (userId) => (userId ? `${LEGACY_BASE_KEY}.${userId}` : LEGACY_BASE_KEY)

let cache = { userId: null, value: null, loaded: false }

const idFor = (userId) => userId ?? getCurrentUser()?.id ?? null

const hasValues = (preferences) =>
  Boolean(preferences) &&
  typeof preferences === 'object' &&
  Object.values(preferences).some((value) => value !== '' && value !== null && value !== undefined)

function readLegacy(userId) {
  try {
    const raw = window.localStorage.getItem(legacyKey(userId))
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.error('Failed to read old pet preferences from storage', error)
    return null
  }
}

function clearLegacy(userId) {
  try {
    window.localStorage.removeItem(legacyKey(userId))
  } catch {
    // nothing to do
  }
}

async function writePreferences(userId, preferences) {
  try {
    const { data, error } = await supabase
      .from('guardian_profiles')
      .update({ preferences })
      .eq('id', userId)
      .select('id')
    if (error) {
      console.error('Failed to save pet preferences', error)
      return false
    }
    if (data && data.length > 0) return true

    // Older accounts may not have a row yet: create it.
    const { error: insertError } = await supabase.from('guardian_profiles').insert({ id: userId, preferences })
    if (insertError) {
      console.error('Failed to save pet preferences', insertError)
      return false
    }
    return true
  } catch (error) {
    console.error('Failed to save pet preferences', error)
    return false
  }
}

/** Reads this account's preferences from Supabase into memory. Resolves them (or null). */
export async function loadPetPreferences(userId) {
  const id = idFor(userId)
  if (!id) return null
  try {
    const { data, error } = await supabase
      .from('guardian_profiles')
      .select('preferences')
      .eq('id', id)
      .maybeSingle()
    if (error) {
      console.error('Failed to load pet preferences', error)
      return getPetPreferences(id)
    }

    let value = hasValues(data?.preferences) ? data.preferences : null
    if (!value) {
      // One-time move of answers an earlier version kept in this browser.
      const legacy = readLegacy(id)
      if (hasValues(legacy) && (await writePreferences(id, legacy))) {
        value = legacy
        clearLegacy(id)
      }
    }
    cache = { userId: id, value, loaded: true }
    return value
  } catch (error) {
    console.error('Failed to load pet preferences', error)
    return getPetPreferences(id)
  }
}

/** The in-memory copy (call loadPetPreferences first); null if none saved. */
export function getPetPreferences(userId) {
  const id = idFor(userId)
  if (id && cache.userId === id && cache.loaded) return cache.value
  return readLegacy(id) // before the first load: whatever this browser still had
}

/** Saves the answers. Resolves true if the database was updated, false otherwise. */
export async function savePetPreferences(preferences, userId) {
  const id = idFor(userId)
  if (!id) return false

  const before = cache.userId === id ? cache : { userId: id, value: null, loaded: false }
  cache = { userId: id, value: preferences, loaded: true } // screens see the new answers right away

  const saved = await writePreferences(id, preferences)
  if (!saved) {
    cache = { ...before, userId: id }
    return false
  }
  clearLegacy(id)
  return true
}

export function hasPetPreferences(userId) {
  return hasValues(getPetPreferences(userId))
}
