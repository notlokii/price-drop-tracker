import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())

const STORE_CONFIG = {
  nike: {
    hostnames: ['nike.com'],
    waitMs: 3000,
    waitSelector: '[data-testid="product-title"], #pdp_product_title',
  },
  asos: {
    hostnames: ['asos.com'],
    waitMs: 3000,
    waitSelector: '[data-testid="current-price"], h1:not(:empty)',
  },
  hollister: {
    hostnames: ['hollister.com', 'hollisterco.com'],
    waitMs: 5000,
    waitSelector: 'h1, [data-test="product-price"]',
  },
}

function parsePrice(value) {
  if (value == null) return null
  const match = String(value).replace(/,/g, '').match(/(\d+\.?\d*)/)
  if (!match) return null
  const price = parseFloat(match[1])
  return Number.isFinite(price) && price > 0 ? price : null
}

function detectStore(url) {
  const hostname = new URL(url).hostname.replace(/^www\./, '')
  for (const [store, config] of Object.entries(STORE_CONFIG)) {
    if (config.hostnames.some((h) => hostname === h || hostname.endsWith(`.${h}`))) {
      return store
    }
  }
  return 'generic'
}

function pickBestPrice(candidates) {
  const parsed = candidates.map(parsePrice).filter((p) => p != null)
  if (parsed.length === 0) return null
  return Math.min(...parsed)
}

function extractFromPage(store) {
  function collectJsonLdProducts(data, products = []) {
    if (!data) return products

    const nodes = Array.isArray(data) ? data : [data]
    for (const node of nodes) {
      if (node['@graph']) {
        collectJsonLdProducts(node['@graph'], products)
      }

      const type = node['@type']
      const typeStr = Array.isArray(type) ? type.join(' ') : String(type || '')

      if (typeStr.includes('Product')) {
        products.push(node)
      }
    }

    return products
  }

  function addPricesFromProduct(product, priceCandidates) {
    const offer = product.offers
    if (!offer) return

    const offers = Array.isArray(offer) ? offer : [offer]
    for (const o of offers) {
      if (o.price != null) priceCandidates.push(String(o.price))
      if (o.lowPrice != null) priceCandidates.push(String(o.lowPrice))
    }

    const variants = product.hasVariant || []
    const variantList = Array.isArray(variants) ? variants : [variants]
    for (const variant of variantList) {
      if (variant?.offers?.price != null) {
        priceCandidates.push(String(variant.offers.price))
      }
    }
  }

  const getMeta = (selector) =>
    document.querySelector(selector)?.getAttribute('content')?.trim() || null

  const getText = (selector) =>
    document.querySelector(selector)?.textContent?.trim() || null

  const priceCandidates = []
  let name = null
  let image = null

  // --- Store-specific selectors (most accurate, tried first) ---
  if (store === 'nike') {
    name =
      getText('[data-testid="product-title"]') ||
      getText('#pdp_product_title') ||
      getText('h1[data-testid="product_title"]')

    const nikePrices = document.querySelectorAll('[data-testid="currentPrice-container"]')
    for (const el of nikePrices) {
      if (el.textContent?.trim()) priceCandidates.push(el.textContent.trim())
    }
  }

  if (store === 'asos') {
    name = getText('h1') || getText('[data-testid="product-title"]')

    const asosPrice =
      getText('[data-testid="current-price"]') ||
      getText('[data-testid="price-screenreader-only-text"]') ||
      getText('[class*="salePrice"]')
    if (asosPrice) priceCandidates.push(asosPrice)
  }

  if (store === 'hollister') {
    name = getText('h1') || getText('[data-test="product-name"]')

    const hollisterPrice =
      getText('[data-test="product-price"]') ||
      getText('[data-test="product-price-text"]') ||
      getText('.product-price-text') ||
      getText('[class*="product-price"]')
    if (hollisterPrice) priceCandidates.push(hollisterPrice)
  }

  // --- Generic fallbacks (all stores) ---
  name =
    name ||
    getMeta('meta[property="og:title"]') ||
    getMeta('meta[name="twitter:title"]') ||
    getText('h1') ||
    document.title?.trim() ||
    null

  image =
    image ||
    getMeta('meta[property="og:image"]') ||
    getMeta('meta[name="twitter:image"]') ||
    null

  const metaPrice =
    getMeta('meta[property="product:price:amount"]') ||
    getMeta('meta[itemprop="price"]')
  if (metaPrice) priceCandidates.push(metaPrice)

  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]')
  for (const script of jsonLdScripts) {
    try {
      const data = JSON.parse(script.textContent)
      const products = collectJsonLdProducts(data)
      for (const product of products) {
        addPricesFromProduct(product, priceCandidates)
      }
    } catch {
      // ignore malformed JSON-LD
    }
  }

  if (store === 'generic') {
    const selectorList = ['[itemprop="price"]', '[data-testid*="price" i]']
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
  }

  if (name) {
    name = name.split('|')[0].trim()
  }

  const bodyText = document.body?.innerText || ''
  const blockedReason =
    bodyText.includes('Enter the characters seen in the image') ? 'captcha' :
    getText('h1') === 'Oops!!' ? 'asos-blocked' :
    null

  return { name, image, priceCandidates, blockedReason }
}

async function detectBlockedPage(page, store) {
  const bodyText = await page.evaluate(() => document.body?.innerText || '')

  if (bodyText.includes('Enter the characters seen in the image')) {
    return 'Store showed a CAPTCHA — automated scraping was blocked. Wait before retrying.'
  }

  if (store === 'asos') {
    const h1 = await page.evaluate(() => document.querySelector('h1')?.textContent?.trim())
    if (h1 === 'Oops!!') {
      return 'ASOS blocked automated access. Try again later or add the item from a home network.'
    }
  }

  if (store === 'hollister') {
    const url = page.url()
    const onHomepage = url.includes('/shop/us?') || url.endsWith('/shop/us')
    const hasProduct = url.includes('/p/')
    if (onHomepage && !hasProduct) {
      return 'Hollister redirected away from the product page — likely bot detection. Try again later.'
    }
  }

  return null
}

export async function scrapeProduct(url) {
  const store = detectStore(url)
  const config = STORE_CONFIG[store] || { waitMs: 3000, waitSelector: null }

  const headless =
    process.env.SCRAPE_HEADLESS === 'false' ? false : 'shell'

  const browser = await puppeteer.launch({
    headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    )
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' })

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    })

    if (config.waitSelector) {
      try {
        await page.waitForSelector(config.waitSelector, { timeout: 15000 })
      } catch {
        // Fall through to blocked-page checks and generic extraction
      }
    }

    await new Promise((resolve) => setTimeout(resolve, config.waitMs))

    const blockedMessage = await detectBlockedPage(page, store)
    if (blockedMessage) {
      throw new Error(blockedMessage)
    }

    const scraped = await page.evaluate(extractFromPage, store)

    if (scraped.blockedReason) {
      throw new Error('Store blocked automated access — try again later')
    }

    const currentPrice = pickBestPrice(scraped.priceCandidates)

    if (!scraped.name) {
      throw new Error('Could not find product name on page')
    }

    if (!currentPrice) {
      throw new Error(
        `Could not find product price on page (${store === 'generic' ? 'unknown store' : store})`
      )
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

export { detectStore }
