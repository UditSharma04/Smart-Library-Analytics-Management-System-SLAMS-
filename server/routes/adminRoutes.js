import express from 'express'
import { adminLogin, getAdminProfile, updateAdminProfile } from '../controllers/adminController.js'
import { protectAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/login', adminLogin)
router.get('/profile', protectAdmin, getAdminProfile)
router.put('/profile', protectAdmin, updateAdminProfile)

export default router 