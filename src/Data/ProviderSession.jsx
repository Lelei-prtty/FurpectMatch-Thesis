import { getCurrentUser } from './Accounts.jsx'
import { getApplicantProfile, getRequestsCache, loadRequests } from './Requests.jsx'
import { supabase } from '../lib/supabaseClient.js'

// ---------------------------------------------------------------------------
// Provider data layer
//
//  1. LISTINGS  - the pets a provider has put up for adoption. These now live in
//     the Supabase `pets` table (photos in the `pet-photos` Storage bucket).
//     Reads/writes are async. The most recent results are also kept in memory so
//     the few synchronous helpers (getListings, getPublicListings, ...) keep
//     working: call loadListings() / fetchPublicListings() first to fill them.
//  2. THE REQUEST INBOX - guardians' adoption requests live in the Supabase
//     `applications` table (see Requests.jsx). This file reads the requests for
//     the signed-in provider's pets and changes their status.
// ---------------------------------------------------------------------------

const PHOTO_BUCKET = 'pet-photos'
export const MAX_PHOTOS = 5 // photos per listing (the first one is the cover)

export const LISTING_STATUSES = ['Available', 'Pending', 'Adopted']
export const REQUEST_STATUSES = ['Pending', 'Under Review', 'Approved', 'Declined']

// Only these fields can be set from the UI (anything else is ignored).
const LISTING_FIELDS = [
  'name', 'species', 'breed', 'age', 'gender', 'size', 'color',
  'vaccinated', 'spayedNeutered', 'houseTrained', 'goodWithKids', 'goodWithPets',
  'description', 'specialNeeds', 'image', 'images', 'area', 'status',
]

// UI field -> `pets` column
const COLUMN_FOR = {
  name: 'name',
  species: 'species',
  breed: 'breed',
  age: 'age',
  gender: 'gender',
  size: 'size',
  color: 'color',
  vaccinated: 'vaccinated',
  spayedNeutered: 'spayed_neutered',
  houseTrained: 'house_trained',
  goodWithKids: 'good_with_kids',
  goodWithPets: 'good_with_pets',
  description: 'description',
  specialNeeds: 'special_needs',
  area: 'area',
  status: 'status',
}
const BOOLEAN_COLUMNS = new Set(['vaccinated', 'spayed_neutered', 'house_trained', 'good_with_kids', 'good_with_pets'])
const NULLABLE_TEXT_COLUMNS = new Set(['size', 'color', 'area', 'description', 'special_needs'])

const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
const ownerIdOf = () => getCurrentUser()?.id ?? null

// What guardians see in the "health" pill. Only states what the provider ticked.
const healthLabel = (listing) => (listing.vaccinated ? 'Vaccinated' : 'Not yet vaccinated')

function pickFields(data) {
  const out = {}
  LISTING_FIELDS.forEach((field) => {
    if (data[field] !== undefined) out[field] = data[field]
  })
  return out
}

// --- photos (Supabase Storage) ----------------------------------------------

const photoUrl = (path) => {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path // e.g. photos that came with the dataset
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl
}

