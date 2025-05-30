import mongoose from 'mongoose'

const bookRequestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    trim: true
  },
  isbn: {
    type: String,
    trim: true
  },
  publisher: {
    type: String,
    trim: true
  },
  edition: {
    type: String,
    trim: true
  },
  courseRelevance: {
    type: String,
    trim: true
  },
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  justification: {
    type: String,
    required: true
  },
  similarBooks: {
    type: String,
    trim: true
  },
  unitsCount: {
    type: Number,
    default: 1,
    min: 1
  },
  referenceLinks: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
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

export default mongoose.model('BookRequest', bookRequestSchema) 