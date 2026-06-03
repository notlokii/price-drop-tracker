function Navbar({ onTrackItemClick }) {
  return (
    <nav className="border-b border-gray-800 bg-gray-950 px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <h1 className="text-xl font-bold text-white">PriceDrop</h1>
        <button
          type="button"
          onClick={onTrackItemClick}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          + Track Item
        </button>
      </div>
    </nav>
  )
}

export default Navbar
