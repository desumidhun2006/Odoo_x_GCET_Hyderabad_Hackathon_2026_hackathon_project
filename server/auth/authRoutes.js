import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { body } from 'express-validator'
import { currentUser, forgotPassword, login, logout, register, resendOtp, resetPassword, verifyOtp } from './authController.js'
import { requireAuth } from './authMiddleware.js'
import { validateRequest } from './validateRequest.js'

const router = Router()
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, message: 'Too many attempts. Please try again later.' } })
const forgotLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 3, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, message: 'Please wait before requesting another reset code.' } })
const verifyLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, message: 'Too many code attempts. Please try again later.' } })

const validEmail = body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail()
const validPassword = body('password')
  .isLength({ min: 8, max: 72 }).withMessage('Password must be between 8 and 72 characters')
  .matches(/[A-Za-z]/).withMessage('Password must contain a letter')
  .matches(/[0-9]/).withMessage('Password must contain a number')

router.post('/register', authLimiter,
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be between 2 and 80 characters'),
  validEmail, validPassword, validateRequest, register)

router.post('/login', authLimiter,
  validEmail,
  body('password').isLength({ min: 1, max: 72 }).withMessage('Password is required'),
  validateRequest, login)

router.get('/me', requireAuth, currentUser)
router.post('/logout', requireAuth, logout)
router.post('/forgot-password', forgotLimiter, validEmail, validateRequest, forgotPassword)
router.post('/resend-otp', forgotLimiter, validEmail, validateRequest, resendOtp)
router.post('/verify-otp', verifyLimiter, validEmail,
  body('otp').matches(/^\d{6}$/).withMessage('Enter the 6-digit code'),
  validateRequest, verifyOtp)
router.post('/reset-password', authLimiter, validEmail,
  body('newPassword')
    .isLength({ min: 8, max: 72 }).withMessage('Password must be between 8 and 72 characters')
    .matches(/[A-Za-z]/).withMessage('Password must contain a letter')
    .matches(/[0-9]/).withMessage('Password must contain a number'),
  validateRequest, resetPassword)

export default router