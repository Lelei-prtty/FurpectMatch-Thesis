import { Link, useSearchParams } from 'react-router-dom'
import TermsDocument from '../components/TermsDocument.jsx'
import { normalizeTermsRole } from '../Data/TermsContent.jsx'
import { TERMS_VERSION } from '../Data/Accounts.jsx' // adjust both paths if this file is not in src/pages

// The Terms and Conditions page. /terms?role=provider shows the provider terms; anything else
// (including /terms on its own) shows the guardian terms.
export default function Terms() {
  const [searchParams, setSearchParams] = useSearchParams()
  const role = normalizeTermsRole(searchParams.get('role'))

  const tabClasses = (active) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      active ? 'bg-[#683B0D] text-white' : 'bg-[#CACACA]/30 text-[#989797] hover:bg-[#CACACA]/50'
    }`

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CACACA]/20 via-white to-[#CACACA]/20 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-2xl ring-1 ring-black/5 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm uppercase tracking-[0.25em] text-[#683B0D]">Furpect Match</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setSearchParams({ role: 'guardian' })} className={tabClasses(role === 'guardian')}>
              Pet Guardian
            </button>
            <button type="button" onClick={() => setSearchParams({ role: 'provider' })} className={tabClasses(role === 'provider')}>
              Pet Provider
            </button>
          </div>
        </div>
        <p className="mt-2 text-xs text-[#989797]">Version {TERMS_VERSION}</p>

        <div className="mt-6">
          <TermsDocument role={role} headingLevel={1} />
        </div>

        <p className="mt-10 text-sm text-[#989797]">
          <Link to="/" className="font-semibold text-[#683B0D] hover:text-[#CEA74E]">
            Back to Furpect Match
          </Link>
        </p>
      </div>
    </div>
  )
}
