import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { protectAdmin } from '../middleware/adminMiddleware.js'
import {
  createStockFeedback,
  getMyStockFeedback,
  getAllStockFeedback,
  updateStockFeedbackStatus
} from '../controllers/stockFeedbackController.js'

const router = express.Router()

// Student routes
router.post('/', protect, createStockFeedback)
router.get('/my-feedback', protect, getMyStockFeedback)

// Admin routes
router.get('/all', protectAdmin, getAllStockFeedback)
router.put('/:id/status', protectAdmin, updateStockFeedbackStatus)

export default router 