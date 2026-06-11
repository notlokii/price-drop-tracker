import PriceHistoryChart from './PriceHistoryChart'

function ProductCard({ item, onDelete, deleting }) {
  const atTarget = item.currentPrice <= item.targetPrice
  const hasError = Boolean(item.scrapeError)

  function handleDeleteClick(e) {
    e.preventDefault()
    e.stopPropagation()
    onDelete(item.id)
  }

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-gray-900 transition hover:border-gray-700 ${
        hasError ? 'border-red-900' : 'border-gray-800'
      }`}
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block cursor-pointer"
        aria-label={`Open ${item.name} on store website`}
      >
        <img
          src={item.image}
          alt={item.name}
          className="h-40 w-full object-cover transition group-hover:opacity-90 sm:h-48"
        />
        <div className="p-4 pb-0">
          <div className="mb-3 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-semibold text-white group-hover:text-indigo-300">
              {item.name}
            </h3>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                hasError
                  ? 'bg-red-900 text-red-300'
                  : atTarget
                    ? 'bg-green-900 text-green-300'
                    : 'bg-yellow-900 text-yellow-300'
              }`}
            >
              {hasError ? 'Check failed' : atTarget ? 'Target met' : 'Tracking'}
            </span>
          </div>
        </div>
      </a>

      <div className="px-4 pb-4">
        {hasError && (
          <p className="mb-2 rounded-lg border border-red-900 bg-red-950 px-2 py-1.5 text-xs text-red-300">
            {item.scrapeError}
          </p>
        )}

        <div className="space-y-1 text-sm">
          <p className="text-gray-400">
            Current:{' '}
            <span className="font-medium text-white">
              ${item.currentPrice.toFixed(2)}
            </span>
          </p>
          <p className="text-gray-400">
            Target:{' '}
            <span className="font-medium text-indigo-400">
              ${item.targetPrice.toFixed(2)}
            </span>
          </p>
          {item.lastChecked && (
            <p className="text-xs text-gray-500">
              Last checked:{' '}
              {new Date(item.lastChecked).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          )}
        </div>

        <PriceHistoryChart itemId={item.id} />

        <button
          type="button"
          onClick={handleDeleteClick}
          disabled={deleting}
          className="mt-4 w-full rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-400 transition hover:border-red-800 hover:text-red-400 disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
