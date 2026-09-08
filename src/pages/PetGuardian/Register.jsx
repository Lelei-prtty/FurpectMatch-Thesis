import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PetPreferencesForm from '../../components/Petpreferencesform.jsx'
import { DEFAULT_PET_PREFERENCES } from '../../Data/Petpreferencesoptions.jsx'
import { savePetPreferences } from '../../Data/Petpreferencesstorage.jsx'

export default function GuardianRegister() {
  const navigate = useNavigate()

  // Step 1 — account details
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Step 2 — adoption preferences & lifestyle
  const [preferences, setPreferences] = useState(DEFAULT_PET_PREFERENCES)

  // Tab / step control
  const [activeTab, setActiveTab] = useState('account') // 'account' | 'preferences'
  const [accountCompleted, setAccountCompleted] = useState(false)

  const handlePreferenceChange = (field, value) => {
    setPreferences((prev) => ({ ...prev, [field]: value }))
  }

  const handleAccountSubmit = (event) => {
    event.preventDefault()
    if (!fullName || !email || !password || !confirmPassword) {
      alert('Please fill in all fields.')
      return
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.')
      return
    }
    setAccountCompleted(true)
    setActiveTab('preferences')
  }

  const goToDashboard = () => {
    savePetPreferences(preferences)
    navigate('/guardian/dashboard', { replace: true })
  }

  const handlePreferencesSubmit = (event) => {
    event.preventDefault()
    goToDashboard()
  }

  const handleSkipPreferences = () => {
    goToDashboard()
  }

  const isPreferencesTab = activeTab === 'preferences'

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CACACA]/20 via-white to-[#CACACA]/20 px-4 py-12 sm:px-6 lg:px-8">
      <div
        className={`mx-auto w-full overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-black/5 transition-[max-width] ${
          isPreferencesTab ? 'max-w-6xl' : 'max-w-4xl'
        }`}
      >
        <div className="grid gap-6 lg:grid-cols-[420px_auto]">
          <div className="bg-[#683B0D] p-8 text-white sm:p-10">
            <div className="mb-8 flex items-center gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#CEA74E]/60">Join as a Pet Guardian</p>
                <h1 className="mt-4 text-3xl font-semibold">
                  {isPreferencesTab ? 'Tell Us About You' : 'Create Your Guardian Account'}
                </h1>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[#CEA74E]/40">
              {isPreferencesTab
                ? 'A few quick questions about your lifestyle help us match you with a pet you can truly care for.'
                : 'Create your guardian account to discover pets and submit adoption requests.'}
            </p>
            <div className="mt-10 space-y-8">
              {isPreferencesTab ? (
                <>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm font-semibold text-[#CEA74E]/40">Better matches</p>
                    <p className="mt-2 text-sm text-[#CEA74E]/60">
                      We use your answers to recommend pets that fit your home and routine.
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm font-semibold text-[#CEA74E]/40">Smoother applications</p>
                    <p className="mt-2 text-sm text-[#CEA74E]/60">
                      Providers can see you're a prepared, well-matched adopter.
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm font-semibold text-[#CEA74E]/40">Edit anytime</p>
                    <p className="mt-2 text-sm text-[#CEA74E]/60">
                      You can update these answers later from your Profile page.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm font-semibold text-[#CEA74E]/40">Browse pets</p>
                    <p className="mt-2 text-sm text-[#CEA74E]/60">Explore available animals and find the right match.</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm font-semibold text-[#CEA74E]/40">Save favorites</p>
                    <p className="mt-2 text-sm text-[#CEA74E]/60">Keep pet profiles you love in one place.</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm font-semibold text-[#CEA74E]/40">Apply to adopt</p>
                    <p className="mt-2 text-sm text-[#CEA74E]/60">Send applications and connect directly with providers.</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#683B0D]">Guardian registration</p>
                <h1 className="mt-4 text-3xl font-semibold text-[#683B0D]">Sign up for Furpect Match</h1>
              </div>

              {/* Register tabs */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('account')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeTab === 'account'
                      ? 'bg-[#683B0D] text-white'
                      : 'bg-[#CACACA]/30 text-[#989797] hover:bg-[#CACACA]/50'
                  }`}
                >
                  1. Account Details
                </button>
                <button
                  type="button"
                  disabled={!accountCompleted}
                  onClick={() => accountCompleted && setActiveTab('preferences')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeTab === 'preferences'
                      ? 'bg-[#683B0D] text-white'
                      : accountCompleted
                        ? 'bg-[#CACACA]/30 text-[#989797] hover:bg-[#CACACA]/50'
                        : 'cursor-not-allowed bg-[#CACACA]/20 text-[#CACACA]'
                  }`}
                >
                  2. Preferences & Lifestyle
                </button>
              </div>

              {activeTab === 'account' && (
                <form className="space-y-6" onSubmit={handleAccountSubmit}>
                  <label className="block text-sm font-semibold text-[#683B0D]">
                    Full Name
                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Maria Santos"
                      className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CEA74E]/40"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-[#683B0D]">
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="guardian@email.com"
                      className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CEA74E]/40"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-[#683B0D]">
                    Password
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create a password"
                      className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CEA74E]/40"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-[#683B0D]">
                    Confirm Password
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Re-enter password"
                      className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CEA74E]/40"
                    />
                  </label>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
                  >
                    Continue to Preferences
                  </button>
                </form>
              )}

              {activeTab === 'preferences' && (
                <form className="space-y-6" onSubmit={handlePreferencesSubmit}>
                  <PetPreferencesForm values={preferences} onFieldChange={handlePreferenceChange} />
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={handleSkipPreferences}
                      className="text-sm font-semibold text-[#989797] underline-offset-2 hover:text-[#683B0D] hover:underline"
                    >
                      Skip for now, I'll set this up later
                    </button>
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E] sm:w-auto"
                    >
                      Complete Registration
                    </button>
                  </div>
                </form>
              )}

              <p className="text-sm text-[#989797]">
                Already have an account?{' '}
                <Link to="/guardian/login" className="font-semibold text-[#683B0D] hover:text-[#CEA74E]">
                  Log in as Guardian
                </Link>
              </p>
              <p className="text-sm text-[#989797]">
                Need provider access?{' '}
                <Link to="/provider/register" className="font-semibold text-[#683B0D] hover:text-[#CEA74E]">
                  Register as Provider
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}