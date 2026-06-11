import PriceHistoryChart from './PriceHistoryChart'

function ProductCard({ item, onDelete, deleting }) {
  const atTarget = item.currentPrice <= item.targetPrice
  const hasError = Boolean(item.scrapeError)
  const savings =
    item.currentPrice > item.targetPrice
      ? item.currentPrice - item.targetPrice
      : 0

  function handleDeleteClick(e) {
    e.preventDefault()
    e.stopPropagation()
    onDelete(item.id)
  }

  return (
    <article
      className={`cyber-corner-card cyber-panel-glow overflow-hidden ${
        atTarget
          ? 'border-cyan/40 shadow-[0_0_20px_rgba(34,211,238,0.12)]'
          : hasError
            ? 'border-pink/30'
            : ''
      }`}
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block cursor-pointer"
        aria-label={`Open ${item.name} on store website`}
      >
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="h-40 w-full object-cover transition group-hover:opacity-80 sm:h-48"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-panel-raised via-transparent to-transparent opacity-60" />
        </div>
        <div className="p-4 pb-0">
          <div className="mb-3 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-medium text-white transition group-hover:text-neon-bright">
              {item.name}
            </h3>
            <span
              className={
                hasError
                  ? 'cyber-badge-error'
                  : atTarget
                    ? 'cyber-badge-target'
                    : 'cyber-badge-tracking'
              }
            >
              {hasError ? 'Failed' : atTarget ? 'Target' : 'Watch'}
            </span>
          </div>
        </div>
      </a>

      <div className="px-4 pb-4">
        {hasError && (
          <p className="mb-2 rounded-md border border-pink/30 bg-pink/5 px-2 py-1.5 text-xs text-pink">
            {item.scrapeError}
          </p>
        )}

        <div className="space-y-1.5 text-sm">
          <p className="text-muted">
            Current{' '}
            <span className="font-semibold text-white">
              ${item.currentPrice.toFixed(2)}
            </span>
          </p>
          <p className="text-muted">
            Target{' '}
            <span className="font-semibold text-neon-bright">
              ${item.targetPrice.toFixed(2)}
            </span>
          </p>
          {savings > 0 && (
            <p className="text-xs text-pink">
              ${savings.toFixed(2)} above target
            </p>
          )}
          {atTarget && (
            <p className="text-xs text-cyan">Ready to buy — target met!</p>
          )}
          {item.lastChecked && (
            <p className="text-xs text-muted/70">
              Last checked{' '}
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
          className="cyber-btn-danger mt-4 w-full"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
