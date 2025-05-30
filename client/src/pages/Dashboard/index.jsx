import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  BookOpenIcon,
  ClockIcon,
  BellIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import QuickStats from './components/QuickStats'
import BorrowedBooks from './components/BorrowedBooks'
import LibrarySpace from './components/LibrarySpace'
import ActivityTimeline from './components/ActivityTimeline'
import QuickActions from './components/QuickActions'
import UpcomingDues from './components/UpcomingDues'
import SearchBox from '../../components/SearchBox'
import axios from '../../utils/axios'
import { toast } from 'react-hot-toast'

function Dashboard() {
  const navigate = useNavigate()
  const [greeting, setGreeting] = useState('')
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user'))
  const [notifications, setNotifications] = useState([])
  const [dashboardData, setDashboardData] = useState({
    borrowedBooks: [],
    fines: {
      total: 0,
      overdue: 0,
      damage: 0,
      unpaid: 0
    },
    readingProgress: 0,
    dueSoon: 0
  })
  const [libraryStats, setLibraryStats] = useState({
    capacity: { current: 0, total: 0 },
    studyRooms: {
      available: 0,
      total: 0,
      individual: { available: 0, total: 0 },
      group: { available: 0, total: 0 }
    },
    peakHours: {
      time: '',
      traffic: '',
      quietest: '',
      busiest: ''
    },
    popularSection: { name: '', checkouts: 0 }
  })

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [
        notificationsRes,
        borrowedBooksRes,
        libraryStatsRes
      ] = await Promise.all([
        axios.get('/dashboard/notifications'),
        axios.get('/dashboard/stats'),
        axios.get('/dashboard/library-stats')
      ])

      // Add console logs to debug the response
      console.log('Dashboard Stats Response:', borrowedBooksRes.data)
      console.log('Fines Data:', borrowedBooksRes.data.fines)

      setNotifications(notificationsRes.data)
      setDashboardData({
        borrowedBooks: borrowedBooksRes.data.books,
        fines: borrowedBooksRes.data.fines || {
          total: 0,
          overdue: 0,
          damage: 0,
          unpaid: 0
        },
        readingProgress: borrowedBooksRes.data.readingProgress,
        dueSoon: borrowedBooksRes.data.dueSoon
      })
      setLibraryStats(libraryStatsRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    // Set up real-time updates using WebSocket or polling
    const updateInterval = setInterval(fetchDashboardData, 60000) // Update every minute
    return () => clearInterval(updateInterval)
  }, [])

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) return 'Good Morning'
      if (hour < 17) return 'Good Afternoon'
      return 'Good Evening'
    }
    setGreeting(getGreeting())
  }, [])

  // Update the Library Stats section with more detailed metrics
  const metrics = [
    {
      label: 'Library Capacity',
      value: `${Math.round((libraryStats.capacity.current / libraryStats.capacity.total) * 100)}%`,
      trend: `${libraryStats.capacity.current} of ${libraryStats.capacity.total} seats occupied`,
      icon: UserGroupIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Study Rooms',
      value: `${libraryStats.studyRooms?.available || 0}/${libraryStats.studyRooms?.total || 0}`,
      trend: `${(libraryStats.studyRooms?.total || 0) - (libraryStats.studyRooms?.available || 0)} rooms occupied`,
      icon: BookOpenIcon,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      details: [
        { 
          label: 'Individual Rooms', 
          value: `${libraryStats.studyRooms?.individual?.available || 0}/${libraryStats.studyRooms?.individual?.total || 0} available` 
        },
        { 
          label: 'Group Rooms', 
          value: `${libraryStats.studyRooms?.group?.available || 0}/${libraryStats.studyRooms?.group?.total || 0} available` 
        }
      ]
    },
    {
      label: 'Peak Hours',
      value: libraryStats.peakHours?.time || 'N/A',
      trend: `Current traffic: ${libraryStats.peakHours?.traffic || 'Unknown'}`,
      icon: ClockIcon,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      details: [
        { label: 'Quietest Time', value: libraryStats.peakHours?.quietest || 'N/A' },
        { label: 'Busiest Time', value: libraryStats.peakHours?.busiest || 'N/A' }
      ]
    },
    {
      label: 'Popular Section',
      value: libraryStats.popularSection?.name || 'N/A',
      trend: `${libraryStats.popularSection?.checkouts || 0} checkouts today`,
      icon: ChartBarIcon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      details: [
        { label: 'Most Borrowed', value: libraryStats.popularSection?.name || 'N/A' },
        { label: 'Trending', value: libraryStats.popularSection?.trend || 'N/A' }
      ]
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 shadow-lg text-white"
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">
              {greeting}, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-white/80">
              Welcome to your library dashboard
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">Student ID</p>
            <p className="font-mono font-semibold">{user?.registerNumber}</p>
          </div>
        </div>
        <div className="mt-4">
          <SearchBox />
        </div>
      </motion.div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold text-gray-800 flex items-center gap-2">
              <BellIcon className="w-5 h-5 text-accent" />
              Important Notifications
            </h2>
          </div>
          <div className="space-y-3">
            {notifications.map(notification => (
              <div
                key={notification._id}
                className={`p-4 rounded-lg border flex items-center justify-between
                  ${notification.priority === 'high' ? 'bg-red-50 border-red-200' :
                    notification.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'}`}
              >
                <span className="text-gray-800">{notification.message}</span>
                <button 
                  className="text-sm text-gray-600 hover:text-gray-800"
                  onClick={() => navigate(notification.actionUrl)}
                >
                  {notification.actionText || 'View'}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <QuickStats
        borrowedCount={dashboardData.borrowedBooks.length}
        dueSoonCount={dashboardData.dueSoon}
        readingProgress={dashboardData.readingProgress}
        totalFines={dashboardData.fines}
      />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Borrowed Books */}
        <div className="lg:col-span-2">
          <BorrowedBooks books={dashboardData.borrowedBooks} />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-heading font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: BookOpenIcon, label: 'Browse Books', path: '/library' },
              { icon: UserGroupIcon, label: 'Study Spaces', path: '/spaces', subtext: 'Book rooms & spaces' },
              { icon: ChartBarIcon, label: 'My Progress', path: '/progress' },
              { icon: ExclamationCircleIcon, label: 'Report Issue', path: '/feedback' },
              { icon: AcademicCapIcon, label: 'Resources', path: '/resources' }
            ].map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors min-h-[100px]"
                onClick={() => navigate(action.path)}
              >
                <action.icon className="w-6 h-6 text-primary mb-2" />
                <span className="text-sm font-medium text-gray-800">{action.label}</span>
                {action.subtext && (
                  <span className="text-[10px] text-gray-500 mt-1">{action.subtext}</span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Library Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div className={`text-xs font-medium ${metric.color} flex items-center gap-1`}>
                {metric.trend}
              </div>
            </div>
            
            <h3 className="text-sm text-gray-600 mb-1">{metric.label}</h3>
            <div className="text-2xl font-semibold font-mono mb-3">{metric.value}</div>
            
            {metric.details && (
              <div className="pt-3 border-t border-gray-100 mt-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {metric.details.map(detail => (
                  <div key={detail.label} className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">{detail.label}</span>
                    <span className="font-medium text-gray-700">{detail.value}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default Dashboard 