import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { protectAdmin } from '../middleware/adminMiddleware.js'
import {
  createBookRequest,
  getMyBookRequests,
  getAllBookRequests,
  updateBookRequestStatus
} from '../controllers/bookRequestController.js'

const router = express.Router()

// Student routes
router.post('/', protect, createBookRequest)
router.get('/my-requests', protect, getMyBookRequests)

// Admin routes
router.get('/all', protectAdmin, getAllBookRequests)
router.put('/:id/status', protectAdmin, updateBookRequestStatus)

export default router 