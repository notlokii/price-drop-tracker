import { getToken } from './auth.js'
import { parseResponse } from './http.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

function authHeaders(extra = {}) {
  const headers = { ...extra }
  const token = getToken()

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function apiFetch(path, options, fallbackError) {
  try {
    const res = await fetch(`${API_URL}${path}`, options)
    return parseResponse(res, fallbackError)
  } catch (err) {
    if (err.message.includes('VITE_API_URL') || err.message.includes('Cannot reach')) {
      throw err
    }
    throw new Error(
      `${fallbackError} — ${err.message}. Check that the backend is running at ${API_URL}.`
    )
  }
}

export async function fetchItems() {
  return apiFetch('/items', { headers: authHeaders() }, 'Failed to fetch items')
}

export async function createItem(url, targetPrice) {
  return apiFetch(
    '/items',
    {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ url, targetPrice: Number(targetPrice) }),
    },
    'Failed to create item'
  )
}

export async function deleteItem(id) {
  return apiFetch(
    `/items/${id}`,
    { method: 'DELETE', headers: authHeaders() },
    'Failed to delete item'
  )
}

export async function fetchPriceHistory(itemId) {
  return apiFetch(
    `/items/${itemId}/history`,
    { headers: authHeaders() },
    'Failed to fetch price history'
  )
}
