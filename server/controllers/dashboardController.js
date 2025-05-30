import Book from '../models/Book.js'
import Borrow from '../models/Borrow.js'
import Student from '../models/Student.js'
import Space from '../models/Space.js'
import { calculateFine } from '../utils/dateUtils.js'
import Fine from '../models/Fine.js'

const calculateTotalFine = (borrow) => {
  const now = new Date()
  const dueDate = new Date(borrow.dueDate)
  
  if (now <= dueDate) return 0
  
  const daysLate = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24))
  const baseFine = borrow.fineStructure?.baseFine || 5 // Default ₹5 per day
  
  let totalFine = daysLate * baseFine

  // Add penalties if any
  if (borrow.fineStructure?.penalties) {
    const { weekend, holiday, damage } = borrow.fineStructure.penalties
    if (borrow.returnCondition === 'damaged' && damage) {
      totalFine += damage
    }
    // Add other penalty calculations as needed
  }

  return totalFine
}

export const getDashboardStats = async (req, res) => {
  try {
    const studentId = req.user._id

    // Get recent borrows for the student
    const recentBorrows = await Borrow.find({ student: studentId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: 'book',
        select: 'title author coverImage isbn'
      })
      .lean()

    // Transform the data for frontend
    const recentBooks = recentBorrows.map(borrow => ({
      id: borrow.book._id,
      title: borrow.book.title,
      author: borrow.book.author,
      coverImage: borrow.book.coverImage,
      isbn: borrow.book.isbn,
      borrowDate: borrow.borrowDate,
      dueDate: borrow.dueDate,
      status: borrow.status
    }))

    // Get all fines for the student
    const fines = await Fine.find({
      student: studentId,
      status: 'pending'
    }).lean()

    // Calculate fine totals by type
    const fineDetails = fines.reduce((acc, fine) => ({
      total: acc.total + fine.amount,
      overdue: acc.overdue + (fine.type === 'overdue' ? fine.amount : 0),
      damage: acc.damage + (fine.type === 'damage' ? fine.amount : 0),
      unpaid: acc.total + fine.amount // All pending fines are unpaid
    }), { total: 0, overdue: 0, damage: 0, unpaid: 0 })

    // Get active borrows
    const activeBorrows = await Borrow.find({
      student: studentId,
      status: 'active'
    })
    .populate('book', 'title author coverImage')
    .lean()

    // Calculate reading progress
    const totalProgress = activeBorrows.reduce((acc, curr) => acc + (curr.progress || 0), 0)
    const avgProgress = activeBorrows.length ? Math.round(totalProgress / activeBorrows.length) : 0

    // Count books due soon (within next 3 days)
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    
    const dueSoonCount = activeBorrows.filter(book => 
      book.dueDate <= threeDaysFromNow && book.dueDate > new Date()
    ).length

    const response = {
      recentBooks,
      books: activeBorrows,
      fines: fineDetails,
      readingProgress: avgProgress,
      dueSoon: dueSoonCount
    }

    console.log('Sending response with fines:', response)
    res.json(response)

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' })
  }
}

export const getLibraryStats = async (req, res) => {
  try {
    // Get library capacity and discussion rooms from Space model
    const spaceStats = await Space.findOne().select('libraryCapacity discussionRooms').lean()
    
    // Calculate discussion room availability
    const discussionRooms = spaceStats.discussionRooms.reduce((acc, room) => ({
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

    // Calculate peak hours based on historical data and current time
    const now = new Date()
    const hour = now.getHours()
    
    // Define peak hours schedule
    const peakHoursSchedule = [
      { start: 8, end: 10, traffic: 'Low', label: 'Morning Hours' },
      { start: 10, end: 12, traffic: 'Moderate', label: 'Late Morning' },
      { start: 12, end: 14, traffic: 'High', label: 'Lunch Hours' },
      { start: 14, end: 17, traffic: 'Peak', label: 'Afternoon' },
      { start: 17, end: 19, traffic: 'High', label: 'Evening' },
      { start: 19, end: 21, traffic: 'Moderate', label: 'Night' }
    ]

    // Find current time slot
    const currentTimeSlot = peakHoursSchedule.find(
      slot => hour >= slot.start && hour < slot.end
    ) || { traffic: 'Low', label: 'Off Hours' }

    // Find quietest and busiest times
    const quietestTime = peakHoursSchedule.find(slot => slot.traffic === 'Low')
    const busiestTime = peakHoursSchedule.find(slot => slot.traffic === 'Peak')

    res.json({
      capacity: spaceStats.libraryCapacity,
      studyRooms: {
        available: discussionRooms.available,
        total: discussionRooms.total,
        individual: discussionRooms.individual,
        group: discussionRooms.group
      },
      peakHours: {
        time: currentTimeSlot.label,
        traffic: currentTimeSlot.traffic,
        quietest: `${quietestTime.start}AM - ${quietestTime.end}AM`,
        busiest: `${busiestTime.start}PM - ${busiestTime.end}PM`
      },
      popularSection: await getPopularSection()
    })

  } catch (error) {
    console.error('Error fetching library stats:', error)
    res.status(500).json({ message: 'Failed to fetch library stats' })
  }
}

// Helper function to get popular section
async function getPopularSection() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const popularSection = await Borrow.aggregate([
    {
      $match: {
        borrowDate: { $gte: today }
      }
    },
    {
      $lookup: {
        from: 'books',
        localField: 'book',
        foreignField: '_id',
        as: 'bookDetails'
      }
    },
    {
      $unwind: '$bookDetails'
    },
    {
      $group: {
        _id: '$bookDetails.category',
        checkouts: { $sum: 1 }
      }
    },
    {
      $sort: { checkouts: -1 }
    },
    {
      $limit: 1
    }
  ])

  return {
    name: popularSection[0]?._id || 'No checkouts today',
    checkouts: popularSection[0]?.checkouts || 0
  }
}

export const getNotifications = async (req, res) => {
  try {
    const studentId = req.user._id
    const now = new Date()

    // Get active borrows
    const borrows = await Borrow.find({
      student: studentId,
      status: 'active'
    })
    .populate('book', 'title')
    .lean()

    const notifications = []

    // Due date notifications
    borrows.forEach(borrow => {
      const daysUntilDue = Math.ceil((borrow.dueDate - now) / (1000 * 60 * 60 * 24))
      
      if (daysUntilDue <= 0) {
        notifications.push({
          _id: `due_${borrow._id}`,
          type: 'due',
          message: `"${borrow.book.title}" is overdue!`,
          priority: 'high',
          actionUrl: `/borrowed/${borrow._id}`,
          actionText: 'Renew Now'
        })
      } else if (daysUntilDue <= 2) {
        notifications.push({
          _id: `due_soon_${borrow._id}`,
          type: 'due',
          message: `"${borrow.book.title}" is due in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`,
          priority: 'medium',
          actionUrl: `/borrowed/${borrow._id}`,
          actionText: 'View Details'
        })
      }
    })

    // Fine notifications
    const totalFines = borrows.reduce((acc, curr) => acc + calculateFine(curr.dueDate), 0)
    if (totalFines > 0) {
      notifications.push({
        _id: 'fine',
        type: 'fine',
        message: `You have ₹${totalFines} in outstanding fines`,
        priority: 'medium',
        actionUrl: '/fines',
        actionText: 'Pay Now'
      })
    }

    res.json(notifications)

  } catch (error) {
    console.error('Error fetching notifications:', error)
    res.status(500).json({ message: 'Failed to fetch notifications' })
  }
} 