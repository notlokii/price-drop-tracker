import 'dotenv/config'
import express from 'express'

const app = express()
const PORT = process.env.PORT || 5001

app.get('/', (req, res) => {
  res.json({
    message: 'PriceDrop API is running',
    testRoute: '/test',
  })
})

app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' })
})

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Test it: http://localhost:${PORT}/test`)
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
