import Library from '../models/Library.js'
import Book from '../models/Book.js'
import Set from '../models/Set.js'
import Borrow from '../models/Borrow.js'
import Fine from '../models/Fine.js'

export const getBooks = async (req, res) => {
  try {
    const { 
      search, 
      availability, 
      sort = 'title',
      page = 1,
      limit = 12,
      genre,
      section
    } = req.query

    // Build query
    const query = {}
    
    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ]
    }

    // Availability filter
    if (availability === 'available' || availability === 'borrowed') {
      query['availability.status'] = availability === 'available'
    }

    // Genre filter
    if (genre) {
      query['details.genre'] = genre
    }

    // Section filter
    if (section) {
      query['location.section'] = section
    }

    // Execute query with pagination
    const books = await Library.find(query)
      .sort(getSortObject(sort))
      .skip((page - 1) * limit)
      .limit(limit)

    // Get total count for pagination
    const total = await Library.countDocuments(query)

    res.json({
      books,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: parseInt(page),
        hasMore: page * limit < total
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getBookById = async (req, res) => {
  try {
    const book = await Library.findById(req.params.id)
    
    if (!book) {
      return res.status(404).json({ 
        message: 'Book not found' 
      })
    }

    res.json(book)
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid book ID' 
      })
    }

    res.status(500).json({ 
      message: error.message 
    })
  }
}

// Helper function to get sort object
const getSortObject = (sort) => {
  switch (sort) {
    case 'author':
      return { author: 1 }
    case 'recent':
      return { createdAt: -1 }
    case 'title':
    default:
      return { title: 1 }
  }
}

export const searchBooks = async (req, res) => {
  try {
    const { query } = req.query

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      })
    }

    // Create a case-insensitive search regex
    const searchRegex = new RegExp(query, 'i')

    // Search in title, author, and ISBN fields
    const books = await Book.find({
      $or: [
        { title: searchRegex },
        { author: searchRegex },
        { isbn: searchRegex }
      ]
    }).select('title author isbn') // Only select needed fields
      .limit(10) // Limit results to 10 books

    res.json({
      success: true,
      data: books
    })
  } catch (error) {
    console.error('Search books error:', error)
    res.status(500).json({
      success: false,
      message: 'Error searching books'
    })
  }
}

export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.params
    const studentId = req.user._id

    // Check if book exists and is available
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    // Check if user has any overdue books
    const overdueBooks = await Borrow.find({
      student: studentId,
      dueDate: { $lt: new Date() },
      status: 'active'
    })

    if (overdueBooks.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot borrow new books while you have overdue books' 
      })
    }

    // Check if user has any unpaid fines
    const unpaidFines = await Fine.find({
      student: studentId,
      status: 'pending'
    })

    if (unpaidFines.length > 0) {
      return res.status(400).json({ 
        message: 'Please clear your pending fines before borrowing new books' 
      })
    }

    // Check if user already has this book
    const existingBorrow = await Borrow.findOne({
      student: studentId,
      book: bookId,
      status: 'active'
    })

    if (existingBorrow) {
      return res.status(400).json({ 
        message: 'You already have this book borrowed' 
      })
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    // Create new borrow record
    const borrow = await Borrow.create({
      student: studentId,
      book: bookId,
      borrowDate: new Date(),
      dueDate,
      status: 'active',
      progress: 0
    })

    // Update book availability
    await Book.findByIdAndUpdate(bookId, {
      $inc: { availableCopies: -1 }
    })

    res.status(201).json({
      message: 'Book borrowed successfully',
      borrow
    })

  } catch (error) {
    console.error('Error borrowing book:', error)
    res.status(500).json({ message: 'Failed to borrow book' })
  }
}

// Add other controller functions... 