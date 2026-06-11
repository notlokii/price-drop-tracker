import { useState, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import CardGrid from '../components/CardGrid'
import AddItemModal from '../components/AddItemModal'
import LoadingSpinner from '../components/LoadingSpinner'
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
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar onTrackItemClick={() => setIsModalOpen(true)} />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold sm:text-2xl">Your Tracked Items</h2>
          {!loading && !error && items.length > 0 && (
            <div className="relative w-full sm:max-w-xs">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or store..."
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 pl-10 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
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

        {loading && <LoadingSpinner label="Loading your items..." />}

        {error && (
          <p className="mb-4 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-red-300">
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
