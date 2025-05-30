import mongoose from 'mongoose'

const fineSchema = new mongoose.Schema({
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
  borrow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Borrow',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['overdue', 'damage', 'lost'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidAt: Date,
  paymentId: String
}, {
  timestamps: true
})

export default mongoose.model('Fine', fineSchema) 