import React from 'react'
import ChatPanel from './ChatPanel.jsx'

const formatShort = (iso) =>
  new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

// Conversation list + the open chat. Shared by the guardian and provider dashboards.
export default function MessagesTab({ conversations, selectedId, onSelect, emptyText }) {
  if (conversations.length === 0) {
    return (
      <div className="rounded-3xl border border-[#CACACA] bg-[#CACACA]/10 p-10 text-center">
        <p className="text-lg font-semibold text-[#683B0D]">No messages yet</p>
        <p className="mt-2 text-sm text-[#989797]">{emptyText}</p>
      </div>
    )
  }

  const selected = conversations.find((c) => c.requestId === selectedId) || null

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <div className={`${selected ? 'hidden lg:block' : ''} space-y-3`}>
        {conversations.map((c) => (
          <button
            key={c.requestId}
            type="button"
            onClick={() => onSelect(c.requestId)}
            className={`w-full rounded-3xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md ${
              selected?.requestId === c.requestId ? 'border-[#CEA74E]' : 'border-[#CACACA]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#CEA74E]/25 font-bold text-[#683B0D]">
                {(c.otherName || '?').charAt(0).toUpperCase()}
                {c.presence?.online && (
                  <span
                    role="img"
                    aria-label="Active now"
                    className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-semibold text-[#683B0D]">{c.otherName}</p>
                  <p className="shrink-0 text-xs text-[#989797]">{formatShort(c.lastAt)}</p>
                </div>
                <p className="truncate text-xs text-[#989797]">About {c.petName}{c.open ? '' : ' · closed'}</p>
                <p className="mt-1 truncate text-sm text-[#989797]">{c.lastText || 'No messages yet'}</p>
              </div>
              {c.unread > 0 && (
                <span className="rounded-full bg-[#CEA74E] px-2 py-1 text-xs font-bold text-white">{c.unread}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className={selected ? '' : 'hidden lg:block'}>
        {selected ? (
          <ChatPanel key={selected.requestId} conversation={selected} onBack={() => onSelect(null)} />
        ) : (
          <div className="flex h-[70vh] min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-[#CACACA] bg-[#CACACA]/10">
            <p className="text-sm text-[#989797]">Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  )
}
