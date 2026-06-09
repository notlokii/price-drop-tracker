import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())

const url = process.argv[2]
if (!url) {
  console.error('Usage: node scripts/debug-scraper.js "URL"')
  process.exit(1)
}

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 800 })
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise((r) => setTimeout(r, 5000))

const debug = await page.evaluate(() => {
  const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].map(
    (s) => s.textContent?.slice(0, 500)
  )
  const priceEls = [...document.querySelectorAll('[data-testid*="price" i], [class*="price" i]')]
    .slice(0, 15)
    .map((el) => ({
      tag: el.tagName,
      testid: el.getAttribute('data-testid'),
      class: el.className?.slice?.(0, 80),
      text: el.textContent?.trim()?.slice(0, 80),
    }))

  return {
    title: document.title,
    h1: document.querySelector('h1')?.textContent?.trim(),
    ogTitle: document.querySelector('meta[property="og:title"]')?.content,
    jsonLdCount: jsonLd.length,
    jsonLdSamples: jsonLd,
    priceEls,
  }
})

console.log(JSON.stringify(debug, null, 2))
await browser.close()
