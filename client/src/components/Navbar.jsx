import { useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'

function Navbar({ onTrackItemClick }) {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="border-b border-gray-800 bg-gray-950 px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <h1 className="text-xl font-bold text-white">PriceDrop</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onTrackItemClick}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            + Track Item
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 transition hover:border-gray-600 hover:text-white"
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
