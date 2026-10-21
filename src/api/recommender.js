// Client for the FastAPI recommender service (pet_gnn_pipeline/api/app.py).
// Vite exposes env vars via import.meta.env, not process.env -- set
// VITE_API_BASE in a .env file at the project root to point somewhere other
// than localhost (see .env.example).
import { tidyLabel } from '../utils/petFilters.js'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

async function handle(res) {
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    // FastAPI sends { "detail": "..." } -- show just the readable part when we can.
    let message = body || res.statusText
    try {
      const parsed = JSON.parse(body)
      if (typeof parsed.detail === 'string') message = parsed.detail
    } catch {
      // not JSON -- keep the raw text
    }
    throw new Error(message || `Request failed (${res.status})`)
  }
  return res.json()
}

/** Top-k recommended pets for a guardian already present in the training data. */
export async function getRecommendations(guardianId, k = 6) {
  return handle(await fetch(`${API_BASE}/recommend/${encodeURIComponent(guardianId)}?k=${k}`))
}

/**
 * Matches for the person's OWN preference answers (the registration / Profile
 * form), scored by the model as if they were one more survey guardian.
 * Resolves { source, pet_type, message, recommendations }. `message` is set
 * (with an empty list) when there is nothing to recommend, e.g. a type of
 * animal that has no listings. Rejects with a readable message if the answers
 * can't be scored (e.g. no preferred pet type chosen yet).
 */
export async function getRecommendationsForPreferences(preferences, k = 6) {
  return handle(
    await fetch(`${API_BASE}/recommend/preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: preferences, k }),
    })
  )
}

/** List of all guardians in the dataset -- handy for a demo guardian picker. */
export async function getGuardians() {
  return handle(await fetch(`${API_BASE}/guardians`))
}

/** Every pet in the dataset (not personalized -- use getRecommendations for that). */
export async function getPets() {
  return handle(await fetch(`${API_BASE}/pets`))
}

/** Single guardian's profile. */
export async function getGuardian(guardianId) {
  return handle(await fetch(`${API_BASE}/guardians/${encodeURIComponent(guardianId)}`))
}

/** API health check -- { status, guardians, pets }. */
export async function getHealth() {
  return handle(await fetch(`${API_BASE}/health`))
}

/**
 * Maps a raw API pet object (from /pets or /recommend) onto the shape the
 * guardian UI uses. Every field here comes straight from the dataset -- no
 * invented values. Anything the dataset doesn't have for a pet is null, and
 * the UI shows it as "not provided" rather than guessing.
 *
 * `image` is the pet's real uploaded photo (Google Drive thumbnail) or null.
 * `matchScore` (0-1) only exists on /recommend results.
 */
export function mapPet(apiPet) {
  const kidsFriendly =
    apiPet.friendly_with_children === 'Yes' ? true
    : apiPet.friendly_with_children === 'No' ? false
    : null

  return {
    id: apiPet.pet_id,
    name: apiPet.pet_name || 'Unnamed',
    species: apiPet.pet_type,
    breed: apiPet.pet_breed,
    age: tidyLabel(apiPet.pet_age),
    gender: apiPet.pet_sex,
    size: tidyLabel(apiPet.pet_size),
    image: apiPet.photo_url || null,
    area: apiPet.area || null,
    listedBy: apiPet.provider_type || null,
    temperament: apiPet.pet_temperament || null,
    goodWithKids: kidsFriendly,
    // 1-5 survey scales
    activityLevel: apiPet.pet_activity_level ?? null,
    aloneTolerance: apiPet.alone_tolerance ?? null,
    otherAnimals: apiPet.interaction_other_animals ?? null,
    outdoorFrequency: apiPet.outdoor_frequency || null,
    exercise: apiPet.exercise || null,
    housing: apiPet.housing || null,
    careInstructions: apiPet.care_instructions || null,
    // match_percent is normalized per-guardian (see app.py) so it has real
    // visual spread; raw `score` is cosine similarity, which saturates near
    // 1.0 and isn't meaningful to show directly as a percentage.
    ...(apiPet.match_percent !== undefined ? { matchScore: apiPet.match_percent / 100 } : {}),
  }
}

// Same mapping; kept as a named export for the "Recommended for You" section.
export const mapRecommendedPet = mapPet