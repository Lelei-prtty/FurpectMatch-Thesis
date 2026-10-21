import { useState } from 'react'

// Shows the pet's real uploaded photo when there is one. Pets without a photo
// (or whose image fails to load, e.g. a Drive file that isn't shared publicly)
// get a neutral "No photo yet" tile -- never a stock picture that could be
// mistaken for the actual animal.
export default function PetPhoto({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-[#CACACA]/30 text-[#989797] ${className}`}
        role="img"
        aria-label={`No photo available for ${alt}`}
      >
        <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10.5" r="1.5" />
          <path d="m21 16-5-5-8 8" />
        </svg>
        <span className="text-xs font-semibold uppercase tracking-[0.15em]">No photo yet</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  )
}
