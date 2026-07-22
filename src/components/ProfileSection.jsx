import React, { useState } from 'react'
import { Edit } from 'lucide-react'

export default function ProfileSection({ userRole = 'Guardian', onEditClick }) {
  const [userInfo] = useState({
    name: userRole === 'Guardian' ? 'Maria Santos' : 'Juan Dela Cruz',
    email: userRole === 'Guardian' ? 'maria@pawmatch.org' : 'juan.delacruz@providers.org',
    phone: userRole === 'Guardian' ? '+1 (555) 123-4567' : '+1 (555) 987-6543',
    avatar: userRole === 'Guardian' 
      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop',
    role: userRole === 'Guardian' ? 'Pet Guardian' : 'Pet Provider',
    memberSince: userRole === 'Guardian' ? 'Jan 2025' : 'Dec 2024',
  })

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#CACACA]">
      <div className="flex flex-col gap-6">
        {/* Top: Button positioned right */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onEditClick}
            className="inline-flex items-center gap-2 rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </button>
        </div>

        {/* Bottom: Avatar and Details */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* Left: Avatar and Basic Info */}
          <div className="flex flex-col items-center gap-4 lg:items-start">
            <div className="relative h-32 w-32 overflow-hidden rounded-3xl bg-[#CACACA]">
              <img
                src={userInfo.avatar}
                alt={userInfo.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-[#683B0D]">{userInfo.name}</h2>
              <p className="mt-1 text-sm text-[#989797]">{userInfo.role}</p>
            </div>
          </div>

          {/* Right: Details Grid */}
          <div className="flex-1 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-[#CACACA] p-4 bg-[#CACACA]/10">
              <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Email</p>
              <p className="mt-2 text-sm font-semibold text-[#683B0D] break-all">{userInfo.email}</p>
            </div>
            <div className="rounded-3xl border border-[#CACACA] p-4 bg-[#CACACA]/10">
              <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Phone</p>
              <p className="mt-2 text-sm font-semibold text-[#683B0D]">{userInfo.phone}</p>
            </div>
            <div className="rounded-3xl border border-[#CACACA] p-4 bg-[#CACACA]/10">
              <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Member Since</p>
              <p className="mt-2 text-sm font-semibold text-[#683B0D]">{userInfo.memberSince}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
