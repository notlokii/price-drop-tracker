import { useState } from 'react'

function AddItemModal({ isOpen, onClose }) {
  const [url, setUrl] = useState('')
  const [targetPrice, setTargetPrice] = useState('')

  if (!isOpen) return null

  function handleSubmit(e) {
    e.preventDefault()
    // Phase 1: form does nothing on submit yet
    setUrl('')
    setTargetPrice('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Track New Item</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition hover:text-white"
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
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://store.com/product/..."
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            />
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
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="29.99"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white transition hover:bg-indigo-500"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddItemModal
