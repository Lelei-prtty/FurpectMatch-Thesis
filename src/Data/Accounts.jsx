// Accounts, validation and sessions -- now backed by Supabase.
//
// Accounts live in Supabase Auth (passwords are hashed on Supabase's servers;
// this file never sees or stores one). Each sign-up gets an id automatically,
// and a matching row in the `profiles` table is created by the database itself
// (see supabase/schema.sql). The function names and result shapes below are the
// same ones the screens already use.
//
// What changed for callers:
//  - updateProfile() is now async (await it).
//  - isEmailTaken() always returns false: checking "is this email registered?"
//    while someone types would let strangers probe which emails have accounts.
//    A duplicate is reported when they submit instead.
//  - authenticate() signs the person in; startSession(user, remember) then only
//    decides whether the session survives closing the browser.
//  - getCurrentUser() is still synchronous. It reads a copy kept in memory that
//    initAuth() fills before the app first renders (see main.jsx).

import { clearStoredSession, isSupabaseConfigured, setRememberChoice, supabase } from '../lib/supabaseClient.js'

const ATTEMPTS_KEY = 'furpectMatch.loginAttempts'
const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_MS = 60 * 1000
const EMAIL_TAKEN = 'An account with this email already exists. Try logging in instead.'

// ---------------------------------------------------------------------------
// Normalizers
// ---------------------------------------------------------------------------

export const normalizeEmail = (value) => String(value ?? '').trim().toLowerCase()

export const normalizeName = (value) => String(value ?? '').trim().replace(/\s+/g, ' ')

/** "0917 123 4567" / "+63 917-123-4567" / "639171234567" -> "+639171234567" (or null if invalid). */
export function normalizePhone(value) {
  const digits = String(value ?? '').replace(/[\s\-().]/g, '')
  const match = /^(?:\+?63|0)(9\d{9})$/.exec(digits)
  return match ? `+63${match[1]}` : null
}

/** "+639171234567" -> "+63 917 123 4567" */
export function formatPhone(value) {
  const m = /^\+63(9\d{2})(\d{3})(\d{4})$/.exec(value ?? '')
  return m ? `+63 ${m[1]} ${m[2]} ${m[3]}` : value || ''
}

// ---------------------------------------------------------------------------
// Validators -- each returns '' when valid, otherwise a user-facing message
// ---------------------------------------------------------------------------

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u
const EMAIL_RE =
  /^[A-Za-z0-9](?:[A-Za-z0-9._%+'-]*[A-Za-z0-9_%+'-])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/

export function validateFullName(value) {
  const name = normalizeName(value)
  if (!name) return 'Please enter your full name.'
  if (name.length < 2) return 'Your name must be at least 2 characters.'
  if (name.length > 60) return 'Your name must be 60 characters or fewer.'
  if (!NAME_RE.test(name) || (name.match(/\p{L}/gu) || []).length < 2) {
    return 'Use letters only (spaces, hyphens, apostrophes and periods are fine).'
  }
  return ''
}

export function validateEmail(value) {
  const email = normalizeEmail(value)
  if (!email) return 'Please enter your email address.'
  if (email.length > 254 || email.includes('..') || !EMAIL_RE.test(email)) {
    return 'Enter a valid email address, like name@example.com.'
  }
  return ''
}

/** Phone is optional. Philippine mobile numbers only. */
export function validatePhone(value, { required = false } = {}) {
  if (!String(value ?? '').trim()) return required ? 'Please enter your mobile number.' : ''
  return normalizePhone(value) ? '' : 'Enter a valid PH mobile number, like 0917 123 4567.'
}

export function validateLocation(value) {
  const location = String(value ?? '').trim()
  if (location.length > 80) return 'Location must be 80 characters or fewer.'
  if (/[<>]/.test(location)) return 'Location can’t contain < or >.'
  return ''
}

const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', 'passw0rd', '12345678', '123456789',
  '1234567890', 'qwerty123', 'qwertyuiop', 'iloveyou', 'admin123', 'welcome1',
  'letmein123', 'abc12345', 'furpectmatch', 'pawmatch',
])

/** Live checklist for the password field (also used by validatePassword). */
export function getPasswordChecks(password, { email = '', fullName = '' } = {}) {
  const pw = String(password ?? '')
  const lower = pw.toLowerCase()
  const emailName = normalizeEmail(email).split('@')[0]
  const containsIdentity =
    (emailName.length >= 3 && lower.includes(emailName)) ||
    (normalizeName(fullName).length >= 3 && lower === normalizeName(fullName).toLowerCase())

  return [
    { id: 'length', label: 'At least 8 characters', ok: pw.length >= 8 },
    { id: 'upper', label: 'One uppercase letter', ok: /[A-Z]/.test(pw) },
    { id: 'lower', label: 'One lowercase letter', ok: /[a-z]/.test(pw) },
    { id: 'number', label: 'One number', ok: /\d/.test(pw) },
    {
      id: 'safe',
      label: 'Not a common password or your email',
      // only judged once the password is long enough to be a real attempt
      ok: pw.length >= 8 && !COMMON_PASSWORDS.has(lower) && !containsIdentity,
    },
  ]
}

