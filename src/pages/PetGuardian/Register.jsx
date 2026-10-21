import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PetPreferencesForm from '../../components/Petpreferencesform.jsx'
import { DEFAULT_PET_PREFERENCES } from '../../Data/Petpreferencesoptions.jsx'
import { savePetPreferences } from '../../Data/Petpreferencesstorage.jsx'
import {
  createAccount,
  getPasswordChecks,
  isEmailTaken,
  startSession,
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
} from '../../Data/Accounts.jsx'

const FIELD_ORDER = ['fullName', 'email', 'phone', 'password', 'confirmPassword']

const inputClass = (hasError, extra = '') =>
  `mt-2 w-full rounded-3xl border bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:ring-2 ${extra} ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
      : 'border-[#CACACA] focus:border-[#CEA74E] focus:ring-[#CEA74E]/40'
  }`

function Field({ id, label, optional, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[#683B0D]">
        {label}
        {optional && <span className="ml-1 font-normal text-[#989797]">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-2 text-xs text-[#989797]">{hint}</p>
      ) : null}
    </div>
  )
}

function EyeToggle({ shown, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#989797] hover:text-[#683B0D]"
      aria-label={shown ? 'Hide password' : 'Show password'}
    >
      {shown ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  )
}

export default function GuardianRegister() {
  const navigate = useNavigate()

  // Step 1 — account details
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Validation display: a field's error shows once it's been touched (left) or
  // after the person tries to continue.
  const [touched, setTouched] = useState({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [serverErrors, setServerErrors] = useState({}) // errors returned when saving
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Step 2 — adoption preferences & lifestyle
  const [preferences, setPreferences] = useState(DEFAULT_PET_PREFERENCES)

  // Tab / step control
  const [activeTab, setActiveTab] = useState('account') // 'account' | 'preferences'
  const [accountCompleted, setAccountCompleted] = useState(false)

  const handlePreferenceChange = (field, value) => {
    setPreferences((prev) => ({ ...prev, [field]: value }))
  }

  const emailTaken = !validateEmail(email) && isEmailTaken(email)
  const errors = {
    fullName: validateFullName(fullName),
    email: validateEmail(email) || (emailTaken ? 'taken' : ''),
    phone: validatePhone(phone),
    password: validatePassword(password, { email, fullName }),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
  }
  const passwordChecks = getPasswordChecks(password, { email, fullName })

  const errorFor = (field) =>
    serverErrors[field] || ((touched[field] || submitAttempted) ? errors[field] : '')

  const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }))

  // Typing in a field clears any error that came back from saving for that field.
  const setField = (field, setter) => (event) => {
    setter(event.target.value)
    if (serverErrors[field]) setServerErrors((prev) => ({ ...prev, [field]: undefined }))
    if (submitError) setSubmitError('')
  }

  const emailMessage = () => {
    const error = errorFor('email')
    if (!error) return ''
    if (error === 'taken' || /already exists/.test(error)) {
      return (
        <>
          An account with this email already exists.{' '}
          <Link to="/guardian/login" className="underline">Log in instead</Link>
        </>
      )
    }
    return error
  }

  const handleAccountSubmit = (event) => {
    event.preventDefault()
    setSubmitAttempted(true)
    const firstInvalid = FIELD_ORDER.find((field) => errors[field])
    if (firstInvalid) {
      document.getElementById(`reg-${firstInvalid}`)?.focus()
      return
    }
    setAccountCompleted(true)
    setActiveTab('preferences')
  }

  // Creates the account (this is where it's actually saved), signs the person in,
  // and keeps their preferences only if they filled them in.
  const finishRegistration = async (savePreferences) => {
    setSubmitting(true)
    setSubmitError('')
    const result = await createAccount({ fullName, email, phone, password })
    setSubmitting(false)

    if (!result.ok) {
      if (result.errors) {
        setServerErrors(result.errors)
        setSubmitAttempted(true)
        setActiveTab('account')
        setSubmitError('Please fix the highlighted fields to finish creating your account.')
      } else {
        setSubmitError(result.message || 'Something went wrong creating your account. Please try again.')
      }
      return
    }

    startSession(result.user, true)
    if (savePreferences) savePetPreferences(preferences, result.user.id)
    navigate('/guardian/dashboard', { replace: true })
  }

  const handlePreferencesSubmit = (event) => {
    event.preventDefault()
    finishRegistration(true)
  }

  const handleSkipPreferences = () => {
    finishRegistration(false)
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
                <form className="space-y-6" onSubmit={handleAccountSubmit} noValidate>
                  {submitError && (
                    <div role="alert" className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}

                  <Field id="reg-fullName" label="Full Name" error={errorFor('fullName')}>
                    <input
                      id="reg-fullName"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={setField('fullName', setFullName)}
                      onBlur={() => touch('fullName')}
                      aria-invalid={Boolean(errorFor('fullName'))}
                      aria-describedby={errorFor('fullName') ? 'reg-fullName-error' : undefined}
                      placeholder="Your full name"
                      className={inputClass(errorFor('fullName'))}
                    />
                  </Field>

                  <Field id="reg-email" label="Email" error={emailMessage()}>
                    <input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={setField('email', setEmail)}
                      onBlur={() => touch('email')}
                      aria-invalid={Boolean(errorFor('email'))}
                      aria-describedby={errorFor('email') ? 'reg-email-error' : undefined}
                      placeholder="you@example.com"
                      className={inputClass(errorFor('email'))}
                    />
                  </Field>

                  <Field
                    id="reg-phone"
                    label="Mobile number"
                    optional
                    error={errorFor('phone')}
                    hint="Philippine mobile number, e.g. 0917 123 4567."
                  >
                    <input
                      id="reg-phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={setField('phone', setPhone)}
                      onBlur={() => touch('phone')}
                      aria-invalid={Boolean(errorFor('phone'))}
                      aria-describedby={errorFor('phone') ? 'reg-phone-error' : undefined}
                      placeholder="0917 123 4567"
                      className={inputClass(errorFor('phone'))}
                    />
                  </Field>

                  <Field id="reg-password" label="Password" error={errorFor('password')}>
                    <div className="relative">
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={password}
                        onChange={setField('password', setPassword)}
                        onBlur={() => touch('password')}
                        aria-invalid={Boolean(errorFor('password'))}
                        aria-describedby="reg-password-rules"
                        placeholder="Create a password"
                        className={inputClass(errorFor('password'), 'pr-12')}
                      />
                      <EyeToggle shown={showPassword} onClick={() => setShowPassword((prev) => !prev)} />
                    </div>
                    <ul id="reg-password-rules" className="mt-3 grid gap-1 text-xs sm:grid-cols-2">
                      {passwordChecks.map((check) => (
                        <li key={check.id} className={check.ok ? 'text-green-700' : 'text-[#989797]'}>
                          <span aria-hidden="true">{check.ok ? '✓' : '○'}</span> {check.label}
                        </li>
                      ))}
                    </ul>
                  </Field>

                  <Field id="reg-confirmPassword" label="Confirm Password" error={errorFor('confirmPassword')}>
                    <div className="relative">
                      <input
                        id="reg-confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={setField('confirmPassword', setConfirmPassword)}
                        onBlur={() => touch('confirmPassword')}
                        aria-invalid={Boolean(errorFor('confirmPassword'))}
                        aria-describedby={errorFor('confirmPassword') ? 'reg-confirmPassword-error' : undefined}
                        placeholder="Re-enter password"
                        className={inputClass(errorFor('confirmPassword'), 'pr-12')}
                      />
                      <EyeToggle shown={showConfirmPassword} onClick={() => setShowConfirmPassword((prev) => !prev)} />
                    </div>
                  </Field>

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
                  {submitError && (
                    <div role="alert" className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}
                  <PetPreferencesForm values={preferences} onFieldChange={handlePreferenceChange} />
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={handleSkipPreferences}
                      disabled={submitting}
                      className="text-sm font-semibold text-[#989797] underline-offset-2 hover:text-[#683B0D] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Skip for now, I'll set this up later
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {submitting ? 'Creating your account…' : 'Complete Registration'}
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