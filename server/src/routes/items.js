import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  getItems,
  createItem,
  deleteItem,
  getPriceHistory,
} from '../controllers/itemsController.js'

const router = Router()

router.use(requireAuth)

router.get('/', getItems)
router.post('/', createItem)
router.get('/:id/history', getPriceHistory)
router.delete('/:id', deleteItem)

export default router