export function validatePassword(password, context = {}) {
  const pw = String(password ?? '')
  if (!pw) return 'Please enter a password.'
  if (pw.length > 128) return 'Password must be 128 characters or fewer.'
  const failed = getPasswordChecks(pw, context).find((check) => !check.ok)
  if (!failed) return ''
  return {
    length: 'Password must be at least 8 characters.',
    upper: 'Password needs at least one uppercase letter.',
    lower: 'Password needs at least one lowercase letter.',
    number: 'Password needs at least one number.',
    safe: 'That password is too easy to guess. Avoid common passwords and your email.',
  }[failed.id]
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return 'Please re-enter your password.'
  return password === confirm ? '' : 'Passwords do not match.'
}

// ---------------------------------------------------------------------------
// Messages for things going wrong outside the person's control
// ---------------------------------------------------------------------------

const NOT_CONFIGURED = {
  ok: false,
  reason: 'config',
  message: 'The app isn’t connected to its database yet (missing Supabase settings). Please tell the site owner.',
}
const NETWORK_ERROR = {
  ok: false,
  reason: 'network',
  message: 'We couldn’t reach the server. Check your internet connection and try again.',
}
const RATE_LIMITED = {
  ok: false,
  reason: 'rate',
  message: 'Too many attempts right now. Please wait a few minutes and try again.',
}

const isRateLimit = (error) =>
  error?.status === 429 || /rate_limit/i.test(error?.code || '') || /rate limit/i.test(error?.message || '')

// ---------------------------------------------------------------------------
// The signed-in person (kept in memory so getCurrentUser() can stay synchronous)
// ---------------------------------------------------------------------------

const PROFILE_COLUMNS = 'id, role, full_name, phone, location, created_at'

let currentUser = null

function toUser(authUser, profile) {
  return {
    id: authUser.id,
    role: profile.role,
    fullName: profile.full_name,
    email: authUser.email ?? '',
    phone: profile.phone || '',
    location: profile.location || '',
    createdAt: profile.created_at,
  }
}

/** Builds the app's user object from a Supabase session (null when signed out). */
async function userFromSession(session) {
  if (!session?.user) return null
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_COLUMNS)
      .eq('id', session.user.id)
      .maybeSingle()
    if (error || !data) {
      if (error) console.error('Failed to load profile', error)
      return null
    }
    return toUser(session.user, data)
  } catch (error) {
    console.error('Failed to load profile', error)
    return null
  }
}

let initPromise = null

/**
 * Call once before the app renders (see main.jsx). Restores a saved login and
 * keeps getCurrentUser() in step with sign-ins / sign-outs afterwards.
 */
export function initAuth() {
  if (!initPromise) {
    initPromise = (async () => {
      if (!isSupabaseConfigured) return
      try {
        const { data } = await supabase.auth.getSession()
        currentUser = await userFromSession(data.session)
      } catch (error) {
        console.error('Failed to restore session', error)
        currentUser = null
      }

      supabase.auth.onAuthStateChange((event) => {
        if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') return
        // Other tabs broadcast their own sign-ins; always re-read THIS tab's session
        // instead of trusting the event. (setTimeout: Supabase asks callbacks not to
        // call back into the client directly.)
        setTimeout(async () => {
          const { data } = await supabase.auth.getSession()
          const next = await userFromSession(data.session)
          if (JSON.stringify(next) !== JSON.stringify(currentUser)) currentUser = next
        }, 0)
      })
    })()
  }
  return initPromise
}

/** The signed-in person (without any password data), or null. */
export function getCurrentUser() {
  return currentUser
}

/**
 * Public details for one person. For now this only knows the signed-in person;
 * once pets/applications move to the database, other people's names come from there.
 */
export function getUserById(userId) {
  return currentUser && currentUser.id === userId ? currentUser : null
}

// ---------------------------------------------------------------------------
// Public API: accounts
// ---------------------------------------------------------------------------

/** Kept so existing screens still work; see the note at the top of this file. */
export function isEmailTaken() {
  return false
}

/**
 * Validates and creates an account (and signs the person in).
 * Resolves { ok: true, user } or { ok: false, reason, errors?: { field: message }, message? }.
 */
