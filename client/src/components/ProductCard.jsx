function ProductCard({ item }) {
  const atTarget = item.currentPrice <= item.targetPrice

  return (
    <article className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
      <img
        src={item.image}
        alt={item.name}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white">{item.name}</h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              atTarget
                ? 'bg-green-900 text-green-300'
                : 'bg-yellow-900 text-yellow-300'
            }`}
          >
            {atTarget ? 'Target met' : 'Tracking'}
          </span>
        </div>
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
        </div>
      </div>
    </article>
  )
}

export default ProductCard
