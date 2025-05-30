import mongoose from 'mongoose'

const borrowSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    default: () => {
      const date = new Date()
      date.setDate(date.getDate() + 14) // Default 14 days borrow period
      return date
    }
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed'
  },
  fine: {
    amount: {
      type: Number,
      default: 0
    },
    paid: {
      type: Boolean,
      default: false
    },
    daysLate: {
      type: Number,
      default: 0
    }
  },
  renewals: {
    count: {
      type: Number,
      default: 0
    },
    maxAllowed: {
      type: Number,
      default: 2
    },
    history: [{
      date: Date,
      newDueDate: Date
    }]
  },
  condition: {
    borrowed: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    },
    returned: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor', 'damaged', 'lost']
    }
  },
  notes: {
    type: String
  },
  transactionId: {
    type: String,
    default: () => Math.random().toString(36).substr(2, 9).toUpperCase()
  }
}, {
  timestamps: true
})

// Add index for frequent queries
borrowSchema.index({ student: 1, status: 1 })
borrowSchema.index({ book: 1, status: 1 })
borrowSchema.index({ dueDate: 1, status: 1 })

// Pre-save middleware to check and update status
borrowSchema.pre('save', function(next) {
  if (this.isModified('dueDate') || this.isNew) {
    const now = new Date()
    if (now > this.dueDate && this.status === 'borrowed') {
      this.status = 'overdue'
    }
  }
  next()
})

// Method to calculate fine
borrowSchema.methods.calculateFine = function() {
  if (this.status !== 'overdue') return 0
  
  const now = new Date()
  const dueDate = new Date(this.dueDate)
  const daysLate = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24))
  
  // Fine calculation: ₹5 per day
  const fineAmount = daysLate * 5
  
  this.fine.amount = fineAmount
  this.fine.daysLate = daysLate
  
  return fineAmount
}

// Method to renew book
borrowSchema.methods.renew = function() {
  if (this.renewals.count >= this.renewals.maxAllowed) {
    throw new Error('Maximum renewals reached')
  }
  
  const oldDueDate = this.dueDate
  const newDueDate = new Date(this.dueDate)
  newDueDate.setDate(newDueDate.getDate() + 14) // Add 14 days
  
  this.dueDate = newDueDate
  this.renewals.count += 1
  this.renewals.history.push({
    date: new Date(),
    newDueDate: newDueDate
  })
  
  return newDueDate
}

const Borrow = mongoose.model('Borrow', borrowSchema)

export default Borrow 