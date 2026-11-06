import { useRef } from 'react'
import ToggleYesNo from './Toggleyesno'
import ScaleSelector from './Scaleselector'
import SearchSelect from './SearchSelect.jsx'
import { NO_PREFERENCE, getPreferenceBreedOptions } from '../Data/Petbreeds.jsx'
import {
  METRO_MANILA_AREAS,
  PET_TYPES,
  MAX_PET_TYPES,
  normalizePetTypes,
  normalizeBreedPreferences,
  AGE_RANGE_OPTIONS,
  PET_SIZE_OPTIONS,
  PET_SEX_OPTIONS,
  TEMPERAMENT_OPTIONS,
  HOUSING_TYPE_OPTIONS,
  EXERCISE_TIME_OPTIONS,
  PET_STAY_OPTIONS,
} from '../Data/Petpreferencesoptions.jsx'

const selectClasses =
  'mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CEA74E]/40'

const sectionClasses = 'rounded-4xl border border-[#CACACA] bg-white p-5 shadow-sm sm:p-6'
const sectionLabelClasses = 'text-sm font-semibold uppercase tracking-[0.2em] text-[#CEA74E]'

export default function PetPreferencesForm({ values, onFieldChange }) {
  const set = (field) => (event) => onFieldChange(field, event.target.value)
  const setValue = (field) => (value) => onFieldChange(field, value)

  // Pet types: the person picks 1 or 2. `petTypes` holds the list; `petType` and
  // `breedPreference` (the first type and its breed) are filled in when the answers are saved.
  const selectedTypes = normalizePetTypes(values)
  const breedPrefs = normalizeBreedPreferences(values, selectedTypes)
  const typesRef = useRef(null)

  const togglePetType = (type) => {
    // Clear any "choose at least one" message so the form can be submitted again.
    typesRef.current?.querySelectorAll('input[type="checkbox"]').forEach((input) => input.setCustomValidity(''))
    const has = selectedTypes.includes(type)
    const next = has ? selectedTypes.filter((item) => item !== type) : [...selectedTypes, type]
    if (next.length > MAX_PET_TYPES) return
    onFieldChange('petTypes', next)
  }

  // One breed question per chosen type, so a Dog + Cat guardian can pick a dog breed and a cat
  // breed. A type that is un-ticked drops its breed (see normalizeBreedPreferences).
  const setBreedFor = (type) => (breed) => {
    const next = { ...breedPrefs }
    if (breed && breed.trim()) next[type] = breed
    else delete next[type]
    onFieldChange('breedPreferences', next)
  }

  const breedLabel = (type) => {
    if (type === 'Dog') return 'What dog breed do you prefer?'
    if (type === 'Cat') return 'What cat breed do you prefer?'
    if (type === 'Rabbit') return 'What rabbit breed do you prefer?'
    if (type === 'Birds / Parakeet') return 'What kind of bird do you prefer?'
    return `What ${type.toLowerCase()} breed do you prefer?`
  }

  return (
    <div className="space-y-6">
      {/* Household & Lifestyle */}
      <div className={sectionClasses}>
        <p className={sectionLabelClasses}>Household & Lifestyle</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-[#683B0D]">
            In which area in Metro Manila do you live?
            <select className={selectClasses} value={values.areaInMetroManila} onChange={set('areaInMetroManila')}>
              <option value="">Select area</option>
              {METRO_MANILA_AREAS.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-[#683B0D]">
            What type of housing environment do you live in?
            <select className={selectClasses} value={values.housingType} onChange={set('housingType')}>
              <option value="">Select housing type</option>
              {HOUSING_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <ToggleYesNo
            label="Do you have prior experience owning or caring for a pet?"
            value={values.priorPetExperience}
            onChange={setValue('priorPetExperience')}
          />
          <ToggleYesNo
            label="Do you currently have other pets at home?"
            value={values.hasOtherPets}
            onChange={setValue('hasOtherPets')}
          />
          <ToggleYesNo
            label="Does anyone in your household support you adopting a pet?"
            value={values.householdSupport}
            onChange={setValue('householdSupport')}
          />
          <ToggleYesNo
            label="Does your household have children living with you?"
            value={values.householdHasChildren}
            onChange={setValue('householdHasChildren')}
          />
          <ToggleYesNo
            label="Is your household air-conditioned?"
            value={values.airConditioned}
            onChange={setValue('airConditioned')}
          />
        </div>
      </div>

      {/* Pet Preferences */}
      <div className={sectionClasses}>
        <p className={sectionLabelClasses}>Pet Preferences</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <fieldset ref={typesRef} className="block text-sm font-semibold text-[#683B0D] sm:col-span-2">
            <legend>What type of pet are you looking forward to adopt?</legend>
            <p className="mt-1 text-xs font-normal text-[#989797]">
              Choose 1 or 2 ({selectedTypes.length} of {MAX_PET_TYPES} chosen). Match scores are available for dogs,
              cats and birds.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PET_TYPES.map((type) => {
                const checked = selectedTypes.includes(type)
                const atLimit = selectedTypes.length >= MAX_PET_TYPES && !checked
                return (
                  <label
                    key={type}
                    className={`flex items-center gap-3 rounded-3xl border px-4 py-3 text-sm font-medium text-[#683B0D] transition ${
                      checked ? 'border-[#CEA74E] bg-[#CEA74E]/10' : 'border-[#CACACA] bg-white'
                    } ${atLimit ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-[#CEA74E]'}`}
                  >
                    <input
                      type="checkbox"
                      name="petTypes"
                      value={type}
                      checked={checked}
                      disabled={atLimit}
                      // While nothing is chosen, every box is "required", so the browser
                      // blocks the form and shows the message below.
                      required={selectedTypes.length === 0}
                      onInvalid={(event) => event.target.setCustomValidity('Choose at least one type of pet.')}
                      onChange={() => togglePetType(type)}
                      className="h-4 w-4 rounded border-[#CACACA] text-[#683B0D] focus:ring-[#CEA74E]"
                    />
                    {type}
                  </label>
                )
              })}
            </div>
          </fieldset>
          {selectedTypes.length === 0 ? (
            <div className="block text-sm font-semibold text-[#683B0D]">
              <label htmlFor="pref-breed">What breed do you prefer?</label>
              <div className="mt-2">
                <SearchSelect
                  id="pref-breed"
                  value=""
                  onChange={() => {}}
                  options={[NO_PREFERENCE]}
                  disabled
                  placeholder="Pick the pet type first"
                />
              </div>
            </div>
          ) : (
            selectedTypes.map((type) => (
              <div key={type} className="block text-sm font-semibold text-[#683B0D]">
                <label htmlFor={`pref-breed-${type}`}>{breedLabel(type)}</label>
                <div className="mt-2">
                  <SearchSelect
                    id={`pref-breed-${type}`}
                    value={breedPrefs[type] || ''}
                    onChange={setBreedFor(type)}
                    options={getPreferenceBreedOptions(type)}
                    placeholder={`${NO_PREFERENCE}, or search a breed`}
                  />
                </div>
              </div>
            ))
          )}
          <label className="block text-sm font-semibold text-[#683B0D]">
            What age range do you prefer?
            <select className={selectClasses} value={values.ageRangePreference} onChange={set('ageRangePreference')}>
              <option value="">Select age range</option>
              {AGE_RANGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-[#683B0D]">
            What specific pet-size do you prefer?
            <select className={selectClasses} value={values.petSizePreference} onChange={set('petSizePreference')}>
              <option value="">Select pet size</option>
              {PET_SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-[#683B0D]">
            What sex of pet do you prefer?
            <select className={selectClasses} value={values.petSexPreference} onChange={set('petSexPreference')}>
              <option value="">Select preference</option>
              {PET_SEX_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-[#683B0D] sm:col-span-2">
            What temperament are you looking for in a pet?
            <select className={selectClasses} value={values.temperamentPreference} onChange={set('temperamentPreference')}>
              <option value="">Select temperament</option>
              {TEMPERAMENT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Care Commitment & Daily Life */}
      <div className={sectionClasses}>
        <p className={sectionLabelClasses}>Care Commitment & Daily Life</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <ScaleSelector
            label="Preferred activity level of your pet"
            value={values.activityLevel}
            onChange={setValue('activityLevel')}
            lowLabel="Low energy"
            highLabel="Very active"
          />
          <ScaleSelector
            label="Do you travel a lot?"
            value={values.travelFrequency}
            onChange={setValue('travelFrequency')}
            lowLabel="Rarely"
            highLabel="Frequently"
          />
          <ScaleSelector
            label="How willing are you to provide home grooming for your pet?"
            value={values.homeGroomingWillingness}
            onChange={setValue('homeGroomingWillingness')}
            lowLabel="Not willing"
            highLabel="Very willing"
          />
          <ScaleSelector
            label="How willing are you to use professional grooming services?"
            value={values.professionalGroomingWillingness}
            onChange={setValue('professionalGroomingWillingness')}
            lowLabel="Not willing"
            highLabel="Very willing"
          />
          <ScaleSelector
            label="Time & effort you can dedicate to feeding and meal preparation"
            value={values.feedingEffort}
            onChange={setValue('feedingEffort')}
            lowLabel="Minimal"
            highLabel="Extensive"
          />
          <label className="block text-sm font-semibold text-[#683B0D]">
            How much daily exercise can you provide?
            <select className={selectClasses} value={values.dailyExerciseTime} onChange={set('dailyExerciseTime')}>
              <option value="">Select duration</option>
              {EXERCISE_TIME_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-[#683B0D]">
            Where will the pet primarily stay?
            <select className={selectClasses} value={values.petPrimaryStay} onChange={set('petPrimaryStay')}>
              <option value="">Select location</option>
              {PET_STAY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  )
}
