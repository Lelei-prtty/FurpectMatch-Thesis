// Option lists derived from the "Pet Guardian Data Collection Survey" responses.
// Kept in one place so the registration step and the Profile "Preferences & Lifestyle"
// tab always ask about (and display) the exact same things.

export const METRO_MANILA_AREAS = [
  'Caloocan (North)',
  'Caloocan (South)',
  'Las Piñas',
  'Makati',
  'Malabon',
  'Mandaluyong',
  'Manila',
  'Marikina',
  'Muntinlupa',
  'Navotas',
  'Parañaque',
  'Pasay',
  'Pasig',
  'Pateros',
  'Quezon City',
  'San Juan',
  'Taguig',
  'Valenzuela',
]

// Domestic pets only. Keep this in step with the species list on the provider form
// and with the species rule in the database.
export const PET_TYPES = [
  'Dog',
  'Cat',
  'Rabbit',
  'Birds / Parakeet',
  'Hamster',
  'Guinea Pig',
  'Fish',
]

// A guardian picks at least 1 and at most this many types of pet.
export const MIN_PET_TYPES = 1
export const MAX_PET_TYPES = 2

// The recommender was trained on dogs, cats and birds only, so only these can get a match
// score. Pets of other types can still be browsed, just without a match percentage.
export const SCORABLE_PET_TYPES = ['Dog', 'Cat', 'Birds / Parakeet']

/**
 * The list of pet types in a set of preferences, whichever way they were saved:
 *  - new answers keep an array in `petTypes`
 *  - older answers keep one value in `petType`
 * Types that no longer exist (Reptile, Capybara, Other) are dropped, and the old
 * "Native (Aspin / Puspin)" becomes Dog + Cat. At most MAX_PET_TYPES are kept.
 */
export function normalizePetTypes(preferences) {
  const raw = Array.isArray(preferences?.petTypes)
    ? preferences.petTypes
    : preferences?.petType
      ? [preferences.petType]
      : []
  const expanded = raw.flatMap((type) => (type === 'Native (Aspin / Puspin)' ? ['Dog', 'Cat'] : [type]))
  const valid = expanded.filter((type) => PET_TYPES.includes(type))
  return [...new Set(valid)].slice(0, MAX_PET_TYPES)
}

/**
 * The preferred breed for each chosen type, as { Dog: 'Shih Tzu', Cat: 'Persian' }.
 * Only chosen types are kept, and a type with no preference is left out. Older answers kept
 * one breed in `breedPreference` for a single type; that is carried over.
 */
export function normalizeBreedPreferences(preferences, types = normalizePetTypes(preferences)) {
  const saved =
    preferences?.breedPreferences && typeof preferences.breedPreferences === 'object'
      ? preferences.breedPreferences
      : {}
  const result = {}
  types.forEach((type) => {
    if (typeof saved[type] === 'string' && saved[type].trim()) result[type] = saved[type].trim()
  })
  if (types.length === 1 && !result[types[0]] && typeof preferences?.breedPreference === 'string') {
    const legacy = preferences.breedPreference.trim()
    if (legacy) result[types[0]] = legacy
  }
  return result
}

/**
 * Returns the preferences with the pet types and breeds tidied up:
 *  - `petTypes` (the list) and `breedPreferences` (a breed per type) are filled in
 *  - `petType` and `breedPreference` hold the first type and its breed, so older code
 *    that reads a single value keeps working
 */
export function withPetTypes(preferences) {
  if (!preferences || typeof preferences !== 'object') return preferences ?? null
  const petTypes = normalizePetTypes(preferences)
  const breedPreferences = normalizeBreedPreferences(preferences, petTypes)
  return {
    ...preferences,
    petTypes,
    petType: petTypes[0] || '',
    breedPreferences,
    breedPreference: breedPreferences[petTypes[0]] || '',
  }
}

// The recommender knows dogs, cats and birds only. The guardian form calls birds
// "Birds / Parakeet"; the pet data calls them "Bird".
export const MODEL_SPECIES = { Dog: 'Dog', Cat: 'Cat', 'Birds / Parakeet': 'Bird' }

/**
 * What to send the model for a set of saved preferences:
 *  - chosen: every pet type the person picked
 *  - answers: the preferences with only the types the model can score (hamsters, fish and
 *    the like would be rejected by the API, so those pets are browse-only)
 */
