import mongoose from 'mongoose'

// Schema for tracking overall library capacity
const libraryCapacitySchema = new mongoose.Schema({
  current: {
    type: Number,
    required: true,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 500
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
})

// Schema for discussion room bookings
const bookingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 3
  },
  purpose: {
    type: String,
    required: true
  },
  memberCount: {
    type: Number,
    required: true,
    min: 2
  }
})

// Schema for discussion rooms
const discussionRoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  },
  features: [String],
  currentBooking: {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    startTime: Date,
    endTime: Date,
    purpose: String,
    memberCount: Number,
    status: {
      type: String,
      enum: ['active', 'ended', 'cancelled'],
      default: 'active'
    }
  },
  bookingHistory: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    startTime: Date,
    endTime: Date,
    purpose: String,
    memberCount: Number,
    status: {
      type: String,
      enum: ['completed', 'ended', 'cancelled'],
      required: true
    }
  }]
})

// Main spaces schema
const spaceSchema = new mongoose.Schema({
  name: String,
  type: String,
  capacity: Number,
  libraryCapacity: {
    current: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  discussionRooms: [discussionRoomSchema]
}, {
  timestamps: true
})

// Method to validate booking time
discussionRoomSchema.methods.validateBooking = function(startTime, duration, memberCount) {
  const now = new Date()
  const bookingStart = new Date(startTime)
  const bookingEnd = new Date(bookingStart.getTime() + duration * 60 * 60 * 1000)
  
  // Check if room is available
  if (this.status !== 'available') {
    throw new Error('Room is not available')
  }

  // Check if member count is valid
  if (memberCount > this.capacity) {
    throw new Error(`Maximum ${this.capacity} members allowed`)
  }

  if (memberCount < 2) {
    throw new Error('Minimum 2 members required')
  }

  // Check if booking is in the past
  if (bookingStart < now) {
    throw new Error('Cannot book for past time')
  }

  // Check if booking is within 3 hours from now
  const maxBookingTime = new Date(now.getTime() + 3 * 60 * 60 * 1000)
  if (bookingStart > maxBookingTime) {
    throw new Error('Can only book slots within next 3 hours')
  }

  // Check if booking extends beyond library closing time (8 PM)
  const closeTime = new Date(bookingStart)
  closeTime.setHours(20, 0, 0, 0)
  if (bookingEnd > closeTime) {
    throw new Error('Booking cannot extend beyond library closing time (8 PM)')
  }

  // Check if room is already booked for this time
  if (this.currentBooking) {
    const currentEnd = new Date(this.currentBooking.endTime)
    if (bookingStart < currentEnd) {
      throw new Error('Room is already booked for this time slot')
    }
  }

  return true
}

// Method to create a booking
discussionRoomSchema.methods.book = async function(bookingData) {
  try {
    // Validate booking
    this.validateBooking(bookingData.startTime, bookingData.duration, bookingData.memberCount)

    // Create booking object
    const booking = {
      ...bookingData,
      endTime: new Date(new Date(bookingData.startTime).getTime() + bookingData.duration * 60 * 60 * 1000)
    }

    // Update room status and set current booking
    this.status = 'in-use'
    this.currentBooking = booking
    this.currentUser = bookingData.student  // Set currentUser to the booking student
    this.bookingHistory.push(booking)

    return booking
  } catch (error) {
    throw error
  }
}

// Method to end session early
discussionRoomSchema.methods.endSession = async function() {
  if (this.status !== 'in-use' || !this.currentBooking) {
    throw new Error('No active session to end')
  }

  // Add current booking to history
  this.bookingHistory.push(this.currentBooking)

  // Reset room status
  this.status = 'available'
  this.currentBooking = null
  this.currentUser = null

  return true
}

const Space = mongoose.model('Space', spaceSchema)

export default Space 