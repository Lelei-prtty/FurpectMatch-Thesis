// Search + filter logic for the pet catalog. Pure functions (no React) so
// they're easy to reason about and test.

export const ALL = 'All'

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

/** Lowercase, strip accents ("Las Piñas" -> "las pinas"), collapse whitespace. */
export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/** Cleans survey-entry whitespace quirks, e.g. "Lap pet-size ( 20cm - 35.5cm)". */
export function tidyLabel(value) {
  if (value === null || value === undefined) return value
  return String(value)
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s+/g, ' ')
    .trim()
}

function toWords(value) {
  return normalizeText(value).split(/[^a-z0-9]+/).filter(Boolean)
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

// Fields people are likely to type. `primary` fields rank higher in results.
const PRIMARY_FIELDS = ['name', 'breed']
const SECONDARY_FIELDS = [
  'species', 'gender', 'size', 'age', 'area', 'listedBy',
  'temperament', 'housing', 'exercise', 'outdoorFrequency', 'careInstructions',
]

/**
 * Every whitespace-separated search term must match the START of a word in
 * the pet's searchable text (so "cat" finds cats but not "location"; "shih
 * tzu" finds Shih Tzus; "pinas" finds "Las Piñas"). Returns a relevance score
 * (0 = no match) so name/breed hits can be ranked above incidental hits in
 * long text like care notes.
 */
export function searchScore(pet, query) {
  const tokens = normalizeText(query).split(' ').filter(Boolean)
  if (tokens.length === 0) return 1

  const primaryWords = PRIMARY_FIELDS.flatMap((f) => toWords(pet[f]))
  const secondaryWords = SECONDARY_FIELDS.flatMap((f) => toWords(pet[f]))
  // A "Both" listing covers dogs AND cats, so "dog" / "cat" should find it,
  // matching what the species dropdown does.
  if (pet.species === 'Both') secondaryWords.push('dog', 'cat')

  let score = 0
  for (const token of tokens) {
    if (primaryWords.some((w) => w.startsWith(token))) score += 2
    else if (secondaryWords.some((w) => w.startsWith(token))) score += 1
    else return 0 // AND semantics: every term must match somewhere
  }
  return score
}

// ---------------------------------------------------------------------------
// Dropdown filters
// ---------------------------------------------------------------------------

// "Both" = one listing covering several animals (dogs AND cats). It should
// show up under either a Dog or a Cat filter rather than being hidden by both.
function speciesMatches(pet, selected) {
  if (selected === ALL) return true
  if (pet.species === selected) return true
  return pet.species === 'Both' && (selected === 'Dog' || selected === 'Cat')
}

const FILTERS = {
  species: (pet, selected) => speciesMatches(pet, selected),
  size: (pet, selected) => selected === ALL || pet.size === selected,
  age: (pet, selected) => selected === ALL || pet.age === selected,
}

// Natural display order instead of whatever order the data arrives in.
const SIZE_ORDER = ['tiny', 'lap', 'average', 'big']
const AGE_ORDER = ['puppy', '5 months', '8 months', '1 year', '5 years']

function rankByPrefix(label, order) {
  const n = normalizeText(label)
  const i = order.findIndex((p) => n.startsWith(p))
  return i === -1 ? order.length : i
}

const SORTERS = {
  species: (a, b) => a.localeCompare(b),
  size: (a, b) => rankByPrefix(a, SIZE_ORDER) - rankByPrefix(b, SIZE_ORDER) || a.localeCompare(b),
  age: (a, b) => rankByPrefix(a, AGE_ORDER) - rankByPrefix(b, AGE_ORDER) || a.localeCompare(b),
}

/** Does the pet pass every active filter except (optionally) one dimension? */
function passesFilters(pet, filters, skip) {
  return Object.keys(FILTERS).every(
    (key) => key === skip || FILTERS[key](pet, filters[key])
  )
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Applies the search box and the three dropdowns. When a search term is
 * active, results are ranked by relevance (name/breed hits first); otherwise
 * the original catalog order is kept.
 */
export function filterPets(pets, { search = '', species = ALL, size = ALL, age = ALL } = {}) {
  const filters = { species, size, age }
  const scored = []
  for (const pet of pets) {
    if (!passesFilters(pet, filters)) continue
    const score = searchScore(pet, search)
    if (score > 0) scored.push({ pet, score })
  }
  if (normalizeText(search)) scored.sort((a, b) => b.score - a.score)
  return scored.map((s) => s.pet)
}

/**
 * Options for one dropdown, each with a count of how many pets you'd get if
 * you picked it GIVEN the search and the other two dropdowns. That way a
 * choice that would return nothing is visibly "(0)" instead of a dead end.
 */
export function getFacetOptions(pets, { search = '', species = ALL, size = ALL, age = ALL } = {}, dimension) {
  const filters = { species, size, age }
  const field = dimension // pet field name matches the filter key
  const values = [...new Set(pets.map((p) => p[field]).filter((v) => v && v !== 'Both'))]
    .sort(SORTERS[dimension])

  // Pets that match the search + the OTHER two dropdowns
  const pool = pets.filter(
    (pet) => passesFilters(pet, filters, dimension) && searchScore(pet, search) > 0
  )

  const options = values.map((value) => ({
    value,
    count: pool.filter((pet) => FILTERS[dimension](pet, value)).length,
  }))
  return [{ value: ALL, count: pool.length }, ...options]
}

export function hasActiveFilters({ search = '', species = ALL, size = ALL, age = ALL } = {}) {
  return Boolean(normalizeText(search)) || species !== ALL || size !== ALL || age !== ALL
}
