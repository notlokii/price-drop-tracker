import ProductCard from './ProductCard'

function CardGrid({ items }) {
  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-gray-400">
        No items tracked yet. Click &quot;+ Track Item&quot; to add one.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default CardGrid
