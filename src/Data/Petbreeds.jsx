// Ready-made choices for the pet forms, so people pick instead of typing.
// Every list is only a starting point: the forms still accept something that isn't on it
// (an unusual breed, a particular coat), except where a form says otherwise.

export const BREEDS_BY_SPECIES = {
  Dog: [
    'Aspin', 'Akita', 'Beagle', 'Bichon Frise', 'Border Collie', 'Boxer', 'Bulldog', 'Chihuahua',
    'Chow Chow', 'Cocker Spaniel', 'Corgi', 'Dachshund', 'Doberman', 'French Bulldog', 'German Shepherd',
    'Golden Retriever', 'Great Dane', 'Jack Russell Terrier', 'Japanese Spitz', 'Labrador Retriever',
    'Maltese', 'Pit Bull', 'Pomeranian', 'Poodle', 'Pug', 'Rottweiler', 'Samoyed', 'Schnauzer',
    'Shiba Inu', 'Shih Tzu', 'Siberian Husky', 'Yorkshire Terrier', 'Mixed breed',
  ],
  Cat: [
    'Puspin', 'Abyssinian', 'American Shorthair', 'Bengal', 'Birman', 'British Shorthair',
    'Domestic Longhair', 'Domestic Shorthair', 'Exotic Shorthair', 'Himalayan', 'Maine Coon',
    'Norwegian Forest Cat', 'Persian', 'Ragdoll', 'Russian Blue', 'Scottish Fold', 'Siamese',
    'Sphynx', 'Mixed breed',
  ],
  Rabbit: [
    'Angora', 'Californian', 'Dutch', 'English Lop', 'Flemish Giant', 'Holland Lop', 'Lionhead',
    'Mini Lop', 'Mini Rex', 'Netherland Dwarf', 'Rex', 'Mixed breed',
  ],
  Bird: [
    'African Grey', 'Budgerigar (Parakeet)', 'Canary', 'Cockatiel', 'Cockatoo', 'Conure', 'Dove',
    'Finch', 'Lovebird', 'Macaw', 'Mynah', 'Parrot', 'Pigeon',
  ],
  Other: [],
}

/** Breeds to offer for a type of pet (an empty list means "just type it"). */
export const getBreedOptions = (species) => BREEDS_BY_SPECIES[species] || []

// The guardian survey names its pet types a little differently from the pet listing form.
export const NO_PREFERENCE = 'No Preference'
const SPECIES_FOR_SURVEY_TYPE = { Dog: 'Dog', Cat: 'Cat', Rabbit: 'Rabbit', 'Birds / Parakeet': 'Bird' }

/** Breeds for the "What breed do you prefer?" question: "No Preference" first, then that type's breeds. */
export function getPreferenceBreedOptions(petType) {
  if (petType === 'Native (Aspin / Puspin)') return [NO_PREFERENCE, 'Aspin', 'Puspin']
  const species = SPECIES_FOR_SURVEY_TYPE[petType]
  return species ? [NO_PREFERENCE, ...getBreedOptions(species)] : [NO_PREFERENCE]
}

// Typical size for some breeds. Only a SUGGESTION: the form fills the size in when a breed is
// picked, and the person can change it (every animal is different).
const TINY = 'Tiny pet-size'
const LAP = 'Lap pet-size'
const AVERAGE = 'Average pet-size'
const BIG = 'Big pet-size'

const SIZE_BY_BREED = {
  Dog: {
    Chihuahua: TINY, Pomeranian: TINY, 'Yorkshire Terrier': TINY, Maltese: TINY,
    'Shih Tzu': LAP, Pug: LAP, Dachshund: LAP, 'Bichon Frise': LAP, 'French Bulldog': LAP,
    'Jack Russell Terrier': LAP,
    Aspin: AVERAGE, Beagle: AVERAGE, Corgi: AVERAGE, 'Cocker Spaniel': AVERAGE, 'Border Collie': AVERAGE,
    Bulldog: AVERAGE, 'Pit Bull': AVERAGE, Boxer: AVERAGE, Schnauzer: AVERAGE, 'Shiba Inu': AVERAGE,
    'Chow Chow': AVERAGE, 'Japanese Spitz': AVERAGE,
    'Labrador Retriever': BIG, 'Golden Retriever': BIG, 'German Shepherd': BIG, 'Siberian Husky': BIG,
    Rottweiler: BIG, Doberman: BIG, Samoyed: BIG, 'Great Dane': BIG, Akita: BIG,
  },
  Cat: { 'Maine Coon': BIG, 'Norwegian Forest Cat': BIG, Ragdoll: BIG },
  Rabbit: {
    'Netherland Dwarf': TINY,
    'Holland Lop': LAP, 'Mini Lop': LAP, 'Mini Rex': LAP, Lionhead: LAP, Dutch: LAP,
    'Flemish Giant': BIG,
  },
  Bird: {
    Lovebird: TINY, 'Budgerigar (Parakeet)': TINY, Cockatiel: TINY, Canary: TINY, Finch: TINY, Conure: TINY,
    Parrot: LAP, Cockatoo: LAP, Macaw: LAP, 'African Grey': LAP,
  },
}

/** A suggested size for this breed, or null when we don't have one. */
export const suggestSize = (species, breed) => SIZE_BY_BREED[species]?.[breed] ?? null

export const COAT_COLORS = [
  'Black', 'White', 'Brown', 'Tan', 'Cream', 'Golden', 'Gray', 'Orange', 'Fawn', 'Chocolate', 'Red', 'Blue',
  'Black & white', 'Brown & white', 'Black & tan', 'Tricolor', 'Brindle', 'Calico', 'Tortoiseshell',
  'Tabby', 'Spotted', 'Merle',
]

// Common places, written "City, Province" like the rest of the app. Anything else can still be typed.
const metroManila = [
  'Caloocan', 'Las Piñas', 'Makati', 'Malabon', 'Mandaluyong', 'Manila', 'Marikina', 'Muntinlupa', 'Navotas',
  'Parañaque', 'Pasay', 'Pasig', 'Pateros', 'Quezon City', 'San Juan', 'Taguig', 'Valenzuela',
].map((city) => `${city}, Metro Manila`)

export const AREA_OPTIONS = [
  ...metroManila,
  ...['Angono', 'Antipolo', 'Baras', 'Binangonan', 'Cainta', 'Cardona', 'Jala-Jala', 'Morong', 'Pililla',
    'Rodriguez', 'San Mateo', 'Tanay', 'Taytay', 'Teresa'].map((city) => `${city}, Rizal`),
  ...['Bacoor', 'Cavite City', 'Dasmariñas', 'General Trias', 'Imus', 'Kawit', 'Silang', 'Tagaytay'].map(
    (city) => `${city}, Cavite`
  ),
  ...['Biñan', 'Cabuyao', 'Calamba', 'San Pedro', 'Santa Rosa'].map((city) => `${city}, Laguna`),
  ...['Malolos', 'Marilao', 'Meycauayan', 'San Jose del Monte'].map((city) => `${city}, Bulacan`),
]
