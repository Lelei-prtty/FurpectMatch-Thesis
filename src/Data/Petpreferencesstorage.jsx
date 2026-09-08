// Simple persistence for a guardian's pet adoption preferences / lifestyle answers.
// Swap this out for a real API call (e.g. PUT /guardians/me/preferences) once the
// backend endpoint exists — the read/write shape below can stay the same.

const STORAGE_KEY = 'furpectMatch.guardianPetPreferences'

export function getPetPreferences() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.error('Failed to read pet preferences from storage', error)
    return null
  }
}

export function savePetPreferences(preferences) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    return true
  } catch (error) {
    console.error('Failed to save pet preferences to storage', error)
    return false
  }
}

export function hasPetPreferences() {
  const stored = getPetPreferences()
  if (!stored) return false
  return Object.values(stored).some((value) => value !== '' && value !== null && value !== undefined)
}