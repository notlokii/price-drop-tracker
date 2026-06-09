import prisma from '../lib/prisma.js'
import { scrapeProduct } from '../services/scraper.js'

export async function getItems(req, res) {
  try {
    const items = await prisma.item.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    })
    res.json(items)
  } catch (err) {
    console.error('GET /items error:', err)
    res.status(500).json({ error: 'Failed to fetch items' })
  }
}

export async function createItem(req, res) {
  try {
    const { url, targetPrice } = req.body

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'url is required' })
    }

    try {
      new URL(url)
    } catch {
      return res.status(400).json({ error: 'url must be a valid URL' })
    }

    const parsedTarget = Number(targetPrice)
    if (!targetPrice || Number.isNaN(parsedTarget) || parsedTarget <= 0) {
      return res.status(400).json({ error: 'targetPrice must be a positive number' })
    }

    const existing = await prisma.item.findFirst({
      where: { url, userId: req.user.id },
    })
    if (existing) {
      return res.status(409).json({ error: 'This URL is already being tracked' })
    }

    let scraped
    try {
      scraped = await scrapeProduct(url)
    } catch (err) {
      console.error('Scrape error:', err.message)
      return res.status(422).json({
        error: `Could not scrape product page: ${err.message}`,
      })
    }

    const item = await prisma.item.create({
      data: {
        url,
        name: scraped.name,
        image: scraped.image,
        currentPrice: scraped.currentPrice,
        targetPrice: parsedTarget,
        userId: req.user.id,
      },
    })

    res.status(201).json(item)
  } catch (err) {
    console.error('POST /items error:', err)
    res.status(500).json({ error: 'Failed to create item' })
  }
}

export async function deleteItem(req, res) {
  try {
    const { id } = req.params

    const item = await prisma.item.findFirst({
      where: { id, userId: req.user.id },
    })

    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }

    await prisma.item.delete({ where: { id } })
    res.status(204).send()
  } catch (err) {
    console.error('DELETE /items error:', err)
    res.status(500).json({ error: 'Failed to delete item' })
  }
}
