import React from 'react'
import { createPortal } from 'react-dom'

// Shown to a guardian (once per request) when a provider approves their application.
export default function ApprovalNoticeModal({ request, onChat, onLater }) {
  if (!request) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true" aria-labelledby="approval-title">
      <div className="w-full max-w-md rounded-[28px] bg-white p-8 text-center shadow-2xl ring-1 ring-black/5">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
          ✓
        </div>
        <h2 id="approval-title" className="text-2xl font-semibold text-[#683B0D]">Your application was approved!</h2>
        <p className="mt-3 text-sm leading-6 text-[#989797]">
          <span className="font-semibold text-[#683B0D]">{request.listedBy || 'The provider'}</span> approved your
          request to adopt <span className="font-semibold text-[#683B0D]">{request.petName}</span>. You can now chat
          with them to arrange the next steps.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onChat}
            className="w-full rounded-full bg-[#683B0D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E]"
          >
            Message the provider
          </button>
          <button
            type="button"
            onClick={onLater}
            className="w-full rounded-full border border-[#CACACA] bg-white px-6 py-3 text-sm font-semibold text-[#683B0D] transition hover:bg-[#CACACA]/10"
          >
            Later
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
