import api from './api.js'

export async function login(credentials) {
  const { data } = await api.post('/auth/login', credentials)
  return data
}

export async function signup(details) {
  const { data } = await api.post('/auth/register', details)
  return data
}

export async function getCurrentUser() {
  const { data } = await api.get('/auth/me')
  return data.user
}

export async function logout() {
  const { data } = await api.post('/auth/logout')
  return data
}

export async function requestPasswordReset(email) {
  const { data } = await api.post('/auth/forgot-password', { email })
  return data
}

export async function resendOtp(email) {
  const { data } = await api.post('/auth/resend-otp', { email })
  return data
}

export async function verifyOtp(details) {
  const { data } = await api.post('/auth/verify-otp', details)
  return data
}

export async function resetPassword(details) {
  const { data } = await api.post('/auth/reset-password', details)
  return data
}