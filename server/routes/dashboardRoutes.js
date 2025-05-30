import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import {
  getDashboardStats,
  getLibraryStats,
  getNotifications
} from '../controllers/dashboardController.js'

const router = express.Router()

router.use(protect)

router.get('/stats', getDashboardStats)
router.get('/library-stats', getLibraryStats)
router.get('/notifications', getNotifications)

export default router 