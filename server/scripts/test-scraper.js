import 'dotenv/config'
import { scrapeProduct } from '../src/services/scraper.js'

const url = process.argv[2]

if (!url) {
  console.error('Usage: npm run scrape:test -- "https://store.com/product/..."')
  process.exit(1)
}

console.log(`Scraping: ${url}\n`)

try {
  const result = await scrapeProduct(url)
  console.log('Success!')
  console.log(JSON.stringify(result, null, 2))
} catch (err) {
  console.error('Scrape failed:', err.message)
  process.exit(1)
}
