import React, { useState } from 'react'
import { X, MessageSquare, Users, Gift, AlertCircle } from 'lucide-react'

export default function NotificationModal({ open, onClose, userRole = 'Guardian' }) {
  const [selectedTab, setSelectedTab] = useState('all')

  // Sample notification data only
  const guardianNotifications = [
    {
      id: 1,
      type: 'message',
      title: 'New Message from Golden Retriever Rescue',
      message: 'They replied to your inquiry about Buddy',
      time: '2 hours ago',
      unread: true,
      icon: MessageSquare,
    },
    {
      id: 2,
      type: 'application',
      title: 'Application Status Updated',
      message: 'Your application for Max has been accepted!',
      time: '5 hours ago',
      unread: true,
      icon: Users,
    },
    {
      id: 3,
      type: 'message',
      title: 'Message from Happy Paws Sanctuary',
      message: 'Your adoption process is moving forward',
      time: '1 day ago',
      unread: false,
      icon: MessageSquare,
    },
  ]

  const providerNotifications = [
    {
      id: 1,
      type: 'message',
      title: 'New Inquiry from Sarah',
      message: 'Asked about your dog\'s vaccination status',
      time: '1 hour ago',
      unread: true,
      icon: MessageSquare,
    },
    {
      id: 2,
      type: 'inquiry',
      title: 'Pet Inquiry Received',
      message: 'Someone is interested in adopting Bella',
      time: '3 hours ago',
      unread: true,
      icon: AlertCircle,
    },
    {
      id: 3,
      type: 'donation',
      title: 'Donation Received',
      message: '₱500 donated to Emergency Rescue Fund',
      time: '1 day ago',
      unread: false,
      icon: Gift,
    },
  ]

  const notifications = userRole === 'Guardian' ? guardianNotifications : providerNotifications

  const filteredNotifications = selectedTab === 'all' 
    ? notifications 
    : notifications.filter(n => (selectedTab === 'unread' ? n.unread : n.type === selectedTab))

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end sm:items-center sm:justify-center px-4 pt-4 sm:pt-0">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      
      <div className="relative z-50 w-full max-w-md max-h-[80vh] overflow-hidden rounded-3xl bg-white shadow-2xl sm:max-h-[calc(100vh-120px)]">
        {/* Header */}
        <div className="sticky top-0 border-b border-[#CACACA] bg-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#683B0D]">Notifications</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-[#CACACA]/20 transition"
          >
            <X className="h-5 w-5 text-[#683B0D]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="sticky top-16 border-b border-[#CACACA] bg-white px-4 py-3 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedTab('all')}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedTab === 'all'
                ? 'bg-[#683B0D] text-white'
                : 'bg-[#CACACA]/20 text-[#683B0D] hover:bg-[#CACACA]/30'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedTab('unread')}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedTab === 'unread'
                ? 'bg-[#683B0D] text-white'
                : 'bg-[#CACACA]/20 text-[#683B0D] hover:bg-[#CACACA]/30'
            }`}
          >
            Unread
          </button>
          {userRole === 'Guardian' ? (
            <>
              <button
                onClick={() => setSelectedTab('message')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedTab === 'message'
                    ? 'bg-[#683B0D] text-white'
                    : 'bg-[#CACACA]/20 text-[#683B0D] hover:bg-[#CACACA]/30'
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => setSelectedTab('application')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedTab === 'application'
                    ? 'bg-[#683B0D] text-white'
                    : 'bg-[#CACACA]/20 text-[#683B0D] hover:bg-[#CACACA]/30'
                }`}
              >
                Applications
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setSelectedTab('message')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedTab === 'message'
                    ? 'bg-[#683B0D] text-white'
                    : 'bg-[#CACACA]/20 text-[#683B0D] hover:bg-[#CACACA]/30'
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => setSelectedTab('inquiry')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedTab === 'inquiry'
                    ? 'bg-[#683B0D] text-white'
                    : 'bg-[#CACACA]/20 text-[#683B0D] hover:bg-[#CACACA]/30'
                }`}
              >
                Inquiries
              </button>
              <button
                onClick={() => setSelectedTab('donation')}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedTab === 'donation'
                    ? 'bg-[#683B0D] text-white'
                    : 'bg-[#CACACA]/20 text-[#683B0D] hover:bg-[#CACACA]/30'
                }`}
              >
                Donations
              </button>
            </>
          )}
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[calc(80vh-160px)] sm:max-h-[calc(100vh-280px)]">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-[#CACACA]">
              {filteredNotifications.map((notification) => {
                const Icon = notification.icon
                return (
                  <button
                    key={notification.id}
                    className={`w-full px-6 py-4 text-left transition hover:bg-[#CACACA]/10 ${
                      notification.unread ? 'bg-[#CEA74E]/5' : 'bg-white'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="mt-1 shrink-0">
                        <div className="rounded-full bg-[#683B0D]/10 p-3">
                          <Icon className="h-5 w-5 text-[#683B0D]" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-[#683B0D]">{notification.title}</p>
                          {notification.unread && (
                            <span className="shrink-0 h-2 w-2 rounded-full bg-[#CEA74E] mt-1.5" />
                          )}
                        </div>
                        <p className="mt-1 text-sm text-[#989797] line-clamp-2">{notification.message}</p>
                        <p className="mt-2 text-xs text-[#989797]">{notification.time}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-12 px-6">
              <div className="rounded-full bg-[#CACACA]/20 p-4">
                <AlertCircle className="h-6 w-6 text-[#989797]" />
              </div>
              <p className="text-center text-[#989797]">No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