async function uploadPhoto(dataUrl, providerId) {
  const blob = await (await fetch(dataUrl)).blob()
  const extension = (blob.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg').replace('+xml', '')
  const path = `${providerId}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, blob, { contentType: blob.type || 'image/jpeg', upsert: false })
  if (error) throw error
  return path
}

/**
 * The photos the form sent, as a list: `images` (several) or the older single `image`.
 * undefined = leave the photos alone, [] = remove them all.
 */
function imagesFrom(fields) {
  if (fields.images !== undefined) return Array.isArray(fields.images) ? fields.images : []
  if (fields.image !== undefined) return fields.image ? [fields.image] : []
  return undefined
}

/**
 * Turns the form's photo list into storage paths (at most MAX_PHOTOS):
 *  - a "data:" photo is new, so it is uploaded
 *  - a URL this app already stored is mapped back to its path and kept
 *  - any other link (for example a photo that came with the dataset) is kept as it is
 * Resolves { paths, uploaded }. `uploaded` lists only the files uploaded just now, so a
 * failed save can delete them again.
 */
async function resolvePhotos(images, providerId, existingPaths = []) {
  const known = new Map(existingPaths.map((path) => [photoUrl(path), path]))
  const paths = []
  const uploaded = []
  try {
    for (const src of images.slice(0, MAX_PHOTOS)) {
      if (typeof src !== 'string' || !src) continue
      if (src.startsWith('data:')) {
        const path = await uploadPhoto(src, providerId)
        uploaded.push(path)
        paths.push(path)
      } else if (known.has(src)) {
        paths.push(known.get(src))
      } else if (/^https?:\/\//i.test(src)) {
        paths.push(src)
      }
    }
  } catch (error) {
    await Promise.all(uploaded.map(removePhoto))
    throw error
  }
  return { paths, uploaded }
}

async function removePhoto(path) {
  if (!path || /^https?:\/\//i.test(path)) return
  const { error } = await supabase.storage.from(PHOTO_BUCKET).remove([path])
  if (error) console.error('Failed to remove photo', error)
}

// --- row <-> listing --------------------------------------------------------

function toRow(fields) {
  const row = {}
  Object.entries(COLUMN_FOR).forEach(([field, column]) => {
    if (fields[field] === undefined) return
    let value = fields[field]
    if (BOOLEAN_COLUMNS.has(column)) {
      value = Boolean(value)
    } else if (typeof value === 'string') {
      value = value.trim()
      if (!value && NULLABLE_TEXT_COLUMNS.has(column)) value = null
    } else if (value == null) {
      value = NULLABLE_TEXT_COLUMNS.has(column) ? null : ''
    }
    row[column] = value
  })
  if ('status' in row && !LISTING_STATUSES.includes(row.status)) delete row.status
  return row
}

function fromRow(row) {
  // Several photos live in photo_paths; older rows only have photo_path.
  const photoPaths =
    Array.isArray(row.photo_paths) && row.photo_paths.length ? row.photo_paths : row.photo_path ? [row.photo_path] : []
  const listing = {
    id: row.id,
    providerId: row.provider_id,
    providerName: row.provider_name,
    name: row.name,
    species: row.species,
    breed: row.breed,
    age: row.age,
    gender: row.gender,
    size: row.size ?? '',
    color: row.color ?? '',
    vaccinated: Boolean(row.vaccinated),
    spayedNeutered: Boolean(row.spayed_neutered),
    houseTrained: Boolean(row.house_trained),
    goodWithKids: Boolean(row.good_with_kids),
    goodWithPets: Boolean(row.good_with_pets),
    description: row.description ?? '',
    specialNeeds: row.special_needs ?? '',
    images: photoPaths.map(photoUrl).filter(Boolean),
    image: photoPaths.length ? photoUrl(photoPaths[0]) : null,
    photoPath: photoPaths[0] ?? null,
    photoPaths,
    area: row.area ?? null,
    status: row.status,
    createdAt: row.created_at,
  }
  listing.health = healthLabel(listing)
  return listing
}

// In-memory copies of the last results (so synchronous helpers keep working).
let myListings = []
let publicCache = []

// ---------------------------------------------------------------------------
// Listings
// ---------------------------------------------------------------------------

/** Loads this provider's listings from Supabase. Resolves { ok: true, listings } or { ok: false }. */
export async function loadListings(providerId = ownerIdOf()) {
  if (!providerId) return { ok: false, reason: 'auth' }
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Failed to load listings', error)
      return { ok: false, reason: 'server' }
    }
    myListings = (data || []).map(fromRow)
    return { ok: true, listings: myListings }
  } catch (error) {
    console.error('Failed to load listings', error)
    return { ok: false, reason: 'server' }
  }
}

/** This provider's listings from the last loadListings(), newest first. */
export function getListings(providerId = ownerIdOf()) {
  if (!providerId) return []
  return myListings.filter((l) => l.providerId === providerId).sort(byNewest)
}

/**
 * Saves a new listing for `user` (defaults to the signed-in account).
 * Resolves { ok: true, listing } or { ok: false, reason: 'auth' | 'photo' | 'server' }.
 */
export async function addListing(data, user = getCurrentUser()) {
  if (!user) return { ok: false, reason: 'auth' }

  const fields = pickFields(data)
  const row = toRow(fields)
  if (row.status === 'Available') delete row.status // let the database default apply
  if (row.area === undefined || row.area === null) row.area = user.location || null

  let photoPaths = []
  let uploaded = []
  const images = imagesFrom(fields)
  if (images && images.length > 0) {
    try {
      const resolved = await resolvePhotos(images, user.id)
      photoPaths = resolved.paths
      uploaded = resolved.uploaded
    } catch (error) {
      console.error('Photo upload failed', error)
      return { ok: false, reason: 'photo' }
    }
  }

  try {
    const { data: saved, error } = await supabase
      .from('pets')
      .insert({
        ...row,
        provider_id: user.id,
        provider_name: user.fullName, // snapshot, shown to guardians as "Listed by"
        source: 'provider',
        photo_path: photoPaths[0] ?? null,
        photo_paths: photoPaths,
      })
      .select()
      .single()
    if (error || !saved) {
      console.error('Saving listing failed', error)
      await Promise.all(uploaded.map(removePhoto))
      return { ok: false, reason: 'server' }
    }
    const listing = fromRow(saved)
    myListings = [listing, ...myListings.filter((l) => l.id !== listing.id)]
    return { ok: true, listing }
  } catch (error) {
    console.error('Saving listing failed', error)
    await Promise.all(uploaded.map(removePhoto))
    return { ok: false, reason: 'server' }
  }
}

/** The account id of whoever listed this pet (from the loaded lists), or null. */
export function getListingOwnerId(listingId) {
  return (
    myListings.find((l) => l.id === listingId)?.providerId ??
    publicCache.find((l) => l.id === listingId)?.providerId ??
    null
  )
}

/** Edits one of this provider's listings. Resolves { ok, listing } or { ok: false, reason }. */
export async function updateListing(listingId, changes, providerId = ownerIdOf()) {
  if (!providerId) return { ok: false, reason: 'auth' }

  const fields = pickFields(changes)
  const patch = toRow(fields)

  const previousPaths = myListings.find((l) => l.id === listingId)?.photoPaths || []
  let photoResult = null
  const images = imagesFrom(fields)
  if (images !== undefined) {
    try {
      photoResult = await resolvePhotos(images, providerId, previousPaths)
    } catch (error) {
      console.error('Photo upload failed', error)
      return { ok: false, reason: 'photo' }
    }
    patch.photo_paths = photoResult.paths
    patch.photo_path = photoResult.paths[0] ?? null
  }
  patch.updated_at = new Date().toISOString()

  try {
    const { data, error } = await supabase
      .from('pets')
      .update(patch)
      .eq('id', listingId)
      .eq('provider_id', providerId)
      .select()
      .maybeSingle()
    if (error) {
      console.error('Updating listing failed', error)
      if (photoResult) await Promise.all(photoResult.uploaded.map(removePhoto))
      return { ok: false, reason: 'server' }
    }
    if (!data) {
      if (photoResult) await Promise.all(photoResult.uploaded.map(removePhoto))
      return { ok: false, reason: 'missing' }
    }

    // Delete the files that are no longer part of the listing.
    if (photoResult) {
      const kept = new Set(photoResult.paths)
      await Promise.all(previousPaths.filter((path) => !kept.has(path)).map(removePhoto))
    }
    const listing = fromRow(data)
    myListings = myListings.map((l) => (l.id === listing.id ? listing : l))
    return { ok: true, listing }
  } catch (error) {
    console.error('Updating listing failed', error)
    return { ok: false, reason: 'server' }
  }
}

/** Deletes one of this provider's listings. Resolves true if something was removed. */
export async function removeListing(listingId, providerId = ownerIdOf()) {
  if (!providerId) return false
  const previousPaths = myListings.find((l) => l.id === listingId)?.photoPaths || []
  try {
    const { data, error } = await supabase
      .from('pets')
      .delete()
      .eq('id', listingId)
      .eq('provider_id', providerId)
      .select('id')
    if (error) {
      console.error('Removing listing failed', error)
      return false
    }
    if (!data || data.length === 0) return false
    myListings = myListings.filter((l) => l.id !== listingId)
    await Promise.all(previousPaths.map(removePhoto))
    return true
  } catch (error) {
    console.error('Removing listing failed', error)
    return false
  }
}

/** Loads every provider's AVAILABLE listings (for the guardian side). */
export async function fetchPublicListings() {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('source', 'provider') // pets that came with the dataset are served by the recommender
      .eq('status', 'Available')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Failed to load public listings', error)
      return { ok: false, reason: 'server' }
    }
    publicCache = (data || []).map(fromRow)
    return { ok: true, listings: getPublicListings() }
  } catch (error) {
    console.error('Failed to load public listings', error)
    return { ok: false, reason: 'server' }
  }
}

/**
 * Every provider's AVAILABLE listings from the last fetchPublicListings(), in the
 * same shape mapPet() produces for the guardian UI (see api/recommender.js).
 * Fields the provider form doesn't collect stay null ("Not provided" in the UI).
 */
export function getPublicListings() {
  return [...publicCache]
    .sort(byNewest)
    .map((l) => ({
      id: l.id,
      name: l.name || 'Unnamed',
      species: l.species,
      breed: l.breed,
      age: l.age,
      gender: l.gender,
      size: l.size,
      image: l.image || null,
      images: l.images || [],
      area: l.area || null,
      listedBy: l.providerName || null,
      temperament: l.description || null,
      goodWithKids: typeof l.goodWithKids === 'boolean' ? l.goodWithKids : null,
      activityLevel: null,
      aloneTolerance: null,
      otherAnimals: null,
      outdoorFrequency: null,
      exercise: null,
      housing: null,
      careInstructions: l.specialNeeds || null,
    }))
}

// ---------------------------------------------------------------------------
// Request inbox (Supabase `applications`, via the copy kept in Requests.jsx)
// ---------------------------------------------------------------------------

/**
 * Adoption requests for this provider's pets, newest first, each with the
 * applicant's account details attached.
 */
export function getApplicationsForProvider(providerId = ownerIdOf()) {
  if (!providerId) return []
  return getRequestsCache()
    .filter((request) => request.providerId === providerId)
    .sort(byNewest)
    .map((request) => {
      const applicant = getApplicantProfile(request.guardianId)
      return {
        id: request.id,
        petId: request.petId,
        pet: request.petName,
        applicantId: request.guardianId,
        name: applicant?.fullName || 'Unknown guardian',
        email: applicant?.email || '',
        phone: applicant?.phone || '',
        location: applicant?.location || '',
        status: request.status || 'Pending',
        matchPercent: request.matchPercent ?? null,
        createdAt: request.createdAt,
        note: request.note || '',
        message: request.message || '',
      }
    })
}

/**
 * Sets a request's status. The database only allows this for pets that belong to
 * this provider, and approving a request also moves an "Available" pet to
 * "Pending" (in the same step) so it stops showing up as open to guardians.
 * Resolves { ok: true } or { ok: false, reason: 'invalid' | 'missing' | 'server' }.
 */
export async function updateApplicationStatus(requestId, status, providerId = ownerIdOf()) {
  if (!REQUEST_STATUSES.includes(status)) return { ok: false, reason: 'invalid' }
  if (!providerId) return { ok: false, reason: 'missing' }
  try {
    const { error } = await supabase.rpc('decide_application', {
      p_application_id: requestId,
      p_status: status,
    })
    if (error) {
      console.error('Updating request status failed', error)
      return { ok: false, reason: /not allowed/i.test(error.message || '') ? 'missing' : 'server' }
    }
    await Promise.all([loadRequests(), loadListings(providerId)])
    return { ok: true }
  } catch (error) {
    console.error('Updating request status failed', error)
    return { ok: false, reason: 'server' }
  }
}
  