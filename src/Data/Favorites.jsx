// A guardian's saved ("favorite") pets, kept in Supabase (`pet_favorites`) so they follow
// the account to any device.
//
// A favorite is stored by the same id the dashboard uses for a pet: a dataset pet's id
// (like "P001") or a provider listing's id. That is why `pet_key` is text, not a uuid.
// Every function resolves quietly (never throws), so a network problem can't crash the page.
import { supabase } from '../lib/supabaseClient.js'
import { getCurrentUser } from './Accounts.jsx'

/** The ids of this person's favorite pets, newest first ([] when signed out or on an error). */
export async function loadFavorites() {
  const user = getCurrentUser()
  if (!user) return []
  try {
    const { data, error } = await supabase
      .from('pet_favorites')
      .select('pet_key')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Failed to load favorites', error)
      return []
    }
    return (data || []).map((row) => row.pet_key)
  } catch (error) {
    console.error('Failed to load favorites', error)
    return []
  }
}

/** Saves a pet as a favorite. Resolves true when it is saved (or already was). */
export async function addFavorite(petKey) {
  const user = getCurrentUser()
  if (!user || !petKey) return false
  try {
    const { error } = await supabase
      .from('pet_favorites')
      .insert({ user_id: user.id, pet_key: String(petKey) })
    // 23505 = already a favorite, which is fine
    if (error && error.code !== '23505') {
      console.error('Failed to add favorite', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Failed to add favorite', error)
    return false
  }
}

/** Removes a favorite. Resolves true when it is gone. */
export async function removeFavorite(petKey) {
  const user = getCurrentUser()
  if (!user || !petKey) return false
  try {
    const { error } = await supabase
      .from('pet_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('pet_key', String(petKey))
    if (error) {
      console.error('Failed to remove favorite', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Failed to remove favorite', error)
    return false
  }
}
