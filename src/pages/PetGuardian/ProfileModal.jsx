import React, { useState } from 'react'

export default function ProfileModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('Personal Information')
  if (!open) return null

  const tabs = ['Personal Information', 'Preferences']

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
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[320px_auto]">
              <div className="rounded-4xl border border-[#CACACA] bg-[#CACACA]/20 p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-[#CACACA]">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80"
                      alt="User placeholder"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-3 right-3 rounded-full bg-white p-2 shadow-sm">
                      <span className="block h-3.5 w-3.5 rounded-full bg-[#683B0D]" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#989797]">Full Name</p>
                    <p className="mt-2 text-xl font-semibold text-[#683B0D]">Juan Dela Cruz</p>
                    <p className="mt-4 text-sm text-[#989797]">Pet Guardian</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-sm text-[#989797]">Email</p>
                    <p className="mt-1 text-base font-medium text-[#683B0D]">juan@email.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#989797]">Phone</p>
                    <p className="mt-1 text-base font-medium text-[#683B0D]">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#989797]">Location</p>
                    <p className="mt-1 text-base font-medium text-[#683B0D]">San Francisco, CA</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-4xl border border-[#CACACA] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#683B0D]">About You</p>
                      <p className="mt-2 text-sm text-[#989797]">Tell us about yourself</p>
                    </div>
                    <button className="rounded-full bg-[#683B0D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#CEA74E]">
                      Edit
                    </button>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#989797]">
                    I'm an animal lover looking to adopt a furry companion to join my family. I have experience with pets and a fenced yard.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-[#CACACA]/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Occupation</p>
                      <p className="mt-2 text-sm font-semibold text-[#683B0D]">Software Engineer</p>
                    </div>
                    <div className="rounded-3xl bg-[#CACACA]/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Housing Type</p>
                      <p className="mt-2 text-sm font-semibold text-[#683B0D]">Apartment</p>
                    </div>
                    <div className="rounded-3xl bg-[#CACACA]/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Living Situation</p>
                      <p className="mt-2 text-sm font-semibold text-[#683B0D]">Live with partner</p>
                    </div>
                    <div className="rounded-3xl bg-[#CACACA]/20 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Experience</p>
                      <p className="mt-2 text-sm font-semibold text-[#683B0D]">5+ years</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-4xl border border-[#CACACA] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#683B0D]">Account Settings</p>
                      <p className="mt-2 text-sm text-[#989797]">Manage how you sign in and hear updates.</p>
                    </div>
                    <button className="rounded-full bg-[#683B0D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#CEA74E]">
                      Edit
                    </button>
                  </div>
                  <div className="mt-6 space-y-3">
                    <button className="flex w-full items-center justify-between rounded-3xl border border-[#CACACA] bg-[#CACACA]/20 px-4 py-4 text-left text-sm text-[#989797] transition hover:bg-[#CACACA]/40">
                      <div>
                        <p className="font-semibold text-[#683B0D]">Change Password</p>
                        <p className="mt-1 text-sm text-[#989797]">Update your password</p>
                      </div>
                      <span className="text-[#CEA74E]">›</span>
                    </button>
                    <button className="flex w-full items-center justify-between rounded-3xl border border-[#CACACA] bg-[#CACACA]/20 px-4 py-4 text-left text-sm text-[#989797] transition hover:bg-[#CACACA]/40">
                      <div>
                        <p className="font-semibold text-[#683B0D]">Notification Preferences</p>
                        <p className="mt-1 text-sm text-[#989797]">Manage how you receive updates</p>
                      </div>
                      <span className="text-[#CEA74E]">›</span>
                    </button>
                  </div>
                </div>
              </div>
                    <button className="rounded-full bg-[#683B0D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#683B0D]">
                      Edit
                    </button>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-700">
                    I’m an animal lover looking to adopt a furry companion to join my family. I have experience with pets and a fenced yard.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Occupation</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">Software Engineer</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Housing Type</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">Apartment</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Living Situation</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">Live with partner</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Experience</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">5+ years</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Account Settings</p>
                      <p className="mt-2 text-sm text-slate-600">Manage how you sign in and hear updates.</p>
                    </div>
                    <button className="rounded-full bg-[#683B0D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#683B0D]">
                      Edit
                    </button>
                  </div>
                  <div className="mt-6 space-y-3">
                    <button className="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm text-slate-700 transition hover:bg-slate-100">
                      <div>
                        <p className="font-semibold text-slate-900">Change Password</p>
                        <p className="mt-1 text-sm text-slate-600">Update your password</p>
                      </div>
                      <span className="text-slate-400">›</span>
                    </button>
                    <button className="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm text-slate-700 transition hover:bg-slate-100">
                      <div>
                        <p className="font-semibold text-slate-900">Notification Preferences</p>
                        <p className="mt-1 text-sm text-slate-600">Manage how you receive updates</p>
                      </div>
                      <span className="text-slate-400">›</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  )
}
