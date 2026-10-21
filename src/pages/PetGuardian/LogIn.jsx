import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import guardianLoginImage from '../../Assets/icons/guardian-icon.svg'
import { setGuardianId, getGuardianId } from '../../Data/GuardianSession.jsx'
import { authenticate, getCurrentUser, startSession, validateEmail } from '../../Data/Accounts.jsx'

const inputClass = (hasError, extra = '') =>
  `mt-2 w-full rounded-3xl border bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:ring-2 ${extra} ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
      : 'border-[#CACACA] focus:border-[#CEA74E] focus:ring-[#CEA74E]/40'
  }`

// Dataset ids look like G001. Only the demo recommender link uses this.
const GUARDIAN_ID_PATTERN = /^G\d{3,4}$/

export default function GuardianLogIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  // DEMO ONLY: there's no real auth/backend yet, so we let the tester pick
  // which guardian_id from the survey dataset (e.g. "G001") to view
  // recommendations as. Remove this once real login issues a guardian_id.
  const [guardianId, setGuardianIdInput] = useState(getGuardianId())

  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const location = useLocation()
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Already signed in? Skip the form.
  useEffect(() => {
    if (getCurrentUser()) navigate('/guardian/dashboard', { replace: true })
  }, [navigate])

  const clearErrors = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    if (formError) setFormError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const normalizedGuardianId = guardianId.trim().toUpperCase() || 'G001'
    const nextErrors = {
      email: validateEmail(email),
      password: password ? '' : 'Please enter your password.',
      guardianId: GUARDIAN_ID_PATTERN.test(normalizedGuardianId) ? '' : 'Use the format G001.',
    }
    setFieldErrors(nextErrors)
    setFormError('')
    const firstInvalid = ['email', 'password', 'guardianId'].find((field) => nextErrors[field])
    if (firstInvalid) {
      document.getElementById(`login-${firstInvalid}`)?.focus()
      return
    }

    setSubmitting(true)
    const result = await authenticate(email, password)
    setSubmitting(false)

    if (!result.ok) {
      if (result.reason === 'locked') {
        setFormError(`Too many failed attempts. Please wait ${result.retryAfterSeconds} seconds and try again.`)
      } else if (result.reason === 'crypto') {
        setFormError(result.message)
      } else {
        // Same message whether the email or the password was wrong, on purpose.
        setFormError('Incorrect email or password.')
      }
      return
    }

    startSession(result.user, rememberMe)
    setGuardianId(normalizedGuardianId)
    navigate(location.state?.from || '/guardian/dashboard', { replace: true })
  }

  const closeForgotPasswordModal = () => setShowForgotPassword(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CACACA]/20 via-white to-[#CACACA]/20 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-black/5">
        <div className="grid gap-6 lg:grid-cols-[420px_auto]">
          <div className="p-8 sm:p-10">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#683B0D]">Guardian access</p>
                <h1 className="mt-4 text-3xl font-semibold text-[#683B0D]">Log in to your Pet Guardian account</h1>
                <p className="mt-3 text-[#989797]">Find pets, save favorites, and submit adoption requests with ease.</p>
              </div>
              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {formError && (
                  <div role="alert" className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {formError}
                  </div>
                )}

                <div>
                  <label htmlFor="login-email" className="block text-sm font-semibold text-[#683B0D]">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => { setEmail(event.target.value); clearErrors('email') }}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
                    placeholder="you@example.com"
                    className={inputClass(fieldErrors.email)}
                  />
                  {fieldErrors.email && (
                    <p id="login-email-error" role="alert" className="mt-2 text-xs font-medium text-red-600">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="login-guardianId" className="block text-sm font-semibold text-[#683B0D]">
                    Guardian ID <span className="font-normal text-[#989797]">(demo only -- e.g. G001)</span>
                  </label>
                  <input
                    id="login-guardianId"
                    type="text"
                    value={guardianId}
                    onChange={(event) => { setGuardianIdInput(event.target.value); clearErrors('guardianId') }}
                    aria-invalid={Boolean(fieldErrors.guardianId)}
                    aria-describedby={fieldErrors.guardianId ? 'login-guardianId-error' : undefined}
                    placeholder="G001"
                    className={inputClass(fieldErrors.guardianId)}
                  />
                  {fieldErrors.guardianId && (
                    <p id="login-guardianId-error" role="alert" className="mt-2 text-xs font-medium text-red-600">{fieldErrors.guardianId}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-semibold text-[#683B0D]">Password</label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => { setPassword(event.target.value); clearErrors('password') }}
                      aria-invalid={Boolean(fieldErrors.password)}
                      aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
                      placeholder="Enter your password"
                      className={inputClass(fieldErrors.password, 'pr-12')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#989797] hover:text-[#683B0D]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
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
                  </div>
                  {fieldErrors.password && (
                    <p id="login-password-error" role="alert" className="mt-2 text-xs font-medium text-red-600">{fieldErrors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-[#CACACA] text-[#683B0D] focus:ring-[#CEA74E]"
                    />
                    <span className="text-sm text-[#989797]">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm font-semibold text-[#683B0D] hover:text-[#CEA74E]"
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Logging in…' : 'Log in as Guardian'}
                </button>
              </form>
              <p className="text-sm text-[#989797]">
                New to PawMatch?{' '}
                <Link to="/guardian/register" className="font-semibold text-[#683B0D] hover:text-[#CEA74E]">
                  Create a guardian account
                </Link>
              </p>
              <p className="text-sm text-[#989797]">
                Need provider access?{' '}
                <Link to="/provider/login" className="font-semibold text-[#683B0D] hover:text-[#CEA74E]">
                  Log in as Provider
                </Link>
              </p>
            </div>
          </div>
          <div className="bg-[#683B0D] p-8 sm:p-10 text-white">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white/10 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#CEA74E]/40">Guardian access</p>
                <p className="mt-4 text-lg font-semibold">Browse pets and discover your next companion.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6">
                <p className="text-sm font-semibold text-[#CEA74E]/40">Easy adoption</p>
                <p className="mt-3 text-sm leading-6 text-[#CEA74E]/40 opacity-90">
                  Save favorites, send applications, and track pet updates in one place.
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6 justify-items-center">
                <img src={guardianLoginImage} alt="Guardian Login" className="w-45 h-45 justify-items-center" />
                <p className="text-sm text-[#CEA74E]/40">Make your next adoption the best match.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password pop up Modal */}
      {showForgotPassword && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeForgotPasswordModal}
        >
          <div
            className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl ring-1 ring-black/5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#683B0D]">Guardian access</p>
                <h2 className="mt-3 text-2xl font-semibold text-[#683B0D]">Reset your password</h2>
              </div>
              <button
                type="button"
                onClick={closeForgotPasswordModal}
                className="text-[#989797] hover:text-[#683B0D] text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#989797]">
              Resetting a forgotten password by email isn't available yet, because the system can't send emails.
              If you're already logged in, you can change your password from your Profile.
            </p>
            <button
              type="button"
              onClick={closeForgotPasswordModal}
              className="mt-6 w-full rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
            >
              Back to log in
            </button>
          </div>
        </div>
      )}
    </div> 
  )
} 