export async function createAccount({ fullName, email, phone = '', location = '', password, role = 'guardian' }) {
  const errors = {}
  const nameError = validateFullName(fullName)
  const emailError = validateEmail(email)
  const phoneError = validatePhone(phone)
  const locationError = validateLocation(location)
  const passwordError = validatePassword(password, { email, fullName })
  if (nameError) errors.fullName = nameError
  if (emailError) errors.email = emailError
  if (phoneError) errors.phone = phoneError
  if (locationError) errors.location = locationError
  if (passwordError) errors.password = passwordError
  if (Object.keys(errors).length > 0) return { ok: false, reason: 'validation', errors }
  if (!isSupabaseConfigured) return NOT_CONFIGURED

  let result
  try {
    result = await supabase.auth.signUp({
      email: normalizeEmail(email),
      password,
      options: {
        // The database reads these to create the profile row (role is limited to
        // 'guardian' or 'provider' there as well).
        data: {
          role: role === 'provider' ? 'provider' : 'guardian',
          full_name: normalizeName(fullName),
          phone: normalizePhone(phone) || '',
          location: String(location ?? '').trim(),
        },
      },
    })
  } catch (error) {
    console.error('Sign-up failed', error)
    return NETWORK_ERROR
  }

  const { data, error } = result
  if (error) {
    if (error.code === 'user_already_exists' || /already registered/i.test(error.message || '')) {
      return { ok: false, reason: 'validation', errors: { email: EMAIL_TAKEN } }
    }
    if (error.code === 'weak_password') {
      return { ok: false, reason: 'validation', errors: { password: error.message || 'Choose a stronger password.' } }
    }
    if (error.code === 'email_address_invalid') {
      return { ok: false, reason: 'validation', errors: { email: 'Enter a valid email address, like name@example.com.' } }
    }
    if (isRateLimit(error)) return RATE_LIMITED
    return { ok: false, reason: 'server', message: error.message || 'We couldn’t create your account. Please try again.' }
  }

  // With "Confirm email" ON, signing up with an address that already exists returns a
  // user with no identities instead of an error.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return { ok: false, reason: 'validation', errors: { email: EMAIL_TAKEN } }
  }
  // "Confirm email" ON: the account exists but there's no session until they confirm.
  if (!data.session) {
    return {
      ok: false,
      reason: 'confirm',
      message: 'Almost done! We sent a confirmation link to your email. Open it, then log in.',
    }
  }

  const user = await userFromSession(data.session)
  if (!user) {
    return { ok: false, reason: 'profile', message: 'Your account was created, but we couldn’t load it. Please try logging in.' }
  }
  currentUser = user
  return { ok: true, user }
}

// --- login throttling (friendly UX on top of Supabase's own server-side limits) ---

