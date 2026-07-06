import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function GuardianRegister() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!fullName || !email || !password || !confirmPassword) {
      alert('Please fill in all fields.')
      return
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.')
      return
    }
    navigate('/guardian/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CACACA]/20 via-white to-[#CACACA]/20 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-black/5">
        <div className="grid gap-6 lg:grid-cols-[420px_auto]">
          <div className="bg-[#683B0D] p-8 sm:p-10 text-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-3xl bg-white/20 flex items-center justify-center text-2xl">✓</div>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#CEA74E]/60">Join as a Pet Guardian</p>
                <h1 className="mt-4 text-3xl font-semibold">Create Your Guardian Account</h1>
              </div>
            </div>
            <p className="text-sm text-[#CEA74E]/40 leading-relaxed">
              Create your guardian account to discover pets and submit adoption requests.
            </p>
            <div className="mt-10 space-y-8">
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
            </div>
          </div>
          <div className="p-8 sm:p-10">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#683B0D]">Guardian registration</p>
                <h1 className="mt-4 text-3xl font-semibold text-[#683B0D]">Sign up for PawMatch</h1>
              </div>
              <form className="space-y-6" onSubmit={handleSubmit}>
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
                    placeholder="guardian@pawmatch.org"
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
                  Create Guardian Account
                </button>
              </form>
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
