import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Heart,
  Users,
  MessageSquare,
  Star,
  Gift,
  Bell,
  Plus,
  Search,
} from 'lucide-react';
import SideBar from './SideBar.jsx';
import Profile from './ProfileModal.jsx';
import PetModal from './PetModal.jsx';
import ApplicationModal from './ApplicationModal.jsx';
import AddPetModal from './AddPetModal.jsx';
import ProfileSection from '../../components/ProfileSection.jsx';
import NotificationModal from '../../components/NotificationModal.jsx';
import MessagesTab from '../../components/MessagesTab.jsx';
import { getConversations, startApprovedThread, startMessagesSync } from '../../Data/Messaging.jsx';
import { usePresenceHeartbeat } from '../../Data/Presence.jsx';
import { getCurrentUser } from '../../Data/Accounts.jsx';
import {
  addListing,
  getApplicationsForProvider,
  getListings,
  loadListings,
  removeListing,
  updateApplicationStatus,
  updateListing,
} from '../../Data/ProviderSession.jsx';
import { startRequestsSync } from '../../Data/Requests.jsx';

// There is no messaging, review, or donation backend yet, so those tabs show an
// empty state (never sample data) until real records exist.

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '';

const STATUS_COLORS = {
  Available: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Adopted: 'bg-blue-100 text-blue-800',
  'Under Review': 'bg-orange-100 text-orange-800',
  Approved: 'bg-green-100 text-green-800',
  Declined: 'bg-red-100 text-red-700',
};
const getStatusColor = (status) => STATUS_COLORS[status] || 'bg-[#CACACA]/20 text-gray-800';

function PetThumb({ pet, className }) {
  return pet.image ? (
    <img src={pet.image} alt={pet.name} className={className} />
  ) : (
    <div className={`${className} flex items-center justify-center bg-[#CACACA]/30 text-4xl font-bold text-[#683B0D]/40`}>
      {(pet.name || '?').charAt(0).toUpperCase()}
    </div>
  );
}

function EmptyState({ children }) {
  return (
    <div className="rounded-[32px] bg-white p-8 text-center shadow-sm">
      <p className="text-[#989797]">{children}</p>
    </div>
  );
}

