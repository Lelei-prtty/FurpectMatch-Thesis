import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function ProviderRegister() {
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
    navigate('/provider/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-black/5">
        <div className="grid gap-6 lg:grid-cols-[420px_auto]">
          <div className="bg-purple-600 p-8 sm:p-10 text-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-12 w-12 rounded-3xl bg-white/20 flex items-center justify-center text-2xl">✓</div>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-purple-200">Join as a Pet Provider</p>
                <h1 className="mt-4 text-3xl font-semibold">Create Your Provider Account</h1>
              </div>
            </div>
            <p className="text-sm text-purple-100 leading-relaxed">
              Create your provider account to list pets, manage applications, and grow your adoption program.
            </p>
            <div className="mt-10 space-y-8">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-sm font-semibold text-purple-100">Create a listing</p>
                <p className="mt-2 text-sm text-purple-200">Add pets and manage their profiles, availability, and health details.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-sm font-semibold text-purple-100">Review applications</p>
                <p className="mt-2 text-sm text-purple-200">Track adoption requests and approve the best matches.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-sm font-semibold text-purple-100">Stay connected</p>
                <p className="mt-2 text-sm text-purple-200">Talk to guardians and move adoptions forward quickly.</p>
              </div>
            </div>
          </div>
          <div className="p-8 sm:p-10">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-purple-600">Provider registration</p>
                <h1 className="mt-4 text-3xl font-semibold text-gray-900">Sign up for PawMatch</h1>
              </div>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Maria Santos"
                    className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />
                </label>
                <label className="block text-sm font-semibold text-gray-700">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="provider@pawsafe.org"
                    className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />
                </label>
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a password"
                    className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />
                </label>
                <label className="block text-sm font-semibold text-gray-700">
                  Confirm Password
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter password"
                    className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  Create Provider Account
                </button>
              </form>
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/provider/login" className="font-semibold text-purple-600 hover:text-purple-700">
                  Log in as Provider
                </Link>
              </p>
              <p className="text-sm text-gray-500">
                Looking for guardian access?{' '}
                <Link to="/guardian/register" className="font-semibold text-purple-600 hover:text-purple-700">
                  Register as Guardian
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
