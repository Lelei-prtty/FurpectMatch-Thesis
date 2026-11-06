import { Check, Cpu, Minus } from 'lucide-react'
import PetPhoto from './PetPhoto.jsx'
import {
  MODEL_SPECIES,
  PET_PREFERENCES_LABELS,
  preferencesForModel,
} from '../Data/Petpreferencesoptions.jsx'

// "Matching Model Output": shows what the recommender (a Graph Attention Network) produced for
// this guardian, led by the single best match for each pet type they chose.
//
// Everything on it comes from the model's real output (`recommendedPets`, ranked, each with a
// match score). The "what lines up" lists are plain comparisons of the guardian's answers with
// the pet's listing; they are NOT the model's internal reasoning, and the panel says so.

const NO_PREFERENCE = 'No Preference'
const TYPE_FOR_SPECIES = { Dog: 'Dog', Cat: 'Cat', Bird: 'Birds / Parakeet' }

const squash = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s*-\s*/g, '-')
    .trim()
const baseOf = (value) => squash(String(value ?? '').split('(')[0])
const answered = (value) =>
  value !== '' && value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0)
const isNumber = (value) => typeof value === 'number' && Number.isFinite(value)

/** Plain comparison of the guardian's answers with one pet's listing. */
function explainMatch(pet, prefs, typeLabel) {
  const fits = []
  const differs = []

  const breed = prefs.breedPreferences?.[typeLabel]
  if (answered(breed) && breed !== NO_PREFERENCE && pet.breed) {
    if (squash(breed) === squash(pet.breed)) fits.push(`Breed: ${pet.breed}`)
    else differs.push(`Breed is ${pet.breed} (you preferred ${breed})`)
  }

  if (answered(prefs.ageRangePreference) && pet.age) {
    if (squash(prefs.ageRangePreference) === squash(pet.age)) fits.push(`Age: ${pet.age}`)
    else differs.push(`Age: ${pet.age} (you preferred ${prefs.ageRangePreference})`)
  }

  if (answered(prefs.petSizePreference) && pet.size) {
    if (baseOf(prefs.petSizePreference) === baseOf(pet.size)) fits.push(`Size: ${String(pet.size).split('(')[0].trim()}`)
    else differs.push(`Size: ${String(pet.size).split('(')[0].trim()} (you preferred ${String(prefs.petSizePreference).split('(')[0].trim()})`)
  }

  if (answered(prefs.petSexPreference) && prefs.petSexPreference !== NO_PREFERENCE && pet.gender) {
    if (squash(prefs.petSexPreference) === squash(pet.gender)) fits.push(`Sex: ${pet.gender}`)
    else differs.push(`Sex: ${pet.gender} (you preferred ${prefs.petSexPreference})`)
  }

  if (answered(prefs.temperamentPreference) && pet.temperament) {
    if (squash(prefs.temperamentPreference) === squash(pet.temperament)) fits.push(`Temperament: ${pet.temperament}`)
  }

  if (prefs.householdHasChildren === 'Yes' && typeof pet.goodWithKids === 'boolean') {
    if (pet.goodWithKids) fits.push('Good with children, and you have children at home')
    else differs.push('Not listed as good with children, and you have children at home')
  }

  if (prefs.hasOtherPets === 'Yes' && isNumber(pet.otherAnimals)) {
    if (pet.otherAnimals >= 3) fits.push(`Gets along with other animals (${pet.otherAnimals}/5)`)
    else differs.push(`May not get along with other animals (${pet.otherAnimals}/5), and you have pets`)
  }

  if (isNumber(Number(prefs.activityLevel)) && isNumber(pet.activityLevel) && answered(prefs.activityLevel)) {
    const wanted = Number(prefs.activityLevel)
    const text = `Activity level ${pet.activityLevel}/5 (you chose ${wanted}/5)`
    if (Math.abs(pet.activityLevel - wanted) <= 1) fits.push(text)
    else differs.push(text)
  }

  if (isNumber(Number(prefs.travelFrequency)) && Number(prefs.travelFrequency) >= 4 && isNumber(pet.aloneTolerance)) {
    if (pet.aloneTolerance >= 4) fits.push('Copes well when left alone, which suits your travel')
    else if (pet.aloneTolerance <= 2) differs.push('Does not cope well alone, and you travel often')
  }

  if (answered(prefs.housingType) && pet.housing) {
    if (squash(pet.housing) === 'both' || squash(pet.housing) === squash(prefs.housingType)) fits.push('Suits your type of home')
    else differs.push('Housing needs differ from your home')
  }

  return { fits: fits.slice(0, 5), differs: differs.slice(0, 2) }
}