const ProviderDashboard = ({ openProfileOnMount }) => {
  const navigate = useNavigate();
  usePresenceHeartbeat();
  const [user, setUser] = useState(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [petList, setPetList] = useState(() => (user ? getListings(user.id) : []));
  const [applications, setApplications] = useState(() => (user ? getApplicationsForProvider(user.id) : []));
  const [chatList, setChatList] = useState(() => (user ? getConversations(user) : []));
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Only signed-in PROVIDERS belong here (guardians have their own dashboard).
  useEffect(() => {
    if (!user || user.role !== 'provider') navigate('/provider/login', { replace: true });
  }, [user, navigate]);

  // Re-read the listings from Supabase; returns the fresh data so callers can sync open modals.
  const refresh = useCallback(async () => {
    if (!user) return { pets: [], apps: [] };
    await loadListings(user.id);
    const pets = getListings(user.id);
    const apps = getApplicationsForProvider(user.id);
    setPetList(pets);
    setApplications(apps);
    setChatList(getConversations(user));
    return { pets, apps };
  }, [user]);

  // Load this provider's pets from Supabase when the dashboard opens.
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Keep the adoption requests and chat messages (Supabase) fresh while this page is open.
  useEffect(() => {
    if (!user) return undefined;
    const stopRequests = startRequestsSync();
    const stopMessages = startMessagesSync();
    return () => {
      stopRequests();
      stopMessages();
    };
  }, [user]);

  // A guardian may send a request from another tab/window; pick it up.
  useEffect(() => {
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  // New requests and chat messages can arrive while this page stays open.
  useEffect(() => {
    if (!user) return undefined;
    const timer = setInterval(() => {
      const nextChats = getConversations(user);
      setChatList((prev) => (JSON.stringify(prev) === JSON.stringify(nextChats) ? prev : nextChats));
      const nextApps = getApplicationsForProvider(user.id);
      setApplications((prev) => (JSON.stringify(prev) === JSON.stringify(nextApps) ? prev : nextApps));
    }, 2500);
    return () => clearInterval(timer);
  }, [user]);

  useEffect(() => {
    if (openProfileOnMount) {
      setActiveTab('profile');
      setShowProfileModal(true);
    }
  }, [openProfileOnMount]);

  if (!user || user.role !== 'provider') return null;

  const term = searchTerm.toLowerCase();
  const filteredPets = petList.filter(
    (pet) => pet.name.toLowerCase().includes(term) || (pet.breed || '').toLowerCase().includes(term)
  );
  const filteredApplications = applications.filter(
    (app) => app.name.toLowerCase().includes(term) || (app.pet || '').toLowerCase().includes(term)
  );

  const totalPets = petList.length;
  const availablePets = petList.filter((pet) => pet.status === 'Available').length;
  const adoptedPets = petList.filter((pet) => pet.status === 'Adopted').length;
  const pendingApplications = applications.filter((app) => app.status === 'Pending').length;

  const unreadMessages = chatList.reduce((sum, chat) => sum + chat.unread, 0);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'pets', label: 'My Pets', icon: Heart },
    { id: 'applications', label: 'Applications', icon: Users, badge: pendingApplications || undefined },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessages || undefined },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
    { id: 'donations', label: 'Donations', icon: Gift },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // --- pets -----------------------------------------------------------------

  const addNewPet = async (data) => {
    const result = await addListing(data, user);
    if (result.ok) {
      await refresh();
      setShowAddPetModal(false);
    }
    return result; // AddPetModal shows an error if it failed
  };

  // Saves edits to a listing (details, description, photo) from the edit modal.
  const saveEditedPet = async (data) => {
    const result = await updateListing(editingPet.id, data, user.id);
    if (result.ok) {
      const { pets } = await refresh();
      // Keep an open pet profile in sync with the edited data.
      setSelectedPet((current) => (current ? pets.find((p) => p.id === editingPet.id) || null : current));
      setEditingPet(null);
    }
    return result; // AddPetModal shows an error if it failed
  };

  const changePetStatus = async (pet, status) => {
    const result = await updateListing(pet.id, { status }, user.id);
    if (!result.ok) {
      alert("We couldn't update this listing. Please try again.");
      return;
    }
    const { pets } = await refresh();
    setSelectedPet(pets.find((p) => p.id === pet.id) || null);
  };

  const removePet = async (pet) => {
    if (!window.confirm(`Remove ${pet.name} from your listings? Guardians will no longer see this pet.`)) return;
    const removed = await removeListing(pet.id, user.id);
    if (!removed) {
      alert("We couldn't remove this listing. Please try again.");
      return;
    }
    await refresh();
    setSelectedPet(null);
  };

  // --- applications ---------------------------------------------------------

  const changeApplicationStatus = async (application, status) => {
    if (status === 'Declined' && !window.confirm(`Decline ${application.name}'s request for ${application.pet}?`)) return;
    const result = await updateApplicationStatus(application.id, status, user.id);
    if (!result.ok) {
      alert("We couldn't update this request. Please try again.");
      return;
    }
    if (status === 'Approved') startApprovedThread(application.id, user);
    const { apps, pets } = await refresh();
    setSelectedApplication(apps.find((a) => a.id === application.id) || null);
    // Approving can move the pet to Pending; keep an open pet profile in sync.
    setSelectedPet((current) => (current ? pets.find((p) => p.id === current.id) || null : current));
  };

  const openApplicationFromPet = (application) => {
    setSelectedApplication(application);
  };

  const openChat = (requestId) => {
    setSelectedApplication(null);
    setSelectedChatId(requestId);
    setActiveTab('messages');
  };

  // --- headers --------------------------------------------------------------

  const getActivePageTitle = () => {
    if (activeTab === 'profile') return 'Profile';
    return navigationItems.find((item) => item.id === activeTab)?.label || 'Dashboard';
  };

  const getActivePageSubtitle = () => {
    switch (activeTab) {
      case 'profile':
        return 'Manage your account details and password.';
      case 'dashboard':
        return 'Overall view of your listings and requests.';
      case 'pets':
        return 'Keep your adoption listings updated and showcase each pet’s story.';
      case 'applications':
        return 'Review incoming applications and move the best matches forward.';
      case 'messages':
        return 'Respond to pet inquiries and keep every conversation on track.';
      case 'reviews':
        return 'Track reviews and ratings to maintain trust with adopters.';
      case 'donations':
        return 'Manage donations and support the rescue efforts that matter most.';
      default:
        return '';
    }
  };

  // --- tabs -----------------------------------------------------------------

  const renderSearch = (placeholder) => (
    <div className="mb-8">
      <div className="w-full max-w-2xl">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#989797]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-[#CACACA] bg-white py-3 pl-12 pr-4 text-sm shadow-sm focus:border-[#CEA74E] focus:outline-none focus:ring-2 focus:ring-[#CEA74E]/30 sm:text-base"
          />
        </label>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {renderSearch('Search pets, applications...')}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Pets', value: totalPets, subtext: `${availablePets} available` },
          { label: 'Available Listings', value: availablePets, subtext: 'Ready for adoption' },
          { label: 'Pending Requests', value: pendingApplications, subtext: `${applications.length} total` },
          { label: 'Adopted', value: adoptedPets, subtext: 'Found a home' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-sm text-[#989797]">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-black">{stat.value}</p>
            <p className="mt-1 text-xs text-[#683B0D]">{stat.subtext}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#683B0D]">Your pets</h2>
          <button
            type="button"
            onClick={() => setActiveTab('pets')}
            className="text-sm font-medium text-[#683B0D] hover:text-[#CEA74E]"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {filteredPets.length > 0 ? (
            filteredPets.slice(0, 8).map((pet) => (
              <button
                key={pet.id}
                type="button"
                onClick={() => setSelectedPet(pet)}
                className="overflow-hidden rounded-lg bg-white text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <PetThumb pet={pet} className="h-32 w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-black">{pet.name}</h3>
                  <p className="text-sm text-[#989797]">{pet.breed} • {pet.age}</p>
                  <div className="mt-3 flex gap-2">
                    <span className={`rounded px-2 py-1 text-xs font-semibold ${getStatusColor(pet.status)}`}>
                      {pet.status}
                    </span>
                    <span className="px-2 py-1 text-xs text-[#989797]">{pet.health}</span>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState>
                {totalPets === 0
                  ? 'You haven’t listed any pets yet. Add your first pet from the My Pets tab.'
                  : 'No pets match your search. Try a different name or breed.'}
              </EmptyState>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPets = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setShowAddPetModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#683B0D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
        >
          <Plus className="h-4 w-4" />
          Add pet for adoption
        </button>
      </div>
      {petList.length > 0 && renderSearch('Search your pets by name or breed...')}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            <div key={pet.id} className="overflow-hidden rounded-[32px] bg-white shadow-sm transition hover:shadow-md">
              <PetThumb pet={pet} className="h-56 w-full object-cover" />
              <div className="space-y-4 p-6">
                <div>
                  <p className="text-sm font-semibold text-[#989797]">{pet.breed}</p>
                  <h3 className="mt-2 text-2xl font-bold text-[#683B0D]">{pet.name}</h3>
                  <p className="mt-1 text-sm text-[#989797]">{pet.age}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(pet.status)}`}>
                    {pet.status}
                  </span>
                  <span className="rounded-full bg-[#CACACA]/20 px-3 py-1 text-sm text-[#989797]">{pet.health}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPet(pet)}
                    className="flex-1 rounded-full bg-[#683B0D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
                  >
                    View profile
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPet(pet)}
                    className="rounded-full border border-[#683B0D] px-5 py-3 text-sm font-semibold text-[#683B0D] transition hover:bg-[#683B0D] hover:text-white"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState>
              {totalPets === 0
                ? 'No pets listed yet. Use “Add pet for adoption” to create your first listing.'
                : 'No pets match your search. Try a different name or breed.'}
            </EmptyState>
          </div>
        )}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-4">
      {filteredApplications.length > 0 ? (
        filteredApplications.map((app) => (
          <div key={app.id} className="rounded-[32px] bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#CEA74E]/25 text-xl font-bold text-[#683B0D]">
                  {(app.name || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-semibold text-[#683B0D]">{app.name}</p>
                  <p className="text-sm text-[#989797]">Applied for {app.pet}</p>
                  <p className="text-sm text-[#989797]">{formatDate(app.createdAt)}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedApplication(app)}
                  className="rounded-full border border-[#CACACA] bg-white px-4 py-2 text-sm font-semibold text-[#683B0D] transition hover:border-[#683B0D]"
                >
                  View details
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <EmptyState>
          {applications.length === 0
            ? 'No adoption requests yet. When a guardian requests one of your pets, it will show up here.'
            : 'No applications match your search yet.'}
        </EmptyState>
      )}
    </div>
  );

  const renderMessages = () => (
    <MessagesTab
      conversations={chatList}
      selectedId={selectedChatId}
      onSelect={setSelectedChatId}
      emptyText="A chat opens here when you approve a guardian's adoption request."
    />
  );

  const renderReviews = () => (
    <EmptyState>Reviews and ratings aren’t available yet. They will appear here once guardians can leave them.</EmptyState>
  );

  const renderDonations = () => (
    <EmptyState>Donations aren’t available yet. Donation history and causes will appear here once they are.</EmptyState>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <ProfileSection userRole="Provider" onEditClick={() => setShowProfileModal(true)} />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfile();
      case 'pets':
        return renderPets();
      case 'applications':
        return renderApplications();
      case 'messages':
        return renderMessages();
      case 'reviews':
        return renderReviews();
      case 'donations':
        return renderDonations();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <SideBar
        activeTab={activeTab}
        onNavClick={handleNavClick}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigationItems={navigationItems}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="sticky top-0 z-30 flex flex-col gap-3 border-b border-[#CACACA] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-[#683B0D] sm:text-3xl lg:text-4xl">{getActivePageTitle()}</h1>
            <p className="mt-2 text-sm text-[#989797] sm:text-base">{getActivePageSubtitle()}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              className="relative rounded-lg p-2 transition-colors hover:bg-[#CACACA]/20"
              onClick={() => setShowNotifications(true)}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-[#683B0D]" />
              {pendingApplications > 0 && (
                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#CEA74E] text-xs font-bold text-white">
                  {pendingApplications}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">{renderContent()}</div>
        </div>
      </div>

      <PetModal
        pet={selectedPet}
        applications={applications}
        onClose={() => setSelectedPet(null)}
        onViewApplication={openApplicationFromPet}
        onChangeStatus={changePetStatus}
        onRemove={removePet}
        onEdit={(pet) => setEditingPet(pet)}
      />
      <ApplicationModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onChangeStatus={changeApplicationStatus}
        onOpenChat={(app) => openChat(app.id)}
      />
      {showAddPetModal && (
        <AddPetModal
          onClose={() => setShowAddPetModal(false)}
          onSubmit={addNewPet}
          initialPet={user.location ? { area: user.location } : {}}
        />
      )}
      {editingPet && (
        <AddPetModal
          key={editingPet.id}
          title="Edit pet listing"
          subtitle="Update the details, description and photo."
          submitLabel="Save changes"
          initialPet={editingPet}
          onClose={() => setEditingPet(null)}
          onSubmit={saveEditedPet}
        />
      )}
      <Profile
        open={showProfileModal}
        user={user}
        onUserChange={setUser}
        onClose={() => {
          setShowProfileModal(false);
          setActiveTab('dashboard');
        }}
      />
      <NotificationModal open={showNotifications} onClose={() => setShowNotifications(false)} userRole="Provider" />
    </div>
  );
};

export default ProviderDashboard;
