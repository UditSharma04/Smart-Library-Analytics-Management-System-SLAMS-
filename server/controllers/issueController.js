import Issue from '../models/Issue.js'
import Book from '../models/Book.js'

// Report an issue
export const reportIssue = async (req, res) => {
  try {
    const { bookId } = req.params
    const { type, description, priority = 'medium' } = req.body
    const studentId = req.user._id

    // Verify book exists
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    // Check for duplicate reports
    const existingReport = await Issue.findOne({
      book: bookId,
      student: studentId,
      status: { $in: ['pending', 'investigating'] }
    })

    if (existingReport) {
      return res.status(400).json({ 
        message: 'You already have an active report for this book',
        existingReport
      })
    }

    const issue = await Issue.create({
      book: bookId,
      student: studentId,
      type,
      description,
      priority,
      status: 'pending',
      location: book.location // Copy location from book if available
    })

    // Populate student and book details for response
    const populatedIssue = await Issue.findById(issue._id)
      .populate('student', 'name email')
      .populate('book', 'title author coverImage')

    res.status(201).json({
      message: 'Issue reported successfully',
      issue: populatedIssue
    })

  } catch (error) {
    console.error('Error reporting issue:', error)
    res.status(500).json({ message: 'Failed to report issue' })
  }
}

// Get reports for a specific book
export const getBookReports = async (req, res) => {
  try {
    const { bookId } = req.params
    const reports = await Issue.find({ book: bookId })
      .populate('student', 'name email')
      .sort('-createdAt')

    res.json(reports)
  } catch (error) {
    console.error('Error fetching book reports:', error)
    res.status(500).json({ message: 'Failed to fetch reports' })
  }
}

// Get user's reports
export const getMyReports = async (req, res) => {
  try {
    const reports = await Issue.find({ student: req.user._id })
      .populate('book', 'title author coverImage')
      .sort('-createdAt')

    res.json(reports)
  } catch (error) {
    console.error('Error fetching user reports:', error)
    res.status(500).json({ message: 'Failed to fetch reports' })
  }
}

// Update report status (for admin)
export const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params
    const { status, resolution, adminNotes } = req.body

    const report = await Issue.findByIdAndUpdate(
      reportId,
      {
        status,
        resolution,
        adminNotes,
        ...(status === 'resolved' ? { resolvedAt: new Date() } : {})
      },
      { new: true }
    )
    .populate('student', 'name email')
    .populate('book', 'title author')

    res.json(report)
  } catch (error) {
    console.error('Error updating report:', error)
    res.status(500).json({ message: 'Failed to update report' })
  }
} 