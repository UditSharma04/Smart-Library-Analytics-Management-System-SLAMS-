import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true
  },
  notes: [{
    type: {
      type: String,
      enum: ['note', 'highlight'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    page: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
})

// Indexes for efficient queries
reviewSchema.index({ book: 1, student: 1 }, { unique: true })
reviewSchema.index({ book: 1, rating: 1 })

export default mongoose.model('Review', reviewSchema) 