import StockFeedback from '../models/StockFeedback.js'
import Book from '../models/Book.js'

// Create stock feedback
export const createStockFeedback = async (req, res) => {
  try {
    const {
      bookId,
      currentStatus,
      demandIndicator,
      studentCount,
      courseAssociation
    } = req.body

    // Verify book exists
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      })
    }

    const feedback = await StockFeedback.create({
      student: req.user._id,
      bookId,
      currentStatus,
      demandIndicator,
      studentCount,
      courseAssociation
    })

    res.status(201).json({
      success: true,
      data: feedback
    })
  } catch (error) {
    console.error('Error creating stock feedback:', error)
    res.status(500).json({
      message: 'Failed to submit stock feedback'
    })
  }
}

// Get user's stock feedback
export const getMyStockFeedback = async (req, res) => {
  try {
    const feedback = await StockFeedback.find({ student: req.user._id })
      .populate('bookId', 'title author')
      .sort('-createdAt')

    res.json({
      success: true,
      data: feedback
    })
  } catch (error) {
    console.error('Error fetching stock feedback:', error)
    res.status(500).json({
      message: 'Failed to fetch stock feedback'
    })
  }
}

// Get all stock feedback (admin only)
export const getAllStockFeedback = async (req, res) => {
  try {
    const feedback = await StockFeedback.find()
      .populate('student', 'name registerNumber')
      .populate('bookId', 'title author')
      .populate('reviewedBy', 'username')
      .sort('-createdAt')

    res.json({
      success: true,
      data: feedback
    })
  } catch (error) {
    console.error('Error fetching all stock feedback:', error)
    res.status(500).json({
      message: 'Failed to fetch stock feedback'
    })
  }
}

// Update stock feedback status (admin only)
export const updateStockFeedbackStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body
    const feedback = await StockFeedback.findById(req.params.id)

    if (!feedback) {
      return res.status(404).json({
        message: 'Stock feedback not found'
      })
    }

    feedback.status = status
    feedback.adminResponse = adminResponse
    feedback.reviewedBy = req.user._id
    feedback.reviewedAt = new Date()

    await feedback.save()

    res.json({
      success: true,
      data: feedback
    })
  } catch (error) {
    console.error('Error updating stock feedback:', error)
    res.status(500).json({
      message: 'Failed to update stock feedback'
    })
  }
} 