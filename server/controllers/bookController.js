import Book from '../models/Book.js'
import Set from '../models/Set.js'
import { uploadToCloudinary } from '../utils/cloudinary.js'
import { generateQRCode } from '../utils/qrCode.js'
import Issue from '../models/Issue.js'

// Get all books with pagination and filters
export const getBooks = async (queryParams) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      availability
    } = queryParams

    console.log('Query parameters:', { page, limit, search, category, availability })

    const query = {}

    if (search) {
      query.$text = { $search: search }
    }

    if (category) {
      query.category = category
    }

    console.log('MongoDB query:', query)

    const books = await Book.find(query)
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean()

    console.log('Found books:', books?.length)

    const total = await Book.countDocuments(query)

    const booksWithAvailability = await Promise.all(
      books.map(async (book) => {
        const set = await Set.findOne({ bookId: book._id })
        const availability = set ? set.getAvailabilityCounts() : {
          total: 0,
          available: 0,
          availabilityRatio: '0/0'
        }
        
        return {
          ...book,
          availableUnits: availability.available,
          totalUnits: availability.total,
          availabilityRatio: availability.availabilityRatio,
          status: availability.available > 0 ? 'available' : 'unavailable'
        }
      })
    )

    console.log('Books with availability:', booksWithAvailability?.length)

    return {
      books: booksWithAvailability,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    }

  } catch (error) {
    console.error('Controller error:', error)
    throw error
  }
}

// Get single book details with units
export const getBookDetails = async (id) => {
  try {
    const book = await Book.findById(id).lean()
    if (!book) {
      throw new Error('Book not found')
    }

    // Get set information with units
    const set = await Set.findOne({ bookId: id })
      .populate('units.currentBorrower', 'registerNumber email')
      .lean()

    // Calculate availability
    const availableUnits = set ? 
      set.units.filter(unit => unit.status === 'available').length : 0

    return {
      ...book,
      availableUnits,
      totalUnits: set ? set.units.length : 0,
      set: set || null
    }

  } catch (error) {
    console.error('Error fetching book details:', error)
    throw error
  }
}

// Verify book unit for borrowing
export const verifyBookUnit = async (req, res) => {
  try {
    const { code } = req.body

    const set = await Set.findOne({ 'units.qrCode': code })
    if (!set) {
      return res.status(404).json({ message: 'Invalid QR code' })
    }

    const unit = set.units.find(u => u.qrCode === code)
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' })
    }

    if (unit.status !== 'available') {
      return res.status(400).json({ message: 'Book unit is not available' })
    }

    res.json({
      bookId: set.bookId,
      unitCode: code,
      status: unit.status,
      condition: unit.condition
    })

  } catch (error) {
    console.error('Error verifying book unit:', error)
    res.status(500).json({ message: 'Error verifying book unit' })
  }
}

// Add new book with units
export const addNewBook = async (req, res) => {
  try {
    const bookData = req.body
    let coverImage = ''

    if (req.file) {
      const result = await uploadToCloudinary(req.file)
      coverImage = result.secure_url
    }

    const book = await Book.create({
      ...bookData,
      coverImage
    })

    // Create initial set for the book
    await Set.create({
      bookId: book._id,
      units: [],
      location: bookData.location
    })

    res.status(201).json(book)

  } catch (error) {
    console.error('Error adding new book:', error)
    res.status(500).json({ message: 'Error adding new book' })
  }
}

// Add unit to existing book
export const addBookUnit = async (req, res) => {
  try {
    const { bookId, qrCode, condition = 'Good' } = req.body

    const set = await Set.findOne({ bookId })
    if (!set) {
      return res.status(404).json({ message: 'Book set not found' })
    }

    // Check if QR code is unique
    const existingUnit = set.units.find(u => u.qrCode === qrCode)
    if (existingUnit) {
      return res.status(400).json({ message: 'QR code already exists' })
    }

    // Add new unit
    set.units.push({
      qrCode,
      condition,
      status: 'available'
    })

    await set.save()

    // Update total units in book
    await Book.findByIdAndUpdate(bookId, {
      totalUnits: set.units.length
    })

    res.json(set)

  } catch (error) {
    console.error('Error adding book unit:', error)
    res.status(500).json({ message: 'Error adding book unit' })
  }
}

export const searchBooks = async (req, res) => {
  try {
    const { query } = req.query

    if (!query) {
      return res.json({
        success: true,
        data: []
      })
    }

    // Create search query
    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { isbn: { $regex: query, $options: 'i' } }
      ]
    }

    // Find books
    const books = await Book.find(searchQuery)
      .select('title author isbn')
      .limit(10)

    res.json({
      success: true,
      data: books
    })

  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({
      success: false,
      message: 'Error searching books'
    })
  }
}

export const reportIssue = async (req, res) => {
  try {
    const { bookId } = req.params
    const { type, description } = req.body
    const studentId = req.user._id

    const issue = await Issue.create({
      book: bookId,
      student: studentId,
      type,
      description,
      status: 'pending',
      createdAt: new Date()
    })

    // Notify admin (you can implement this later)
    // await notifyAdmin(issue)

    res.json({
      message: 'Issue reported successfully',
      issue
    })
  } catch (error) {
    console.error('Error reporting issue:', error)
    res.status(500).json({ message: 'Failed to report issue' })
  }
}

export const getBookAvailability = async (req, res) => {
  try {
    const { bookId } = req.params
    const book = await Book.findById(bookId)
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      })
    }

    await book.refreshAvailability()

    res.json({
      success: true,
      data: {
        availability: book.availability
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
} 