import { createClient } from '@supabase/supabase-js'

// The one shared Supabase connection for the whole app.
// The two values come from your .env file locally, and from Vercel's
// "Environment Variables" when deployed. Both are PUBLIC by design (the database
// rules in schema.sql protect the data), but never put the service_role / secret
// key here.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

// ---------------------------------------------------------------------------
// "Remember me" for the login session
//
// remember = true  -> the session lives in localStorage (survives closing the browser)
// remember = false -> the session lives in sessionStorage (ends when the tab closes)
//
// Supabase asks this adapter where to read/write its session. A session that
// already exists stays where it is (so token refreshes don't move it).
// ---------------------------------------------------------------------------

let rememberChoice = false // used only when a brand-new session is first written

const safe = (fn, fallback = null) => {
  try { return fn() } catch { return fallback }
}

const authStorage = {
  getItem(key) {
    return safe(() => window.sessionStorage.getItem(key)) ?? safe(() => window.localStorage.getItem(key))
  },
  setItem(key, value) {
    const inLocal = safe(() => window.localStorage.getItem(key)) !== null
    const inSession = safe(() => window.sessionStorage.getItem(key)) !== null
    const useLocal = inLocal ? true : inSession ? false : rememberChoice
    const target = useLocal ? window.localStorage : window.sessionStorage
    const other = useLocal ? window.sessionStorage : window.localStorage
    safe(() => target.setItem(key, value))
    safe(() => other.removeItem(key))
  },
  removeItem(key) {
    safe(() => window.localStorage.removeItem(key))
    safe(() => window.sessionStorage.removeItem(key))
  },
}

/** Called after login: keep this session across browser restarts (true) or not (false). */
export function setRememberChoice(remember) {
  rememberChoice = Boolean(remember)
  const from = rememberChoice ? window.sessionStorage : window.localStorage
  const to = rememberChoice ? window.localStorage : window.sessionStorage
  safe(() => {
    Object.keys(from)
      .filter((key) => key.startsWith('sb-'))
      .forEach((key) => {
        to.setItem(key, from.getItem(key))
        from.removeItem(key)
      })
  })
}

/** Last-resort cleanup if signing out on the server fails. */
export function clearStoredSession() {
  ;[window.localStorage, window.sessionStorage].forEach((storage) =>
    safe(() => {
      Object.keys(storage)
        .filter((key) => key.startsWith('sb-'))
        .forEach((key) => storage.removeItem(key))
    })
  )
}

// If the settings are missing we still build a client (with placeholders) so the
// app doesn't crash on import; main.jsx shows a clear "missing settings" screen.
export const supabase = createClient(url || 'http://localhost:54321', anonKey || 'missing-anon-key', {
  auth: {
    storage: authStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
})
