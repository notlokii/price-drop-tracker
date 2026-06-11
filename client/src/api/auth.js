import { parseResponse } from './http.js'
import { getApiUrl } from './config.js'
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
  const API_URL = getApiUrl()
  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
  } catch {
    throw new Error(
      `Cannot reach API at ${API_URL}. If deployed, set VITE_API_URL to your Railway backend URL.`
    )
  }

  const data = await parseResponse(res, 'Authentication failed')
  setToken(data.token)
  return data
}

export function register(email, password) {
  return authRequest('/auth/register', email, password)
}

export function login(email, password) {
  return authRequest('/auth/login', email, password)
}
