import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function ProviderLogIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email || !password) {
      alert('Please enter your email and password.')
      return
    }
    navigate('/provider/dashboard', { replace: true })
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
                  <Link to="#" className="text-sm font-semibold text-[#683B0D] hover:text-[#CEA74E]">
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#683B0D]"
                >
                  Log in as Provider
                </button>
              </form>
              <p className="text-sm text-[#989797]">
                New to PawMatch?{' '}
                <Link to="/provider/register" className="font-semibold text-[#683B0D] hover:text-[#683B0D]">
                  Create a provider account
                </Link>
              </p>
              <p className="text-sm text-[#989797]">
                Need guardian access?{' '}
                <Link to="/guardian/login" className="font-semibold text-[#683B0D] hover:text-[#683B0D]">
                  Log in as Guardian
                </Link>
              </p>
            </div>
          </div>
          <div className="bg-[#683B0D] p-8 sm:p-10 text-white">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white/10 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#CACACA]/20">Provider dashboard</p>
                <p className="mt-4 text-lg font-semibold">Manage pets and applications in one place.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6">
                <p className="text-sm font-semibold text-[#CACACA]/20">Quick access</p>
                <p className="mt-3 text-sm leading-6 text-[#CACACA]/20 opacity-90">
                  Add listings, review adoption requests, and respond to messages all from your provider dashboard.
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6 text-center">
                <div className="mx-auto mb-5 h-28 w-28 overflow-hidden rounded-full bg-white/20"></div>
                <p className="text-sm text-[#CACACA]/20">Trusted by shelters and rescues across the country.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
