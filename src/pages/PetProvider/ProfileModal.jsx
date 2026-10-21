import React, { useEffect, useState } from 'react'
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

const Notice = ({ notice }) =>
  notice ? (
    <div
      role="alert"
      className={`rounded-3xl border px-4 py-3 text-sm ${
        notice.tone === 'success'
          ? 'border-green-200 bg-green-50 text-green-700'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      {notice.text}
    </div>
  ) : null

const FieldError = ({ message }) =>
  message ? <p role="alert" className="mt-2 text-xs font-medium text-red-600">{message}</p> : null

const tabs = ['Personal Information', 'Password']

export default function Profile({ open, onClose, user, onUserChange }) {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [profileDraft, setProfileDraft] = useState({ fullName: '', phone: '', location: '' })
  const [profileErrors, setProfileErrors] = useState({})
  const [profileNotice, setProfileNotice] = useState(null)
  const [passwordDraft, setPasswordDraft] = useState({ current: '', next: '', confirm: '' })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [passwordNotice, setPasswordNotice] = useState(null)
  const [savingPassword, setSavingPassword] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)

  // Start from the saved account every time the modal opens.
  useEffect(() => {
    if (!open || !user) return
    setActiveTab(tabs[0])
    setProfileDraft({
      fullName: user.fullName,
      phone: user.phone ? formatPhone(user.phone) : '',
      location: user.location || '',
    })
    setProfileErrors({})
    setProfileNotice(null)
    setPasswordDraft({ current: '', next: '', confirm: '' })
    setPasswordErrors({})
    setPasswordNotice(null)
  }, [open, user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null

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
  const memberSince = formatMemberSince(user?.createdAt)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 sm:px-6">
      <div className="w-full max-w-4xl overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-black/10">
        <div className="flex flex-col gap-4 border-b border-[#CACACA] bg-[#683B0D] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#CEA74E]">My Profile</p>
            <p className="mt-2 text-2xl font-semibold text-white">Manage your provider account</p>
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

        <div className="max-h-[calc(100vh-232px)] overflow-y-auto p-5 sm:p-6">
          {!user ? (
            <p className="text-sm text-[#989797]">Please log in again to see your profile.</p>
          ) : activeTab === 'Personal Information' ? (
            <div className="grid gap-6 lg:grid-cols-[280px_auto]">
              <div className="h-fit rounded-4xl border border-[#CACACA] bg-[#CACACA]/20 p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-[#CEA74E]/25 text-2xl font-bold text-[#683B0D]"
                    aria-hidden="true"
                  >
                    {initialsOf(user.fullName)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold text-[#683B0D]">{user.fullName}</p>
                    <p className="text-sm text-[#989797]">Pet Provider</p>
                  </div>
                </div>
                <p className="mt-4 break-all text-sm text-[#683B0D]">{user.email}</p>
                {memberSince && <p className="mt-1 text-xs text-[#989797]">Member since {memberSince}</p>}
              </div>

              <form className="space-y-5" onSubmit={handleProfileSave} noValidate>
                <Notice notice={profileNotice} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pf-name" className="block text-sm font-semibold text-[#683B0D]">Full name</label>
                    <input
                      id="pf-name"
                      value={profileDraft.fullName}
                      onChange={(e) => { setProfileDraft((p) => ({ ...p, fullName: e.target.value })); setProfileErrors((p) => ({ ...p, fullName: undefined })) }}
                      aria-invalid={Boolean(profileErrors.fullName)}
                      className={inputClass(profileErrors.fullName)}
                    />
                    <FieldError message={profileErrors.fullName} />
                  </div>
                  <div>
                    <label htmlFor="pf-email" className="block text-sm font-semibold text-[#683B0D]">Email</label>
                    <input
                      id="pf-email"
                      value={user.email}
                      readOnly
                      className="mt-2 w-full cursor-not-allowed rounded-3xl border border-[#CACACA] bg-[#CACACA]/20 px-4 py-3 text-sm text-[#989797] outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="pf-phone" className="block text-sm font-semibold text-[#683B0D]">Mobile number</label>
                    <input
                      id="pf-phone"
                      value={profileDraft.phone}
                      onChange={(e) => { setProfileDraft((p) => ({ ...p, phone: e.target.value })); setProfileErrors((p) => ({ ...p, phone: undefined })) }}
                      aria-invalid={Boolean(profileErrors.phone)}
                      placeholder="0917 123 4567"
                      className={inputClass(profileErrors.phone)}
                    />
                    <FieldError message={profileErrors.phone} />
                  </div>
                  <div>
                    <label htmlFor="pf-location" className="block text-sm font-semibold text-[#683B0D]">Location</label>
                    <input
                      id="pf-location"
                      value={profileDraft.location}
                      onChange={(e) => { setProfileDraft((p) => ({ ...p, location: e.target.value })); setProfileErrors((p) => ({ ...p, location: undefined })) }}
                      aria-invalid={Boolean(profileErrors.location)}
                      placeholder="Antipolo, Rizal"
                      className={inputClass(profileErrors.location)}
                    />
                    <FieldError message={profileErrors.location} />
                    <p className="mt-1 text-xs text-[#989797]">Used as the default location for new pet listings.</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <form className="mx-auto max-w-lg space-y-5" onSubmit={handlePasswordSave} noValidate>
              <Notice notice={passwordNotice} />
              <div>
                <label htmlFor="pw-current" className="block text-sm font-semibold text-[#683B0D]">Current password</label>
                <input
                  id="pw-current"
                  type={passwordInputType}
                  autoComplete="current-password"
                  value={passwordDraft.current}
                  onChange={(e) => { setPasswordDraft((p) => ({ ...p, current: e.target.value })); setPasswordErrors((p) => ({ ...p, currentPassword: undefined })) }}
                  aria-invalid={Boolean(passwordErrors.currentPassword)}
                  className={inputClass(passwordErrors.currentPassword)}
                />
                <FieldError message={passwordErrors.currentPassword} />
              </div>
              <div>
                <label htmlFor="pw-new" className="block text-sm font-semibold text-[#683B0D]">New password</label>
                <input
                  id="pw-new"
                  type={passwordInputType}
                  autoComplete="new-password"
                  value={passwordDraft.next}
                  onChange={(e) => { setPasswordDraft((p) => ({ ...p, next: e.target.value })); setPasswordErrors((p) => ({ ...p, newPassword: undefined })) }}
                  aria-invalid={Boolean(passwordErrors.newPassword)}
                  className={inputClass(passwordErrors.newPassword)}
                />
                <FieldError message={passwordErrors.newPassword} />
                {passwordDraft.next && (
                  <ul className="mt-3 space-y-1 text-xs">
                    {passwordChecks.map((check) => (
                      <li key={check.id} className={check.ok ? 'text-green-700' : 'text-[#989797]'}>
                        {check.ok ? '✓' : '○'} {check.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label htmlFor="pw-confirm" className="block text-sm font-semibold text-[#683B0D]">Confirm new password</label>
                <input
                  id="pw-confirm"
                  type={passwordInputType}
                  autoComplete="new-password"
                  value={passwordDraft.confirm}
                  onChange={(e) => { setPasswordDraft((p) => ({ ...p, confirm: e.target.value })); setPasswordErrors((p) => ({ ...p, confirm: undefined })) }}
                  aria-invalid={Boolean(passwordErrors.confirm)}
                  className={inputClass(passwordErrors.confirm)}
                />
                <FieldError message={passwordErrors.confirm} />
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
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingPassword ? 'Saving…' : 'Change password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
