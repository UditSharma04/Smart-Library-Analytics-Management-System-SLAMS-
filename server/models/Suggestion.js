import mongoose from 'mongoose'

const suggestionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Library Services', 'Book Collection', 'Infrastructure', 'Digital Resources', 'Others']
  },
  details: {
    type: String,
    required: true,
    trim: true
  },
  impact: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  timeline: {
    type: String,
    enum: ['short-term', 'medium-term', 'long-term'],
    default: 'short-term'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'implemented', 'rejected'],
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

export default mongoose.model('Suggestion', suggestionSchema) 