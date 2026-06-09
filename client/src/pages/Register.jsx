import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'

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
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 text-white">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-8">
        <h1 className="mb-2 text-2xl font-bold">Create account</h1>
        <p className="mb-6 text-sm text-gray-400">Start tracking price drops with PriceDrop</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-gray-400">
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
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-gray-400">
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
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
