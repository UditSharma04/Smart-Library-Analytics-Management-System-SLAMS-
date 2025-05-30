import Review from '../models/Review.js'
import Library from '../models/Library.js'
import { formatReviewResponse } from '../utils/formatters.js'

export const getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params
    const reviews = await Review.find({ book: bookId })
      .populate('student', 'name avatar')
      .sort('-createdAt')

    res.json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyBookReview = async (req, res) => {
  try {
    const { bookId } = req.params
    const studentId = req.user._id

    console.log('Fetching review for:', { bookId, studentId })

    const review = await Review.findOne({
      book: bookId,
      student: studentId
    }).populate('book', 'title author')

    if (!review) {
      return res.json({
        rating: 0,
        review: '',
        notes: [],
        highlights: []
      })
    }

    // Format the response
    const response = {
      _id: review._id,
      rating: review.rating || 0,
      review: review.review || '',
      notes: review.notes.filter(note => note.type === 'note').map(note => ({
        _id: note._id,
        content: note.content,
        page: note.page,
        createdAt: note.createdAt
      })),
      highlights: review.notes.filter(note => note.type === 'highlight').map(highlight => ({
        _id: highlight._id,
        content: highlight.content,
        page: highlight.page,
        createdAt: highlight.createdAt
      }))
    }

    console.log('Sending review data:', response)
    res.json(response)

  } catch (error) {
    console.error('Error fetching review:', error)
    res.status(500).json({ message: 'Error fetching review' })
  }
}

export const addNote = async (req, res) => {
  try {
    const { bookId } = req.params
    const { type, content, page } = req.body
    const studentId = req.user._id

    const normalizedType = type === 'notes' ? 'note' : type === 'highlights' ? 'highlight' : type

    console.log('Adding note:', { bookId, type: normalizedType, content, page, studentId })

    const reviewDoc = await Review.findOneAndUpdate(
      { book: bookId, student: studentId },
      { 
        $push: { 
          notes: { 
            type: normalizedType, 
            content, 
            page, 
            createdAt: new Date() 
          }
        }
      },
      { upsert: true, new: true }
    )

    const response = formatReviewResponse(reviewDoc)
    console.log('Sending response:', response)
    res.json(response)
  } catch (error) {
    console.error('Error adding note:', error)
    res.status(500).json({ message: error.message })
  }
}

export const addOrUpdateReview = async (req, res) => {
  try {
    const { bookId } = req.params
    const { rating, review } = req.body
    const studentId = req.user._id

    console.log('Updating review:', { bookId, rating, review, studentId })

    const reviewDoc = await Review.findOneAndUpdate(
      { book: bookId, student: studentId },
      { 
        $set: { 
          rating, 
          review,
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    )

    const response = formatReviewResponse(reviewDoc)
    console.log('Updated review response:', response)
    res.json(response)
  } catch (error) {
    console.error('Error updating review:', error)
    res.status(500).json({ message: error.message })
  }
}

export const deleteNote = async (req, res) => {
  try {
    const { bookId, noteId } = req.params
    const studentId = req.user._id

    const reviewDoc = await Review.findOneAndUpdate(
      { book: bookId, student: studentId },
      { $pull: { notes: { _id: noteId } } },
      { new: true }
    )

    const response = formatReviewResponse(reviewDoc)
    console.log('After delete response:', response)
    res.json(response)
  } catch (error) {
    console.error('Error deleting note:', error)
    res.status(500).json({ message: error.message })
  }
} 