import React, { useEffect, useMemo, useState } from 'react'
import { Home, Users, Search, Heart, MessageSquare, Bell, X } from 'lucide-react'
import SideBar from '../PetGuardian/Sidebar.jsx'
import MessageModal from '../PetGuardian/MessageModal.jsx'
import ProfileModal from '../PetGuardian/ProfileModal.jsx'
import PetDetailModal from '../PetGuardian/PetDetailModal.jsx'
import ProfileSection from '../../components/ProfileSection.jsx'
import NotificationModal from '../../components/NotificationModal.jsx'
import PetPhoto from '../../components/PetPhoto.jsx'
import MessagesTab from '../../components/MessagesTab.jsx'
import ApprovalNoticeModal from '../../components/ApprovalNoticeModal.jsx'
import {
  getGuardianId,
  getAdoptionRequests,
  addAdoptionRequest,
  withdrawAdoptionRequest,
} from '../../Data/GuardianSession.jsx'
import { getCurrentUser } from '../../Data/Accounts.jsx'
import { fetchPublicListings, getPublicListings } from '../../Data/ProviderSession.jsx'
import { startRequestsSync } from '../../Data/Requests.jsx'
import { getConversations, getUnseenApprovals, markApprovalSeen, startMessagesSync } from '../../Data/Messaging.jsx'
import { usePresenceHeartbeat } from '../../Data/Presence.jsx'
import {
  getRecommendations,
  getRecommendationsForPreferences,
  getPets,
  mapPet,
  mapRecommendedPet,
} from '../../api/recommender.js'
import { getPetPreferences, hasPetPreferences, loadPetPreferences } from '../../Data/Petpreferencesstorage.jsx'
import { ALL, filterPets, getFacetOptions, hasActiveFilters } from '../../utils/petFilters.js'

// Small round pet avatar for the applications list. Falls back to the pet's
// first letter when there's no photo (or the photo fails to load).
function Avatar({ src, name }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#CACACA]/40 text-xl font-bold text-[#683B0D]">
      {src && !failed ? (
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        (name || '?').charAt(0).toUpperCase()
      )}
    </div>
  )
}

const formatRequestDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

// Messages and adoption history have no data source yet: there's no messaging
// backend, and nothing on the provider side can reply or approve an adoption.
// They start empty (never sample data) and the tabs below show an empty state
// until real records exist. Point these at the real API when it's available.
const conversations = []
const adoptionHistory = []

// How many recommended pets to show at once (after search/filters are applied).
const RECOMMENDED_COUNT = 6

// The API normalizes match % within the guardian's preferred species, so a pet
// of another species can come back below 0. Clamp so the badge reads 0-100%.
function toRecommended(apiPet) {
  const pet = mapRecommendedPet(apiPet)
  return { ...pet, matchScore: Math.min(1, Math.max(0, pet.matchScore ?? 0)) }
}

