import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  coverImage: {
    type: String,
    default: ''
  },
  publishedYear: Number,
  publisher: String,
  pageCount: Number,
  language: {
    type: String,
    default: 'English'
  },
  category: String,
  subCategory: String,
  totalUnits: {
    type: Number,
    default: 0
  },
  condition: {
    type: String,
    enum: ['New', 'Excellent', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  acquisitionDate: {
    type: Date,
    default: Date.now
  },
  price: Number,
  edition: String,
  format: {
    type: String,
    enum: ['Hardcover', 'Paperback', 'E-Book', 'AudioBook', 'Magazine', 'Journal'],
    default: 'Hardcover'
  },
  tags: [String],
  notes: String,
  metadata: {
    deweyDecimal: String,
    libraryOfCongress: String,
    originalLanguage: String,
    translatedFrom: String
  },
  borrowingDetails: {
    loanPeriod: {
      type: Number,
      default: 14
    },
    renewalsAllowed: {
      type: Number,
      default: 2
    },
    lateFeePerDay: {
      type: Number,
      default: 5
    }
  },
  qrCode: {
    bookId: String,
    title: String,
    location: Object,
    timestamp: Date
  },
  currentBorrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  borrowHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Borrow'
  }],
  availability: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Add indexes for frequently queried fields
bookSchema.index({ isbn: 1 }, { unique: true })
bookSchema.index({ title: 'text', author: 'text' })
bookSchema.index({ category: 1, subCategory: 1 })
bookSchema.index({ availability: 1 })

// Virtual for book status
bookSchema.virtual('status').get(function() {
  if (!this.availability) return 'Borrowed'
  return 'Available'
})

// Method to check if book can be borrowed
bookSchema.methods.canBeBorrowed = function() {
  return this.availability && this.condition !== 'Poor'
}

// Method to calculate late fee
bookSchema.methods.calculateLateFee = function(returnDate, dueDate) {
  if (!returnDate || !dueDate) return 0
  const days = Math.max(0, Math.floor((returnDate - dueDate) / (1000 * 60 * 60 * 24)))
  return days * this.borrowingDetails.lateFeePerDay
}

// Add method to get available units count
bookSchema.methods.getAvailableUnits = async function() {
  const set = await mongoose.model('Set').findOne({ bookId: this._id })
  if (!set) return 0
  return set.units.filter(unit => unit.status === 'available').length
}

// Add a pre-save middleware to check borrowHistory
bookSchema.pre('save', function(next) {
  // If book has active borrows, it should be unavailable
  if (this.borrowHistory && this.borrowHistory.length > 0) {
    this.availability = false
  }
  next()
})

// Add method to check availability
bookSchema.methods.isAvailable = function() {
  return this.availability === true
}

// Add this method to Book model
bookSchema.methods.refreshAvailability = async function() {
  const activeBorrows = await mongoose.model('Borrow').countDocuments({
    book: this._id,
    status: 'borrowed'
  })
  
  this.availability = activeBorrows === 0
  await this.save()
  return this.availability
}

export default mongoose.model('Book', bookSchema) 