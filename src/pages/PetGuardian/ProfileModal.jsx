import React, { useState } from 'react'

export default function ProfileModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('Personal Information')
  if (!open) return null

  const tabs = ['Personal Information', 'Preferences', 'Adoption History']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 sm:px-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-black/10">
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-600">My Profile</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">Manage your profile information and preferences</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
          >
            Close
          </button>
        </div>

        <div className="flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:px-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="max-h-[calc(100vh-172px)] overflow-y-auto p-5 sm:p-6">
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[320px_auto]">
              <div className="rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-slate-200">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80"
                      alt="User placeholder"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-3 right-3 rounded-full bg-white p-2 shadow-sm">
                      <span className="block h-3.5 w-3.5 rounded-full bg-purple-600" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Full Name</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">Juan Dela Cruz</p>
                    <p className="mt-4 text-sm text-slate-500">Pet Guardian</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="mt-1 text-base font-medium text-slate-900">juan@email.com</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="mt-1 text-base font-medium text-slate-900">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="mt-1 text-base font-medium text-slate-900">San Francisco, CA</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">About You</p>
                      <p className="mt-2 text-sm text-slate-600">Tell us about yourself</p>
                    </div>
                    <button className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700">
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
                    <button className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700">
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
        </div>
      </div>
    </div>
  )
}
