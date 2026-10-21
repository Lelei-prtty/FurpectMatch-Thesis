import { useEffect, useState } from 'react'
import { Heart, X, ZoomIn } from 'lucide-react'
import PetPhoto from '../../components/PetPhoto.jsx'

// 1-5 survey scale shown as filled dots. null = not provided.
function ScaleRow({ label, value }) {
  return (
    <div className="rounded-3xl bg-[#CACACA]/20 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">{label}</p>
      {value === null || value === undefined ? (
        <p className="mt-2 text-sm italic text-[#989797]">Not provided</p>
      ) : (
        <div className="mt-2 flex items-center gap-1.5" aria-label={`${value} out of 5`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={`h-2.5 w-2.5 rounded-full ${n <= value ? 'bg-[#CEA74E]' : 'bg-[#CACACA]'}`}
            />
          ))}
          <span className="ml-2 text-xs font-semibold text-[#683B0D]">{value}/5</span>
        </div>
      )}
    </div>
  )
}

// Drive thumbnails take a size parameter; ask for a bigger one in the viewer
// so the photo is sharp when shown full-screen (Drive returns the original if
// it's smaller than requested).
const largeVersion = (url) => url.replace(/sz=w\d+/, 'sz=w2000')

export default function PetDetailModal({ pet, open, onClose, isLiked, onToggleLike, onSendRequest, hasRequested = false }) {
  const [viewerOpen, setViewerOpen] = useState(false)
  // 0 = try the large version, 1 = fall back to the normal one, 2 = give up
  const [viewerStage, setViewerStage] = useState(0)

  // Start fresh whenever the modal closes or a different pet is opened.
  useEffect(() => {
    setViewerOpen(false)
    setViewerStage(0)
  }, [open, pet?.id])

  // Esc closes the full-size photo (and only the photo, not the whole modal).
  useEffect(() => {
    if (!viewerOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        setViewerOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [viewerOpen])

  if (!open || !pet) return null

  const facts = [
    { label: 'Species', value: pet.species },
    { label: 'Breed', value: pet.breed },
    { label: 'Age', value: pet.age },
    { label: 'Gender', value: pet.gender },
    { label: 'Size', value: pet.size },
    { label: 'Location', value: pet.area },
    { label: 'Listed by', value: pet.listedBy },
    { label: 'Housing', value: pet.housing },
    { label: 'Daily exercise', value: pet.exercise },
    { label: 'Outdoor time', value: pet.outdoorFrequency },
  ]

  const kidsLabel =
    pet.goodWithKids === true ? 'Yes' : pet.goodWithKids === false ? 'No' : 'Not provided'

  const viewerSrc = pet.image ? (viewerStage === 0 ? largeVersion(pet.image) : pet.image) : null

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 sm:px-6"
        onClick={onClose}
      >
        <div
          className="w-full max-w-3xl overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-black/10"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="relative h-64 w-full overflow-hidden bg-[#CACACA] sm:h-80">
            <PetPhoto src={pet.image} alt={pet.name} />

            {pet.image && (
              <button
                type="button"
                onClick={() => setViewerOpen(true)}
                className="absolute inset-0 cursor-zoom-in focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#CEA74E]"
                aria-label={`View full photo of ${pet.name}`}
              >
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white">
                  <ZoomIn className="h-3.5 w-3.5" />
                  View full photo
                </span>
              </button>
            )}

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
              {pet.matchScore !== undefined && (
                <span className="rounded-full bg-[#CEA74E] px-3 py-1 text-xs font-semibold text-white">
                  {Math.round(pet.matchScore * 100)}% match
                </span>
              )}
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
              <p className="text-sm font-semibold text-[#683B0D]">Temperament</p>
              <p className="mt-2 text-sm leading-7 text-[#989797]">
                {pet.temperament || 'Not provided.'}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-[#683B0D]">Personality & Lifestyle</p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-[#CACACA]/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Good with kids</p>
                  <p className="mt-2 text-sm font-semibold text-[#683B0D]">{kidsLabel}</p>
                </div>
                <ScaleRow label="Activity level" value={pet.activityLevel} />
                <ScaleRow label="Okay when left alone" value={pet.aloneTolerance} />
                <ScaleRow label="Gets along with other animals" value={pet.otherAnimals} />
              </div>
            </div>

            {pet.careInstructions && (
              <div className="mt-6 rounded-3xl border border-[#CEA74E]/40 bg-[#CEA74E]/10 p-4">
                <p className="text-sm font-semibold text-[#683B0D]">Care notes from the owner</p>
                <p className="mt-2 text-sm leading-6 text-[#683B0D]/80">{pet.careInstructions}</p>
              </div>
            )}

            {hasRequested && (
              <p className="mt-6 rounded-3xl bg-[#CEA74E]/10 px-4 py-3 text-sm text-[#683B0D]">
                Request sent. You can track it under <span className="font-semibold">My Applications</span>.
              </p>
            )}

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
                disabled={hasRequested}
                onClick={() => onSendRequest?.(pet)}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                  hasRequested
                    ? 'cursor-not-allowed bg-[#CACACA]/50 text-[#989797]'
                    : 'bg-[#683B0D] text-white hover:bg-[#CEA74E]'
                }`}
              >
                {hasRequested ? 'Request sent' : 'Send Adoption Request'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-size photo viewer. Click the dark area, the X, or press Esc to close. */}
      {viewerOpen && viewerSrc && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Full photo of ${pet.name}`}
          onClick={() => setViewerOpen(false)}
        >
          <button
            type="button"
            onClick={() => setViewerOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-[#683B0D] shadow-sm hover:bg-white"
            aria-label="Close full photo"
          >
            <X className="h-5 w-5" />
          </button>

          {viewerStage === 2 ? (
            <p className="text-sm text-white/80">Couldn't load this photo.</p>
          ) : (
            <img
              key={viewerStage}
              src={viewerSrc}
              alt={pet.name}
              onClick={(event) => event.stopPropagation()}
              onError={() => setViewerStage((stage) => stage + 1)}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
            />
          )}

          <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-4 py-1.5 text-sm font-semibold text-white">
            {pet.name}
          </p>
        </div>
      )}
    </>
  )
}
