import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchSelect from '../../components/SearchSelect.jsx'
import AgeInput from '../../components/AgeInput.jsx'
import { AREA_OPTIONS, COAT_COLORS, getBreedOptions, suggestSize } from '../../Data/Petbreeds.jsx'
import { createPet } from '../../Data/Pets.jsx'
import {
  createAccount,
  isEmailTaken,
  startSession,
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
} from '../../Data/Accounts.jsx'

const DEFAULT_PET_INFO = {
  name: '',
  species: 'Dog',
  breed: '',
  age: '',
  gender: 'Male',
  size: 'Average pet-size',
  color: '',
  area: '',
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

  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [petAttempted, setPetAttempted] = useState(false)
  const [serverErrors, setServerErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isPetTab = activeTab === 'pet'

  // Validation is derived from the fields, shown once the person has tried to continue.
  const emailTaken = !validateEmail(email) && isEmailTaken(email)
  const errors = {
    fullName: validateFullName(fullName),
    email: validateEmail(email) || (emailTaken ? 'An account with this email already exists. Try logging in instead.' : ''),
    password: validatePassword(password, { email, fullName }),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
  }
  const shownError = (field) => (submitAttempted ? errors[field] || serverErrors[field] : '') || ''
  const petErrors = {
    name: petInfo.name.trim() ? '' : 'Enter the pet\'s name.',
    breed: petInfo.breed.trim() ? '' : 'Enter the breed.',
    age: petInfo.age.trim() ? '' : 'Enter the age, like 2 years.',
  }
  const shownPetError = (field) => (petAttempted ? petErrors[field] : '')

  // A breed belongs to a type of pet, so changing the type clears the breed.
  const handleSpeciesChange = (species) => {
    setPetInfo((prev) => (prev.species === species ? prev : { ...prev, species, breed: '' }))
  }

  // Picking a known breed fills in a typical size, unless the size was already chosen by hand.
  const sizeTouched = useRef(false)
  const handleBreedPick = (breed) => {
    if (sizeTouched.current) return
    const size = suggestSize(petInfo.species, breed)
    if (size) setPetInfo((prev) => ({ ...prev, size }))
  }

  const handlePetInfoChange = (field, value) => {
    setPetInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleAccountSubmit = (event) => {
    event.preventDefault()
    setSubmitAttempted(true)
    const firstInvalid = ['fullName', 'email', 'password', 'confirmPassword'].find((field) => errors[field])
    if (firstInvalid) {
      document.getElementById(`reg-${firstInvalid}`)?.focus()
      return
    }
    setServerErrors({})
    setAccountCompleted(true)
    setActiveTab('pet')
  }

  // The account is only created here, at the end (like the guardian flow).
  // addPet = false when the provider skips the pet step.
  const finishRegistration = async (addPet) => {
    setSubmitting(true)
    setSubmitError('')
    const result = await createAccount({ fullName, email, password, role: 'provider' })
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
    if (addPet) {
      const listing = await createPet(petInfo, result.user)
      if (!listing.ok) {
        // The account exists and they're signed in; the pet can be re-added from the dashboard.
        alert("Your account was created, but we couldn't save the pet. You can add the pet again from your dashboard.")
      }
    }
    navigate('/provider/dashboard', { replace: true })
  }

  const handlePetInfoSubmit = (event) => {
    event.preventDefault()
    setPetAttempted(true)
    if (petErrors.name || petErrors.breed || petErrors.age) return
    finishRegistration(true)
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
                <form className="space-y-6" onSubmit={handleAccountSubmit} noValidate>
                  {submitError && (
                    <div role="alert" className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}
                  <label className="block text-sm font-semibold text-[#683B0D]">
                    Full Name
                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      id="reg-fullName"
                      autoComplete="name"
                      aria-invalid={Boolean(shownError('fullName'))}
                      placeholder="Maria Santos"
                      className={`mt-2 w-full rounded-3xl border ${shownError('fullName') ? 'border-red-400' : 'border-[#CACACA]'} bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20`}
                    />
                                    {shownError('fullName') && (
                    <p role="alert" className="mt-2 text-xs font-medium text-red-600">{shownError('fullName')}</p>
                  )}
                  </label>
                  <label className="block text-sm font-semibold text-[#683B0D]">
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      id="reg-email"
                      autoComplete="email"
                      aria-invalid={Boolean(shownError('email'))}
                      placeholder="provider@email.com"
                      className={`mt-2 w-full rounded-3xl border ${shownError('email') ? 'border-red-400' : 'border-[#CACACA]'} bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20`}
                    />
                                    {shownError('email') && (
                    <p role="alert" className="mt-2 text-xs font-medium text-red-600">{shownError('email')}</p>
                  )}
                  </label>
                  <label className="block text-sm font-semibold text-[#683B0D]">
                    Password
                    <div className="relative mt-2">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        id="reg-password"
                        autoComplete="new-password"
                        aria-invalid={Boolean(shownError('password'))}
                        placeholder="Create a password"
                        className={`w-full rounded-3xl border ${shownError('password') ? 'border-red-400' : 'border-[#CACACA]'} bg-white px-4 py-3 pr-12 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20`}
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
                                    {shownError('password') && (
                    <p role="alert" className="mt-2 text-xs font-medium text-red-600">{shownError('password')}</p>
                  )}
                  </label>
                  <label className="block text-sm font-semibold text-[#683B0D]">
                    Confirm Password
                    <div className="relative mt-2">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        id="reg-confirmPassword"
                        autoComplete="new-password"
                        aria-invalid={Boolean(shownError('confirmPassword'))}
                        placeholder="Re-enter password"
                        className={`w-full rounded-3xl border ${shownError('confirmPassword') ? 'border-red-400' : 'border-[#CACACA]'} bg-white px-4 py-3 pr-12 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20`}
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
                                    {shownError('confirmPassword') && (
                    <p role="alert" className="mt-2 text-xs font-medium text-red-600">{shownError('confirmPassword')}</p>
                  )}
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
                <form className="space-y-6" onSubmit={handlePetInfoSubmit} noValidate>
                  {submitError && (
                    <div role="alert" className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}
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
                                      {shownPetError('name') && (
                    <p role="alert" className="mt-2 text-xs font-medium text-red-600">{shownPetError('name')}</p>
                  )}
                  </label>
                    <label className="block text-sm font-semibold text-[#683B0D]">
                      Type of Pet
                      <select
                        value={petInfo.species}
                        onChange={(event) => handleSpeciesChange(event.target.value)}
                        className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                      >
                        <option>Dog</option>
                        <option>Cat</option>
                        <option>Rabbit</option>
                        <option>Bird</option>
                        <option>Other</option>
                      </select>
                    </label>
                    <div className="block text-sm font-semibold text-[#683B0D]">
                      <label htmlFor="reg-pet-breed">Breed</label>
                      <div className="mt-2">
                        <SearchSelect
                          id="reg-pet-breed"
                          value={petInfo.breed}
                          onChange={(breed) => handlePetInfoChange('breed', breed)}
                          onPick={handleBreedPick}
                          options={getBreedOptions(petInfo.species)}
                          placeholder={petInfo.species === 'Other' ? 'Type the kind of animal' : 'Search or pick a breed'}
                          invalid={Boolean(shownPetError('breed'))}
                        />
                      </div>
                      {shownPetError('breed') && (
                      <p role="alert" className="mt-2 text-xs font-medium text-red-600">{shownPetError('breed')}</p>
                    )}
                    </div>
                    <div className="block text-sm font-semibold text-[#683B0D]">
                      <label htmlFor="reg-pet-age">Age</label>
                      <div className="mt-2">
                        <AgeInput
                          id="reg-pet-age"
                          value={petInfo.age}
                          onChange={(age) => handlePetInfoChange('age', age)}
                          invalid={Boolean(shownPetError('age'))}
                        />
                      </div>
                      {shownPetError('age') && (
                      <p role="alert" className="mt-2 text-xs font-medium text-red-600">{shownPetError('age')}</p>
                    )}
                    </div>
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
                        onChange={(event) => {
                          sizeTouched.current = true
                          handlePetInfoChange('size', event.target.value)
                        }}
                        className="mt-2 w-full rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CACACA]/20"
                      >
                        <option>Tiny pet-size</option>
                        <option>Lap pet-size</option>
                        <option>Average pet-size</option>
                        <option>Big pet-size</option>
                      </select>
                    </label>
                    <div className="block text-sm font-semibold text-[#683B0D] sm:col-span-2">
                      <label htmlFor="reg-pet-color">Color / Markings</label>
                      <div className="mt-2">
                        <SearchSelect
                          id="reg-pet-color"
                          value={petInfo.color}
                          onChange={(color) => handlePetInfoChange('color', color)}
                          options={COAT_COLORS}
                          placeholder="Pick a color or describe it"
                        />
                      </div>
                    </div>
                    <div className="block text-sm font-semibold text-[#683B0D] sm:col-span-2">
                      <label htmlFor="reg-pet-area">Location (city / area)</label>
                      <div className="mt-2">
                        <SearchSelect
                          id="reg-pet-area"
                          value={petInfo.area}
                          onChange={(area) => handlePetInfoChange('area', area)}
                          options={AREA_OPTIONS}
                          placeholder="Antipolo, Rizal"
                        />
                      </div>
                    </div>
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
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => finishRegistration(false)}
                        className="text-sm font-semibold text-[#683B0D] underline-offset-2 hover:text-[#CEA74E] hover:underline disabled:opacity-60"
                      >
                        Skip for now
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {submitting ? 'Creating account…' : 'Complete Registration'}
                      </button>
                    </div>
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