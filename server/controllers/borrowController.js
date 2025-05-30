import Borrow from '../models/Borrow.js'
import Library from '../models/Library.js'
import { calculateDueDate, calculateFine } from '../utils/dateUtils.js'
import Set from '../models/Set.js'
import mongoose from 'mongoose'
import Review from '../models/Review.js'
import { formatReviewResponse } from '../utils/formatters.js'
import Book from '../models/Book.js'

const BORROW_LIMIT = 5 // Maximum books a student can borrow
const BORROW_DAYS = 14 // Default borrowing period in days

export const borrowBook = async (req, res) => {
  const { bookId } = req.params
  const studentId = req.user._id

  try {
    // Create new borrow record
    const borrow = new Borrow({
      student: studentId,
      book: bookId
    })

    await borrow.save()

    // Update book status
    await Book.findByIdAndUpdate(bookId, {
      availability: false
    })

    res.status(200).json({
      success: true,
      message: 'Book borrowed successfully'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to borrow book'
    })
  }
}

export const getMyBooks = async (req, res) => {
  try {
    const studentId = req.user._id
    console.log('Fetching books for student:', studentId) // Debug log

    // Find all borrows for the student with populated book details
    const borrows = await Borrow.find({
      student: studentId,
      status: { $in: ['active', 'overdue'] }
    })
    .populate({
      path: 'book',
      select: 'title author coverImage isbn description publishedYear pageCount'
    })
    .sort({ borrowDate: -1 })

    console.log('Found borrows:', borrows) // Debug log

    // Format the response with explicit _id fields
    const formattedBorrows = borrows.map(borrow => {
      console.log('Formatting borrow:', borrow) // Debug log
      return {
        _id: borrow._id.toString(), // Ensure _id is a string
        book: {
          _id: borrow.book._id.toString(),
          title: borrow.book.title,
          author: borrow.book.author,
          coverImage: borrow.book.coverImage,
          isbn: borrow.book.isbn,
          description: borrow.book.description,
          publishedYear: borrow.book.publishedYear,
          pageCount: borrow.book.pageCount
        },
        borrowDate: borrow.borrowDate,
        dueDate: borrow.dueDate,
        status: borrow.status,
        progress: borrow.progress || 0,
        currentPage: borrow.currentPage || 0
      }
    })

    console.log('Sending formatted borrows:', formattedBorrows) // Debug log
    res.json(formattedBorrows)

  } catch (error) {
    console.error('Error in getMyBooks:', error)
    res.status(500).json({ 
      message: 'Error fetching borrowed books',
      error: error.message 
    })
  }
}

export const getBorrowDetails = async (req, res) => {
  try {
    const { bookId } = req.params
    const studentId = req.user._id

    console.log('Getting borrow details:', { bookId, studentId })

    if (!bookId || bookId === 'undefined') {
      console.error('Invalid bookId received:', bookId)
      return res.status(400).json({ message: 'Invalid borrow ID' })
    }

    // Get borrow details with populated book info
    const borrowDetails = await Borrow.findOne({
      _id: bookId,
      student: studentId
    }).populate({
      path: 'book',
      model: 'Book',
      select: 'title author coverImage isbn description publishedYear pageCount'
    })

    console.log('Raw borrow details:', borrowDetails)

    if (!borrowDetails) {
      console.log('No borrow found for:', { bookId, studentId })
      return res.status(404).json({ message: 'Borrow record not found' })
    }

    // Get review data
    const review = await Review.findOne({
      book: borrowDetails.book._id,
      student: studentId
    })

    console.log('Found review:', review)

    // Format the response
    const response = {
      borrow: {
        _id: borrowDetails._id.toString(),
        book: {
          _id: borrowDetails.book._id.toString(),
          title: borrowDetails.book.title,
          author: borrowDetails.book.author,
          coverImage: borrowDetails.book.coverImage || '',
          isbn: borrowDetails.book.isbn,
          description: borrowDetails.book.description,
          publishedYear: borrowDetails.book.publishedYear,
          pageCount: borrowDetails.book.pageCount
        },
        borrowDate: borrowDetails.borrowDate,
        dueDate: borrowDetails.dueDate,
        status: borrowDetails.status,
        progress: borrowDetails.progress || 0,
        currentPage: borrowDetails.currentPage || 0
      },
      stats: {
        progress: borrowDetails.progress || 0,
        currentPage: borrowDetails.currentPage || 0,
        readingStreak: borrowDetails.readingStreak || 0
      },
      review: review ? formatReviewResponse(review) : null
    }

    console.log('Sending formatted response:', response)
    res.json(response)

  } catch (error) {
    console.error('Error in getBorrowDetails:', error)
    res.status(500).json({ 
      message: 'Error fetching borrow details',
      error: error.message 
    })
  }
}

export const updateReadingProgress = async (req, res) => {
  try {
    const { bookId } = req.params
    const { currentPage } = req.body
    const studentId = req.user._id

    const borrow = await Borrow.findOne({
      book: bookId,
      student: studentId,
      status: 'active'
    }).populate('book')

    if (!borrow) {
      return res.status(404).json({ message: 'Borrow record not found' })
    }

    // Calculate progress percentage
    const progress = Math.round((currentPage / borrow.book.details.pages) * 100)

    // Update progress and streak
    const lastUpdated = borrow.lastProgressUpdate || borrow.borrowDate
    const daysSinceLastUpdate = Math.floor(
      (new Date() - new Date(lastUpdated)) / (1000 * 60 * 60 * 24)
    )

    let readingStreak = borrow.readingStreak || 0
    if (daysSinceLastUpdate <= 1) {
      readingStreak += 1
    } else {
      readingStreak = 1
    }

    borrow.currentPage = currentPage
    borrow.progress = progress
    borrow.readingStreak = readingStreak
    borrow.lastProgressUpdate = new Date()

    await borrow.save()

    res.json({
      message: 'Progress updated successfully',
      borrow
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const verifyBookCode = async (req, res) => {
  try {
    const { code } = req.body
    
    const set = await Set.findOne({
      'unitCodes.code': code,
      'unitCodes.status': 'available'
    })

    if (!set) {
      return res.status(404).json({ message: 'Invalid or unavailable book code' })
    }

    const unit = set.unitCodes.find(u => u.code === code)
    
    res.json({
      bookId: set.book,
      unitCode: code,
      rfid: unit.rfid
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const verifyExit = async (req, res) => {
  try {
    const { rfid } = req.body
    
    const borrow = await Borrow.findOne({
      rfid,
      status: 'active',
      exitVerified: false
    })

    if (!borrow) {
      return res.status(404).json({ message: 'Invalid or already verified RFID' })
    }

    borrow.exitVerified = true
    borrow.exitTime = new Date()
    await borrow.save()

    res.json({
      message: 'Exit verified successfully',
      borrow
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createBorrow = async (req, res) => {
  try {
    const { studentId, bookId } = req.body

    // Create new borrow record with minimal required data
    const borrow = new Borrow({
      student: studentId,
      book: bookId
      // All other fields will use default values
    })

    await borrow.save()

    // Update book availability
    await Book.findByIdAndUpdate(bookId, {
      $set: { availability: false },
      $push: { borrowHistory: borrow._id }
    })

    res.status(201).json({
      success: true,
      data: borrow
    })

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
} 