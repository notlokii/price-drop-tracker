import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import CardGrid from '../components/CardGrid'
import AddItemModal from '../components/AddItemModal'
import { fetchItems, createItem, deleteItem } from '../api/items'

function Dashboard() {
  const [items, setItems] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    // Append directly — no second request needed (GET never scrapes)
    setItems((prev) => [newItem, ...prev])
  }

  async function handleDeleteItem(id) {
    await deleteItem(id)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar onTrackItemClick={() => setIsModalOpen(true)} />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="mb-6 text-2xl font-bold">Your Tracked Items</h2>

        {loading && (
          <p className="py-12 text-center text-gray-400">Loading items...</p>
        )}

        {error && (
          <p className="mb-4 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-red-300">
            {error}. Is the backend running at localhost:5001?
          </p>
        )}

        {!loading && !error && (
          <CardGrid items={items} onDelete={handleDeleteItem} />
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
