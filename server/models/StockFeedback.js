import mongoose from 'mongoose'

const stockFeedbackSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  currentStatus: {
    type: String,
    enum: ['sufficient', 'low', 'critical'],
    required: true
  },
  demandIndicator: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  studentCount: {
    type: Number,
    min: 0,
    required: true
  },
  courseAssociation: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  },
  adminResponse: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  reviewedAt: Date
}, {
  timestamps: true
})

export default mongoose.model('StockFeedback', stockFeedbackSchema) 