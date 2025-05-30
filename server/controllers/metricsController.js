import BookRequest from '../models/BookRequest.js'
import StockFeedback from '../models/StockFeedback.js'
import Suggestion from '../models/Suggestion.js'

export const getFeedbackMetrics = async (req, res) => {
  try {
    const studentId = req.user._id
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    // Get all requests for this student
    const [bookRequests, stockFeedback, suggestions] = await Promise.all([
      BookRequest.find({ student: studentId }),
      StockFeedback.find({ student: studentId }),
      Suggestion.find({ student: studentId })
    ])

    // Total Requests
    const totalRequests = {
      all: bookRequests.length + stockFeedback.length + suggestions.length,
      thisMonth: [...bookRequests, ...stockFeedback, ...suggestions]
        .filter(item => new Date(item.createdAt) > thirtyDaysAgo).length
    }

    // Approval Rate
    const approvedRequests = [
      ...bookRequests.filter(req => req.status === 'approved'),
      ...stockFeedback.filter(feed => feed.status === 'resolved'),
      ...suggestions.filter(sug => sug.status === 'implemented')
    ].length

    const completedRequests = [
      ...bookRequests.filter(req => req.status !== 'pending'),
      ...stockFeedback.filter(feed => feed.status !== 'pending'),
      ...suggestions.filter(sug => sug.status !== 'pending')
    ].length

    const approvalRate = completedRequests > 0 
      ? Math.round((approvedRequests / completedRequests) * 100)
      : 0

    // Average Response Time
    const responseTimes = [
      ...bookRequests,
      ...stockFeedback,
      ...suggestions
    ]
      .filter(item => item.reviewedAt)
      .map(item => {
        const created = new Date(item.createdAt)
        const reviewed = new Date(item.reviewedAt)
        return reviewed - created
      })

    const avgResponseTime = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length / (1000 * 60 * 60)) // Convert to hours
      : 0

    res.json({
      success: true,
      data: {
        totalRequests: {
          value: totalRequests.all,
          trend: `+${totalRequests.thisMonth} this month`
        },
        approvalRate: {
          value: `${approvalRate}%`,
          trend: 'Last 30 days'
        },
        responseTime: {
          value: `${avgResponseTime}h`,
          trend: avgResponseTime < 48 ? 'Within SLA' : 'Above SLA'
        }
      }
    })
  } catch (error) {
    console.error('Error fetching metrics:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch metrics'
    })
  }
} 