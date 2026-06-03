import { useState } from 'react'
import Navbar from '../components/Navbar'
import CardGrid from '../components/CardGrid'
import AddItemModal from '../components/AddItemModal'

const FAKE_ITEMS = [
  {
    id: '1',
    name: 'Hollister Classic Hoodie',
    image: 'https://picsum.photos/seed/hoodie/400/400',
    currentPrice: 49.99,
    targetPrice: 45.0,
    url: 'https://example.com/hoodie',
  },
  {
    id: '2',
    name: 'Nike Air Max 90',
    image: 'https://picsum.photos/seed/nike/400/400',
    currentPrice: 119.99,
    targetPrice: 100.0,
    url: 'https://example.com/nike',
  },
  {
    id: '3',
    name: 'ASOS Oversized T-Shirt',
    image: 'https://picsum.photos/seed/asos/400/400',
    currentPrice: 18.0,
    targetPrice: 20.0,
    url: 'https://example.com/asos',
  },
]

function Dashboard() {
  const [items] = useState(FAKE_ITEMS)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar onTrackItemClick={() => setIsModalOpen(true)} />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <h2 className="mb-6 text-2xl font-bold">Your Tracked Items</h2>
        <CardGrid items={items} />
      </main>
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default Dashboard
