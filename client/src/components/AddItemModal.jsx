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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Track New Item</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-gray-400 transition hover:text-white disabled:opacity-30"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="mb-1 block text-sm text-gray-400">
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
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-gray-500">
              We scrape this page once to get the name, image, and current price.
            </p>
          </div>

          <div>
            <label
              htmlFor="targetPrice"
              className="mb-1 block text-sm text-gray-400"
            >
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
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          {submitting && (
            <p className="text-sm text-indigo-300">
              Scraping product page… this usually takes 5–10 seconds.
            </p>
          )}

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {submitting ? 'Scraping…' : 'Add Item'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddItemModal
