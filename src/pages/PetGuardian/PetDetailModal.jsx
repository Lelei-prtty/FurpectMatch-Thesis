import { Heart, X } from 'lucide-react'

export default function PetDetailModal({ pet, open, onClose, isLiked, onToggleLike }) {
  if (!open || !pet) return null

  const facts = [
    { label: 'Species', value: pet.species },
    { label: 'Breed', value: pet.breed },
    { label: 'Age', value: pet.age },
    { label: 'Gender', value: pet.gender },
    { label: 'Size', value: pet.size },
    { label: 'Color', value: pet.color },
  ]

  const traits = [
    { label: 'Vaccinated', value: pet.vaccinated },
    { label: 'Spayed / Neutered', value: pet.spayedNeutered },
    { label: 'House-trained', value: pet.houseTrained },
    { label: 'Good with kids', value: pet.goodWithKids },
    { label: 'Good with other pets', value: pet.goodWithPets },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 sm:px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-black/10"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-64 w-full overflow-hidden bg-[#CACACA] sm:h-80">
          <img src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-[#683B0D] shadow-sm hover:bg-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => onToggleLike(pet)}
            className="absolute right-4 bottom-4 rounded-full bg-white/90 p-3 text-[#683B0D] shadow-sm transition hover:bg-[#CEA74E] hover:text-white"
            aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current text-[#CEA74E]' : ''}`} />
          </button>
        </div>

        <div className="max-h-[calc(100vh-320px)] overflow-y-auto p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#989797]">{pet.breed}</p>
              <h2 className="mt-1 text-3xl font-bold text-[#683B0D]">{pet.name}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#CEA74E]/20 px-3 py-1 text-xs font-semibold text-[#683B0D]">
                {pet.status}
              </span>
              <span className="rounded-full bg-[#CACACA]/30 px-3 py-1 text-xs font-semibold text-[#683B0D]">
                {pet.health}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-3xl bg-[#CACACA]/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">{fact.label}</p>
                <p className="mt-2 text-sm font-semibold text-[#683B0D]">{fact.value || '—'}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-[#683B0D]">About {pet.name}</p>
            <p className="mt-2 text-sm leading-7 text-[#989797]">{pet.description || 'No description provided.'}</p>
          </div>

          {pet.specialNeeds && (
            <div className="mt-6 rounded-3xl border border-[#CEA74E]/40 bg-[#CEA74E]/10 p-4">
              <p className="text-sm font-semibold text-[#683B0D]">Special Needs / Medical Notes</p>
              <p className="mt-2 text-sm leading-6 text-[#683B0D]/80">{pet.specialNeeds}</p>
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm font-semibold text-[#683B0D]">Health & Temperament</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {traits.map((trait) => (
                <div
                  key={trait.label}
                  className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                    trait.value ? 'bg-[#683B0D] text-white' : 'bg-[#CACACA]/30 text-[#989797]'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${trait.value ? 'bg-[#CEA74E]' : 'bg-[#CACACA]'}`} />
                  {trait.label}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#CACACA] bg-white px-6 py-3 text-sm font-semibold text-[#683B0D] transition hover:bg-[#CACACA]/10"
            >
              Close
            </button>
            <button
              type="button"
              className="rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
            >
              Send Adoption Request
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}