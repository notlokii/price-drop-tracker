import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { fetchPriceHistory } from '../api/items'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function PriceHistoryChart({ itemId }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchPriceHistory(itemId)
        if (!cancelled) setHistory(data)
      } catch {
        if (!cancelled) setHistory([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [itemId])

  if (loading) {
    return (
      <p className="mt-3 text-xs text-muted/70">Loading price history...</p>
    )
  }

  if (history.length < 2) {
    return (
      <p className="mt-3 text-xs text-muted/70">
        Price history appears after the first daily check.
      </p>
    )
  }

  const chartData = history.map((entry) => ({
    date: formatDate(entry.checkedAt),
    price: entry.price,
  }))

  return (
    <div className="mt-4 h-36 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis
            dataKey="date"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={40}
            domain={['auto', 'auto']}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#12121f',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '6px',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#a855f7"
            strokeWidth={2}
            dot={{ fill: '#22d3ee', r: 3 }}
            activeDot={{ r: 5, fill: '#c084fc', stroke: '#22d3ee' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PriceHistoryChart
