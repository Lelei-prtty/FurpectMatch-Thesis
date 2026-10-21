import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getCurrentUser } from '../Data/Accounts.jsx'
import { describePresence } from '../Data/Presence.jsx'
import { MAX_IMAGE_CHARS, MAX_MESSAGE_LENGTH, getRequest, getThread, markThreadRead, sendMessage } from '../Data/Messaging.jsx'

const SEND_ERRORS = {
  empty: 'Type a message or attach a photo first.',
  toolong: `Messages can be up to ${MAX_MESSAGE_LENGTH} characters.`,
  badimage: 'That photo is too large or isn’t a supported image. Try a different one.',
  closed: 'This conversation is closed, so new messages can’t be sent.',
  photo: 'We couldn’t upload that photo. Try a different one, or send the message without it.',
  server: 'We couldn’t send that message. Please try again.',
  forbidden: 'You can’t send messages in this conversation.',
  auth: 'Please log in again to send messages.',
  missing: 'This conversation no longer exists.',
}

// Shrink photos before sending (a raw phone photo can be several MB).
const MAX_PHOTO_SIDE = 900

function shrinkImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      // Start at a good size/quality; if the result is still too big for the
      // chat, squeeze it harder (lower quality, then smaller) until it fits.
      let side = Math.min(1, MAX_PHOTO_SIDE / Math.max(img.width, img.height))
      for (let attempt = 0; attempt < 4; attempt += 1) {
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * side))
        canvas.height = Math.max(1, Math.round(img.height * side))
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ffffff' // PNGs with transparency would turn black as JPEG
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        for (const quality of [0.75, 0.6, 0.45]) {
          const dataUrl = canvas.toDataURL('image/jpeg', quality)
          if (dataUrl.length <= MAX_IMAGE_CHARS) {
            resolve(dataUrl)
            return
          }
        }
        side *= 0.7
      }
      reject(new Error('That photo is too large to send. Try a smaller one.'))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('We couldn’t read that image. Try a JPG or PNG.'))
    }
    img.src = url
  })
}

const formatTime = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

