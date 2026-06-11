import 'dotenv/config'
console.log('[boot] Loading PriceDrop API...')
import express from 'express'
import cors from 'cors'
import itemsRouter from './routes/items.js'
import authRouter from './routes/auth.js'
import { startPriceCheckerCron } from './jobs/priceChecker.js'

const app = express()
const PORT = process.env.PORT || 5001

const clientOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) =>
      origin.trim().replace(/\/$/, '')
    )
  : null

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server, curl, and same-origin requests
      if (!origin) return callback(null, true)

      const normalized = origin.replace(/\/$/, '')

      // If CLIENT_URL is set, only allow listed origins
      if (clientOrigins) {
        if (clientOrigins.includes(normalized)) return callback(null, true)
        console.warn(`[cors] Blocked origin: ${origin}`)
        return callback(null, false)
      }

      // No CLIENT_URL set — allow all (JWT still protects /items)
      return callback(null, true)
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  })
)

if (clientOrigins) {
  console.log('[cors] Allowed origins:', clientOrigins.join(', '))
} else {
  console.log('[cors] CLIENT_URL not set — allowing all origins')
}
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: 'PriceDrop API is running',
    testRoute: '/test',
    itemsRoute: '/items',
    authRoutes: ['/auth/register', '/auth/login'],
  })
})

app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' })
})

app.use('/auth', authRouter)
app.use('/items', itemsRouter)

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Health check: GET /test`)

  if (!process.env.RESEND_API_KEY) {
    console.warn(
      '[env] RESEND_API_KEY is not set — price checks will run but alert emails will fail'
    )
  }

  startPriceCheckerCron()
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `\nPort ${PORT} is already in use.\n` +
        'Try a different port: PORT=5002 npm run dev\n' +
        'On Mac, port 5000 is often taken by AirPlay Receiver (System Settings → AirDrop & Handoff).\n'
    )
  } else {
    console.error(err)
  }
  process.exit(1)
})
