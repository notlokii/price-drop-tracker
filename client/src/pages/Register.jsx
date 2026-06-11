import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import AuthShell from '../components/AuthShell'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await register(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Create account"
      subtitle="Start tracking price drops with PriceDrop"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="cyber-link">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="cyber-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            disabled={submitting}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="cyber-input"
          />
        </div>

        <div>
          <label htmlFor="password" className="cyber-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            disabled={submitting}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="cyber-input"
          />
          <p className="mt-1.5 text-xs text-muted/70">At least 6 characters</p>
        </div>

        {error && (
          <p className="rounded-md border border-pink/30 bg-pink/5 px-3 py-2 text-sm text-pink">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="cyber-btn-primary w-full">
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </AuthShell>
  )
}

export default Register
