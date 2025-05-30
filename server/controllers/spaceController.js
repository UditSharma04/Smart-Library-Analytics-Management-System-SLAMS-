import Space from '../models/Space.js'
import { catchAsync } from '../utils/catchAsync.js'

// Export all functions individually
export const getSpacesStatus = async (req, res) => {
  try {
    const spaceData = await Space.findOne()
    
    if (!spaceData) {
      return res.status(404).json({ message: 'Space data not found' })
    }

    res.json({
      libraryCapacity: spaceData.libraryCapacity,
      discussionRooms: spaceData.discussionRooms
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const bookDiscussionRoom = async (req, res) => {
  try {
    const { roomId } = req.params
    const { startTime, endTime } = req.body
    const studentId = req.user._id

    // Validate time slots
    const start = new Date(startTime)
    const end = new Date(endTime)
    const now = new Date()

    if (start < now || end <= start) {
      return res.status(400).json({ 
        message: 'Invalid time slot. Please select a future time slot with valid duration.' 
      })
    }

    // Find the space document and the specific room
    const space = await Space.findOne({
      'discussionRooms.roomId': roomId
    })

    if (!space) {
      return res.status(404).json({ message: 'Room not found' })
    }

    const room = space.discussionRooms.find(r => r.roomId === roomId)

    // Check if room is available
    if (room.status !== 'available') {
      return res.status(400).json({ message: 'Room is not available' })
    }

    // Check for conflicting bookings - only check active bookings
    const hasConflict = room.bookingHistory.some(booking => {
      // Skip ended or cancelled bookings
      if (booking.status === 'ended' || booking.status === 'cancelled') {
        return false
      }

      const bookingStart = new Date(booking.startTime)
      const bookingEnd = new Date(booking.endTime)
      return (
        (start >= bookingStart && start < bookingEnd) ||
        (end > bookingStart && end <= bookingEnd) ||
        (start <= bookingStart && end >= bookingEnd)
      )
    })

    if (hasConflict) {
      return res.status(400).json({ message: 'Time slot is already booked' })
    }

    // Update room status and add booking
    await Space.updateOne(
      { 'discussionRooms.roomId': roomId },
      {
        $set: {
          'discussionRooms.$.status': 'occupied',
          'discussionRooms.$.currentBooking': {
            student: studentId,
            startTime: start,
            endTime: end,
            status: 'active'  // Add status to currentBooking
          }
        }
      }
    )

    res.json({ 
      message: 'Room booked successfully',
      booking: {
        roomId,
        startTime: start,
        endTime: end
      }
    })

  } catch (error) {
    console.error('Error booking discussion room:', error)
    res.status(500).json({ message: 'Failed to book room' })
  }
}

export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { roomId } = req.params
    const now = new Date()
    const maxBookingTime = new Date(now.getTime() + 3 * 60 * 60 * 1000)
    
    const space = await Space.findOne({
      'discussionRooms.roomId': roomId
    })
    
    if (!space) {
      return res.status(404).json({ message: 'Room not found' })
    }

    const room = space.discussionRooms.find(r => r.roomId === roomId)
    
    // Generate available time slots
    const timeSlots = []
    let currentTime = new Date(now)
    currentTime.setMinutes(0, 0, 0)
    
    while (currentTime <= maxBookingTime) {
      const slotEnd = new Date(currentTime.getTime() + 60 * 60 * 1000)
      
      // Check if slot conflicts with existing bookings
      const isAvailable = !room.bookingHistory.some(booking => {
        const bookingStart = new Date(booking.startTime)
        const bookingEnd = new Date(booking.endTime)
        return (
          (currentTime >= bookingStart && currentTime < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd)
        )
      })
      
      if (isAvailable) {
        timeSlots.push({
          start: currentTime.toISOString(),
          end: slotEnd.toISOString()
        })
      }
      
      currentTime = slotEnd
    }
    
    res.json(timeSlots)
  } catch (error) {
    console.error('Error getting available time slots:', error)
    res.status(500).json({ message: 'Failed to get available time slots' })
  }
}

export const endSession = async (req, res) => {
  try {
    const { roomId } = req.params
    const studentId = req.user._id

    const space = await Space.findOne({
      'discussionRooms.roomId': roomId,
      'discussionRooms.currentBooking.student': studentId
    })

    if (!space) {
      return res.status(404).json({ message: 'Room not found or not booked by you' })
    }

    const room = space.discussionRooms.find(r => r.roomId === roomId)
    
    // Add current booking to history with ended status
    const currentBooking = room.currentBooking
    currentBooking.status = 'ended'
    room.bookingHistory.push(currentBooking)

    // Reset room status
    room.status = 'available'
    room.currentBooking = null

    await space.save()

    res.json({ message: 'Session ended successfully' })
  } catch (error) {
    console.error('Error ending session:', error)
    res.status(500).json({ message: 'Failed to end session' })
  }
}

export const getSpaceStats = async (req, res) => {
  try {
    const spaceData = await Space.findOne()
    if (!spaceData) {
      return res.status(404).json({ message: 'Space data not found' })
    }

    // Calculate discussion room availability
    const discussionRooms = spaceData.discussionRooms.reduce((acc, room) => ({
      available: acc.available + (room.status === 'available' ? 1 : 0),
      total: acc.total + 1,
      individual: {
        available: acc.individual.available + (
          room.capacity <= 4 && room.status === 'available' ? 1 : 0
        ),
        total: acc.individual.total + (room.capacity <= 4 ? 1 : 0)
      },
      group: {
        available: acc.group.available + (
          room.capacity > 4 && room.status === 'available' ? 1 : 0
        ),
        total: acc.group.total + (room.capacity > 4 ? 1 : 0)
      }
    }), {
      available: 0,
      total: 0,
      individual: { available: 0, total: 0 },
      group: { available: 0, total: 0 }
    })

    res.json({
      capacity: spaceData.libraryCapacity,
      studyRooms: discussionRooms,
      peakHours: calculatePeakHours(),
      popularSection: await getPopularSection()
    })
  } catch (error) {
    console.error('Error fetching space stats:', error)
    res.status(500).json({ message: 'Failed to fetch space statistics' })
  }
}

export const cancelBooking = async (req, res) => {
  try {
    const { roomId } = req.params
    const studentId = req.user._id

    const space = await Space.findOne({
      'discussionRooms.roomId': roomId,
      'discussionRooms.currentBooking.student': studentId
    })

    if (!space) {
      return res.status(404).json({ message: 'No active booking found for this room' })
    }

    const room = space.discussionRooms.find(r => r.roomId === roomId)
    
    // Add current booking to history with cancelled status
    const currentBooking = room.currentBooking
    currentBooking.status = 'cancelled'
    room.bookingHistory.push(currentBooking)

    // Reset room status
    room.status = 'available'
    room.currentBooking = null
    room.currentUser = null

    await space.save()

    res.json({ message: 'Booking cancelled successfully' })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    res.status(500).json({ message: 'Failed to cancel booking' })
  }
}

export const getBookingHistory = async (req, res) => {
  try {
    const studentId = req.user._id
    const space = await Space.findOne()
    
    if (!space) {
      return res.status(404).json({ message: 'Space data not found' })
    }

    // Collect all bookings for the student from all rooms
    const bookings = space.discussionRooms.reduce((acc, room) => {
      const roomBookings = room.bookingHistory
        .filter(booking => booking.student.toString() === studentId.toString())
        .map(booking => ({
          roomId: room.roomId,
          roomName: room.name,
          ...booking.toObject(),
          isActive: room.currentBooking?.student.toString() === studentId.toString()
        }))
      return [...acc, ...roomBookings]
    }, [])

    // Sort by start time, most recent first
    bookings.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))

    res.json(bookings)
  } catch (error) {
    console.error('Error fetching booking history:', error)
    res.status(500).json({ message: 'Failed to fetch booking history' })
  }
}

