import React, { useEffect, useState } from 'react'
import { Edit } from 'lucide-react'
import { formatPhone, getCurrentUser, subscribeToUser } from '../Data/Accounts.jsx'

const initialsOf = (name) =>
  (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

const formatMemberSince = (iso) => {
  const date = iso ? new Date(iso) : null
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : ''
}

// Shows the signed-in person's real account details. Anything we don't have is
// shown as "Not provided" -- never a made-up value.
// It listens for changes, so it updates right after the profile is saved.
export default function ProfileSection({ userRole = 'Guardian', profile, onEditClick }) {
  const [liveUser, setLiveUser] = useState(getCurrentUser())

  useEffect(() => {
    setLiveUser(getCurrentUser()) // pick up anything that loaded after the first render
    return subscribeToUser(setLiveUser)
  }, [])

  // Prefer the freshest signed-in account; fall back to what the parent passed in.
  const account = liveUser || profile

  const userInfo = {
    name: account?.fullName || '',
    email: account?.email || '',
    phone: account?.phone ? formatPhone(account.phone) : '',
    location: account?.location || '',
    role: userRole === 'Guardian' ? 'Pet Guardian' : 'Pet Provider',
    memberSince: formatMemberSince(account?.createdAt),
  }

  const details = [
    { label: 'Email', value: userInfo.email, breakAll: true },
    { label: 'Phone', value: userInfo.phone },
    { label: 'Location', value: userInfo.location },
    { label: 'Member Since', value: userInfo.memberSince },
  ]

  return (
    <div className="relative rounded-3xl border border-[#CACACA] bg-white p-6 pb-20 shadow-sm">
      {/* Edit profile button */}
      <div className="absolute bottom-4 right-4">
        <button
          type="button"
          onClick={onEditClick}
          className="inline-flex items-center gap-2 rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        {/* Left: Avatar and Basic Info */}
        <div className="flex flex-col items-center gap-4 lg:items-start">
          <div
            className="flex h-32 w-32 items-center justify-center rounded-3xl bg-[#CEA74E]/25 text-4xl font-bold text-[#683B0D]"
            aria-hidden="true"
          >
            {initialsOf(userInfo.name) || '?'}
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-[#683B0D]">
              {userInfo.name || <span className="text-base font-normal italic text-[#989797]">Name not set</span>}
            </h2>
            <p className="mt-1 text-sm text-[#989797]">{userInfo.role}</p>
          </div>
        </div>

        {/* Right: Details Grid */}
        <div className="grid flex-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {details.map((item) => (
            <div key={item.label} className="rounded-3xl border border-[#CACACA] bg-[#CACACA]/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">{item.label}</p>
              {item.value ? (
                <p className={`mt-2 text-sm font-semibold text-[#683B0D] ${item.breakAll ? 'break-all' : ''}`}>{item.value}</p>
              ) : (
                <p className="mt-2 text-sm italic text-[#989797]">Not provided</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
