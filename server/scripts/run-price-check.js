import 'dotenv/config'
import { checkAllPrices } from '../src/jobs/priceChecker.js'
import prisma from '../src/lib/prisma.js'

try {
  const result = await checkAllPrices()
  console.log('\nResult:', result)
} catch (err) {
  console.error('Price check failed:', err.message)
  process.exit(1)
} finally {
  await prisma.$disconnect()
}
