import { ChevronLeft, ChevronRight } from 'lucide-react'
import PetPhoto from './PetPhoto.jsx'

// Shows one photo at a time with previous / next arrows and dots when there are several.
// The parent keeps the current `index`, so it can also open the same photo full-size.
export default function PhotoGallery({ images = [], index = 0, onIndexChange, alt }) {
  const count = images.length
  const current = count ? Math.min(Math.max(index, 0), count - 1) : 0

  const go = (step) => (event) => {
    event.stopPropagation()
    onIndexChange?.((current + step + count) % count)
  }

  return (
    <div className="relative h-full w-full">
      {/* key: start fresh (and forget an earlier load failure) whenever the photo changes */}
      <PetPhoto key={images[current] || 'none'} src={images[current] || null} alt={alt} />

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={go(-1)}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[#683B0D] shadow-sm hover:bg-white"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={go(1)}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[#683B0D] shadow-sm hover:bg-white"
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute left-1/2 top-4 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/40 px-3 py-1.5">
            {images.map((src, i) => (
              <button
                key={`${i}-${src}`}
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onIndexChange?.(i)
                }}
                className={`h-2 w-2 rounded-full ${i === current ? 'bg-white' : 'bg-white/50'}`}
                aria-label={`Show photo ${i + 1} of ${count}`}
                aria-current={i === current}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