function PhotoViewer({ src, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Photo"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo"
        className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-[#683B0D] shadow-sm hover:bg-white"
      >
        Close
      </button>
      <img
        src={src}
        alt="Attached"
        onClick={(event) => event.stopPropagation()}
        className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
      />
    </div>,
    document.body
  )
}

// One conversation. Used by both dashboards; the signed-in account decides
// which side of the chat "you" are.
export default function ChatPanel({ conversation, onBack }) {
  const { requestId, otherName, otherId, petName } = conversation
  const me = getCurrentUser()
  const [thread, setThread] = useState([])
  const [open, setOpen] = useState(conversation.open)
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState(null) // data URL waiting to be sent
  const [attaching, setAttaching] = useState(false)
  const [sending, setSending] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [presence, setPresence] = useState(() => describePresence(otherId))
  const [error, setError] = useState('')
  const listRef = useRef(null)
  const fileRef = useRef(null)

  const load = useCallback(() => {
    const next = getThread(requestId)
    // Only re-render when something actually changed.
    setThread((prev) =>
      prev.length === next.length && prev[prev.length - 1]?.id === next[next.length - 1]?.id ? prev : next
    )
    setOpen(getRequest(requestId)?.status === 'Approved')
    const nextPresence = describePresence(otherId)
    setPresence((prev) =>
      prev.online === nextPresence.online && prev.label === nextPresence.label ? prev : nextPresence
    )
    markThreadRead(requestId)
  }, [requestId, otherId])

  // Load now, then keep up with new messages (same tab: poll; other tabs: storage event).
  useEffect(() => {
    setThread([])
    setText('')
    setPhoto(null)
    setError('')
    load()
    const timer = setInterval(load, 2000)
    window.addEventListener('storage', load)
    return () => {
      clearInterval(timer)
      window.removeEventListener('storage', load)
    }
  }, [load])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [thread.length, requestId])

  const handlePickPhoto = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = '' // lets the same file be picked again later
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG or PNG).')
      return
    }
    setAttaching(true)
    setError('')
    try {
      setPhoto(await shrinkImage(file))
    } catch (err) {
      setError(err.message)
    } finally {
      setAttaching(false)
    }
  }

  const handleSend = async (event) => {
    event.preventDefault()
    if (attaching || sending) return
    setSending(true)
    const result = await sendMessage(requestId, text, undefined, photo)
    setSending(false)
    if (!result.ok) {
      setError(SEND_ERRORS[result.reason] || 'Something went wrong sending that message.')
      return
    }
    setText('')
    setPhoto(null)
    setError('')
    load()
  }

  return (
    <div className="flex h-[70vh] min-h-[420px] flex-col overflow-hidden rounded-3xl border border-[#CACACA] bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-[#CACACA] bg-[#683B0D] px-5 py-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white hover:bg-white/20 lg:hidden"
          >
            Back
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold text-white">{otherName}</p>
          <p className="flex items-center gap-3 truncate text-sm text-[#CEA74E]">
            {presence.label && (
              <span className="flex shrink-0 items-center gap-1.5 text-white/90">
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full ${presence.online ? 'bg-green-400' : 'bg-white/40'}`}
                />
                {presence.label}
              </span>
            )}
            <span className="truncate">About {petName}</span>
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            open ? 'bg-[#CEA74E] text-white' : 'bg-white/20 text-white'
          }`}
        >
          {open ? 'Open' : 'Closed'}
        </span>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-[#CACACA]/10 p-5">
        {thread.length === 0 && (
          <p className="pt-10 text-center text-sm text-[#989797]">No messages yet. Say hello!</p>
        )}
        {thread.map((message) => {
          if (message.senderRole === 'system') {
            return (
              <p key={message.id} className="mx-auto max-w-md rounded-full bg-[#CEA74E]/15 px-4 py-2 text-center text-xs text-[#683B0D]">
                {message.text}
              </p>
            )
          }
          const mine = message.senderId === me?.id
          return (
            <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
                  mine ? 'bg-[#683B0D] text-white' : 'border border-[#CACACA] bg-white text-[#683B0D]'
                }`}
              >
                {message.image && (
                  <button
                    type="button"
                    onClick={() => setViewing(message.image)}
                    aria-label="View photo"
                    className="mb-2 block cursor-zoom-in overflow-hidden rounded-2xl"
                  >
                    <img src={message.image} alt="Attached" className="max-h-60 w-full object-cover" />
                  </button>
                )}
                {message.text && <p className="whitespace-pre-wrap break-words leading-6">{message.text}</p>}
                <p className={`mt-1 text-[11px] ${mine ? 'text-white/70' : 'text-[#989797]'}`}>
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSend} className="border-t border-[#CACACA] bg-white p-4">
        {error && (
          <p role="alert" className="mb-2 text-xs font-medium text-red-600">{error}</p>
        )}
        {open ? (
          <>
            {(photo || attaching) && (
              <div className="mb-3 flex items-center gap-3">
                {photo ? (
                  <div className="relative">
                    <img src={photo} alt="Photo to send" className="h-20 w-20 rounded-2xl border border-[#CACACA] object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      aria-label="Remove photo"
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#683B0D] text-sm font-bold leading-none text-white shadow hover:bg-[#CEA74E]"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-[#989797]">Preparing photo…</p>
                )}
              </div>
            )}
            <div className="flex gap-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handlePickPhoto}
                aria-label="Attach photo"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="Attach a photo"
                title="Attach a photo"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl border border-[#CACACA] bg-white text-[#683B0D] transition hover:border-[#CEA74E] hover:text-[#CEA74E]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <input
                type="text"
                value={text}
                maxLength={MAX_MESSAGE_LENGTH}
                onChange={(event) => { setText(event.target.value); if (error) setError('') }}
                placeholder={photo ? 'Add a caption (optional)...' : 'Type a message...'}
                aria-label="Message"
                className="min-w-0 flex-1 rounded-3xl border border-[#CACACA] bg-white px-4 py-3 text-sm text-[#683B0D] outline-none focus:border-[#CEA74E] focus:ring-2 focus:ring-[#CEA74E]/20"
              />
              <button
                type="submit"
                disabled={attaching || sending}
                className="rounded-3xl bg-[#683B0D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#CEA74E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-sm text-[#989797]">
            This conversation is closed because the application is no longer approved.
          </p>
        )}
      </form>

      {viewing && <PhotoViewer src={viewing} onClose={() => setViewing(null)} />}
    </div>
  )
}
