import React, { useState } from 'react'

export default function Profile({ open, onClose }) {
  const [fullName, setFullName] = useState('Juan Dela Cruz')
  const [email, setEmail] = useState('juan@email.com')
  const [phone, setPhone] = useState('0912 345 6789')
  const [role] = useState('Provider')
  const [bio, setBio] = useState('Pet lover and proud caregiver. Hoping to give a furry friend a better home!')

  const [adoptionUpdates, setAdoptionUpdates] = useState(true)
  const [newPetMatches, setNewPetMatches] = useState(true)
  const [tipsResources, setTipsResources] = useState(false)
  const [marketing, setMarketing] = useState(false)

  const [profileVisibility, setProfileVisibility] = useState('Everyone')
  const [showEmail, setShowEmail] = useState(false)
  const [showPhone, setShowPhone] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    // Placeholder save action - replace with API call
    console.log('Saving profile', { fullName, email, phone, bio })
    alert('Profile saved (placeholder)')
  }

  const handleDelete = () => {
    if (window.confirm('Delete account and all of your data? This cannot be undone.')) {
      console.log('Account deleted (placeholder)')
      alert('Account deleted (placeholder)')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-50 w-full max-w-6xl max-h-[90vh] overflow-auto">
        <div className="rounded-2xl shadow-lg overflow-hidden bg-white">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold">Profile</h3>
              <button onClick={onClose} className="text-[#989797] hover:text-[#683B0D]">Close</button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left column */}
              <aside className="col-span-1 space-y-6 lg:col-span-1">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 flex flex-col items-center gap-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=7c3aed&color=fff&size=256`}
                    alt="Profile"
                    className="h-28 w-28 rounded-full object-cover shadow-sm"
                  />
                  <div className="text-center">
                    <p className="font-semibold text-[#683B0D]">{fullName}</p>
                    <p className="text-sm text-[#989797]">{role}</p>
                  </div>
                  <input type="file" className="hidden" id="profilePic" />
                  <label htmlFor="profilePic" className="inline-flex w-full items-center justify-center rounded-full border border-[#CACACA] bg-white px-4 py-2 text-sm font-medium text-[#683B0D] hover:bg-white">
                    Change Photo
                  </label>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5">
                  <h3 className="mb-4 text-lg font-semibold">Need Help?</h3>
                  <ul className="space-y-3 text-sm text-[#683B0D]">
                    <li className="flex items-center justify-between">
                      <span>Help Center</span>
                      <span className="text-[#989797]">›</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Contact Support</span>
                      <span className="text-[#989797]">›</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Privacy Policy</span>
                      <span className="text-[#989797]">›</span>
                    </li>
                  </ul>
                </div>
              </aside>

              {/* Main column */}
              <main className="col-span-1 lg:col-span-2 space-y-6">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="rounded-2xl border border-gray-100 bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold">Account Information</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="text-sm font-medium text-[#683B0D]">Full Name</span>
                        <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2 w-full rounded-lg border border-[#CACACA] px-4 py-3 outline-none focus:border-[#CEA74E]-500 focus:ring-2 focus:ring-[#CEA74E]-50" />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-[#683B0D]">Email</span>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-[#CACACA] px-4 py-3 outline-none bg-white" />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-[#683B0D]">Phone Number</span>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 w-full rounded-lg border border-[#CACACA] px-4 py-3 outline-none" />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-[#683B0D]">Role</span>
                        <input value={role} readOnly className="mt-2 w-full rounded-lg border border-[#CACACA] px-4 py-3 outline-none bg-white" />
                      </label>
                    </div>

                    <label className="block mt-4">
                      <span className="text-sm font-medium text-[#683B0D]">Bio</span>
                      <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={250} className="mt-2 h-28 w-full rounded-lg border border-[#CACACA] px-4 py-3 outline-none" />
                      <div className="mt-2 text-right text-xs text-[#989797]">{bio.length}/250</div>
                    </label>

                    <div className="mt-6 flex justify-end">
                      <button type="submit" className="rounded-full bg-[#683B0D]600 px-6 py-2 text-sm font-semibold text-white hover:bg-[#683B0D]700">Save Changes</button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold">Email Preferences</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Adoption Updates</p>
                          <p className="text-xs text-[#989797]">Receive updates about your applications</p>
                        </div>
                        <label className="inline-flex items-center">
                          <input type="checkbox" checked={adoptionUpdates} onChange={(e) => setAdoptionUpdates(e.target.checked)} className="h-5 w-10 rounded-full accent-[#683B0D]" />
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Pet Matches</p>
                          <p className="text-xs text-[#989797]">Get notified when new pets match your preferences</p>
                        </div>
                        <label className="inline-flex items-center">
                          <input type="checkbox" checked={newPetMatches} onChange={(e) => setNewPetMatches(e.target.checked)} className="h-5 w-10 rounded-full accent-[#683B0D]" />
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Tips & Resources</p>
                          <p className="text-xs text-[#989797]">Receive helpful tips and pet care resources</p>
                        </div>
                        <label className="inline-flex items-center">
                          <input type="checkbox" checked={tipsResources} onChange={(e) => setTipsResources(e.target.checked)} className="h-5 w-10 rounded-full accent-[#683B0D]" />
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing & Promotions</p>
                          <p className="text-xs text-[#989797]">Receive news and special offers</p>
                        </div>
                        <label className="inline-flex items-center">
                          <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="h-5 w-10 rounded-full accent-[#683B0D]" />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-100 bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold">Privacy</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-sm font-medium text-[#683B0D]">Profile Visibility</span>
                        <select value={profileVisibility} onChange={(e) => setProfileVisibility(e.target.value)} className="mt-2 w-full rounded-lg border border-[#CACACA] px-4 py-3 outline-none">
                          <option>Everyone</option>
                          <option>Only Me</option>
                          <option>Connected Users</option>
                        </select>
                      </label>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Show My Email</p>
                            <p className="text-xs text-[#989797]">Allow others to see your email</p>
                          </div>
                          <label className="inline-flex items-center">
                            <input type="checkbox" checked={showEmail} onChange={(e) => setShowEmail(e.target.checked)} className="h-5 w-10 rounded-full accent-[#683B0D]" />
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Show My Phone Number</p>
                            <p className="text-xs text-[#989797]">Allow others to see your phone number</p>
                          </div>
                          <label className="inline-flex items-center">
                            <input type="checkbox" checked={showPhone} onChange={(e) => setShowPhone(e.target.checked)} className="h-5 w-10 rounded-full accent-[#683B0D]" />
                          </label>
                        </div>

                        <div className="mt-2 flex items-center justify-between border-t pt-3">
                          <div>
                            <p className="font-medium text-red-500">Delete Account</p>
                            <p className="text-xs text-[#989797]">Permanently delete your account and all of your data.</p>
                          </div>
                          <button onClick={handleDelete} type="button" className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">Delete Account</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
