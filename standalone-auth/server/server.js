import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { connectDatabase } from './config/db.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import { checkRequestOrigin } from './middleware/originGuard.js'
import authRoutes from './routes/authRoutes.js'

const projectEnvPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env')
dotenv.config({ path: projectEnvPath })

const app = express()
const port = Number(process.env.PORT || 5000)
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters')
}

app.disable('x-powered-by')
app.use(helmet())
app.use(cors({ origin: clientUrl, credentials: true }))
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())
app.use(checkRequestOrigin)
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 200, standardHeaders: 'draft-7', legacyHeaders: false }))
app.use('/api/auth', authRoutes)
app.use(notFound)
app.use(errorHandler)

connectDatabase()
  .then(() => app.listen(port, () => console.log(`StockSense auth API listening on port ${port}`)))
  .catch((error) => {
    console.error('Unable to start the authentication API:', error.message)
    process.exit(1)
  })