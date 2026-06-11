const STORE_NAMES = {
  'asos.com': 'ASOS',
  'hollister.com': 'Hollister',
  'hollisterco.com': 'Hollister',
  'nike.com': 'Nike',
}

export function getStoreFromUrl(url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '')
    if (STORE_NAMES[hostname]) return STORE_NAMES[hostname]

    const base = hostname.split('.')[0]
    return base.charAt(0).toUpperCase() + base.slice(1)
  } catch {
    return 'Other'
  }
}

export function groupItemsByStore(items) {
  const groups = {}

  for (const item of items) {
    const store = getStoreFromUrl(item.url)
    if (!groups[store]) groups[store] = []
    groups[store].push(item)
  }

  return Object.keys(groups)
    .sort((a, b) => a.localeCompare(b))
    .map((store) => ({ store, items: groups[store] }))
}

export function filterItems(items, query) {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return items

  return items.filter((item) => {
    const store = getStoreFromUrl(item.url).toLowerCase()
    return (
      item.name.toLowerCase().includes(trimmed) ||
      store.includes(trimmed) ||
      item.url.toLowerCase().includes(trimmed)
    )
  })
}
