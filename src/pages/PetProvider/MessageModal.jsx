import React from 'react';
import { MessageCircle, X } from 'lucide-react';

const MessageModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src={message.avatar} alt={message.name} className="h-14 w-14 rounded-3xl object-cover" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{message.name}</h2>
              <p className="text-sm text-gray-500">Conversation preview</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
              <MessageCircle className="mr-2 h-4 w-4" />
              Active
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[320px_auto]">
          <div className="space-y-4 rounded-[32px] border border-gray-100 bg-gray-50 p-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Contact info</p>
              <p className="text-lg font-semibold text-gray-900">{message.name}</p>
              <p className="text-sm text-gray-600">Received: {message.time}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Latest message</p>
              <p className="mt-3 text-sm leading-6 text-gray-700">{message.message}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Status</p>
              <p className="mt-2 font-semibold text-gray-900">Open conversation</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-4 rounded-[32px] bg-gray-100 p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">Conversation</p>
                <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Live</span>
              </div>
              <div className="space-y-3">
                <div className="rounded-3xl bg-white px-5 py-4 shadow-sm">
                  <p className="text-sm leading-6 text-gray-700">{message.message}</p>
                </div>
                <div className="self-end rounded-3xl bg-purple-600 px-5 py-4 text-sm font-semibold text-black">
                  Thanks for your message! I&#39;ll review the request and get back to you shortly.
                </div>
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-4 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700">Send reply</label>
              <div className="mt-3 flex gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
                <button
                  type="button"
                  className="rounded-3xl bg-purple-600 px-5 py-3 text-sm font-semibold text-black transition hover:bg-purple-700"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
