import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { 
  getBooks,
  getBookDetails, 
  addNewBook, 
  addBookUnit,
  verifyBookUnit,
  searchBooks 
} from '../controllers/bookController.js'
import { 
  borrowBook, 
  getMyBooks, 
  getBorrowDetails, 
  updateReadingProgress,
  verifyBookCode,
  verifyExit
} from '../controllers/borrowController.js'
import { 
  getBookReviews, 
  getMyBookReview,
  addOrUpdateReview, 
  addNote, 
  deleteNote 
} from '../controllers/reviewController.js'
import {
  reportIssue,
  getBookReports,
  getMyReports
} from '../controllers/issueController.js'
import multer from 'multer'
import { getBookById } from '../controllers/libraryController.js'
import Book from '../models/Book.js'
import Set from '../models/Set.js'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

// Search route - keep only this one
router.get('/books/search', searchBooks)

// Book routes
router.get('/books', async (req, res) => {
  try {
    const books = await getBooks(req.query)
    res.json(books)
  } catch (error) {
    console.error('Route error:', error)
    res.status(500).json({ message: 'Error fetching books' })
  }
})

router.get('/books/:id', async (req, res) => {
  try {
    const book = await getBookDetails(req.params.id)
    res.json(book)
  } catch (error) {
    console.error('Error fetching book details:', error)
    res.status(500).json({ message: 'Error fetching book details' })
  }
})

// Book management routes
router.post('/books', protect, upload.single('coverImage'), addNewBook)
router.post('/books/unit', protect, addBookUnit)
router.post('/verify-unit', protect, verifyBookUnit)

// Borrowing routes
router.get('/mybooks', protect, getMyBooks)
router.post('/verify-code', protect, verifyBookCode)
router.post('/verify-exit', protect, verifyExit)
router.post('/:id/borrow', protect, borrowBook)
router.get('/borrows/:bookId', protect, getBorrowDetails)
router.patch('/borrow/:id/progress', protect, updateReadingProgress)

// Review and notes routes
router.get('/books/:bookId/reviews', getBookReviews)
router.get('/books/:bookId/review', protect, getMyBookReview)
router.post('/books/:bookId/review', protect, addOrUpdateReview)
router.post('/books/:bookId/notes', protect, addNote)
router.delete('/books/:bookId/notes/:noteId', protect, deleteNote)

// Issue/Report routes
router.post('/books/:bookId/report', protect, reportIssue)
router.get('/books/:bookId/reports', protect, getBookReports)
router.get('/my-reports', protect, getMyReports)

// Parameterized routes come last
router.get('/:id', getBookById)

export default router 