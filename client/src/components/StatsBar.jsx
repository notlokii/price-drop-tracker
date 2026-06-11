function StatsBar({ items }) {
  const atTarget = items.filter((i) => i.currentPrice <= i.targetPrice).length
  const tracking = items.length - atTarget
  const potentialSavings = items.reduce((sum, item) => {
    const diff = item.currentPrice - item.targetPrice
    return diff > 0 ? sum + diff : sum
  }, 0)

  const stats = [
    { label: 'Tracked', value: items.length },
    { label: 'At target', value: atTarget, accent: 'text-cyan' },
    { label: 'Watching', value: tracking, accent: 'text-neon-bright' },
    {
      label: 'To save',
      value: `$${potentialSavings.toFixed(0)}`,
      accent: 'text-pink',
    },
  ]

  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="cyber-panel px-4 py-3">
          <p className={`cyber-stat-value ${stat.accent || ''}`}>{stat.value}</p>
          <p className="cyber-stat-label mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

export default StatsBar
