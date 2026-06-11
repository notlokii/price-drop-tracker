import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import CardGrid from '../components/CardGrid'
import AddItemModal from '../components/AddItemModal'
import LoadingSpinner from '../components/LoadingSpinner'
import { fetchItems, createItem, deleteItem } from '../api/items'

function Dashboard() {
  const [items, setItems] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

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
        <h2 className="mb-6 text-xl font-bold sm:text-2xl">Your Tracked Items</h2>

        {loading && <LoadingSpinner label="Loading your items..." />}

        {error && (
          <p className="mb-4 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-red-300">
            {error}
          </p>
        )}

        {!loading && !error && (
          <CardGrid
            items={items}
            onDelete={handleDeleteItem}
            deletingId={deletingId}
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
