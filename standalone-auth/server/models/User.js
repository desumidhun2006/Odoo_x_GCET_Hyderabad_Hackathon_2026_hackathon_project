import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

export const USER_ROLES = ['user', 'inventory_manager', 'warehouse_staff', 'admin']

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 80,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 254,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false,
  },
  role: { type: String, enum: USER_ROLES, default: 'user' },
  isVerified: { type: Boolean, default: false },
  resetOTP: { type: String, default: undefined, select: false },
  resetOTPExpires: { type: Date, default: undefined, select: false },
  resetOTPAttempts: { type: Number, default: 0, select: false },
  resetVerifiedUntil: { type: Date, default: undefined, select: false },
  tokenVersion: { type: Number, default: 0, select: false },
}, { timestamps: true })

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

userSchema.methods.toJSON = function toJSON() {
  const result = this.toObject()
  delete result.password
  delete result.resetOTP
  delete result.resetOTPExpires
  delete result.resetOTPAttempts
  delete result.resetVerifiedUntil
  delete result.tokenVersion
  delete result.__v
  return result
}

const User = mongoose.model('User', userSchema)
export default User