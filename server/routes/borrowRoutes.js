import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { borrowBook, getMyBooks, getBorrowDetails } from '../controllers/borrowController.js'

const router = express.Router()

// Protect all routes
router.use(protect)

// Borrow routes
router.post('/:bookId', borrowBook)
router.get('/my-books', getMyBooks)
router.get('/:borrowId', getBorrowDetails)

export default router 