import mongoose from 'mongoose'

const issueSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  type: {
    type: String,
    enum: ['damage', 'missing', 'content', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true,
    minlength: 10
  },
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  location: {
    block: String,
    shelf: String
  },
  images: [String], // URLs of any attached images
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: Date,
  resolution: String,
  adminNotes: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
})

// Add indexes for efficient querying
issueSchema.index({ book: 1, status: 1 })
issueSchema.index({ student: 1, status: 1 })
issueSchema.index({ createdAt: -1 })

export default mongoose.model('Issue', issueSchema) 