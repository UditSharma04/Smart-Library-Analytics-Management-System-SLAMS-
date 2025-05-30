import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  UsersIcon,
  ClockIcon,
  QrCodeIcon,
  ChartBarIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

// Discussion room data with features
const discussionRooms = [
  {
    id: 'DR1',
    name: 'Discussion Room 1',
    capacity: 6,
    features: ['Whiteboard', 'TV Screen'],
    status: 'available',
    currentOccupants: 0,
    timeRemaining: null
  },
  {
    id: 'DR2',
    name: 'Discussion Room 2',
    capacity: 8,
    features: ['Whiteboard', 'Projector'],
    status: 'in-use',
    currentOccupants: 6,
    timeRemaining: '45 min'
  },
  {
    id: 'DR3',
    name: 'Discussion Room 3',
    capacity: 4,
    features: ['Whiteboard'],
    status: 'available',
    currentOccupants: 0,
    timeRemaining: null
  },
  {
    id: 'DR4',
    name: 'Discussion Room 4',
    capacity: 6,
    features: ['TV Screen'],
    status: 'maintenance',
    currentOccupants: 0,
    timeRemaining: null
  },
  {
    id: 'DR5',
    name: 'Discussion Room 5',
    capacity: 8,
    features: ['Whiteboard', 'TV Screen'],
    status: 'in-use',
    currentOccupants: 4,
    timeRemaining: '120 min'
  }
]

export default function LibrarySpace() {
  const [occupancy, setOccupancy] = useState({
    current: 156,
    total: 300,
    percentage: 52,
    status: 'moderate' // low, moderate, high
  })

  const [peakHours, setPeakHours] = useState({
    current: false,
    nextPeak: '2:00 PM',
    estimatedWait: '~15 min'
  })

  const getOccupancyColor = (percentage) => {
    if (percentage < 50) return 'text-green-500'
    if (percentage < 80) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getRoomStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700'
      case 'in-use': return 'bg-yellow-100 text-yellow-700'
      case 'maintenance': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Occupancy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-gray-800">
            Library Occupancy
          </h2>
          <div className="flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">Real-time tracking</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Occupancy Meter */}
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
                <circle
                  className={getOccupancyColor(occupancy.percentage)}
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${occupancy.percentage * 2.83} 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="50"
                  className="text-3xl font-bold"
                  textAnchor="middle"
                  dy=".3em"
                >
                  {occupancy.percentage}%
                </text>
              </svg>
            </div>
          </div>

          {/* Occupancy Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Current Occupancy</span>
              </div>
              <span className="font-mono font-semibold">
                {occupancy.current}/{occupancy.total}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Next Peak Time</span>
              </div>
              <span className="font-mono">{peakHours.nextPeak}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ExclamationCircleIcon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Estimated Wait</span>
              </div>
              <span className="font-mono">{peakHours.estimatedWait}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Discussion Rooms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-gray-800">
            Discussion Rooms
          </h2>
          <button className="text-sm text-primary hover:text-primary-dark">
            Book a Room
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discussionRooms.map((room) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border rounded-lg p-4 hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-700">{room.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomStatusColor(room.status)}`}>
                  {room.status === 'in-use' ? `${room.timeRemaining} left` : room.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Capacity</span>
                  <span>{room.currentOccupants}/{room.capacity}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {room.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {room.status === 'available' && (
                  <button className="w-full mt-2 flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    <QrCodeIcon className="w-4 h-4" />
                    <span>Quick Book</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
} 