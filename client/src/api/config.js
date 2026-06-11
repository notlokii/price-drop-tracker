function normalizeApiUrl(raw) {
  if (!raw) return null
  const trimmed = raw.trim().replace(/\/$/, '')
  if (!trimmed) return null
  return trimmed
}

export function getApiUrl() {
  const fromEnv = normalizeApiUrl(import.meta.env.VITE_API_URL)

  if (fromEnv) {
    if (!fromEnv.startsWith('http://') && !fromEnv.startsWith('https://')) {
      throw new Error(
        `VITE_API_URL must start with https:// (got "${fromEnv}"). ` +
          'A value without https:// is treated as a relative path and hits Vercel instead of Railway.'
      )
    }
    return fromEnv
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:5001'
  }

  throw new Error(
    'VITE_API_URL is not set on Vercel. Add it under Settings → Environment Variables ' +
      '(enable Production + Preview), then redeploy.'
  )
}
