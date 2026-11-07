import { useEffect } from 'react'
import { X } from 'lucide-react'
import TermsDocument from './TermsDocument.jsx'
import { TERMS_VERSION } from '../Data/Accounts.jsx'

// The Terms and Conditions in a pop-up, so people can read them without leaving the form.
//  - role: 'guardian' or 'provider'
//  - onAgree: called when they press "I Agree" (the form ticks its checkbox)
//  - onClose: called when they close the pop-up without agreeing
export default function TermsModal({ role, onAgree, onClose }) {
  // Esc closes it.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Terms and Conditions"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-black/10"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#CACACA] px-6 py-4 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#CEA74E]">Version {TERMS_VERSION}</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#683B0D] hover:bg-[#CACACA]/30"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          <TermsDocument role={role} headingLevel={2} />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#CACACA] px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#CACACA] bg-white px-6 py-3 text-sm font-semibold text-[#683B0D] transition hover:bg-[#CACACA]/10"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onAgree}
            className="rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  )
}