function BestMatchCard({ pet, typeLabel, poolSize, prefs, onOpenPet }) {
  const percent = Math.round(pet.matchScore * 100)
  const { fits, differs } = explainMatch(pet, prefs, typeLabel)
  const speciesName = (pet.species || '').toLowerCase()

  return (
    <div className="grid gap-6 rounded-3xl border border-[#CEA74E]/60 bg-white p-5 shadow-sm ring-1 ring-[#CEA74E]/20 md:grid-cols-[220px_1fr] md:p-6">
      <div className="h-52 overflow-hidden rounded-3xl bg-[#CACACA] md:h-full md:min-h-[220px]">
        <PetPhoto src={pet.image} alt={pet.name} />
      </div>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#CEA74E]">
              Best {speciesName} match
            </p>
            <h3 className="mt-1 text-2xl font-bold text-[#683B0D]">{pet.name}</h3>
            <p className="text-sm font-semibold text-[#989797]">{pet.breed}</p>
          </div>
          <div className="shrink-0 rounded-2xl border border-[#CACACA] bg-[#CACACA]/10 px-4 py-2 text-center">
            <p className="text-2xl font-bold text-[#683B0D]">{percent}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#989797]">Match</p>
          </div>
        </div>

        <div
          className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#CACACA]/40"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${percent}% match`}
        >
          <div className="h-full rounded-full bg-[#683B0D]" style={{ width: `${percent}%` }} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {[pet.species, pet.gender, pet.size, pet.age].filter(Boolean).map((chip) => (
            <span key={chip} className="rounded-full bg-[#CACACA]/30 px-3 py-1 text-xs font-semibold text-[#683B0D]">
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold text-[#683B0D]">What lines up with your answers</p>
          {fits.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {fits.map((text) => (
                <li key={text} className="flex items-start gap-2 text-sm text-[#683B0D]/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#CEA74E]" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-[#989797]">
              Beyond the type of pet, your answers don’t overlap with the details in this listing.
            </p>
          )}
          {differs.length > 0 && (
            <>
              <p className="mt-3 text-sm font-semibold text-[#683B0D]">Worth checking</p>
              <ul className="mt-2 space-y-1.5">
                {differs.map((text) => (
                  <li key={text} className="flex items-start gap-2 text-sm text-[#989797]">
                    <Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#989797]">
            Compared with {poolSize} {speciesName} listing{poolSize === 1 ? '' : 's'}. 100% means the best match among
            them.
          </p>
          <button
            type="button"
            onClick={() => onOpenPet(pet)}
            className="rounded-full border border-[#CACACA] bg-white px-4 py-2 text-xs font-semibold text-[#683B0D] transition hover:border-[#683B0D]"
          >
            View details
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ModelOutputPanel({
  preferences,
  recommendedPets = [],
  recsSource,
  loading = false,
  error = null,
  notice = '',
  onOpenPet,
  onSetPreferences,
}) {
  const prefs = preferences || {}
  const { answers } = preferencesForModel(prefs)

  // The best match for each pet type the guardian chose (at most two).
  const bests =
    recsSource === 'preferences'
      ? answers.petTypes
          .map((typeLabel) => {
            const species = MODEL_SPECIES[typeLabel]
            const pool = recommendedPets.filter((pet) => pet.species === species)
            const best = pool.find((pet) => typeof pet.matchScore === 'number')
            return best ? { typeLabel: TYPE_FOR_SPECIES[species] || typeLabel, best, poolSize: pool.length } : null
          })
          .filter(Boolean)
      : []

  const answeredCount = PET_PREFERENCES_LABELS.filter(([key]) => answered(prefs[key])).length
  const live = recsSource === 'preferences'

  return (
    <section aria-labelledby="model-output-title" className="space-y-4">
      <div className="flex items-start gap-4 rounded-3xl border border-dashed border-[#CACACA] bg-[#CACACA]/10 p-5">
        <div className="rounded-2xl bg-[#683B0D]/10 p-3 text-[#683B0D]">
          <Cpu className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="model-output-title" className="text-lg font-semibold text-[#683B0D]">
              Matching Model Output
            </h2>
            <span className="rounded-full bg-[#CEA74E]/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#683B0D]">
              {live ? 'Live' : 'Demo profile'}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#989797]">
            Output from our trained Graph Attention Network. It compares your answers with every available pet, scores
            each one, and ranks them. Your best match comes first.
          </p>
        </div>
      </div>

      {loading && <p className="px-1 text-sm text-[#989797]">Running the model on your preferences…</p>}

      {!loading && error && (
        <p role="alert" className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          The model couldn’t be reached right now ({error}).
        </p>
      )}

      {!loading && !error && recsSource === 'demo' && (
        <div className="rounded-3xl border border-[#CACACA] bg-white p-6 text-center">
          <p className="text-sm font-semibold text-[#683B0D]">Your best match will appear here</p>
          <p className="mt-1 text-sm text-[#989797]">
            Right now the model is running on a demo profile. Save your preferences to see the pet it ranks first for you.
          </p>
          <button
            type="button"
            onClick={onSetPreferences}
            className="mt-4 rounded-full bg-[#683B0D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
          >
            Set your preferences
          </button>
        </div>
      )}

      {!loading && !error && live && bests.length === 0 && (
        <p className="rounded-3xl bg-[#CACACA]/20 px-4 py-4 text-sm text-[#683B0D]">
          {notice || 'The model has no match to show for the types you chose yet.'}
        </p>
      )}

      {!loading && !error && live && bests.length > 0 && (
        <>
          <div className={`grid gap-5 ${bests.length > 1 ? 'xl:grid-cols-2' : ''}`}>
            {bests.map(({ typeLabel, best, poolSize }) => (
              <BestMatchCard
                key={typeLabel}
                pet={best}
                typeLabel={typeLabel}
                poolSize={poolSize}
                prefs={prefs}
                onOpenPet={onOpenPet}
              />
            ))}
          </div>

          <ol className="grid gap-3 sm:grid-cols-3">
            {[
              { title: 'Your answers', text: `${answeredCount} preferences read from your profile` },
              { title: 'Graph model', text: `Scores ${recommendedPets.length} pets against your answers` },
              { title: 'Ranked output', text: 'Best match first. The full ranking is below.' },
            ].map((step, index) => (
              <li key={step.title} className="rounded-3xl border border-[#CACACA] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#CEA74E]">Step {index + 1}</p>
                <p className="mt-1 text-sm font-semibold text-[#683B0D]">{step.title}</p>
                <p className="mt-1 text-xs text-[#989797]">{step.text}</p>
              </li>
            ))}
          </ol>

          <p className="px-1 text-xs text-[#989797]">
            The lines under each best match compare your answers with the listing. They are not the model’s own
            reasoning. Match percentages are relative, not a chance of adoption, and this prototype was trained on
            survey data, so treat results as a guide.
          </p>
        </>
      )}
    </section>
  )
}
