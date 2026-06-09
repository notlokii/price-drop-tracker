import bcrypt from 'bcrypt'
import prisma from '../lib/prisma.js'
import { signToken } from '../lib/jwt.js'

const SALT_ROUNDS = 10

function validateCredentials(email, password) {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return 'A valid email is required'
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters'
  }

  return null
}

export async function register(req, res) {
  try {
    const { email, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()

    const validationError = validateCredentials(normalizedEmail, password)
    if (validationError) {
      return res.status(400).json({ error: validationError })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
      },
      select: { id: true, email: true },
    })

    const token = signToken(user.id)

    res.status(201).json({ token, user })
  } catch (err) {
    console.error('POST /auth/register error:', err)
    res.status(500).json({ error: 'Failed to register' })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()

    const validationError = validateCredentials(normalizedEmail, password)
    if (validationError) {
      return res.status(400).json({ error: validationError })
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    // Same message whether email or password is wrong — don't leak which emails exist
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = signToken(user.id)

    res.json({
      token,
      user: { id: user.id, email: user.email },
    })
  } catch (err) {
    console.error('POST /auth/login error:', err)
    res.status(500).json({ error: 'Failed to login' })
  }
}