export default function GuardianDashboard({ openProfileOnMount, openMessageNameOnMount }) {
  usePresenceHeartbeat()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [searchTerm] = useState('') // applications/messages tabs have no search box yet
  const [petSearch, setPetSearch] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState(ALL)
  const [selectedSize, setSelectedSize] = useState(ALL)
  const [selectedAge, setSelectedAge] = useState(ALL)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [likedPetIds, setLikedPetIds] = useState([])
  const [selectedPet, setSelectedPet] = useState(null)
  // Adoption requests this guardian has sent (saved in this browser; see GuardianSession.jsx)
  const [requests, setRequests] = useState(() => getAdoptionRequests())
  // Chats (one per approved request) and the one-time "approved!" notice
  const [chatList, setChatList] = useState(() => getConversations())
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [approvalNotice, setApprovalNotice] = useState(null)
  // The signed-in account (the route guard in App.jsx guarantees there is one)
  const [user, setUser] = useState(() => getCurrentUser())
  // Fallback only: if the person hasn't saved preferences (or they can't be scored),
  // recommendations come from this survey guardian from the dataset, and we say so.
  const demoGuardianId = getGuardianId()
  // Where the recommendations came from: the person's own preferences, or the demo profile.
  const [recsSource, setRecsSource] = useState('demo')
  const [recsNotice, setRecsNotice] = useState('')
  // Bumped when preferences are saved, so recommendations are re-scored.
  const [prefsVersion, setPrefsVersion] = useState(0)
  // The saved preferences live in Supabase; wait for them before scoring recommendations.
  const [prefsLoaded, setPrefsLoaded] = useState(false)
  useEffect(() => {
    let cancelled = false
    loadPetPreferences().finally(() => {
      if (!cancelled) setPrefsLoaded(true)
    })
    return () => { cancelled = true }
  }, [])
  const [profileModalTab, setProfileModalTab] = useState(undefined)

  // Live recommendations from the GNN recommender API (pet_gnn_pipeline/api).
  const [recommendedPets, setRecommendedPets] = useState([])
  const [recsLoading, setRecsLoading] = useState(true)
  const [recsError, setRecsError] = useState(null)

  // Full pet catalog, also from the API (replaces the old static mock list).
  // Pets from the recommender API (the dataset) ...
  const [apiPets, setApiPets] = useState([])
  // ... plus the pets providers have listed in the app (still marked Available).
  const [providerPets, setProviderPets] = useState(() => getPublicListings())
  // What the guardian browses: both together, newest provider listings first.
  const pets = useMemo(() => [...providerPets, ...apiPets], [providerPets, apiPets])
  const [petsLoading, setPetsLoading] = useState(true)
  const [petsError, setPetsError] = useState(null)

  // 1) The pet catalogue
  useEffect(() => {
    let cancelled = false

    async function loadPets() {
      setPetsLoading(true)
      setPetsError(null)
      try {
        const catalog = (await getPets()).map(mapPet)
        if (cancelled) return
        setApiPets(catalog)
        if (catalog.length === 0) setRecsLoading(false)
      } catch (err) {
        if (cancelled) return
        console.error('Failed to load pets', err)
        setPetsError(err.message)
        setRecsError(err.message)
        setRecsLoading(false)
      } finally {
        if (!cancelled) setPetsLoading(false)
      }
    }

    loadPets()
    return () => { cancelled = true }
  }, [])

  // Provider listings live in Supabase (new pet, marked Pending/Adopted, removed).
  // Load them now, and again when this tab is focused or every little while.
  useEffect(() => {
    let cancelled = false
    const refreshProviderPets = async () => {
      await fetchPublicListings()
      if (!cancelled) setProviderPets(getPublicListings())
    }
    refreshProviderPets()
    const timer = setInterval(() => {
      if (!document.hidden) refreshProviderPets()
    }, 20000)
    window.addEventListener('focus', refreshProviderPets)
    return () => {
      cancelled = true
      clearInterval(timer)
      window.removeEventListener('focus', refreshProviderPets)
    }
  }, [])

  // 2) The recommendations. Ask the model for its ranking of the WHOLE catalogue
  // (not just a top 6) so the search/filters can pick the best matches among what's
  // left. Uses the person's own saved preferences when they have them; otherwise
  // (or if those can't be scored) falls back to the demo survey profile.
  useEffect(() => {
    if (apiPets.length === 0 || !prefsLoaded) return undefined
    let cancelled = false

    async function loadRecommendations() {
      setRecsLoading(true)
      setRecsError(null)
      setRecsNotice('')
      try {
        if (hasPetPreferences()) {
          try {
            const data = await getRecommendationsForPreferences(getPetPreferences(), apiPets.length)
            if (cancelled) return
            setRecommendedPets(data.recommendations.map(toRecommended))
            setRecsSource('preferences')
            setRecsNotice(data.message || '')
            return
          } catch (err) {
            if (cancelled) return
            console.error('Could not score the saved preferences', err)
            setRecsNotice(`${err.message} Showing matches for demo profile ${demoGuardianId} instead.`)
          }
        }
        const data = await getRecommendations(demoGuardianId, apiPets.length)
        if (cancelled) return
        setRecommendedPets(data.recommendations.map(toRecommended))
        setRecsSource('demo')
      } catch (err) {
        if (cancelled) return
        console.error('Failed to load recommendations', err)
        setRecsError(err.message)
      } finally {
        if (!cancelled) setRecsLoading(false)
      }
    }

    loadRecommendations()
    return () => { cancelled = true }
  }, [apiPets.length, prefsVersion, prefsLoaded]) // eslint-disable-line react-hooks/exhaustive-deps

  // A provider can approve a request or send a message while this page is open.
  // Keep requests, chats and the approval notice up to date (only re-render on change).
  useEffect(() => {
    const sync = () => {
      const nextRequests = getAdoptionRequests()
      setRequests((prev) => (JSON.stringify(prev) === JSON.stringify(nextRequests) ? prev : nextRequests))
      const nextChats = getConversations()
      setChatList((prev) => (JSON.stringify(prev) === JSON.stringify(nextChats) ? prev : nextChats))
      setApprovalNotice((current) => current || getUnseenApprovals()[0] || null)
    }
    sync()
    // Keeps the requests (Supabase) fresh and calls sync() after every refresh.
    const stopRequestsSync = startRequestsSync(sync)
    const stopMessagesSync = startMessagesSync(sync)
    const timer = setInterval(sync, 2500)
    window.addEventListener('focus', sync)
    window.addEventListener('storage', sync)
    return () => {
      stopRequestsSync()
      stopMessagesSync()
      clearInterval(timer)
      window.removeEventListener('focus', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const openChatFor = (requestId) => {
    setSelectedChatId(requestId)
    setActiveTab('messages')
  }

  const dismissApprovalNotice = (openChat) => {
    if (!approvalNotice) return
    markApprovalSeen(approvalNotice.id)
    if (openChat) openChatFor(approvalNotice.id)
    setApprovalNotice(null)
  }

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

  const openPetDetail = (pet) => {
    setSelectedPet(pet)
  }

  const closePetDetail = () => {
    setSelectedPet(null)
  }

  const toggleLikePet = (pet) => {
    setLikedPetIds((prev) =>
      prev.includes(pet.id) ? prev.filter((id) => id !== pet.id) : [...prev, pet.id]
    )
  }

  const requestedPetIds = useMemo(() => new Set(requests.map((r) => r.petId)), [requests])

  const sendAdoptionRequest = async (pet) => {
    const result = await addAdoptionRequest(pet)
    if (result.ok) {
      setRequests(getAdoptionRequests())
      return
    }
    const messages = {
      duplicate: 'You have already sent a request for this pet.',
      unavailable: 'Sorry, this pet is no longer available for adoption requests.',
      notready: "This sample pet can't receive adoption requests yet.",
      auth: 'Please log in again to send a request.',
      role: 'Only guardian accounts can send adoption requests.',
      session: 'Your login changed in another tab or window. Please refresh this page and log in again.',
    }
    alert(messages[result.reason] || "We couldn't send your request. Please try again.")
    setRequests(getAdoptionRequests())
  }

  const cancelRequest = async (request) => {
    if (!window.confirm(`Cancel your adoption request for ${request.petName}?`)) return
    const removed = await withdrawAdoptionRequest(request.id)
    if (!removed) {
      alert("We couldn't cancel this request. Please try again.")
    }
    setRequests(getAdoptionRequests())
  }

  useEffect(() => {
    if (openProfileOnMount) {
      setActiveTab('profile')
    }
    if (openMessageNameOnMount) {
      const message = conversations.find(msg => msg.name === openMessageNameOnMount)
      if (message) {
        openMessageModal(message)
      }
    }
  }, [openProfileOnMount, openMessageNameOnMount])

  const unreadMessages = chatList.reduce((sum, chat) => sum + chat.unread, 0)

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'applications', label: 'My Applications', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessages || undefined },
  ]

  // Search + dropdown filtering (logic lives in utils/petFilters.js).
  // Dropdown options come from the live data, each with a count of how many
  // pets you'd get given the search and the other two dropdowns.
  const filters = { search: petSearch, species: selectedSpecies, size: selectedSize, age: selectedAge }
  const filteredPets = useMemo(
    () => filterPets(pets, filters),
    [pets, petSearch, selectedSpecies, selectedSize, selectedAge] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const speciesOptions = useMemo(
    () => getFacetOptions(pets, filters, 'species'),
    [pets, petSearch, selectedSize, selectedAge] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const sizeOptions = useMemo(
    () => getFacetOptions(pets, filters, 'size'),
    [pets, petSearch, selectedSpecies, selectedAge] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const ageOptions = useMemo(
    () => getFacetOptions(pets, filters, 'age'),
    [pets, petSearch, selectedSpecies, selectedSize] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const filtersActive = hasActiveFilters(filters)

  // Recommendations respect the same search + filters. The model's ranking is
  // kept (best match first) even while searching; we then show the top few.
  const matchingRecommended = useMemo(() => {
    const rank = new Map(recommendedPets.map((pet, i) => [pet.id, i]))
    return filterPets(recommendedPets, filters).sort((a, b) => rank.get(a.id) - rank.get(b.id))
  }, [recommendedPets, petSearch, selectedSpecies, selectedSize, selectedAge]) // eslint-disable-line react-hooks/exhaustive-deps
  const visibleRecommended = matchingRecommended.slice(0, RECOMMENDED_COUNT)

  const clearFilters = () => {
    setPetSearch('')
    setSelectedSpecies(ALL)
    setSelectedSize(ALL)
    setSelectedAge(ALL)
  }

  const optionLabel = (option, allLabel) =>
    `${option.value === ALL ? allLabel : option.value} (${option.count})`

  const filteredMessages = conversations.filter((msg) =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            <h1 className="mt-2 text-3xl font-semibold text-[#683B0D]">{headerText.title}</h1>
            <p className="mt-1 text-sm text-[#989797]">{headerText.desc}</p>
          </div>
          <button
            type="button"
            className="relative p-2 hover:bg-[#CACACA]/20 rounded-lg transition-colors"
            onClick={() => setShowNotifications(true)}
          >
            <Bell className="h-5 w-5 text-[#683B0D]" />
          </button>
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
                        value={petSearch}
                        onChange={(e) => setPetSearch(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Escape') setPetSearch('') }}
                        placeholder="Search by name, breed, area, or keyword..."
                        aria-label="Search pets"
                        className="w-full rounded-3xl border border-[#CACACA] bg-white px-12 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CEA74E]/20"
                      />
                      {petSearch && (
                        <button
                          type="button"
                          onClick={() => setPetSearch('')}
                          aria-label="Clear search"
                          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#989797] hover:bg-[#CACACA]/30 hover:text-[#683B0D]"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <select
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                  aria-label="Filter by species"
                  className="rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E]"
                >
                  {speciesOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.count === 0 && option.value !== selectedSpecies}
                    >
                      {optionLabel(option, 'All species')}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  aria-label="Filter by size"
                  className="rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E]"
                >
                  {sizeOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.count === 0 && option.value !== selectedSize}
                    >
                      {optionLabel(option, 'All sizes')}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  aria-label="Filter by age"
                  className="rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E]"
                >
                  {ageOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.count === 0 && option.value !== selectedAge}
                    >
                      {optionLabel(option, 'All ages')}
                    </option>
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
                  <p className="mt-4 text-3xl font-bold text-[#683B0D]">{filtersActive ? filteredPets.length : pets.length}</p>
                  <p className="mt-2 text-sm text-[#989797]">
                    {filtersActive
                      ? `of ${pets.length} pets match your search and filters.`
                      : 'Explore the latest available animals for adoption.'}
                  </p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#CACACA]">
                  <p className="text-sm font-semibold text-[#989797]">Favorites</p>
                  <p className="mt-4 text-3xl font-bold text-[#683B0D]">{likedPetIds.length}</p>
                  <p className="mt-2 text-sm text-[#989797]">Keep track of pets you love.</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#CACACA]">
                  <p className="text-sm font-semibold text-[#989797]">Requests sent</p>
                  <p className="mt-4 text-3xl font-bold text-[#683B0D]">{requests.length}</p>
                  <p className="mt-2 text-sm text-[#989797]">
                    {requests.length === 0
                      ? "You haven't sent any adoption requests yet."
                      : 'Track them under My Applications.'}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[#683B0D]">Recommended for You</h2>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#989797]">
                    {filtersActive && !recsLoading && !recsError && recommendedPets.length > 0
                      ? `Top ${visibleRecommended.length} of ${matchingRecommended.length} matching`
                      : recsSource === 'preferences'
                        ? 'Matched to your preferences'
                        : `Matching model · demo profile ${demoGuardianId}`}
                  </span>
                </div>
                {!recsLoading && !recsError && recommendedPets.length > 0 && (recsNotice || recsSource === 'demo') && (
                  <p className="mt-2 text-sm text-[#989797]">
                    {recsNotice || `These are matches for demo profile ${demoGuardianId}, not for you.`}{' '}
                    {recsSource === 'demo' && (
                      <button
                        type="button"
                        onClick={() => { setProfileModalTab('Preferences & Lifestyle'); setShowProfileModal(true) }}
                        className="font-semibold text-[#683B0D] underline decoration-[#CEA74E] underline-offset-4 hover:text-[#CEA74E]"
                      >
                        Set your preferences
                      </button>
                    )}
                  </p>
                )}
                {recsLoading && (
                  <p className="mt-4 text-sm text-[#989797]">Finding your best matches...</p>
                )}
                {recsError && (
                  <p className="mt-4 text-sm text-red-600">
                    Couldn't load recommendations ({recsError}). Is the recommender API running?
                  </p>
                )}
                {!recsLoading && !recsError && recommendedPets.length === 0 && (
                  <p className="mt-4 text-sm text-[#989797]">{recsNotice || 'No recommendations available right now.'}</p>
                )}
                {!recsLoading && !recsError && recommendedPets.length > 0 && visibleRecommended.length === 0 && (
                  <div className="mt-4 rounded-3xl border border-[#CACACA] bg-[#CACACA]/10 p-8 text-center">
                    <p className="text-sm text-[#989797]">None of your recommended pets match this search or these filters.</p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-3 rounded-full bg-[#683B0D] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
                {!recsLoading && !recsError && visibleRecommended.length > 0 && (
                  <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {visibleRecommended.map((pet) => {
                      const isLiked = likedPetIds.includes(pet.id)
                      return (
                        <div
                          key={pet.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => openPetDetail(pet)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') openPetDetail(pet)
                          }}
                          className="cursor-pointer overflow-hidden rounded-[32px] bg-white shadow-sm border border-[#CEA74E]/60 ring-1 ring-[#CEA74E]/20 transition hover:-translate-y-1 hover:shadow-lg"
                        >
                          <div className="relative h-48 overflow-hidden bg-[#CACACA]">
                            <PetPhoto src={pet.image} alt={pet.name} />
                            <span className="absolute left-3 top-3 rounded-full bg-[#CEA74E] px-3 py-1 text-xs font-semibold text-white">
                              {Math.round(pet.matchScore * 100)}% match
                            </span>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation()
                                toggleLikePet(pet)
                              }}
                              className={`group absolute right-3 top-3 rounded-full p-2 shadow-sm transition ${
                                isLiked ? 'bg-[#CEA74E] text-white' : 'bg-white/90 text-[#683B0D] hover:bg-[#CEA74E] hover:text-white'
                              }`}
                              aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              <Heart className={`h-4 w-4 transition group-hover:scale-110 ${isLiked ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                          <div className="p-6">
                            <p className="text-sm font-semibold text-[#989797]">{pet.breed}</p>
                            <h2 className="mt-2 text-2xl font-bold text-[#683B0D]">{pet.name}</h2>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="rounded-full bg-[#CACACA]/30 px-3 py-1 text-xs font-semibold text-[#683B0D]">{pet.species}</span>
                              <span className="rounded-full bg-[#CACACA]/30 px-3 py-1 text-xs font-semibold text-[#683B0D]">{pet.gender}</span>
                              <span className="rounded-full bg-[#CACACA]/30 px-3 py-1 text-xs font-semibold text-[#683B0D]">{pet.size}</span>
                              <span className="rounded-full bg-[#CACACA]/30 px-3 py-1 text-xs font-semibold text-[#683B0D]">{pet.age}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl font-semibold text-[#683B0D]">Browse All Pets</h2>
                  {!petsLoading && !petsError && (
                    <div className="flex items-center gap-3 text-sm text-[#989797]">
                      <span>
                        {filtersActive
                          ? `Showing ${filteredPets.length} of ${pets.length} pets`
                          : `${pets.length} pets`}
                      </span>
                      {filtersActive && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="font-semibold text-[#683B0D] underline decoration-[#CEA74E] underline-offset-4 hover:text-[#CEA74E]"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {petsLoading && (
                  <p className="mt-4 text-sm text-[#989797]">Loading pets...</p>
                )}
                {petsError && (
                  <p className="mt-4 text-sm text-red-600">
                    Couldn't load pets ({petsError}). Is the recommender API running?
                  </p>
                )}
                {!petsLoading && !petsError && filteredPets.length === 0 && (
                  <div className="mt-4 rounded-3xl border border-[#CACACA] bg-[#CACACA]/10 p-8 text-center">
                    <p className="text-sm text-[#989797]">No pets match your search or filters.</p>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-3 rounded-full bg-[#683B0D] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {!petsLoading && !petsError && filteredPets.map((pet) => {
                  const isLiked = likedPetIds.includes(pet.id)
                  return (
                    <div
                      key={pet.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => openPetDetail(pet)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') openPetDetail(pet)
                      }}
                      className="cursor-pointer overflow-hidden rounded-[32px] bg-white shadow-sm border border-[#CACACA] transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative h-48 overflow-hidden bg-[#CACACA]">
                        <PetPhoto src={pet.image} alt={pet.name} />
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            toggleLikePet(pet)
                          }}
                          className={`group absolute right-3 top-3 rounded-full p-2 shadow-sm transition ${
                            isLiked ? 'bg-[#CEA74E] text-white' : 'bg-white/90 text-[#683B0D] hover:bg-[#CEA74E] hover:text-white'
                          }`}
                          aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Heart className={`h-4 w-4 transition group-hover:scale-110 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-[#989797]">{pet.breed}</p>
                            <h2 className="mt-2 text-2xl font-bold text-[#683B0D]">{pet.name}</h2>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[#CACACA]/30 px-3 py-1 text-xs font-semibold text-[#683B0D]">{pet.species}</span>
                          <span className="rounded-full bg-[#CACACA]/30 px-3 py-1 text-xs font-semibold text-[#683B0D]">{pet.gender}</span>
                          <span className="rounded-full bg-[#CACACA]/30 px-3 py-1 text-xs font-semibold text-[#683B0D]">{pet.size}</span>
                          <span className="rounded-full bg-[#CACACA]/30 px-3 py-1 text-xs font-semibold text-[#683B0D]">{pet.age}</span>
                        </div>
                        {(pet.area || pet.listedBy) && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {pet.area && (
                              <span className="rounded-full bg-[#683B0D]/10 px-3 py-1 text-xs font-semibold text-[#683B0D]">{pet.area}</span>
                            )}
                            {pet.listedBy && (
                              <span className="rounded-full bg-[#683B0D]/10 px-3 py-1 text-xs font-semibold text-[#683B0D]">{pet.listedBy}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {activeTab === 'applications' && (
            <section className="space-y-6">
              {requests.length === 0 ? (
                <div className="rounded-3xl border border-[#CACACA] bg-[#CACACA]/10 p-10 text-center">
                  <p className="text-lg font-semibold text-[#683B0D]">No applications yet</p>
                  <p className="mt-2 text-sm text-[#989797]">
                    When you send an adoption request, it will show up here so you can track it.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="mt-5 rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
                  >
                    Browse pets
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => {
                    const pet = pets.find((p) => p.id === request.petId)
                    return (
                      <div key={request.id} className="rounded-3xl bg-white p-6 shadow-sm border border-[#CACACA] hover:shadow-md transition">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar src={request.petImage} name={request.petName} />
                            <div>
                              <h3 className="text-lg font-semibold text-[#683B0D]">{request.petName}</h3>
                              <p className="text-sm text-[#989797]">
                                {[request.petBreed, request.petSpecies].filter(Boolean).join(' · ') || 'Adoption request'}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`w-fit rounded-full px-3 py-1 text-sm font-semibold text-white ${
                              request.status === 'Approved' ? 'bg-green-600' : request.status === 'Declined' ? 'bg-red-500' : 'bg-[#CEA74E]'
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Sent</p>
                            <p className="mt-1 text-sm text-[#683B0D]">{formatRequestDate(request.createdAt)}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Location</p>
                            <p className="mt-1 text-sm text-[#683B0D]">{request.area || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Listed by</p>
                            <p className="mt-1 text-sm text-[#683B0D]">{request.listedBy || 'Not provided'}</p>
                          </div>
                        </div>

                        {request.matchPercent !== null && request.matchPercent !== undefined && (
                          <p className="mt-4 text-sm text-[#989797]">
                            Our model rated this a <span className="font-semibold text-[#683B0D]">{Math.max(0, request.matchPercent)}% match</span> when you applied.
                          </p>
                        )}

                        <div className="mt-5 flex flex-wrap gap-3">
                          {pet && (
                            <button
                              type="button"
                              onClick={() => openPetDetail(pet)}
                              className="rounded-full border border-[#CACACA] bg-white px-5 py-2 text-sm font-semibold text-[#683B0D] transition hover:bg-[#CACACA]/10"
                            >
                              View pet
                            </button>
                          )}
                          {request.status === 'Approved' && (
                            <button
                              type="button"
                              onClick={() => openChatFor(request.id)}
                              className="rounded-full bg-[#683B0D] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
                            >
                              Message provider
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => cancelRequest(request)}
                            className="rounded-full border border-red-200 bg-white px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            Cancel request
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          )}

          {activeTab === 'messages' && (
            <section className="space-y-6">
              <MessagesTab
                conversations={chatList}
                selectedId={selectedChatId}
                onSelect={setSelectedChatId}
                emptyText="When a provider approves your application, you can chat with them here."
              />
            </section>
          )}

          {activeTab === 'profile' && (
            <section className="space-y-6">
              <ProfileSection userRole="Guardian" profile={user} onEditClick={() => { setProfileModalTab(undefined); setShowProfileModal(true) }} />
            </section>
          )}

          {activeTab === 'adoption' && (
            <section className="space-y-6">
              <div className="space-y-6">
                {adoptionHistory.length > 0 ? (
                  adoptionHistory.map((adoption, index) => (
                    <div key={index} className="rounded-4xl border border-[#CACACA] bg-white p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-6">
                        <div className="h-32 w-32 shrink-0 overflow-hidden rounded-3xl bg-[#CACACA]">
                          <PetPhoto src={adoption.image} alt={adoption.petName} />
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
                  <div className="rounded-4xl border border-[#CACACA] bg-[#CACACA]/10 p-10 text-center">
                    <p className="text-lg font-semibold text-[#683B0D]">No adoption history yet</p>
                    <p className="mt-2 text-sm text-[#989797]">
                      Pets you've adopted will be listed here.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('dashboard')}
                      className="mt-5 rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
                    >
                      Browse pets
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}
          </main>
        </div>
        <MessageModal message={selectedMessage} onClose={closeMessageModal} />
        <ApprovalNoticeModal
          request={approvalNotice}
          onChat={() => dismissApprovalNotice(true)}
          onLater={() => dismissApprovalNotice(false)}
        />
        <NotificationModal open={showNotifications} onClose={() => setShowNotifications(false)} userRole="Guardian" />
        <ProfileModal
          open={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
          onUserChange={setUser}
          initialTab={profileModalTab}
          onPreferencesSaved={() => setPrefsVersion((version) => version + 1)}
        />
        <PetDetailModal
          pet={selectedPet}
          open={!!selectedPet}
          onClose={closePetDetail}
          isLiked={selectedPet ? likedPetIds.includes(selectedPet.id) : false}
          onToggleLike={toggleLikePet}
          onSendRequest={sendAdoptionRequest}
          hasRequested={selectedPet ? requestedPetIds.has(selectedPet.id) : false}
        />
      </div>
  )
}