import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import providerLoginImage from '../../Assets/icons/provider-icon.svg'

export default function ProviderLogIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email || !password) {
      alert('Please enter your email and password.')
      return
    }
    navigate('/provider/dashboard', { replace: true })
  }

  const handleForgotPasswordSubmit = (event) => {
    event.preventDefault()
    if (!resetEmail) {
      alert('Please enter your email.')
      return
    }
    // TODO: hook this up to your real password-reset API call
    setResetSent(true)
  }

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false)
    setResetEmail('')
    setResetSent(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CACACA]/20 via-white to-[#CACACA]/20 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-black/5">
        <div className="grid gap-6 lg:grid-cols-[420px_auto]">
          <div className="p-8 sm:p-10">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#683B0D]">Provider access</p>
                <h1 className="mt-4 text-3xl font-semibold text-[#683B0D]">Log in to your Pet Provider account</h1>
                <p className="mt-3 text-[#989797]">Manage pets, review applications, and stay connected with adopters.</p>
              </div>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <label className="block text-sm font-semibold text-[#683B0D]">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="provider@pawsafe.org"
                    className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                  />
                </label>
                <label className="block text-sm font-semibold text-[#683B0D]">
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                  />
                </label>
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
                  className="w-full rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
                >
                  Log in as Provider
                </button>
              </form>
              <p className="text-sm text-[#989797]">
                New to PawMatch?{' '}
                <Link to="/provider/register" className="font-semibold text-[#683B0D] hover:text-[#CEA74E]">
                  Create a provider account
                </Link>
              </p>
              <p className="text-sm text-[#989797]">
                Need guardian access?{' '}
                <Link to="/guardian/login" className="font-semibold text-[#683B0D] hover:text-[#CEA74E]">
                  Log in as Guardian
                </Link>
              </p>
            </div>
          </div>
          <div className="bg-[#683B0D] p-8 sm:p-10 text-white">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white/10 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#CACACA]/40">Provider dashboard</p>
                <p className="mt-4 text-lg font-semibold">Manage pets and applications in one place.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6">
                <p className="text-sm font-semibold text-[#CACACA]/40">Quick access</p>
                <p className="mt-3 text-sm leading-6 text-[#CACACA]/40 opacity-90">
                  Add listings, review adoption requests, and respond to messages all from your provider dashboard.
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6 justify-items-center">
               <img src={providerLoginImage} alt="Provider Login" className="w-45 h-45 justify-items-center" />
                <p className="text-sm text-[#CACACA]/40">Trusted by shelters and rescues across the country.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Pop up Modal */}
      {showForgotPassword && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeForgotPasswordModal}
        >
          <div
            className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-2xl ring-1 ring-black/5"
            onClick={(event) => event.stopPropagation()}
          >
            {!resetSent ? (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-[#683B0D]">Provider access</p>
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
                <p className="mt-3 text-sm text-[#989797]">
                  Enter the email linked to your account and we'll send you a link to reset your password.
                </p>
                <form className="mt-6 space-y-5" onSubmit={handleForgotPasswordSubmit}>
                  <label className="block text-sm font-semibold text-[#683B0D]">
                    Email
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(event) => setResetEmail(event.target.value)}
                      placeholder="provider@pawsafe.org"
                      className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                    />
                  </label>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
                  >
                    Send reset link
                  </button>
                </form>
                <button
                  type="button"
                  onClick={closeForgotPasswordModal}
                  className="mt-4 w-full text-center text-sm font-semibold text-[#683B0D] hover:text-[#CEA74E]"
                >
                  Back to log in
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#CEA74E]/20">
                  <span className="text-2xl">✓</span>
                </div>
                <h2 className="text-2xl font-semibold text-[#683B0D]">Check your email</h2>
                <p className="mt-3 text-sm text-[#989797]">
                  We've sent a password reset link to <span className="font-semibold text-[#683B0D]">{resetEmail}</span>.
                </p>
                <button
                  type="button"
                  onClick={closeForgotPasswordModal}
                  className="mt-6 w-full rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}