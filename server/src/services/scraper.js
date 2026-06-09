import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())

function parsePrice(value) {
  if (value == null) return null
  const match = String(value).replace(/,/g, '').match(/(\d+\.?\d*)/)
  if (!match) return null
  const price = parseFloat(match[1])
  return Number.isFinite(price) && price > 0 ? price : null
}

export async function scrapeProduct(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    })

    // Give JS-heavy retail sites a moment to render prices
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const scraped = await page.evaluate(() => {
      const getMeta = (selector) =>
        document.querySelector(selector)?.getAttribute('content')?.trim() || null

      const name =
        getMeta('meta[property="og:title"]') ||
        getMeta('meta[name="twitter:title"]') ||
        document.querySelector('h1')?.textContent?.trim() ||
        document.title?.trim() ||
        null

      const image =
        getMeta('meta[property="og:image"]') ||
        getMeta('meta[name="twitter:image"]') ||
        null

      const priceCandidates = []

      // Meta tags some stores use for price
      const metaPrice =
        getMeta('meta[property="product:price:amount"]') ||
        getMeta('meta[itemprop="price"]')
      if (metaPrice) priceCandidates.push(metaPrice)

      // JSON-LD structured data (very common on Nike, ASOS, etc.)
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]')
      for (const script of jsonLdScripts) {
        try {
          const data = JSON.parse(script.textContent)
          const nodes = Array.isArray(data) ? data : [data]

          for (const node of nodes) {
            if (node['@type'] === 'Product' || node['@type']?.includes?.('Product')) {
              const offer = node.offers
              if (offer) {
                const offers = Array.isArray(offer) ? offer : [offer]
                for (const o of offers) {
                  if (o.price) priceCandidates.push(String(o.price))
                  if (o.lowPrice) priceCandidates.push(String(o.lowPrice))
                }
              }
            }

            if (node['@type'] === 'Offer' && node.price) {
              priceCandidates.push(String(node.price))
            }
          }
        } catch {
          // ignore malformed JSON-LD blocks
        }
      }

      // Common DOM selectors as fallback
      const selectorList = [
        '[itemprop="price"]',
        '[data-testid*="price" i]',
        '[class*="price" i]',
        '[id*="price" i]',
      ]

      for (const selector of selectorList) {
        const el = document.querySelector(selector)
        if (el) {
          const value =
            el.getAttribute('content') ||
            el.getAttribute('data-price') ||
            el.textContent?.trim()
          if (value) priceCandidates.push(value)
        }
      }

      return { name, image, priceCandidates }
    })

    const currentPrice =
      scraped.priceCandidates.map(parsePrice).find((p) => p != null) ?? null

    if (!scraped.name) {
      throw new Error('Could not find product name on page')
    }

    if (!currentPrice) {
      throw new Error('Could not find product price on page')
    }

    return {
      name: scraped.name,
      image:
        scraped.image ||
        'https://placehold.co/400x400/1f2937/9ca3af?text=No+Image',
      currentPrice,
    }
  } finally {
    await browser.close()
  }
}
