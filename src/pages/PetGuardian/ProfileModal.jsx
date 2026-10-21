import React, { useEffect, useState } from 'react'
import PetPreferencesForm from '../../components/Petpreferencesform.jsx'
import PetPreferencesSummary from '../../Data/Petpreferencessummary.jsx'
import { DEFAULT_PET_PREFERENCES } from '../../Data/Petpreferencesoptions.jsx'
import { getPetPreferences, hasPetPreferences, savePetPreferences } from '../../Data/Petpreferencesstorage.jsx'
import {
  changePassword,
  formatPhone,
  getPasswordChecks,
  updateProfile,
  validateConfirmPassword,
} from '../../Data/Accounts.jsx'

const inputClass = (hasError) =>
  `mt-2 w-full rounded-3xl border bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
      : 'border-[#CACACA] focus:border-[#CEA74E] focus:ring-[#CEA74E]/40'
  }`

const initialsOf = (name) =>
  (name || '').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('')

const formatMemberSince = (iso) => {
  const date = iso ? new Date(iso) : null
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : ''
}

function FieldError({ id, message }) {
  return message ? (
    <p id={id} role="alert" className="mt-2 text-xs font-medium text-red-600">{message}</p>
  ) : null
}

function Notice({ tone, children }) {
  const styles = tone === 'success'
    ? 'border-green-200 bg-green-50 text-green-800'
    : 'border-red-200 bg-red-50 text-red-700'
  return (
    <div role={tone === 'success' ? 'status' : 'alert'} className={`rounded-3xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  )
}

export default function ProfileModal({ open, onClose, user, onUserChange, initialTab, onPreferencesSaved }) {
  const [activeTab, setActiveTab] = useState('Personal Information')
  const [petPreferences, setPetPreferences] = useState(DEFAULT_PET_PREFERENCES)
  const [draftPetPreferences, setDraftPetPreferences] = useState(DEFAULT_PET_PREFERENCES)
  const [isEditingPetPreferences, setIsEditingPetPreferences] = useState(false)

  // Personal information form (name / phone / location). Email can't be changed.
  const [profileDraft, setProfileDraft] = useState({ fullName: '', phone: '', location: '' })
  const [profileErrors, setProfileErrors] = useState({})
  const [profileNotice, setProfileNotice] = useState(null) // { tone, text }

  // Change-password form
  const [passwordDraft, setPasswordDraft] = useState({ current: '', next: '', confirm: '' })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [passwordNotice, setPasswordNotice] = useState(null)
  const [showPasswords, setShowPasswords] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    if (!open) return
    const stored = getPetPreferences()
    setPetPreferences(stored || DEFAULT_PET_PREFERENCES)
    setDraftPetPreferences(stored || DEFAULT_PET_PREFERENCES)
    setIsEditingPetPreferences(false)

    // Start every opening with the saved values and a clean slate.
    setActiveTab(initialTab || 'Personal Information')
    setProfileDraft({
      fullName: user?.fullName || '',
      phone: user?.phone ? formatPhone(user.phone) : '',
      location: user?.location || '',
    })
    setProfileErrors({})
    setProfileNotice(null)
    setPasswordDraft({ current: '', next: '', confirm: '' })
    setPasswordErrors({})
    setPasswordNotice(null)
    setShowPasswords(false)
  }, [open, user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null

  const tabs = ['Personal Information', 'Preferences & Lifestyle']

  const handleProfileSave = (event) => {
    event.preventDefault()
    setProfileNotice(null)
    const result = updateProfile(user.id, profileDraft)
    if (!result.ok) {
      setProfileErrors(result.errors || {})
      if (!result.errors) setProfileNotice({ tone: 'error', text: result.message })
      return
    }
    setProfileErrors({})
    setProfileDraft({
      fullName: result.user.fullName,
      phone: result.user.phone ? formatPhone(result.user.phone) : '',
      location: result.user.location,
    })
    onUserChange?.(result.user)
    setProfileNotice({ tone: 'success', text: 'Your profile has been updated.' })
  }

  const handlePasswordSave = async (event) => {
    event.preventDefault()
    setPasswordNotice(null)
    const confirmError = validateConfirmPassword(passwordDraft.next, passwordDraft.confirm)
    if (confirmError) {
      setPasswordErrors({ confirm: confirmError })
      return
    }
    setSavingPassword(true)
    const result = await changePassword(user.id, passwordDraft.current, passwordDraft.next)
    setSavingPassword(false)
    if (!result.ok) {
      setPasswordErrors(result.errors || {})
      if (!result.errors) setPasswordNotice({ tone: 'error', text: result.message })
      return
    }
    setPasswordErrors({})
    setPasswordDraft({ current: '', next: '', confirm: '' })
    setPasswordNotice({ tone: 'success', text: 'Your password has been changed.' })
  }

  const passwordChecks = getPasswordChecks(passwordDraft.next, { email: user?.email, fullName: user?.fullName })
  const passwordInputType = showPasswords ? 'text' : 'password'

  const handlePetPreferenceFieldChange = (field, value) => {
    setDraftPetPreferences((prev) => ({ ...prev, [field]: value }))
  }

  const startEditingPetPreferences = () => {
    setDraftPetPreferences(petPreferences)
    setIsEditingPetPreferences(true)
  }

  const cancelEditingPetPreferences = () => {
    setDraftPetPreferences(petPreferences)
    setIsEditingPetPreferences(false)
  }

  const savePetPreferencesEdits = () => {
    setPetPreferences(draftPetPreferences)
    savePetPreferences(draftPetPreferences)
    setIsEditingPetPreferences(false)
    onPreferencesSaved?.() // lets the dashboard re-score the recommendations
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 sm:px-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-black/10">
        <div className="flex flex-col gap-4 border-b border-[#CACACA] bg-[#683B0D] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#CEA74E]">My Profile</p>
            <p className="mt-2 text-2xl font-semibold text-white">Manage your profile information and preferences</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#683B0D] shadow-sm ring-1 ring-[#CACACA] transition hover:bg-[#CACACA]"
          >
            Close
          </button>
        </div>

        <div className="flex flex-col gap-4 border-b border-[#CACACA] bg-white px-5 py-4 sm:flex-row sm:items-center sm:px-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab ? 'bg-[#683B0D] text-white' : 'bg-[#CACACA]/30 text-[#989797] hover:bg-[#CACACA]/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="max-h-[calc(100vh-172px)] overflow-y-auto p-5 sm:p-6">
          {activeTab === 'Personal Information' && (
            <div className="space-y-6">
              {!user ? (
                <p className="text-sm text-[#989797]">Please log in again to see your profile.</p>
              ) : (
                <div className="grid gap-6 lg:grid-cols-[320px_auto]">
                  {/* Summary of the saved account details */}
                  <div className="h-fit rounded-4xl border border-[#CACACA] bg-[#CACACA]/20 p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-[#CEA74E]/25 text-2xl font-bold text-[#683B0D]"
                        aria-hidden="true"
                      >
                        {initialsOf(user.fullName) || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="break-words text-xl font-semibold text-[#683B0D]">{user.fullName}</p>
                        <p className="mt-1 text-sm text-[#989797]">Pet Guardian</p>
                      </div>
                    </div>
                    <div className="mt-6 space-y-4">
                      {[
                        { label: 'Email', value: user.email, breakAll: true },
                        { label: 'Phone', value: user.phone ? formatPhone(user.phone) : '' },
                        { label: 'Location', value: user.location },
                        { label: 'Member since', value: formatMemberSince(user.createdAt) },
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="text-sm text-[#989797]">{item.label}</p>
                          {item.value ? (
                            <p className={`mt-1 text-base font-medium text-[#683B0D] ${item.breakAll ? 'break-all' : ''}`}>{item.value}</p>
                          ) : (
                            <p className="mt-1 text-base italic text-[#989797]">Not provided</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Edit personal information */}
                    <form onSubmit={handleProfileSave} noValidate className="rounded-4xl border border-[#CACACA] bg-white p-6 shadow-sm">
                      <p className="text-sm font-semibold text-[#683B0D]">Personal information</p>
                      <p className="mt-2 text-sm text-[#989797]">Update how your name and contact details appear.</p>

                      {profileNotice && <div className="mt-4"><Notice tone={profileNotice.tone}>{profileNotice.text}</Notice></div>}

                      <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label htmlFor="pf-fullName" className="block text-sm font-semibold text-[#683B0D]">Full name</label>
                          <input
                            id="pf-fullName"
                            type="text"
                            autoComplete="name"
                            value={profileDraft.fullName}
                            onChange={(e) => { setProfileDraft((p) => ({ ...p, fullName: e.target.value })); setProfileErrors((p) => ({ ...p, fullName: undefined })); setProfileNotice(null) }}
                            aria-invalid={Boolean(profileErrors.fullName)}
                            aria-describedby={profileErrors.fullName ? 'pf-fullName-error' : undefined}
                            className={inputClass(profileErrors.fullName)}
                          />
                          <FieldError id="pf-fullName-error" message={profileErrors.fullName} />
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="pf-email" className="block text-sm font-semibold text-[#683B0D]">Email</label>
                          <input
                            id="pf-email"
                            type="email"
                            value={user.email}
                            readOnly
                            className="mt-2 w-full cursor-not-allowed rounded-3xl border border-[#CACACA] bg-[#CACACA]/20 px-4 py-3 text-sm text-[#989797] outline-none"
                          />
                          <p className="mt-2 text-xs text-[#989797]">Your email is your login, so it can't be changed here.</p>
                        </div>

                        <div>
                          <label htmlFor="pf-phone" className="block text-sm font-semibold text-[#683B0D]">
                            Mobile number <span className="font-normal text-[#989797]">(optional)</span>
                          </label>
                          <input
                            id="pf-phone"
                            type="tel"
                            autoComplete="tel"
                            value={profileDraft.phone}
                            onChange={(e) => { setProfileDraft((p) => ({ ...p, phone: e.target.value })); setProfileErrors((p) => ({ ...p, phone: undefined })); setProfileNotice(null) }}
                            aria-invalid={Boolean(profileErrors.phone)}
                            aria-describedby={profileErrors.phone ? 'pf-phone-error' : undefined}
                            placeholder="0917 123 4567"
                            className={inputClass(profileErrors.phone)}
                          />
                          <FieldError id="pf-phone-error" message={profileErrors.phone} />
                        </div>

                        <div>
                          <label htmlFor="pf-location" className="block text-sm font-semibold text-[#683B0D]">
                            Location <span className="font-normal text-[#989797]">(optional)</span>
                          </label>
                          <input
                            id="pf-location"
                            type="text"
                            autoComplete="address-level2"
                            value={profileDraft.location}
                            onChange={(e) => { setProfileDraft((p) => ({ ...p, location: e.target.value })); setProfileErrors((p) => ({ ...p, location: undefined })); setProfileNotice(null) }}
                            aria-invalid={Boolean(profileErrors.location)}
                            aria-describedby={profileErrors.location ? 'pf-location-error' : undefined}
                            placeholder="City or area"
                            className={inputClass(profileErrors.location)}
                          />
                          <FieldError id="pf-location-error" message={profileErrors.location} />
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          type="submit"
                          className="rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
                        >
                          Save changes
                        </button>
                      </div>
                    </form>

                    {/* Change password */}
                    <form onSubmit={handlePasswordSave} noValidate className="rounded-4xl border border-[#CACACA] bg-white p-6 shadow-sm">
                      <p className="text-sm font-semibold text-[#683B0D]">Change password</p>
                      <p className="mt-2 text-sm text-[#989797]">Choose a strong password you don't use anywhere else.</p>

                      {passwordNotice && <div className="mt-4"><Notice tone={passwordNotice.tone}>{passwordNotice.text}</Notice></div>}

                      <div className="mt-5 space-y-5">
                        <div>
                          <label htmlFor="pw-current" className="block text-sm font-semibold text-[#683B0D]">Current password</label>
                          <input
                            id="pw-current"
                            type={passwordInputType}
                            autoComplete="current-password"
                            value={passwordDraft.current}
                            onChange={(e) => { setPasswordDraft((p) => ({ ...p, current: e.target.value })); setPasswordErrors((p) => ({ ...p, currentPassword: undefined })); setPasswordNotice(null) }}
                            aria-invalid={Boolean(passwordErrors.currentPassword)}
                            aria-describedby={passwordErrors.currentPassword ? 'pw-current-error' : undefined}
                            className={inputClass(passwordErrors.currentPassword)}
                          />
                          <FieldError id="pw-current-error" message={passwordErrors.currentPassword} />
                        </div>

                        <div>
                          <label htmlFor="pw-new" className="block text-sm font-semibold text-[#683B0D]">New password</label>
                          <input
                            id="pw-new"
                            type={passwordInputType}
                            autoComplete="new-password"
                            value={passwordDraft.next}
                            onChange={(e) => { setPasswordDraft((p) => ({ ...p, next: e.target.value })); setPasswordErrors((p) => ({ ...p, newPassword: undefined })); setPasswordNotice(null) }}
                            aria-invalid={Boolean(passwordErrors.newPassword)}
                            aria-describedby="pw-new-rules"
                            className={inputClass(passwordErrors.newPassword)}
                          />
                          <FieldError id="pw-new-error" message={passwordErrors.newPassword} />
                          <ul id="pw-new-rules" className="mt-3 grid gap-1 text-xs sm:grid-cols-2">
                            {passwordChecks.map((check) => (
                              <li key={check.id} className={check.ok ? 'text-green-700' : 'text-[#989797]'}>
                                <span aria-hidden="true">{check.ok ? '✓' : '○'}</span> {check.label}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <label htmlFor="pw-confirm" className="block text-sm font-semibold text-[#683B0D]">Confirm new password</label>
                          <input
                            id="pw-confirm"
                            type={passwordInputType}
                            autoComplete="new-password"
                            value={passwordDraft.confirm}
                            onChange={(e) => { setPasswordDraft((p) => ({ ...p, confirm: e.target.value })); setPasswordErrors((p) => ({ ...p, confirm: undefined })); setPasswordNotice(null) }}
                            aria-invalid={Boolean(passwordErrors.confirm)}
                            aria-describedby={passwordErrors.confirm ? 'pw-confirm-error' : undefined}
                            className={inputClass(passwordErrors.confirm)}
                          />
                          <FieldError id="pw-confirm-error" message={passwordErrors.confirm} />
                        </div>

                        <label className="flex cursor-pointer items-center gap-2 text-sm text-[#989797]">
                          <input
                            type="checkbox"
                            checked={showPasswords}
                            onChange={(e) => setShowPasswords(e.target.checked)}
                            className="h-4 w-4 rounded border-[#CACACA] text-[#683B0D] focus:ring-[#CEA74E]"
                          />
                          Show passwords
                        </label>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          type="submit"
                          disabled={savingPassword}
                          className="rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {savingPassword ? 'Saving…' : 'Change password'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Preferences & Lifestyle' && (
            <div className="space-y-6">
              {/* Pet adoption preferences & lifestyle, collected at registration */}
              <div className="rounded-4xl border border-[#CACACA] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#683B0D]">Pet Adoption Preferences & Lifestyle</h3>
                    <p className="mt-2 text-sm text-[#989797]">
                      Our matching model uses these answers to recommend pets for you.
                    </p>
                  </div>
                  {!isEditingPetPreferences && (
                    <button
                      type="button"
                      onClick={startEditingPetPreferences}
                      className="rounded-full bg-[#683B0D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
                    >
                      {hasPetPreferences() ? 'Edit' : 'Add Preferences'}
                    </button>
                  )}
                </div>

                <div className="mt-6">
                  {isEditingPetPreferences ? (
                    <div className="space-y-6">
                      <PetPreferencesForm values={draftPetPreferences} onFieldChange={handlePetPreferenceFieldChange} />
                      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={cancelEditingPetPreferences}
                          className="rounded-full border border-[#CACACA] bg-white px-6 py-3 text-sm font-semibold text-[#683B0D] transition hover:bg-[#CACACA]/10"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={savePetPreferencesEdits}
                          className="rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
                        >
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  ) : hasPetPreferences() ? (
                    <PetPreferencesSummary values={petPreferences} />
                  ) : (
                    <p className="text-sm text-[#989797]">
                      You haven&apos;t completed your adoption preferences yet. Add them to get recommendations matched to you.
                    </p>
                  )}
                </div>
              </div>
              </div>

          )}
        </div>
      </div>
    </div>
  )
}