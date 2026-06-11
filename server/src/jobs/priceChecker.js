import cron from 'node-cron'
import prisma from '../lib/prisma.js'
import { scrapeProduct } from '../services/scraper.js'
import { sendPriceDropEmail } from '../services/mailer.js'

const SCRAPE_DELAY_MS = 3000

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function checkAllPrices() {
  const items = await prisma.item.findMany({
    include: { user: { select: { email: true } } },
  })

  console.log(`\n[priceChecker] Starting — ${items.length} item(s) to check`)

  let checked = 0
  let failed = 0
  let alerts = 0

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const oldPrice = item.currentPrice

    try {
      console.log(`[priceChecker] Scraping: ${item.name}`)

      const scraped = await scrapeProduct(item.url)
      const newPrice = scraped.currentPrice

      await prisma.priceHistory.create({
        data: { price: newPrice, itemId: item.id },
      })

      await prisma.item.update({
        where: { id: item.id },
        data: {
          currentPrice: newPrice,
          lastChecked: new Date(),
          name: scraped.name,
          image: scraped.image,
          scrapeError: null,
        },
      })

      checked++

      if (newPrice <= item.targetPrice) {
        console.log(
          `[priceChecker] Target met for "${item.name}" — ${newPrice} <= ${item.targetPrice}`
        )

        try {
          await sendPriceDropEmail({
            to: item.user.email,
            productName: scraped.name,
            oldPrice,
            newPrice,
            productUrl: item.url,
          })
          alerts++
          console.log(`[priceChecker] Email sent to ${item.user.email}`)
        } catch (emailErr) {
          console.error(
            `[priceChecker] Price updated but email failed for "${item.name}": ${emailErr.message}`
          )
        }
      }
    } catch (err) {
      failed++
      console.error(`[priceChecker] Failed "${item.name}": ${err.message}`)

      await prisma.item.update({
        where: { id: item.id },
        data: { scrapeError: err.message },
      })
    }

    if (i < items.length - 1) {
      await sleep(SCRAPE_DELAY_MS)
    }
  }

  const summary = `[priceChecker] Done — ${checked} checked, ${failed} failed, ${alerts} alert(s) sent`
  console.log(summary)
  return { checked, failed, alerts, total: items.length }
}

export function startPriceCheckerCron() {
  if (process.env.CRON_ENABLED === 'false') {
    console.log('[priceChecker] Cron disabled (CRON_ENABLED=false)')
    return
  }

  const schedule = process.env.CRON_SCHEDULE || '0 9 * * *'

  cron.schedule(schedule, () => {
    console.log('[priceChecker] Cron triggered')
    checkAllPrices().catch((err) => {
      console.error('[priceChecker] Cron run failed:', err.message)
    })
  })

  console.log(`[priceChecker] Scheduled daily at: ${schedule}`)
}
