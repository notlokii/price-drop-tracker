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
    if (res.status === 405) {
      throw new Error(
        `${fallbackError} — got 405 Method Not Allowed. ` +
          'Your frontend is calling Vercel, not Railway. ' +
          'Set VITE_API_URL to https://price-drop-tracker-production-cd13.up.railway.app ' +
          '(with https://), enable it for Preview + Production, then redeploy.'
      )
    }

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
