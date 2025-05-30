import express from 'express'
import multer from 'multer'
import { addNewBook, addBookUnit, searchBooks, getBooks, getBookDetails, verifyBookUnit, reportIssue, getBookAvailability } from '../controllers/bookController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

router.post('/add', protect, upload.single('coverImage'), addNewBook)
router.post('/unit/add', protect, addBookUnit)
router.get('/search', protect, searchBooks)
router.get('/:bookId/availability', protect, getBookAvailability)

export default router 