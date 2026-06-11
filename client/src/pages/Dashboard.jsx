import { useState, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import CardGrid from '../components/CardGrid'
import AddItemModal from '../components/AddItemModal'
import LoadingSpinner from '../components/LoadingSpinner'
import StatsBar from '../components/StatsBar'
import { fetchItems, createItem, deleteItem } from '../api/items'
import { filterItems } from '../utils/store'

function Dashboard() {
  const [items, setItems] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = useMemo(
    () => filterItems(items, searchQuery),
    [items, searchQuery]
  )

  async function loadItems() {
    try {
      setError(null)
      const data = await fetchItems()
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  async function handleAddItem(url, targetPrice) {
    const newItem = await createItem(url, targetPrice)
    setItems((prev) => [newItem, ...prev])
    toast.success('Item added and tracked!')
  }

  async function handleDeleteItem(id) {
    setDeletingId(id)
    try {
      await deleteItem(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
      toast.success('Item removed')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="cyber-page">
      <Navbar onTrackItemClick={() => setIsModalOpen(true)} />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="cyber-heading text-xl sm:text-2xl">Tracked Items</h2>
            <p className="mt-1 text-sm text-muted">Monitor prices across your stores</p>
          </div>
          {!loading && !error && items.length > 0 && (
            <div className="relative w-full sm:max-w-xs">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or store..."
                className="cyber-input pl-10"
              />
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neon/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          )}
        </div>

        {!loading && !error && items.length > 0 && <StatsBar items={items} />}

        {loading && <LoadingSpinner label="Loading your items..." />}

        {error && (
          <p className="mb-4 rounded-md border border-pink/30 bg-pink/5 px-4 py-3 text-pink">
            {error}
          </p>
        )}

        {!loading && !error && (
          <CardGrid
            items={filteredItems}
            onDelete={handleDeleteItem}
            deletingId={deletingId}
            searchQuery={searchQuery}
          />
        )}
      </main>
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddItem}
      />
    </div>
  )
}

export default Dashboard
