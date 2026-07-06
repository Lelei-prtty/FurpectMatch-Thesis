import React, { useEffect, useState } from 'react'
import { Home, Users, Search, Filter, Heart, MessageSquare } from 'lucide-react'
import SideBar from '../PetGuardian/Sidebar.jsx'
import MessageModal from '../PetGuardian/MessageModal.jsx'
import { pets, applications, messagesList } from '../../Data/ProviderSampleData.jsx'

export default function GuardianDashboard({ openProfileOnMount, openMessageNameOnMount }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState('All')
  const [selectedSize, setSelectedSize] = useState('All')
  const [selectedAge, setSelectedAge] = useState('All')

  const handleNavClick = (id) => {
    setActiveTab(id)
  }

  const getHeaderText = () => {
    const headers = {
      'dashboard': { title: 'Browse Pets', desc: 'Find your perfect companion and submit adoption requests in one place.' },
      'applications': { title: 'My Applications', desc: 'Review the adoption applications and next steps.' },
      'messages': { title: 'My Messages', desc: 'View conversations with pet providers.' },
      'profile': { title: 'My Profile', desc: 'Manage your account details and adoption preferences.' },
      'adoption': { title: 'Adoption History', desc: 'View your pet adoption history and details.' }
    }
    return headers[activeTab] || headers['dashboard']
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

  const adoptionHistory = [
    {
      petName: 'Coco',
      breed: 'Rabbit',
      adoptionDate: 'May 30, 2024',
      image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4d4b3f4?w=300&h=300&fit=crop',
      status: 'Currently with us',
      notes: 'Coco is a sweet and gentle rabbit who loves fresh vegetables and quiet spaces.'
    },
    {
      petName: 'Whiskers',
      breed: 'Siamese Cat',
      adoptionDate: 'January 15, 2023',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop',
      status: 'Previously adopted',
      notes: 'Whiskers was adopted but later returned. Very affectionate and loves playtime.'
    }
  ]

  const headerText = getHeaderText()

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <SideBar
        activeTab={activeTab}
        onNavClick={handleNavClick}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigationItems={navigationItems}
      />

      <div className="flex-1 overflow-hidden">
        <div className="bg-white border-b border-[#CACACA] px-6 py-5 flex items-center justify-between sticky top-0 z-20">
          <div>
            <p className="text-sm text-[#989797]">Guardian Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#683B0D]">{headerText.title}</h1>
            <p className="mt-1 text-sm text-[#989797]">{headerText.desc}</p>
          </div>
          {activeTab === 'dashboard' && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[#CACACA] bg-white px-4 py-2 text-sm font-semibold text-[#683B0D] shadow-sm hover:bg-[#CACACA]/20"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          )}
        </div>

        <main className="h-[calc(100vh-88px)] overflow-auto px-6 py-6">
          {activeTab === 'dashboard' && (
            <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm border border-[#CACACA]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#989797]">Search pets</p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <label className="relative flex-1">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#989797]" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by pet name, breed, or keyword..."
                        className="w-full rounded-3xl border border-[#CACACA] bg-white px-12 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CEA74E]/20"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <select
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                  className="rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E]"
                >
                  {speciesOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E]"
                >
                  {sizeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E]"
                >
                  {ageOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <section className="space-y-6">
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#CACACA]">
                  <p className="text-sm font-semibold text-[#989797]">Available pets</p>
                  <p className="mt-4 text-3xl font-bold text-[#683B0D]">{pets.length}</p>
                  <p className="mt-2 text-sm text-[#989797]">Explore the latest available animals for adoption.</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#CACACA]">
                  <p className="text-sm font-semibold text-[#989797]">Favorites</p>
                  <p className="mt-4 text-3xl font-bold text-[#683B0D]">24</p>
                  <p className="mt-2 text-sm text-[#989797]">Keep track of pets you love.</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#CACACA]">
                  <p className="text-sm font-semibold text-[#989797]">Requests sent</p>
                  <p className="mt-4 text-3xl font-bold text-[#683B0D]">8</p>
                  <p className="mt-2 text-sm text-[#989797]">Manage your active adoption inquiries.</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredPets.map((pet) => (
                  <div key={pet.name} className="overflow-hidden rounded-[32px] bg-white shadow-sm border border-[#CACACA] hover:shadow-md transition">
                    <div className="h-48 overflow-hidden bg-[#CACACA]">
                      <img src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[#989797]">{pet.breed}</p>
                          <h2 className="mt-2 text-2xl font-bold text-[#683B0D]">{pet.name}</h2>
                        </div>
                        <button className="rounded-full border border-[#CACACA] bg-white p-2 text-[#683B0D] hover:bg-[#CEA74E] hover:text-white transition">
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#CACACA]/30 px-3 py-1 text-xs font-semibold text-[#683B0D]">{pet.age}</span>
                        <span className="rounded-full bg-[#CACACA]/30 px-3 py-1 text-xs font-semibold text-[#683B0D]">{pet.status}</span>
                        <span className="rounded-full bg-[#CACACA]/30 px-3 py-1 text-xs font-semibold text-[#683B0D]">{pet.health}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'applications' && (
            <section className="space-y-6">
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div key={app.name} className="rounded-3xl bg-white p-6 shadow-sm border border-[#CACACA] hover:shadow-md transition">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <img src={app.avatar} alt={app.name} className="h-16 w-16 rounded-full object-cover" />
                        <div>
                          <h3 className="text-lg font-semibold text-[#683B0D]">{app.name}</h3>
                          <p className="text-sm text-[#989797]">Applied for {app.pet}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-[#CEA74E] px-3 py-1 text-sm font-semibold text-white">{app.status}</span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-[#989797]">{app.message}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Email</p>
                        <p className="mt-1 text-sm text-[#683B0D]">{app.email}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Phone</p>
                        <p className="mt-1 text-sm text-[#683B0D]">{app.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Last update</p>
                        <p className="mt-1 text-sm text-[#683B0D]">{app.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'messages' && (
            <section className="space-y-6">
              <div className="space-y-4">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((msg) => (
                    <button
                      key={msg.name}
                      type="button"
                      onClick={() => openMessageModal(msg)}
                      className="w-full rounded-3xl bg-white p-4 text-left shadow-sm border border-[#CACACA] transition hover:shadow-md hover:border-[#CEA74E]"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <img src={msg.avatar} alt={msg.name} className="h-14 w-14 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-[#683B0D]">{msg.name}</p>
                            <p className="text-sm text-[#989797]">{msg.message}</p>
                          </div>
                        </div>
                        <p className="text-sm text-[#989797]">{msg.time}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-3xl bg-white p-8 text-center shadow-sm border border-[#CACACA]">
                    <p className="text-[#989797]">No messages to display.</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === 'profile' && (
            <section className="rounded-3xl bg-white p-6 shadow-sm border border-[#CACACA]">
              <h2 className="text-xl font-semibold text-[#683B0D]">Guardian Profile</h2>
              <p className="mt-2 text-sm text-[#989797]">Manage your account details and adoption preferences.</p>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-[#CACACA] p-6 bg-[#CACACA]/10">
                  <p className="text-sm text-[#989797]">Name</p>
                  <p className="mt-2 text-lg font-semibold text-[#683B0D]">Maria Santos</p>
                </div>
                <div className="rounded-3xl border border-[#CACACA] p-6 bg-[#CACACA]/10">
                  <p className="text-sm text-[#989797]">Email</p>
                  <p className="mt-2 text-lg font-semibold text-[#683B0D]">maria@pawmatch.org</p>
                </div>
                <div className="rounded-3xl border border-[#CACACA] p-6 bg-[#CACACA]/10">
                  <p className="text-sm text-[#989797]">Favorite Breed</p>
                  <p className="mt-2 text-lg font-semibold text-[#683B0D]">Golden Retriever</p>
                </div>
                <div className="rounded-3xl border border-[#CACACA] p-6 bg-[#CACACA]/10">
                  <p className="text-sm text-[#989797]">Member since</p>
                  <p className="mt-2 text-lg font-semibold text-[#683B0D]">Jan 2025</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'adoption' && (
            <section className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#CACACA]">
                <h2 className="text-xl font-semibold text-[#683B0D]">Adoption History</h2>
                <p className="mt-2 text-sm text-[#989797]">View your pet adoption history and details.</p>
              </div>
              <div className="space-y-6">
                {adoptionHistory.length > 0 ? (
                  adoptionHistory.map((adoption, index) => (
                    <div key={index} className="rounded-4xl border border-[#CACACA] bg-white p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-6">
                        <div className="h-32 w-32 shrink-0 overflow-hidden rounded-3xl bg-[#CACACA]">
                          <img
                            src={adoption.image}
                            alt={adoption.petName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                              <p className="text-2xl font-semibold text-[#683B0D]">{adoption.petName}</p>
                              <p className="mt-1 text-sm text-[#989797]">{adoption.breed}</p>
                            </div>
                            <span className="inline-flex rounded-full bg-[#CEA74E] px-3 py-1 text-sm font-semibold text-white w-fit">
                              {adoption.status}
                            </span>
                          </div>
                          <p className="mt-3 text-sm font-medium text-[#989797]">
                            Adoption Date: <span className="text-[#683B0D]">{adoption.adoptionDate}</span>
                          </p>
                          <p className="mt-4 leading-6 text-[#989797]">{adoption.notes}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-4xl border border-[#CACACA] bg-[#CACACA]/20 p-8 text-center">
                    <p className="text-[#989797]">No adoption history yet.</p>
                  </div>
                )}
              </div>
            </section>
          )}
          </main>
        </div>
        <MessageModal message={selectedMessage} onClose={closeMessageModal} />
      </div>
  )
}
