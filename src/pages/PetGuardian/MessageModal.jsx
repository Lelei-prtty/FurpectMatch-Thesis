import React from 'react';
import { MessageCircle, X } from 'lucide-react';

const MessageModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex flex-col gap-4 border-b border-[#CACACA] px-6 py-4 md:flex-row md:items-center md:justify-between bg-[#683B0D]">
          <div className="flex items-center gap-4">
            <img src={message.avatar} alt={message.name} className="h-14 w-14 rounded-3xl object-cover" />
            <div>
              <h2 className="text-xl font-semibold text-white">{message.name}</h2>
              <p className="text-sm text-[#CEA74E]">Conversation preview</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-[#CEA74E] px-4 py-2 text-sm font-semibold text-white">
              <MessageCircle className="mr-2 h-4 w-4" />
              Active
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white transition hover:bg-[#CEA74E]/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[320px_auto]">
          <div className="space-y-4 rounded-[32px] border border-[#CACACA] bg-[#CACACA]/20 p-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-[#989797]">Contact info</p>
              <p className="text-lg font-semibold text-[#683B0D]">{message.name}</p>
              <p className="text-sm text-[#989797]">Received: {message.time}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm border border-[#CACACA]">
              <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Latest message</p>
              <p className="mt-3 text-sm leading-6 text-[#683B0D]">{message.message}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm border border-[#CACACA]">
              <p className="text-xs uppercase tracking-[0.2em] text-[#989797]">Status</p>
              <p className="mt-2 font-semibold text-[#683B0D]">Open conversation</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-4 rounded-[32px] bg-[#CACACA]/20 p-6 border border-[#CACACA]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#683B0D]">Conversation</p>
                <span className="text-xs uppercase tracking-[0.2em] text-[#989797]">Live</span>
              </div>
              <div className="space-y-3">
                <div className="rounded-3xl bg-white px-5 py-4 shadow-sm border border-[#CACACA]">
                  <p className="text-sm leading-6 text-[#683B0D]">{message.message}</p>
                </div>
                <div className="self-end rounded-3xl bg-[#683B0D] px-5 py-4 text-sm font-semibold text-white">
                  Thanks for your message! I&apos;ll review the request and get back to you shortly.
                </div>
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-4 shadow-sm border border-[#CACACA]">
              <label className="block text-sm font-semibold text-[#683B0D]">Send reply</label>
              <div className="mt-3 flex gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CEA74E]/20"
                />
                <button
                  type="button"
                  className="rounded-3xl bg-[#683B0D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
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
