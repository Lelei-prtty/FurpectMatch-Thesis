import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const DEFAULT_PET_INFO = {
  name: '',
  species: 'Dog',
  breed: '',
  age: '',
  gender: 'Male',
  size: 'Medium',
  color: '',
  vaccinated: false,
  spayedNeutered: false,
  houseTrained: false,
  goodWithKids: false,
  goodWithPets: false,
  description: '',
  specialNeeds: '',
}

export default function ProviderRegister() {
  const navigate = useNavigate()

  // Step 1 — account details
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Step 2 — pet information
  const [petInfo, setPetInfo] = useState(DEFAULT_PET_INFO)

  // Tab / step control
  const [activeTab, setActiveTab] = useState('account') // 'account' | 'pet'
  const [accountCompleted, setAccountCompleted] = useState(false)

  const isPetTab = activeTab === 'pet'

  const handlePetInfoChange = (field, value) => {
    setPetInfo((prev) => ({ ...prev, [field]: value }))
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
    setActiveTab('pet')
  }

  const handlePetInfoSubmit = (event) => {
    event.preventDefault()
    if (!petInfo.name || !petInfo.breed || !petInfo.age) {
      alert('Please fill in the pet\'s name, breed, and age before continuing.')
      return
    }

    navigate('/provider/dashboard', {
      replace: true,
      state: { petInfo },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CACACA]/20 via-white to-[#CACACA]/20 px-4 py-12 sm:px-6 lg:px-8">
      <div
        className={`mx-auto w-full overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-black/5 transition-[max-width] ${
          isPetTab ? 'max-w-6xl' : 'max-w-4xl'
        }`}
      >
        <div className="grid gap-6 lg:grid-cols-[420px_auto]">
          <div className="bg-[#683B0D] p-8 sm:p-10 text-white">
            <div className="flex items-center gap-3 mb-8">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#CEA74E]/30">Join as a Pet Provider</p>
                <h1 className="mt-4 text-3xl font-semibold">
                  {isPetTab ? 'Tell Us About Your Pet' : 'Create Your Provider Account'}
                </h1>
              </div>
            </div>
            <p className="text-sm text-[#CACACA]/20 leading-relaxed">
              {isPetTab
                ? 'Share a few details about the pet you\'re listing so guardians can find and get to know them.'
                : 'Create your provider account to list pets, manage applications, and grow your adoption program.'}
            </p>
            <div className="mt-10 space-y-8">
              {isPetTab ? (
                <>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm font-semibold text-[#CACACA]/20">Complete profiles</p>
                    <p className="mt-2 text-sm text-[#CEA74E]/30">
                      Detailed pet profiles get more attention and better-matched applicants.
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm font-semibold text-[#CACACA]/20">Health & behavior</p>
                    <p className="mt-2 text-sm text-[#CEA74E]/30">
                      Vaccination and temperament info helps guardians know what to expect.
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm font-semibold text-[#CACACA]/20">Edit anytime</p>
                    <p className="mt-2 text-sm text-[#CEA74E]/30">
                      You can update this listing later from your Provider Dashboard.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm font-semibold text-[#CACACA]/20">Create a listing</p>
                    <p className="mt-2 text-sm text-[#CEA74E]/30">Add pets and manage their profiles, availability, and health details.</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm font-semibold text-[#CACACA]/20">Review applications</p>
                    <p className="mt-2 text-sm text-[#CEA74E]/30">Track adoption requests and approve the best matches.</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm font-semibold text-[#CACACA]/20">Stay connected</p>
                    <p className="mt-2 text-sm text-[#CEA74E]/30">Talk to guardians and move adoptions forward quickly.</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-[#683B0D]">Provider registration</p>
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
                  onClick={() => accountCompleted && setActiveTab('pet')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeTab === 'pet'
                      ? 'bg-[#683B0D] text-white'
                      : accountCompleted
                        ? 'bg-[#CACACA]/30 text-[#989797] hover:bg-[#CACACA]/50'
                        : 'cursor-not-allowed bg-[#CACACA]/20 text-[#CACACA]'
                  }`}
                >
                  2. Pet Information
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
                      className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-[#683B0D]">
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="provider@email.com"
                      className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-[#683B0D]">
                    Password
                    <div className="relative mt-2">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a password"
                        className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 pr-12 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
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
                  </label>
                  <label className="block text-sm font-semibold text-[#683B0D]">
                    Confirm Password
                    <div className="relative mt-2">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Re-enter password"
                        className="w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 pr-12 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#989797] hover:text-[#683B0D]"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? (
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
                  </label>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
                  >
                    Continue to Pet Information
                  </button>
                </form>
              )}

              {activeTab === 'pet' && (
                <form className="space-y-6" onSubmit={handlePetInfoSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-[#683B0D]">
                      Pet Name
                      <input
                        type="text"
                        value={petInfo.name}
                        onChange={(event) => handlePetInfoChange('name', event.target.value)}
                        placeholder="Bantay"
                        className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-[#683B0D]">
                      Type of Pet
                      <select
                        value={petInfo.species}
                        onChange={(event) => handlePetInfoChange('species', event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                      >
                        <option>Dog</option>
                        <option>Cat</option>
                        <option>Rabbit</option>
                        <option>Bird</option>
                        <option>Other</option>
                      </select>
                    </label>
                    <label className="block text-sm font-semibold text-[#683B0D]">
                      Breed
                      <input
                        type="text"
                        value={petInfo.breed}
                        onChange={(event) => handlePetInfoChange('breed', event.target.value)}
                        placeholder="Aspin, Labrador, etc."
                        className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-[#683B0D]">
                      Age
                      <input
                        type="text"
                        value={petInfo.age}
                        onChange={(event) => handlePetInfoChange('age', event.target.value)}
                        placeholder="e.g. 2 years"
                        className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-[#683B0D]">
                      Sex
                      <select
                        value={petInfo.gender}
                        onChange={(event) => handlePetInfoChange('gender', event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </label>
                    <label className="block text-sm font-semibold text-[#683B0D]">
                      Size of Pet
                      <select
                        value={petInfo.size}
                        onChange={(event) => handlePetInfoChange('size', event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                      >
                        <option>Tiny pet-size</option>
                        <option>Lap pet-size</option>
                        <option>Average pet-size</option>
                        <option>Big pet-size</option>
                      </select>
                    </label>
                    <label className="block text-sm font-semibold text-[#683B0D] sm:col-span-2">
                      Color / Markings
                      <input
                        type="text"
                        value={petInfo.color}
                        onChange={(event) => handlePetInfoChange('color', event.target.value)}
                        placeholder="Brown with white patches"
                        className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                      />
                    </label>
                  </div>

                  <div className="rounded-3xl border border-[#CACACA] bg-[#CACACA]/10 p-5">
                    <p className="mb-4 text-sm font-semibold text-[#683B0D]">Health & Temperament</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex items-center gap-2 text-sm text-[#683B0D]">
                        <input
                          type="checkbox"
                          checked={petInfo.vaccinated}
                          onChange={(event) => handlePetInfoChange('vaccinated', event.target.checked)}
                          className="h-4 w-4 rounded border-[#CACACA] text-[#683B0D] focus:ring-[#CEA74E]"
                        />
                        Vaccinated
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[#683B0D]">
                        <input
                          type="checkbox"
                          checked={petInfo.spayedNeutered}
                          onChange={(event) => handlePetInfoChange('spayedNeutered', event.target.checked)}
                          className="h-4 w-4 rounded border-[#CACACA] text-[#683B0D] focus:ring-[#CEA74E]"
                        />
                        Spayed / Neutered
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[#683B0D]">
                        <input
                          type="checkbox"
                          checked={petInfo.houseTrained}
                          onChange={(event) => handlePetInfoChange('houseTrained', event.target.checked)}
                          className="h-4 w-4 rounded border-[#CACACA] text-[#683B0D] focus:ring-[#CEA74E]"
                        />
                        House-trained
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[#683B0D]">
                        <input
                          type="checkbox"
                          checked={petInfo.goodWithKids}
                          onChange={(event) => handlePetInfoChange('goodWithKids', event.target.checked)}
                          className="h-4 w-4 rounded border-[#CACACA] text-[#683B0D] focus:ring-[#CEA74E]"
                        />
                        Good with kids
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[#683B0D]">
                        <input
                          type="checkbox"
                          checked={petInfo.goodWithPets}
                          onChange={(event) => handlePetInfoChange('goodWithPets', event.target.checked)}
                          className="h-4 w-4 rounded border-[#CACACA] text-[#683B0D] focus:ring-[#CEA74E]"
                        />
                        Good with other pets
                      </label>
                    </div>
                  </div>

                  <label className="block text-sm font-semibold text-[#683B0D]">
                    Description
                    <textarea
                      value={petInfo.description}
                      onChange={(event) => handlePetInfoChange('description', event.target.value)}
                      placeholder="Tell guardians about this pet's personality and history..."
                      rows={4}
                      className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                    />
                  </label>

                  <label className="block text-sm font-semibold text-[#683B0D]">
                    Special Needs / Medical Notes (optional)
                    <textarea
                      value={petInfo.specialNeeds}
                      onChange={(event) => handlePetInfoChange('specialNeeds', event.target.value)}
                      placeholder="Any ongoing medication, allergies, or accommodations..."
                      rows={3}
                      className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                    />
                  </label>

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab('account')}
                      className="text-sm font-semibold text-[#989797] underline-offset-2 hover:text-[#683B0D] hover:underline"
                    >
                      Back to Account Details
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
                <Link to="/provider/login" className="font-semibold text-[#683B0D]  hover:text-[#CEA74E]">
                  Log in as Provider
                </Link>
              </p>
              <p className="text-sm text-[#989797]">
                Looking for guardian access?{' '}
                <Link to="/guardian/register" className="font-semibold text-[#683B0D]  hover:text-[#CEA74E]">
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