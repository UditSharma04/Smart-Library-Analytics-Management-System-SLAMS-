import express from 'express'
import multer from 'multer'
import { protect } from '../middleware/authMiddleware.js'
import { protectAdmin } from '../middleware/adminMiddleware.js'
import {
  createSuggestion,
  getMySuggestions,
  getAllSuggestions,
  updateSuggestionStatus
} from '../controllers/suggestionController.js'

const router = express.Router()

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDF and DOC files
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and DOC files are allowed'))
    }
  }
})

// Student routes
router.post('/', protect, upload.single('documents'), createSuggestion)
router.get('/my-suggestions', protect, getMySuggestions)

// Admin routes
router.get('/all', protectAdmin, getAllSuggestions)
router.put('/:id/status', protectAdmin, updateSuggestionStatus)

export default router 