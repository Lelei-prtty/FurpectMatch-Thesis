import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Heart,
  Clock,
  Users,
  MessageSquare,
  Star,
  Gift,
  User,
  Settings,
  Bell,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  Eye,
  MoreVertical,
  Plus,
  Search,
} from 'lucide-react';
import SideBar from './pages/PetProvider/SideBar.jsx';
import Profile from './pages/PetProvider/ProfileModal.jsx';
import PetModal from './pages/PetProvider/PetModal.jsx'
import ApplicationModal from './pages/PetProvider/ApplicationModal.jsx'
import MessageModal from './pages/PetProvider/MessageModal.jsx'
import AddPetModal from '../PetProvider/AddPetModal.jsx';
import { applications, donations, messagesList, pets } from '../../Data/ProviderSampleData';

const ProviderDashboard = ({ openProfileOnMount, openAddPetOnMount, openPetNameOnMount, openApplicationNameOnMount, openMessageNameOnMount }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [petList, setPetList] = useState(pets);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [notifications, setNotifications] = useState(2);
  const [messages, setMessages] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPets = petList.filter((pet) =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApplications = applications.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.pet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = messagesList.filter((msg) =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPets = petList.length;
  const availablePets = petList.filter((pet) => pet.status === 'Available').length;
  const totalApplications = applications.length;

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'pets', label: 'My Pets', icon: Heart },
    { id: 'applications', label: 'Applications', icon: Users, badge: totalApplications },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: messages },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
    { id: 'donations', label: 'Donations', icon: Gift },
  ];

  const handleNavClick = (id) => {
    if (id === 'profile') {
      setActiveTab('profile');
      setShowProfileModal(true);
    } else {
      setActiveTab(id);
    }
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const openPetModal = (pet) => {
    setSelectedPet(pet);
  };

  const closePetModal = () => {
    setSelectedPet(null);
  };

  const openApplicationModal = (application) => {
    setSelectedApplication(application);
  };

  const closeApplicationModal = () => {
    setSelectedApplication(null);
  };

  const openMessageModal = (message) => {
    setSelectedMessage(message);
  };

  const closeMessageModal = () => {
    setSelectedMessage(null);
  };

  const openAddPetModal = () => {
    setShowAddPetModal(true);
  };

  const closeAddPetModal = () => {
    setShowAddPetModal(false);
  };

  const addNewPet = (newPet) => {
    setPetList((current) => [newPet, ...current]);
    closeAddPetModal();
  };

  const handleDonate = () => {
    alert('Opening donation modal...');
  };

  const getActivePageTitle = () => {
    if (activeTab === 'profile') return 'Profile';
    const currentItem = navigationItems.find((item) => item.id === activeTab);
    return currentItem?.label || 'Dashboard';
  };

  const getActivePageSubtitle = () => {
    if (activeTab === 'profile') return ['Manage your account details and communication preferences.'];
    switch (activeTab) {
      case 'dashboard':
        return ['Overall view of the statistics and insights.'];
      case 'pets':
        return ['Keep your adoption listings updated and showcase each pet’s story.'];
      case 'applications':
        return ['Review incoming applications and move the best matches forward.'];
      case 'messages':
        return ['Respond to pet inquiries and keep every conversation on track.'];
      case 'reviews':
        return ['Track reviews and ratings to maintain trust with adopters.'];
      case 'donations':
        return ['Manage donations and support the rescue efforts that matter most.'];
      default:
        return ['Open your conversations and respond quickly.'];
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Available': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Adopted': 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-orange-100 text-orange-800',
      'New': 'bg-green-100 text-green-800',
      'Interview': 'bg-blue-100 text-blue-800',
      'Shortlisted': 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="w-full max-w-2xl">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pets, applications..."
              className="w-full bg-white pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-sm sm:text-base"
            />
          </label>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Pets', value: totalPets, subtext: `${availablePets} available` },
          { label: 'Available Listings', value: availablePets, subtext: 'Ready for adoption' },
          { label: 'Applications', value: totalApplications, subtext: 'New requests' },
          { label: 'Avg. Rating', value: '4.8', subtext: '★★★★★' },
          { label: 'Messages', value: messages, subtext: 'Unread' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold mt-2 text-black">{stat.value}</p>
              <p className="text-green-600 text-xs mt-1">{stat.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* My Pets Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setActiveTab('pets')}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
          {filteredPets.length > 0 ? (
            filteredPets.map((pet, index) => (
              <div key={`${pet.name}-${index}`} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-32 overflow-hidden bg-gray-100">
                  <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-black">{pet.name}</h3>
                  <p className="text-gray-600 text-sm">{pet.breed} • {pet.age}</p>
                  <div className="mt-3 flex gap-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(pet.status)}`}>
                      {pet.status}
                    </span>
                    <span className="text-xs text-gray-600 px-2 py-1">{pet.health}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-[32px] bg-white p-8 text-center shadow-sm">
              <p className="text-gray-700">No pets match your search yet. Try a different name or breed.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );

   {/* PetModal here. */}
  const renderPets = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={openAddPetModal}
          className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-black transition hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" />
          Add pet for adoption
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filteredPets.length > 0 ? (
          filteredPets.map((pet, index) => (
            <div key={`${pet.name}-${index}`} className="overflow-hidden rounded-[32px] bg-white shadow-sm transition hover:shadow-md">
              <div className="h-56 overflow-hidden bg-gray-100">
                <img src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">{pet.breed}</p>
                  <h3 className="mt-2 text-2xl font-bold text-gray-900">{pet.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{pet.age}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(pet.status)}`}>
                    {pet.status}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">{pet.health}</span>
                </div>
                <button
                  type="button"
                  onClick={() => openPetModal(pet)}
                  className="w-full rounded-full bg-purple-600 px-4 py-3 text-sm font-semibold text-black transition hover:bg-purple-700"
                >
                  View profile
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-[32px] bg-white p-8 text-center shadow-sm">
            <p className="text-gray-700">No pets match your search. Try a different name or breed.</p>
          </div>
        )}
      </div>
    </div>
  );

  {/* ApplicationModal here. */}
  const renderApplications = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app, index) => (
            <div key={`${app.name}-${index}`} className="rounded-[32px] bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <img src={app.avatar} alt={app.name} className="h-16 w-16 rounded-full object-cover" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{app.name}</p>
                    <p className="text-sm text-gray-600">Applied for {app.pet}</p>
                    <p className="text-sm text-gray-400">{app.time}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => openApplicationModal(app)}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-purple-500 hover:text-purple-700"
                  >
                    View details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[32px] bg-white p-8 text-center shadow-sm">
            <p className="text-gray-700">No applications match your search yet.</p>
          </div>
        )}
      </div>
    </div>
  );

   {/* MessageModal here. */}
  const renderMessages = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg, index) => (
            <button
              key={`${msg.name}-${index}`}
              type="button"
              onClick={() => openMessageModal(msg)}
              className="w-full rounded-[32px] bg-white p-4 text-left shadow-sm transition hover:shadow-md"
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
          <div className="rounded-[32px] bg-white p-8 text-center shadow-sm">
            <p className="text-gray-700">No messages match your search yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center mb-6">
          {[
            { label: 'Profile Views', value: '1,248', change: '+8%' },
            { label: 'Favorites', value: '342', change: '+18%' },
            { label: 'Inquiries', value: '86', change: '-3%' },
            { label: 'Adoptions', value: '7', change: '+25%' },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-gray-600 text-sm mb-2">{item.label}</p>
              <p className="text-2xl font-bold text-black">{item.value}</p>
              <p className="text-green-600 text-xs mt-1">{item.change}</p>
            </div>
          ))}
        </div>
        <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded flex items-end justify-between p-4">
          {[20, 40, 35, 50, 45, 60, 55].map((height, i) => (
            <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${height}%` }}></div>
          ))}
        </div>
        <p className="text-gray-600 text-xs mt-4">Showing data for May 1 - May 31</p>
      </div>
    </div>
  );

  const renderDonations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={handleDonate}
          className="bg-purple-600 hover:bg-purple-700 text-black font-semibold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Gift className="w-5 h-5" />
          Make a Donation
        </button>
      </div>

      {/* Donation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Donated', value: '₱1,800' },
          { label: 'Donations This Year', value: '5' },
          { label: 'Impact', value: '50+ Animals Helped' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
            <div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold mt-2 text-black">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Donation History */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Donation History</h2>
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Cause</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {donations.map((donation, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{donation.cause}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{donation.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{donation.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-semibold px-3 py-1 rounded ${getStatusColor(donation.status)}`}>
                      {donation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Featured Causes */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Emergency Rescue Fund', desc: 'Help us rescue animals in critical conditions', raised: '₱8,500', goal: '₱10,000' },
            { title: 'Veterinary Care', desc: 'Provide free medical care to stray animals', raised: '₱5,200', goal: '₱8,000' },
          ].map((cause, i) => (
            <div key={i} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{cause.title}</h3>
              <p className="text-gray-600 mb-4">{cause.desc}</p>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700">Raised: {cause.raised}</span>
                  <span className="text-gray-700">Goal: {cause.goal}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-black font-semibold py-2 px-4 rounded-lg transition-colors">
                Donate Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
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

  useEffect(() => {
    if (openProfileOnMount) {
      setActiveTab('profile');
      setShowProfileModal(true);
    }
  }, [openProfileOnMount]);

  useEffect(() => {
    if (openAddPetOnMount) {
      setShowAddPetModal(true);
    }
    if (openPetNameOnMount) {
      const pet = pets.find((p) => p.name === openPetNameOnMount);
      if (pet) setSelectedPet(pet);
    }
    if (openApplicationNameOnMount) {
      const app = applications.find((a) => a.name === openApplicationNameOnMount);
      if (app) setSelectedApplication(app);
    }
    if (openMessageNameOnMount) {
      const msg = messagesList.find((m) => m.name === openMessageNameOnMount);
      if (msg) setSelectedMessage(msg);
    }
  }, [openAddPetOnMount, openPetNameOnMount, openApplicationNameOnMount, openMessageNameOnMount]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SideBar
        activeTab={activeTab}
        onNavClick={handleNavClick}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigationItems={navigationItems}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-30">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{getActivePageTitle()}</h1>
            {getActivePageSubtitle().map((line, index) => (
              <p key={index} className="text-sm sm:text-base text-gray-600 mt-2">
                {line}
              </p>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              {notifications > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {notifications}
            </span>
              )}
            </button>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MessageCircle className="w-5 h-5 text-gray-600" />
              {messages > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {messages}
            </span>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">
            {renderContent()}
          </div>
        </div>
      </div>

      <PetModal pet={selectedPet} onClose={closePetModal} />
      <ApplicationModal application={selectedApplication} onClose={closeApplicationModal} />
      <MessageModal message={selectedMessage} onClose={closeMessageModal} />
      {showAddPetModal && <AddPetModal onClose={closeAddPetModal} onSubmit={addNewPet} />}
      <Profile open={showProfileModal} onClose={() => { setShowProfileModal(false); setActiveTab('dashboard'); }} />
    </div>
  );
};

export default ProviderDashboard;
