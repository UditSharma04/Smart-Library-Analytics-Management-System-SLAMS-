import mongoose from 'mongoose'

const librarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  author: {
    type: String,
    required: true,
    index: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  penalty: {
    type: Number,
    required: true
  },
  availability: {
    status: {
      type: Boolean,
      default: true
    },
    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    borrowedAt: Date,
    dueDate: Date
  },
  location: {
    shelf: {
      number: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      }
    },
    section: {
      type: String,
      required: true
    }
  },
  details: {
    publisher: {
      type: String,
      required: true
    },
    publishedYear: {
      type: Number,
      required: true
    },
    edition: {
      type: String,
      required: true
    },
    pages: {
      type: Number,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    genre: [{
      type: String,
      required: true
    }],
    description: {
      type: String,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Create indexes for search
librarySchema.index({ title: 'text', author: 'text', isbn: 'text' })

export default mongoose.model('Library', librarySchema) 