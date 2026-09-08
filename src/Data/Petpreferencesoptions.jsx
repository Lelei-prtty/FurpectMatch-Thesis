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

export const PET_TYPES = [
  'Dog',
  'Cat',
  'Rabbit',
  'Birds / Parakeet',
  'Reptile',
  'Native (Aspin / Puspin)',
  'Capybara',
  'Other',
]

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
  petType: '',
  breedPreference: '',
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
export const PET_PREFERENCES_LABELS = [
  ['areaInMetroManila', 'Area in Metro Manila'],
  ['priorPetExperience', 'Prior pet experience'],
  ['hasOtherPets', 'Other pets at home'],
  ['householdSupport', 'Household support for adoption'],
  ['householdHasChildren', 'Children in household'],
  ['housingType', 'Housing type'],
  ['airConditioned', 'Air-conditioned home'],
  ['petType', 'Preferred pet type'],
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