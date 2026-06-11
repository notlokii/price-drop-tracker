import ProductCard from './ProductCard'
import { groupItemsByStore } from '../utils/store'

function CardGrid({ items, onDelete, deletingId, searchQuery }) {
  if (items.length === 0) {
    if (searchQuery?.trim()) {
      return (
        <div className="cyber-panel py-16 text-center">
          <p className="text-muted">
            No items match &quot;<span className="text-neon-bright">{searchQuery}</span>&quot;
          </p>
        </div>
      )
    }

    return (
      <div className="cyber-panel py-16 text-center">
        <p className="cyber-heading mb-2 text-lg text-neon-bright">No targets locked</p>
        <p className="text-sm text-muted">
          Click <span className="text-neon-bright">+ Track Item</span> to add your first product.
        </p>
      </div>
    )
  }

  const storeGroups = groupItemsByStore(items)

  return (
    <div className="space-y-10">
      {storeGroups.map(({ store, items: storeItems }) => (
        <section key={store}>
          <div className="cyber-divider mb-4 flex items-center justify-between pb-3">
            <h3 className="cyber-heading text-lg text-neon-bright">{store}</h3>
            <span className="text-xs uppercase tracking-widest text-muted">
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
