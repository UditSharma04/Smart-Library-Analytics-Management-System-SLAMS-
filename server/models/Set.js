import mongoose from 'mongoose'

const setSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  units: [{
    qrCode: {
      type: String,
      required: true,
      unique: true
    },
    imageUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['available', 'borrowed', 'maintenance', 'lost'],
      default: 'available'
    },
    condition: {
      type: String,
      enum: ['New', 'Excellent', 'Good', 'Fair', 'Poor'],
      default: 'Good'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    currentBorrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    borrowHistory: [{
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
      },
      borrowDate: Date,
      returnDate: Date,
      dueDate: Date,
      returned: {
        type: Boolean,
        default: false
      }
    }]
  }],
  location: {
    block: String,
    shelf: String,
    row: String,
    column: String
  }
}, {
  timestamps: true
})

// Add index for faster lookups
setSchema.index({ bookId: 1 })
setSchema.index({ 'units.qrCode': 1 })

// Add method to get availability counts
setSchema.methods.getAvailabilityCounts = function() {
  const total = this.units.length
  const available = this.units.filter(unit => unit.status === 'available').length
  const borrowed = this.units.filter(unit => unit.status === 'borrowed').length
  const maintenance = this.units.filter(unit => unit.status === 'maintenance').length
  const lost = this.units.filter(unit => unit.status === 'lost').length

  return {
    total,
    available,
    borrowed,
    maintenance,
    lost,
    availabilityRatio: `${available}/${total}`
  }
}

// Add virtual for quick availability check
setSchema.virtual('availability').get(function() {
  return this.getAvailabilityCounts()
})

export default mongoose.model('Set', setSchema) 