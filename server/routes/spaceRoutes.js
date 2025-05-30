import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  getSpacesStatus,
  bookDiscussionRoom,
  getAvailableTimeSlots,
  endSession,
  getSpaceStats,
  cancelBooking,
  getBookingHistory
} from '../controllers/spaceController.js'

const router = express.Router()

// These routes will be prefixed with /api/spaces
router.get('/status', getSpacesStatus)
router.get('/rooms/:roomId/time-slots', protect, getAvailableTimeSlots)
router.post('/rooms/:roomId/book', protect, bookDiscussionRoom)
router.post('/rooms/:roomId/end-session', protect, endSession)
router.get('/stats', protect, getSpaceStats)
router.delete('/rooms/:roomId/cancel', protect, cancelBooking)
router.get('/bookings', protect, getBookingHistory)

export default router 