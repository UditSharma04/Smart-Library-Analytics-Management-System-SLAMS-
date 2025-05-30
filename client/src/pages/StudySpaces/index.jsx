import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  UsersIcon,
  ClockIcon,
  QrCodeIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import axios from '../../utils/axios'

const discussionRooms = [
  {
    id: 'DR1',
    name: 'Discussion Room 1',
    capacity: 8,
    status: 'available'
  },
  {
    id: 'DR2',
    name: 'Discussion Room 2',
    capacity: 8,
    status: 'in-use'
  },
  {
    id: 'DR3',
    name: 'Discussion Room 3',
    capacity: 6,
    status: 'available'
  },
  {
    id: 'DR4',
    name: 'Discussion Room 4',
    capacity: 6,
    status: 'in-use'
  },
  {
    id: 'DR5',
    name: 'Discussion Room 5',
    capacity: 8,
    status: 'available'
  }
]

export default function StudySpaces() {
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [spaceData, setSpaceData] = useState({
    libraryCapacity: {
      current: 0,
      total: 0
    },
    discussionRooms: []
  })
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [bookingForm, setBookingForm] = useState({
    startTime: '',
    endTime: '',
    purpose: '',
    members: ''
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  // Fetch space data
  const fetchSpaceData = async () => {
    try {
      const { data } = await axios.get('/spaces/status')
      console.log('Space data:', data)
      setSpaceData(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching space data:', error)
      toast.error('Failed to fetch space data')
      setLoading(false)
    }
  }

  // Fetch available time slots
  const fetchTimeSlots = async (roomId) => {
    try {
      const { data } = await axios.get(`/spaces/rooms/${roomId}/time-slots`)
      console.log('Time slots:', data)
      
      // Get current time rounded to nearest 30 minutes
      const now = new Date()
      now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30, 0, 0)

      // Get max booking time (3 hours from now)
      const maxBookingTime = new Date(now.getTime() + 3 * 60 * 60 * 1000)

      // Get library closing time
      const closeTime = new Date(now)
      closeTime.setHours(20, 0, 0, 0)

      // Generate available time slots
      const timeSlots = []
      let currentSlot = new Date(now)

      while (currentSlot < maxBookingTime && currentSlot < closeTime) {
        timeSlots.push({
          startTime: currentSlot.toISOString(),
          endTime: new Date(currentSlot.getTime() + 30 * 60 * 1000).toISOString()
        })
        currentSlot = new Date(currentSlot.getTime() + 30 * 60 * 1000)
      }

      setAvailableTimeSlots(timeSlots)
    } catch (error) {
      console.error('Error fetching time slots:', error)
      toast.error('Failed to fetch available time slots')
    }
  }

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const { data } = await axios.get('/auth/profile')
      setUser(data)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  useEffect(() => {
    fetchSpaceData()
    fetchUserData()
    // Refresh data every minute
    const interval = setInterval(fetchSpaceData, 60000)
    return () => clearInterval(interval)
  }, [])

  // When a room is selected, fetch its available time slots
  useEffect(() => {
    if (selectedRoom) {
      fetchTimeSlots(selectedRoom.roomId)
    }
  }, [selectedRoom])

  const handleBookRoom = async (e) => {
    e.preventDefault()
    if (!selectedRoom || !bookingForm.startTime || !bookingForm.endTime) {
      toast.error('Please select a time slot')
      return
    }

    try {
      const response = await axios.post(`/spaces/rooms/${selectedRoom.roomId}/book`, {
        startTime: bookingForm.startTime,
        endTime: bookingForm.endTime
      })

      console.log('Booking response:', response.data)
      toast.success('Room booked successfully')
      setShowBookingModal(false)
      fetchSpaceData() // Refresh space data
    } catch (error) {
      console.error('Error booking room:', error)
      toast.error(error.response?.data?.message || 'Failed to book room')
    }
  }

  const handleEndSession = async (roomId) => {
    try {
      await axios.post(`/spaces/rooms/${roomId}/end-session`)
      toast.success('Session ended successfully')
      fetchSpaceData()  // Refresh data
    } catch (error) {
      console.error('Error ending session:', error)
      toast.error(error.response?.data?.message || 'Failed to end session')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-heading font-bold text-gray-800 mb-2">
          Study Spaces
        </h1>
        <p className="text-gray-600">
          Book discussion rooms and check space availability
        </p>
      </div>

      {/* Library Capacity */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Library Capacity
            </h2>
            <p className="text-sm text-gray-600">
              Current occupancy and available seats
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-semibold">
              {spaceData.libraryCapacity.current}/{spaceData.libraryCapacity.total}
            </div>
            <div className="text-sm text-gray-600">
              seats occupied
            </div>
          </div>
        </div>
      </div>

      {/* Discussion Rooms */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spaceData.discussionRooms.map((room) => (
          <motion.div
            key={room.roomId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {room.name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-4 h-4" />
                  <span>Capacity: {room.capacity} people</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    room.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="capitalize">{room.status}</span>
                </div>
                {room.currentBooking && (
                  <div className="text-xs text-gray-500">
                    Until: {new Date(room.currentBooking.endTime).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 pb-6">
              {room.currentBooking?.student === user?._id ? (
                // Show End Session button if current user is the one who booked
                <button
                  onClick={() => handleEndSession(room.roomId)}
                  className="w-full py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  End Session Early
                </button>
              ) : (
                // Show Book Now button for available rooms
                <button
                  onClick={() => {
                    setSelectedRoom(room)
                    setShowBookingModal(true)
                  }}
                  disabled={room.status !== 'available'}
                  className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {room.status === 'available' ? 'Book Now' : 'Currently Occupied'}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Book {selectedRoom.name}
              </h3>
              
              <form onSubmit={handleBookRoom} className="space-y-6">
                {/* Time Slots */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <select
                    value={bookingForm.startTime}
                    onChange={(e) => setBookingForm(prev => ({
                      ...prev,
                      startTime: e.target.value,
                      endTime: new Date(new Date(e.target.value).getTime() + 60 * 60 * 1000).toISOString()
                    }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    required
                  >
                    <option value="">Select start time</option>
                    {availableTimeSlots.map((slot, index) => (
                      <option key={index} value={slot.startTime}>
                        {new Date(slot.startTime).toLocaleTimeString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    value={bookingForm.duration}
                    onChange={(e) => setBookingForm(prev => ({
                      ...prev,
                      duration: e.target.value,
                      endTime: new Date(new Date(prev.startTime).getTime() + parseInt(e.target.value) * 60 * 60 * 1000).toISOString()
                    }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    required
                  >
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose
                  </label>
                  <input
                    type="text"
                    value={bookingForm.purpose}
                    onChange={(e) => setBookingForm(prev => ({
                      ...prev,
                      purpose: e.target.value
                    }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="e.g., Group Study, Project Discussion"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Members
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedRoom.capacity}
                    value={bookingForm.members}
                    onChange={(e) => setBookingForm(prev => ({
                      ...prev,
                      members: e.target.value
                    }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum capacity: {selectedRoom.capacity} people
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 