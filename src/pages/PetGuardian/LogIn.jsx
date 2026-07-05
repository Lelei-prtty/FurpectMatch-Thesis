import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function GuardianLogIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email || !password) {
      alert('Please enter your email and password.')
      return
    }
    navigate('/guardian-dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-black/5">
        <div className="grid gap-6 lg:grid-cols-[420px_auto]">
          <div className="p-8 sm:p-10">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-indigo-600">Guardian access</p>
                <h1 className="mt-4 text-3xl font-semibold text-gray-900">Log in to your Pet Guardian account</h1>
                <p className="mt-3 text-gray-600">Find pets, save favorites, and submit adoption requests with ease.</p>
              </div>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <label className="block text-sm font-semibold text-gray-700">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="guardian@pawmatch.org"
                    className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="mt-2 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Log in as Guardian
                </button>
              </form>
              <p className="text-sm text-gray-500">
                New to PawMatch?{' '}
                <Link to="/guardian/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
                  Create a guardian account
                </Link>
              </p>
              <p className="text-sm text-gray-500">
                Need provider access?{' '}
                <Link to="/provider/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
                  Log in as Provider
                </Link>
              </p>
            </div>
          </div>
          <div className="bg-indigo-600 p-8 sm:p-10 text-white">
            <div className="space-y-6">
              <div className="rounded-3xl bg-white/10 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-indigo-100">Guardian access</p>
                <p className="mt-4 text-lg font-semibold">Browse pets and discover your next companion.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6">
                <p className="text-sm font-semibold text-indigo-100">Easy adoption</p>
                <p className="mt-3 text-sm leading-6 text-indigo-100 opacity-90">
                  Save favorites, send applications, and track pet updates in one place.
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 p-6 text-center">
                <div className="mx-auto mb-5 h-28 w-28 overflow-hidden rounded-full bg-white/20"></div>
                <p className="text-sm text-indigo-100">Make your next adoption the best match.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
