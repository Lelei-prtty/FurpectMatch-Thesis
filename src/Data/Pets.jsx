import { supabase } from '../lib/supabaseClient.js'

export async function createPet(petInfo, user) {
  try {
    const { data, error } = await supabase
      .from('pets')
      .insert({
        provider_id: user.id,
        provider_name: user.fullName,
        source: 'provider',          // use a value your schema allows
        name: petInfo.name.trim(),
        species: petInfo.species,
        breed: petInfo.breed.trim(),
        age: petInfo.age.trim(),
        gender: petInfo.gender,
        size: petInfo.size,
        color: petInfo.color.trim() || null,
        area: petInfo.area.trim() || null,
        vaccinated: petInfo.vaccinated,
        spayed_neutered: petInfo.spayedNeutered,
        house_trained: petInfo.houseTrained,
        good_with_kids: petInfo.goodWithKids,
        good_with_pets: petInfo.goodWithPets,
        description: petInfo.description.trim() || null,
        special_needs: petInfo.specialNeeds.trim() || null,
      })
      .select()
      .single()
    if (error) {
      console.error('Saving pet failed', error)
      alert("Your account was created, but we couldn't save the pet: " + (listing.message || 'unknown error'))
    }
    return { ok: true, pet: data }
  } catch (error) {
    console.error('Saving pet failed', error)
    return { ok: false }
  }
}