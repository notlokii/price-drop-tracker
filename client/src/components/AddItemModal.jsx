import { useState } from 'react'

function AddItemModal({ isOpen, onClose, onSubmit }) {
  const [url, setUrl] = useState('')
  const [targetPrice, setTargetPrice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await onSubmit(url, targetPrice)
      setUrl('')
      setTargetPrice('')
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm">
      <div className="cyber-corner-card cyber-panel w-full max-w-md p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="cyber-heading text-lg">Track New Item</h2>
            <p className="mt-0.5 text-xs text-muted">Enter product intel below</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-muted transition hover:text-neon-bright disabled:opacity-30"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="cyber-label">
              Product URL
            </label>
            <input
              id="url"
              type="url"
              required
              disabled={submitting}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://store.com/product/..."
              className="cyber-input font-mono text-xs"
            />
            <p className="mt-1.5 text-xs text-muted/70">
              We scrape this page once for name, image, and current price.
            </p>
          </div>

          <div>
            <label htmlFor="targetPrice" className="cyber-label">
              Target Price ($)
            </label>
            <input
              id="targetPrice"
              type="number"
              min="0"
              step="0.01"
              required
              disabled={submitting}
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="29.99"
              className="cyber-input"
            />
          </div>

          {submitting && (
            <p className="text-sm text-neon-bright">
              Scanning product page… usually 5–10 seconds.
            </p>
          )}

          {error && (
            <p className="rounded-md border border-pink/30 bg-pink/5 px-3 py-2 text-sm text-pink">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="cyber-btn-primary w-full"
          >
            {submitting ? 'Scanning…' : 'Add Item'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddItemModal
