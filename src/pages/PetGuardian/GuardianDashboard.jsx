import React, { useEffect, useState } from 'react'
import { Home, Users, Search, Filter, Heart, MessageSquare } from 'lucide-react'
import SideBar from '../PetGuardian/Sidebar.jsx'
import ProfileModal from '../PetGuardian/ProfileModal.jsx'
import MessageModal from '../PetGuardian/MessageModal.jsx'
import { pets, applications, messagesList } from '../../Data/ProviderSampleData.jsx'

export default function GuardianDashboard({ openProfileOnMount, openMessageNameOnMount }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState('All')
  const [selectedSize, setSelectedSize] = useState('All')
  const [selectedAge, setSelectedAge] = useState('All')

  const handleNavClick = (id) => {
    if (id === 'profile') {
      setActiveTab('profile')
      setProfileModalOpen(true)
    } else {
      setActiveTab(id)
    }
  }

  const openMessageModal = (message) => {
    setSelectedMessage(message)
  }

  const closeMessageModal = () => {
    setSelectedMessage(null)
  }

  useEffect(() => {
    if (openProfileOnMount) {
      setActiveTab('profile')
      setProfileModalOpen(true)
    }
    if (openMessageNameOnMount) {
      const message = messagesList.find(msg => msg.name === openMessageNameOnMount)
      if (message) {
        openMessageModal(message)
      }
    }
  }, [openProfileOnMount, openMessageNameOnMount])

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'applications', label: 'My Applications', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ]

  const speciesOptions = ['All', 'Cat', 'Dog', 'Rabbit']
  const sizeOptions = ['All', 'Small', 'Medium', 'Large']
  const ageOptions = ['All', 'Puppy/Kitten', 'Young', 'Adult']

  const filteredPets = pets.filter((pet) => {
    const searchMatch = [pet.name, pet.breed].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const speciesMatch = selectedSpecies === 'All' || pet.breed.toLowerCase().includes(selectedSpecies.toLowerCase())
    const sizeMatch = selectedSize === 'All' || (selectedSize === 'Small' ? pet.age.includes('yr') : true)
    const ageMatch = selectedAge === 'All' || (selectedAge === 'Puppy/Kitten' ? pet.age.includes('mo') : true)
    return searchMatch && speciesMatch && sizeMatch && ageMatch
  })

  const filteredApplications = applications.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.pet.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredMessages = messagesList.filter((msg) =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <SideBar
        activeTab={activeTab}
        onNavClick={handleNavClick}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigationItems={navigationItems}
      />

      <div className="flex-1 overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between sticky top-0 z-20">
          <div>
            <p className="text-sm text-gray-500">Guardian Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Browse Pets</h1>
            <p className="mt-1 text-sm text-gray-600">Find your perfect companion and submit adoption requests in one place.</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        <main className="h-[calc(100vh-88px)] overflow-auto px-6 py-6">
          <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-500">Search pets</p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <label className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by pet name, breed, or keyword..."
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-12 py-3 text-sm text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <select
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
              >
                {speciesOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
              >
                {sizeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
              >
                {ageOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <section className="space-y-6">
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-slate-500">Available pets</p>
                  <p className="mt-4 text-3xl font-bold text-slate-900">{pets.length}</p>
                  <p className="mt-2 text-sm text-slate-600">Explore the latest available animals for adoption.</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-slate-500">Favorites</p>
                  <p className="mt-4 text-3xl font-bold text-slate-900">24</p>
                  <p className="mt-2 text-sm text-slate-600">Keep track of pets you love.</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-slate-500">Requests sent</p>
                  <p className="mt-4 text-3xl font-bold text-slate-900">8</p>
                  <p className="mt-2 text-sm text-slate-600">Manage your active adoption inquiries.</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredPets.map((pet) => (
                  <div key={pet.name} className="overflow-hidden rounded-[32px] bg-white shadow-sm">
                    <div className="h-48 overflow-hidden bg-slate-100">
                      <img src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-500">{pet.breed}</p>
                          <h2 className="mt-2 text-2xl font-bold text-slate-900">{pet.name}</h2>
                        </div>
                        <button className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50">
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{pet.age}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{pet.status}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{pet.health}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'applications' && (
            <section className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">My Applications</h2>
                <p className="mt-2 text-sm text-slate-600">Review the adoption applications and next steps.</p>
              </div>
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div key={app.name} className="rounded-3xl bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <img src={app.avatar} alt={app.name} className="h-16 w-16 rounded-full object-cover" />
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{app.name}</h3>
                          <p className="text-sm text-slate-500">Applied for {app.pet}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{app.status}</span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-slate-600">{app.message}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</p>
                        <p className="mt-1 text-sm text-slate-800">{app.email}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Phone</p>
                        <p className="mt-1 text-sm text-slate-800">{app.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Last update</p>
                        <p className="mt-1 text-sm text-slate-800">{app.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'messages' && (
            <section className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">My Messages</h2>
                <p className="mt-2 text-sm text-slate-600">View conversations with pet providers.</p>
              </div>
              <div className="space-y-4">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((msg) => (
                    <button
                      key={msg.name}
                      type="button"
                      onClick={() => openMessageModal(msg)}
                      className="w-full rounded-3xl bg-white p-4 text-left shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <img src={msg.avatar} alt={msg.name} className="h-14 w-14 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-gray-900">{msg.name}</p>
                            <p className="text-sm text-gray-600">{msg.message}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{msg.time}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
                    <p className="text-gray-700">No messages match your search yet.</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === 'profile' && (
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Guardian Profile</h2>
              <p className="mt-2 text-sm text-slate-600">Manage your account details and adoption preferences.</p>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 p-6">
                  <p className="text-sm text-slate-500">Name</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Maria Santos</p>
                </div>
                <div className="rounded-3xl border border-slate-200 p-6">
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">maria@pawmatch.org</p>
                </div>
                <div className="rounded-3xl border border-slate-200 p-6">
                  <p className="text-sm text-slate-500">Favorite Breed</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Golden Retriever</p>
                </div>
                <div className="rounded-3xl border border-slate-200 p-6">
                  <p className="text-sm text-slate-500">Member since</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Jan 2025</p>
                </div>
              </div>
            </section>
          )}
          </main>
        </div>
        <ProfileModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
        <MessageModal message={selectedMessage} onClose={closeMessageModal} />
      </div>
  )
}
