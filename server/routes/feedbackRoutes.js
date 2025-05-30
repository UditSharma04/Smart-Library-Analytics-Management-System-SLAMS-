import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { getFeedbackMetrics } from '../controllers/metricsController.js'

const router = express.Router()

router.get('/metrics', protect, getFeedbackMetrics)

export default router 