function readAttempts() {
  try {
    const raw = window.localStorage.getItem(ATTEMPTS_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

function writeAttempts(attempts) {
  try { window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts)) } catch (error) { console.error(error) }
}

function lockoutSecondsLeft(email) {
  const entry = readAttempts()[email]
  if (!entry || !entry.lockedUntil) return 0
  return Math.max(0, Math.ceil((entry.lockedUntil - Date.now()) / 1000))
}

function recordFailure(email) {
  const attempts = readAttempts()
  const entry = attempts[email] || { count: 0, lockedUntil: 0 }
  const expired = entry.lockedUntil && entry.lockedUntil <= Date.now()
  const count = (expired ? 0 : entry.count) + 1
  attempts[email] = count >= MAX_FAILED_ATTEMPTS
    ? { count: 0, lockedUntil: Date.now() + LOCKOUT_MS }
    : { count, lockedUntil: 0 }
  writeAttempts(attempts)
}

function clearFailures(email) {
  const attempts = readAttempts()
  if (attempts[email]) {
    delete attempts[email]
    writeAttempts(attempts)
  }
}

/**
 * Signs in with an email + password.
 * Resolves { ok: true, user } or { ok: false, reason, message? }.
 * 'invalid' is deliberately the same for "no such email" and "wrong password".
 * If the password is right but the account is the other role, the message says so
 * (safe: the person already proved they own the account).
 */
export async function authenticate(email, password, role = 'guardian') {
  if (!isSupabaseConfigured) return NOT_CONFIGURED
  const target = normalizeEmail(email)

  const waitSeconds = lockoutSecondsLeft(target)
  if (waitSeconds > 0) return { ok: false, reason: 'locked', retryAfterSeconds: waitSeconds }

  let result
  try {
    result = await supabase.auth.signInWithPassword({ email: target, password: String(password ?? '') })
  } catch (error) {
    console.error('Sign-in failed', error)
    return NETWORK_ERROR
  }

  if (result.error) {
    const { error } = result
    if (isRateLimit(error)) return { ok: false, reason: 'locked', retryAfterSeconds: 60 }
    if (error.code === 'email_not_confirmed') {
      return { ok: false, reason: 'confirm', message: 'Please confirm your email first. Check your inbox for the link.' }
    }
    if (error.code === 'invalid_credentials' || error.status === 400) {
      recordFailure(target)
      return { ok: false, reason: 'invalid' }
    }
    return { ok: false, reason: 'server', message: 'We couldn’t log you in right now. Please try again.' }
  }

  const user = await userFromSession(result.data.session)
  if (!user) {
    await supabase.auth.signOut({ scope: 'local' }).catch(() => {})
    return { ok: false, reason: 'profile', message: 'We couldn’t load your account. Please try again.' }
  }
  if (user.role !== role) {
    await supabase.auth.signOut({ scope: 'local' }).catch(() => {})
    currentUser = null
    return {
      ok: false,
      reason: 'wrong-role',
      message: `This account is registered as a ${user.role}. Please use the ${user.role} login.`,
    }
  }

  clearFailures(target)
  currentUser = user
  return { ok: true, user }
}

// ---------------------------------------------------------------------------
// Public API: sessions
// ---------------------------------------------------------------------------

/** remember = true keeps you signed in after the browser closes; false ends it with the tab. */
export function startSession(user, remember = false) {
  setRememberChoice(remember)
  return Boolean(user)
}

export function endSession() {
  currentUser = null // the UI treats you as signed out immediately
  supabase.auth.signOut({ scope: 'local' }).catch((error) => {
    console.error('Sign-out failed', error)
    clearStoredSession()
  })
}

// ---------------------------------------------------------------------------
// Public API: profile + password changes
// ---------------------------------------------------------------------------

/** Updates name / phone / location. Resolves { ok: true, user } or { ok: false, errors | message }. */
export async function updateProfile(userId, { fullName, phone, location }) {
  const errors = {}
  const nameError = validateFullName(fullName)
  const phoneError = validatePhone(phone)
  const locationError = validateLocation(location)
  if (nameError) errors.fullName = nameError
  if (phoneError) errors.phone = phoneError
  if (locationError) errors.location = locationError
  if (Object.keys(errors).length > 0) return { ok: false, reason: 'validation', errors }

  if (!currentUser || currentUser.id !== userId) {
    return { ok: false, reason: 'missing', message: 'Account not found. Please log in again.' }
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: normalizeName(fullName),
        phone: normalizePhone(phone) || null,
        location: String(location ?? '').trim() || null,
      })
      .eq('id', userId)
      .select(PROFILE_COLUMNS)
      .single()
    if (error || !data) {
      console.error('Profile update failed', error)
      return { ok: false, reason: 'server', message: 'We couldn’t save your changes. Please try again.' }
    }
    currentUser = toUser({ id: userId, email: currentUser.email }, data)
    return { ok: true, user: currentUser }
  } catch (error) {
    console.error('Profile update failed', error)
    return NETWORK_ERROR
  }
}

/** Verifies the current password, then saves the new one. */
export async function changePassword(userId, currentPassword, newPassword) {
  if (!currentUser || currentUser.id !== userId) {
    return { ok: false, reason: 'missing', message: 'Account not found. Please log in again.' }
  }

  const errors = {}
  if (!currentPassword) errors.currentPassword = 'Please enter your current password.'
  const newError = validatePassword(newPassword, { email: currentUser.email, fullName: currentUser.fullName })
  if (newError) errors.newPassword = newError
  else if (newPassword === currentPassword) errors.newPassword = 'Choose a password different from your current one.'
  if (Object.keys(errors).length > 0) return { ok: false, reason: 'validation', errors }

  try {
    // Prove they know the current password by signing in with it again.
    const verify = await supabase.auth.signInWithPassword({ email: currentUser.email, password: currentPassword })
    if (verify.error) {
      if (isRateLimit(verify.error)) return RATE_LIMITED
      return { ok: false, reason: 'validation', errors: { currentPassword: 'That isn’t your current password.' } }
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      if (error.code === 'same_password') {
        return { ok: false, reason: 'validation', errors: { newPassword: 'Choose a password different from your current one.' } }
      }
      if (error.code === 'weak_password') {
        return { ok: false, reason: 'validation', errors: { newPassword: error.message || 'Choose a stronger password.' } }
      }
      return { ok: false, reason: 'server', message: 'We couldn’t save your new password. Please try again.' }
    }
    return { ok: true }
  } catch (error) {
    console.error('Password change failed', error)
    return NETWORK_ERROR
  }
}
