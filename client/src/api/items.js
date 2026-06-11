import { getToken } from './auth.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

function authHeaders(extra = {}) {
  const headers = { ...extra }
  const token = getToken()

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function handleResponse(res, fallbackError) {
  if (res.status === 401) {
    throw new Error('Please log in to continue')
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || fallbackError)
  }

  if (res.status === 204) return null

  return res.json()
}

export async function fetchItems() {
  const res = await fetch(`${API_URL}/items`, {
    headers: authHeaders(),
  })
  return handleResponse(res, 'Failed to fetch items')
}

export async function createItem(url, targetPrice) {
  const res = await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ url, targetPrice: Number(targetPrice) }),
  })
  return handleResponse(res, 'Failed to create item')
}

export async function deleteItem(id) {
  const res = await fetch(`${API_URL}/items/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  return handleResponse(res, 'Failed to delete item')
}

export async function fetchPriceHistory(itemId) {
  const res = await fetch(`${API_URL}/items/${itemId}/history`, {
    headers: authHeaders(),
  })
  return handleResponse(res, 'Failed to fetch price history')
}
