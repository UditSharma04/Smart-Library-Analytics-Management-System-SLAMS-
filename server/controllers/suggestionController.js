import Suggestion from '../models/Suggestion.js'
import { uploadToCloudinary } from '../utils/cloudinary.js'

// Create suggestion
export const createSuggestion = async (req, res) => {
  try {
    const { category, details, impact } = req.body
    let documents = null

    // Handle file upload if present
    if (req.file) {
      const result = await uploadToCloudinary(req.file)
      documents = {
        fileName: req.file.originalname,
        fileUrl: result.secure_url
      }
    }

    const suggestion = await Suggestion.create({
      student: req.user._id,
      category,
      details,
      impact,
      documents
    })

    res.status(201).json({
      success: true,
      data: suggestion
    })
  } catch (error) {
    console.error('Error creating suggestion:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to submit suggestion'
    })
  }
}

// Get user's suggestions
export const getMySuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find({ student: req.user._id })
      .sort('-createdAt')

    res.json({
      success: true,
      data: suggestions
    })
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suggestions'
    })
  }
}

// Get all suggestions (admin only)
export const getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find()
      .populate('student', 'name registerNumber')
      .populate('reviewedBy', 'username')
      .sort('-createdAt')

    res.json({
      success: true,
      data: suggestions
    })
  } catch (error) {
    console.error('Error fetching all suggestions:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suggestions'
    })
  }
}

// Update suggestion status (admin only)
export const updateSuggestionStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body
    const suggestion = await Suggestion.findById(req.params.id)

    if (!suggestion) {
      return res.status(404).json({
        success: false,
        message: 'Suggestion not found'
      })
    }

    suggestion.status = status
    suggestion.adminResponse = adminResponse
    suggestion.reviewedBy = req.user._id
    suggestion.reviewedAt = new Date()

    await suggestion.save()

    res.json({
      success: true,
      data: suggestion
    })
  } catch (error) {
    console.error('Error updating suggestion:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update suggestion'
    })
  }
} 