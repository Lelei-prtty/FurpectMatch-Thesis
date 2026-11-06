import { useEffect, useState } from 'react'
import PetPhoto from './PetPhoto.jsx'
import { getRecommendationsForPreferences, mapRecommendedPet } from '../api/recommender.js'
import { preferencesForModel } from '../Data/Petpreferencesoptions.jsx'

const TOP_COUNT = 6

// Shown right after a guardian finishes registering and saves their preferences:
// the pets the model matches best with what they just answered.
//  - preferences: the answers that were just saved
//  - saveFailed: true when the answers could not be saved to the account
//  - onContinue: called when they choose to go to the dashboard
export default function TopMatchesModal({ preferences, firstName = '', saveFailed = false, onContinue }) {
  const [state, setState] = useState({ status: 'loading', pets: [], message: '' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { chosen, answers } = preferencesForModel(preferences)

      // Only types the model can't score (hamsters, fish...): nothing to rank.
      if (chosen.length > 0 && answers.petTypes.length === 0) {
        setState({
          status: 'done',
          pets: [],
          message: 'Match scores are available for dogs, cats and birds. You can browse every pet on your dashboard.',
        })
        return
      }

      try {
        const data = await getRecommendationsForPreferences(answers, TOP_COUNT)
        if (cancelled) return
        setState({
          status: 'done',
          pets: (data.recommendations || []).map(mapRecommendedPet).slice(0, TOP_COUNT),
          message: data.message || '',
        })
      } catch (error) {
        console.error('Failed to load top matches', error)
        if (cancelled) return
        setState({
          status: 'error',
          pets: [],
          message: 'We couldn’t reach the matching service right now. Your matches will be waiting on your dashboard.',
        })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [preferences])

  const { status, pets, message } = state

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="top-matches-title"
    >
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[32px] bg-white shadow-2xl ring-1 ring-black/10">
        <div className="border-b border-[#CACACA] px-6 py-6 sm:px-8">
          <p className="text-sm uppercase tracking-[0.25em] text-[#CEA74E]">Your account is ready</p>
          <h2 id="top-matches-title" className="mt-2 text-2xl font-semibold text-[#683B0D] sm:text-3xl">
            {firstName ? `${firstName}, here are your top matches` : 'Here are your top matches'}
          </h2>
          <p className="mt-2 text-sm text-[#989797]">
            These pets fit the preferences you just entered best. You can change your preferences any time in Profile.
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {saveFailed && (
            <p role="alert" className="mb-5 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              We couldn’t save your preferences to your account, so the dashboard may not show these matches. You can
              set them again under Profile.
            </p>
          )}

          {status === 'loading' && (
            <p className="py-12 text-center text-sm text-[#989797]">Finding your best matches…</p>
          )}

          {status !== 'loading' && pets.length === 0 && (
            <p className="rounded-3xl bg-[#CACACA]/20 px-4 py-6 text-center text-sm text-[#683B0D]">
              {message || 'No matches yet. Head to your dashboard to browse all pets.'}
            </p>
          )}

          {pets.length > 0 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className="overflow-hidden rounded-[28px] border border-[#CEA74E]/60 bg-white shadow-sm ring-1 ring-[#CEA74E]/20"
                  >
                    <div className="relative h-40 overflow-hidden bg-[#CACACA]">
                      <PetPhoto src={pet.image} alt={pet.name} />
                      {pet.matchScore !== undefined && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#CEA74E] px-3 py-1 text-xs font-semibold text-white">
                          {Math.round(pet.matchScore * 100)}% match
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-sm font-semibold text-[#989797]">{pet.breed}</p>
                      <h3 className="mt-1 text-xl font-bold text-[#683B0D]">{pet.name}</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {[pet.species, pet.gender, pet.age].filter(Boolean).map((chip) => (
                          <span
                            key={chip}
                            className="rounded-full bg-[#CACACA]/30 px-3 py-1 text-xs font-semibold text-[#683B0D]"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                      {pet.area && <p className="mt-3 text-xs text-[#989797]">{pet.area}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-[#989797]">
                Match percentages compare pets of the types you chose with each other, so the best match is always 100%.
                They are a guide, not a guarantee. Adoption is always your own decision.
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-[#CACACA] px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
          <button
            type="button"
            onClick={onContinue}
            className="rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
          >
            Go to my dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