// Helper function to calculate peak hours
function calculatePeakHours() {
  const now = new Date()
  const hour = now.getHours()
  
  const peakHoursSchedule = [
    { start: 8, end: 10, traffic: 'Low', label: 'Morning Hours' },
    { start: 10, end: 12, traffic: 'Moderate', label: 'Late Morning' },
    { start: 12, end: 14, traffic: 'High', label: 'Lunch Hours' },
    { start: 14, end: 17, traffic: 'Peak', label: 'Afternoon' },
    { start: 17, end: 19, traffic: 'High', label: 'Evening' },
    { start: 19, end: 21, traffic: 'Moderate', label: 'Night' }
  ]

  const currentTimeSlot = peakHoursSchedule.find(
    slot => hour >= slot.start && hour < slot.end
  ) || { traffic: 'Low', label: 'Off Hours' }

  const quietestTime = peakHoursSchedule.find(slot => slot.traffic === 'Low')
  const busiestTime = peakHoursSchedule.find(slot => slot.traffic === 'Peak')

  return {
    time: currentTimeSlot.label,
    traffic: currentTimeSlot.traffic,
    quietest: `${quietestTime.start}AM - ${quietestTime.end}AM`,
    busiest: `${busiestTime.start}PM - ${busiestTime.end}PM`
  }
}