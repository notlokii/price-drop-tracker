import { useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'

function Navbar({ onTrackItemClick }) {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="border-b border-neon/15 bg-panel/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h1 className="cyber-logo">
          Price<span className="cyber-logo-accent">Drop</span>
        </h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={onTrackItemClick}
            className="cyber-btn-primary"
          >
            + Track Item
          </button>
          <button type="button" onClick={handleLogout} className="cyber-btn-ghost">
            Log Out
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
