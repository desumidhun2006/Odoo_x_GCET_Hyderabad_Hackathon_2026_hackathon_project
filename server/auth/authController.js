import { createHmac, randomInt, timingSafeEqual } from 'node:crypto'
import jwt from 'jsonwebtoken'
import User from './User.js'
import { asyncHandler } from './asyncHandler.js'
import { sendPasswordResetOtp } from './emailService.js'

const resetRequestMessage = 'If an account exists for that email, a reset code has been sent.'
const otpLifetimeMs = 10 * 60 * 1000
const resetGrantLifetimeMs = 10 * 60 * 1000
const maximumOtpAttempts = 5

function hashOtp(email, otp) {
  return createHmac('sha256', process.env.JWT_SECRET).update(`${email}:${otp}`).digest('hex')
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  }
}

function cookieLifetime() {
  const value = process.env.JWT_EXPIRES_IN || '7d'
  const match = value.match(/^(\d+)(s|m|h|d)$/)
  if (!match) return 7 * 24 * 60 * 60 * 1000
  const unitMs = { s: 1000, m: 60000, h: 3600000, d: 86400000 }
  return Number(match[1]) * unitMs[match[2]]
}

function setAuthCookie(response, token) {
  response.cookie('stocksense_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: cookieLifetime(),
  })
}

export const register = asyncHandler(async (request, response) => {
  const { name, email, password } = request.body
  const normalizedEmail = email.toLowerCase().trim()
  const existingUser = await User.exists({ email: normalizedEmail })
  if (existingUser) {
    return response.status(409).json({ success: false, message: 'An account with that email already exists' })
  }
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password })
  response.status(201).json({ success: true, message: 'Account created successfully', user: publicUser(user) })
})

export const login = asyncHandler(async (request, response) => {
  const email = request.body.email.toLowerCase().trim()
  const user = await User.findOne({ email }).select('+password +tokenVersion')
  if (!user || !(await user.comparePassword(request.body.password))) {
    return response.status(401).json({ success: false, message: 'Invalid email or password' })
  }

  const token = jwt.sign({ version: user.tokenVersion }, process.env.JWT_SECRET, {
    subject: user._id.toString(),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
  setAuthCookie(response, token)
  response.json({ success: true, message: 'Login successful', user: publicUser(user) })
})

export const currentUser = asyncHandler(async (request, response) => {
  response.json({ success: true, user: publicUser(request.user) })
})

export const logout = asyncHandler(async (request, response) => {
  request.user.tokenVersion += 1
  await request.user.save()
  response.clearCookie('stocksense_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
  response.json({ success: true, message: 'Logout successful' })
})

export const forgotPassword = asyncHandler(async (request, response) => {
  const email = request.body.email.toLowerCase().trim()
  const user = await User.findOne({ email }).select('+resetOTP +resetOTPExpires +resetOTPAttempts +resetVerifiedUntil')
  if (user) {
    const otp = randomInt(0, 1000000).toString().padStart(6, '0')
    user.resetOTP = hashOtp(email, otp)
    user.resetOTPExpires = new Date(Date.now() + otpLifetimeMs)
    user.resetOTPAttempts = 0
    user.resetVerifiedUntil = undefined
    await user.save()
    try {
      await sendPasswordResetOtp(email, otp)
    } catch (error) {
      console.error('Password reset email delivery failed:', error.message)
    }
  }
  response.json({ success: true, message: resetRequestMessage })
})

export const resendOtp = forgotPassword

export const verifyOtp = asyncHandler(async (request, response) => {
  const email = request.body.email.toLowerCase().trim()
  const user = await User.findOne({ email }).select('+resetOTP +resetOTPExpires +resetOTPAttempts +resetVerifiedUntil')
  const expired = !user?.resetOTPExpires || user.resetOTPExpires.getTime() <= Date.now()
  if (!user || expired || !user.resetOTP) {
    return response.status(400).json({ success: false, message: 'That code is invalid or expired. Request a new code.' })
  }
  if (user.resetOTPAttempts >= maximumOtpAttempts) {
    user.resetOTP = undefined
    user.resetOTPExpires = undefined
    await user.save()
    return response.status(429).json({ success: false, message: 'Too many incorrect attempts. Request a new code.' })
  }

  const submittedHash = Buffer.from(hashOtp(email, request.body.otp), 'hex')
  const storedHash = Buffer.from(user.resetOTP, 'hex')
  const matches = submittedHash.length === storedHash.length && timingSafeEqual(submittedHash, storedHash)
  if (!matches) {
    user.resetOTPAttempts += 1
    await user.save()
    const remaining = maximumOtpAttempts - user.resetOTPAttempts
    return response.status(400).json({ success: false, message: remaining > 0 ? `Invalid code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.` : 'Too many incorrect attempts. Request a new code.' })
  }

  user.resetOTP = undefined
  user.resetOTPExpires = undefined
  user.resetOTPAttempts = 0
  user.resetVerifiedUntil = new Date(Date.now() + resetGrantLifetimeMs)
  await user.save()
  response.json({ success: true, message: 'Code verified successfully' })
})

export const resetPassword = asyncHandler(async (request, response) => {
  const email = request.body.email.toLowerCase().trim()
  const user = await User.findOne({ email }).select('+password +resetVerifiedUntil +tokenVersion')
  if (!user?.resetVerifiedUntil || user.resetVerifiedUntil.getTime() <= Date.now()) {
    return response.status(400).json({ success: false, message: 'Verify a valid reset code before changing your password' })
  }

  user.password = request.body.newPassword
  user.resetVerifiedUntil = undefined
  user.tokenVersion += 1
  await user.save()
  response.json({ success: true, message: 'Password reset successfully' })
})