import ToggleYesNo from './Toggleyesno'
import ScaleSelector from './Scaleselector'
import {
  METRO_MANILA_AREAS,
  PET_TYPES,
  AGE_RANGE_OPTIONS,
  PET_SIZE_OPTIONS,
  PET_SEX_OPTIONS,
  TEMPERAMENT_OPTIONS,
  HOUSING_TYPE_OPTIONS,
  EXERCISE_TIME_OPTIONS,
  PET_STAY_OPTIONS,
} from '../data/petPreferencesOptions'

const selectClasses =
  'mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CEA74E]/40'

const sectionClasses = 'rounded-4xl border border-[#CACACA] bg-white p-5 shadow-sm sm:p-6'
const sectionLabelClasses = 'text-sm font-semibold uppercase tracking-[0.2em] text-[#CEA74E]'

export default function PetPreferencesForm({ values, onFieldChange }) {
  const set = (field) => (event) => onFieldChange(field, event.target.value)
  const setValue = (field) => (value) => onFieldChange(field, value)

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
          <label className="block text-sm font-semibold text-[#683B0D]">
            What type of pet are you looking forward to adopt?
            <select className={selectClasses} value={values.petType} onChange={set('petType')}>
              <option value="">Select pet type</option>
              {PET_TYPES.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-[#683B0D]">
            What breed do you prefer?
            <input
              type="text"
              className={selectClasses}
              placeholder="e.g. No Preference"
              value={values.breedPreference}
              onChange={set('breedPreference')}
            />
          </label>
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