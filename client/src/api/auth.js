const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
const TOKEN_KEY = 'token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isLoggedIn() {
  return Boolean(getToken())
}

export function logout() {
  clearToken()
}

async function authRequest(path, email, password) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Authentication failed')
  }

  setToken(data.token)
  return data
}

export function register(email, password) {
  return authRequest('/auth/register', email, password)
}

export function login(email, password) {
  return authRequest('/auth/login', email, password)
}