export function preferencesForModel(preferences) {
  const chosen = normalizePetTypes(preferences)
  const scorable = chosen.filter((type) => SCORABLE_PET_TYPES.includes(type))
  return {
    chosen,
    answers: { ...preferences, petTypes: scorable, petType: scorable[0] || '' },
  }
}

export const AGE_RANGE_OPTIONS = [
  'Puppy/kitten (less than 5 months)',
  '5 months old - 8 months old',
  '8 months old - 1 year old',
  '1 year old - 5 years old',
  '5 years old and above',
]

export const PET_SIZE_OPTIONS = [
  'Tiny pet-size (20cm)',
  'Lap pet-size (20cm - 35.5cm)',
  'Average pet-size (35.5cm - 61cm)',
  'Big pet-size (61cm and above)',
]

export const PET_SEX_OPTIONS = ['Male', 'Female', 'No Preference']

export const TEMPERAMENT_OPTIONS = [
  'Low reaction to loud noises, children, or sudden movements',
  'Low daily energy; content with minimal playtime',
  'Prefers quiet environments, warms up slowly to strangers',
  'Approaches strangers willingly, rarely shows aggression',
  'Needs 1-2+ hours of active play or stimulation daily',
  'Alerts owner to strangers; territorial of home space',
  'Follows owner room to room; dislikes being alone',
]

export const HOUSING_TYPE_OPTIONS = [
  'Indoor (Apartment/Condo/House with no open space)',
  'Outdoor (House with open space)',
]

export const EXERCISE_TIME_OPTIONS = [
  'Less than 30 minutes',
  '30 minutes to 1 hour',
  '1 to 2 hours',
  'More than 2 hours',
]

export const PET_STAY_OPTIONS = ['Indoor', 'Outdoor', 'Both']

export const DEFAULT_PET_PREFERENCES = {
  // Household & lifestyle
  areaInMetroManila: '',
  priorPetExperience: '',
  hasOtherPets: '',
  householdSupport: '',
  householdHasChildren: '',
  housingType: '',
  airConditioned: '',
  // Pet preferences
  petTypes: [], // 1 or 2 types (the form's checkboxes)
  petType: '', // the first chosen type, kept so older code that reads one value still works
  breedPreferences: {}, // a breed per chosen type, e.g. { Dog: 'Shih Tzu', Cat: 'Persian' }
  breedPreference: '', // the first type's breed, kept for older code
  ageRangePreference: '',
  petSizePreference: '',
  petSexPreference: '',
  temperamentPreference: '',
  // Care commitment & daily life
  activityLevel: 3,
  travelFrequency: 3,
  homeGroomingWillingness: 3,
  professionalGroomingWillingness: 3,
  feedingEffort: 3,
  dailyExerciseTime: '',
  petPrimaryStay: '',
}

// Field labels used by the read-only summary shown on the Profile page.
// Note: `petTypes` is a list, so the summary must join it (for example with ", ").
export const PET_PREFERENCES_LABELS = [
  ['areaInMetroManila', 'Area in Metro Manila'],
  ['priorPetExperience', 'Prior pet experience'],
  ['hasOtherPets', 'Other pets at home'],
  ['householdSupport', 'Household support for adoption'],
  ['householdHasChildren', 'Children in household'],
  ['housingType', 'Housing type'],
  ['airConditioned', 'Air-conditioned home'],
  ['petTypes', 'Preferred pet types'],
  ['breedPreference', 'Preferred breed'],
  ['ageRangePreference', 'Preferred age range'],
  ['petSizePreference', 'Preferred pet size'],
  ['petSexPreference', 'Preferred pet sex'],
  ['temperamentPreference', 'Preferred temperament'],
  ['activityLevel', 'Preferred activity level', '/5'],
  ['travelFrequency', 'Travel frequency', '/5'],
  ['homeGroomingWillingness', 'Home grooming willingness', '/5'],
  ['professionalGroomingWillingness', 'Professional grooming willingness', '/5'],
  ['feedingEffort', 'Feeding & meal-prep effort', '/5'],
  ['dailyExerciseTime', 'Daily exercise availability'],
  ['petPrimaryStay', 'Where the pet will primarily stay'],
]
