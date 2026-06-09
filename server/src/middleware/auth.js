import { verifyToken } from '../lib/jwt.js'

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const token = authHeader.slice('Bearer '.length)

  try {
    const payload = verifyToken(token)
    req.user = { id: payload.userId }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
