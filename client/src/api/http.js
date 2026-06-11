export async function parseResponse(res, fallbackError) {
  const text = await res.text()

  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      throw new Error(
        res.ok
          ? 'Server returned an invalid response'
          : `${fallbackError} (non-JSON response)`
      )
    }
  }

  if (res.status === 401) {
    throw new Error(data?.error || 'Please log in to continue')
  }

  if (!res.ok) {
    if (!text) {
      throw new Error(
        `${fallbackError} — server returned ${res.status} with no response body. Check VITE_API_URL and that the backend is running.`
      )
    }
    throw new Error(data?.error || fallbackError)
  }

  if (res.status === 204 || !text) return null

  return data
}
