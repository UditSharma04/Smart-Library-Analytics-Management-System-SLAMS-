import BookRequest from '../models/BookRequest.js'
import { validateBookRequest } from '../utils/validation.js'

// Create new book request
export const createBookRequest = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      publisher,
      edition,
      courseRelevance,
      urgencyLevel,
      justification,
      similarBooks,
      unitsCount,
      referenceLinks
    } = req.body

    // Validate request data
    const validationError = validateBookRequest(req.body)
    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const bookRequest = await BookRequest.create({
      student: req.user._id,
      title,
      author,
      isbn,
      publisher,
      edition,
      courseRelevance,
      urgencyLevel,
      justification,
      similarBooks,
      unitsCount,
      referenceLinks
    })

    res.status(201).json({
      success: true,
      data: bookRequest
    })
  } catch (error) {
    console.error('Error creating book request:', error)
    res.status(500).json({
      message: 'Failed to submit book request'
    })
  }
}

// Get user's book requests
export const getMyBookRequests = async (req, res) => {
  try {
    const requests = await BookRequest.find({ student: req.user._id })
      .sort('-createdAt')

    res.json({
      success: true,
      data: requests
    })
  } catch (error) {
    console.error('Error fetching book requests:', error)
    res.status(500).json({
      message: 'Failed to fetch book requests'
    })
  }
}

// Get all book requests (admin only)
export const getAllBookRequests = async (req, res) => {
  try {
    const requests = await BookRequest.find()
      .populate('student', 'name registerNumber')
      .populate('reviewedBy', 'username')
      .sort('-createdAt')

    res.json({
      success: true,
      data: requests
    })
  } catch (error) {
    console.error('Error fetching all book requests:', error)
    res.status(500).json({
      message: 'Failed to fetch book requests'
    })
  }
}

// Update book request status (admin only)
export const updateBookRequestStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body
    const request = await BookRequest.findById(req.params.id)

    if (!request) {
      return res.status(404).json({
        message: 'Book request not found'
      })
    }

    request.status = status
    request.adminResponse = adminResponse
    request.reviewedBy = req.user._id
    request.reviewedAt = new Date()

    await request.save()

    res.json({
      success: true,
      data: request
    })
  } catch (error) {
    console.error('Error updating book request:', error)
    res.status(500).json({
      message: 'Failed to update book request'
    })
  }
} 