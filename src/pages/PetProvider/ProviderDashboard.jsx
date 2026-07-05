import React, { useState } from 'react';
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
import SideBar from './SideBar';
import { applications, donations, messagesList, pets } from '../../Data/SampleData';

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPetIndex, setSelectedPetIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState(2);
  const [messages, setMessages] = useState(3);

  const messages_list = messagesList;

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'pets', label: 'My Pets', icon: Heart },
    { id: 'applications', label: 'Applications', icon: Users, badge: 12 },
    { id: 'adoptions', label: 'Adoptions', icon: Clock },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: messages },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
    { id: 'donations', label: 'Donations', icon: Gift },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleAddPet = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDonate = () => {
    alert('Opening donation modal...');
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
              placeholder="Search pets, applications..."
              className="w-full bg-white pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-sm sm:text-base"
            />
          </label>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Pets', value: '18', subtext: '↑ 2 this month' },
          { label: 'Active Adoptions', value: '7', subtext: '↑ 2 pending pickups' },
          { label: 'Applications', value: '12', subtext: '↑ 4 new today' },
          { label: 'Avg. Rating', value: '4.8', subtext: '★★★★★' },
          { label: 'Messages', value: messages, subtext: 'unread' },
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
          <h2 className="text-2xl font-bold text-gray-900">My Pets</h2>
          <button
            onClick={() => setActiveTab('pets')}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
          {pets.map((pet, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
          ))}
        </div>
      </div>

    </div>
  );

  const renderPets = () => (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">My Pets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedPetIndex(index)}
          >
            <div className="h-48 overflow-hidden bg-gray-100">
              <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-2xl mb-2 text-black">{pet.name}</h3>
              <p className="text-gray-600 mb-4">{pet.breed} • {pet.age}</p>
              <div className="space-y-2">
                <div className={`text-sm font-semibold px-3 py-1 rounded inline-block ${getStatusColor(pet.status)}`}>
                  {pet.status}
                </div>
                <p className="text-sm text-gray-700">{pet.health}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Applications</h1>
      <div className="space-y-4">
        {applications.map((app, index) => (
          <div key={index} className="bg-white p-6 rounded-lg flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <img src={app.avatar} alt={app.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-lg text-black">{app.name}</p>
                <p className="text-gray-600">Applied for {app.pet}</p>
                <p className="text-sm text-gray-500 mt-1">{app.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold px-3 py-1 rounded ${getStatusColor(app.status)}`}>
                {app.status}
              </span>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Messages</h1>
      <div className="max-w-2xl space-y-2">
        {messages_list.map((msg, index) => (
          <div key={index} className="bg-white p-4 rounded-lg flex items-center gap-3 hover:bg-gray-50 cursor-pointer">
            <img src={msg.avatar} alt={msg.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">{msg.name}</p>
              <p className="text-sm text-gray-600">{msg.message}</p>
            </div>
            <p className="text-xs text-gray-500">{msg.time}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Reviews & Ratings</h1>
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
        <h1 className="text-4xl font-bold text-gray-900">Donations</h1>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Causes</h2>
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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Good morning, Username!</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Here&apos;s what&apos;s happening with your pet care today.</p>
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
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <User className="w-5 h-5 text-black" />
              </div>
              <div className="hidden sm:block">
                <p className="font-semibold text-sm text-gray-900">[User Name]</p>
                <p className="text-xs text-gray-600">[Organization/Role]</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 md:p-8">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Pet</h2>
            <form className="space-y-4">
              <input type="text" placeholder="Pet Name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500" />
              <input type="text" placeholder="Breed" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500" />
              <input type="number" placeholder="Age (years)" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500" />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-black rounded-lg hover:bg-purple-700 font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Pet added successfully!');
                    closeModal();
                  }}
                >
                  Add Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderDashboard;
