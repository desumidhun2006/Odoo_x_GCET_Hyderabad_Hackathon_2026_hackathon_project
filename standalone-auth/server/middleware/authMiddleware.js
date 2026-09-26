import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { asyncHandler } from './asyncHandler.js'

export const requireAuth = asyncHandler(async (request, response, next) => {
  const token = request.cookies?.stocksense_token || request.get('Authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return response.status(401).json({ success: false, message: 'Authentication required' })

  let payload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return response.status(401).json({ success: false, message: 'Authentication required' })
  }

  const user = await User.findById(payload.sub).select('+tokenVersion')
  if (!user || user.tokenVersion !== payload.version) {
    return response.status(401).json({ success: false, message: 'Authentication required' })
  }

  request.user = user
  next()
})