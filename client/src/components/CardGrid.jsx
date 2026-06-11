import ProductCard from './ProductCard'
import { groupItemsByStore } from '../utils/store'

function CardGrid({ items, onDelete, deletingId, searchQuery }) {
  if (items.length === 0) {
    if (searchQuery?.trim()) {
      return (
        <p className="py-12 text-center text-gray-400">
          No items match &quot;{searchQuery}&quot;
        </p>
      )
    }

    return (
      <p className="py-12 text-center text-gray-400">
        No items tracked yet. Click &quot;+ Track Item&quot; to add one.
      </p>
    )
  }

  const storeGroups = groupItemsByStore(items)

  return (
    <div className="space-y-10">
      {storeGroups.map(({ store, items: storeItems }) => (
        <section key={store}>
          <div className="mb-4 flex items-center justify-between border-b border-gray-800 pb-2">
            <h3 className="text-lg font-semibold text-white">{store}</h3>
            <span className="text-sm text-gray-500">
              {storeItems.length} item{storeItems.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {storeItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onDelete={onDelete}
                deleting={deletingId === item.id}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default CardGrid
