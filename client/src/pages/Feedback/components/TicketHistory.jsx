import { useState, useEffect } from 'react'
import { getAllMyTickets, getMySuggestions } from '../../../utils/api'
import { toast } from 'react-hot-toast'

export default function TicketHistory() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      // Fetch both tickets and suggestions
      const [ticketsResponse, suggestionsResponse] = await Promise.all([
        getAllMyTickets(),
        getMySuggestions()
      ])

      if (ticketsResponse.success && suggestionsResponse.success) {
        // Format suggestions to match ticket structure
        const formattedSuggestions = suggestionsResponse.data.map(suggestion => ({
          ...suggestion,
          type: 'Suggestion',
          title: `${suggestion.category} Suggestion`
        }))

        // Combine all tickets and sort by date
        const allTickets = [
          ...ticketsResponse.data,
          ...formattedSuggestions
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        setTickets(allTickets)
      } else {
        toast.error('Failed to fetch tickets')
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
      toast.error('Failed to load ticket history')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'border-yellow-500 bg-yellow-50'
      case 'approved':
      case 'resolved':
      case 'implemented':
        return 'border-green-500 bg-green-50'
      case 'rejected':
        return 'border-red-500 bg-red-50'
      case 'reviewed':
      case 'in-progress':
        return 'border-blue-500 bg-blue-50'
      default:
        return 'border-gray-500 bg-gray-50'
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
      case 'resolved':
      case 'implemented':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'reviewed':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Book Request':
        return 'bg-purple-100 text-purple-800'
      case 'Stock Feedback':
        return 'bg-indigo-100 text-indigo-800'
      case 'Suggestion':
        return 'bg-teal-100 text-teal-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No tickets found. Submit a request, feedback, or suggestion to see it here.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div
          key={ticket._id}
          className={`bg-white rounded-lg p-4 border-l-4 ${getStatusColor(ticket.status)}`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(ticket.type)}`}>
                {ticket.type}
              </span>
              <h3 className="font-medium text-gray-900 mt-1">{ticket.title}</h3>
              {ticket.type === 'Stock Feedback' && (
                <div className="text-sm text-gray-600 mt-1">
                  Status: {ticket.currentStatus} • Demand: {ticket.demandIndicator}
                </div>
              )}
              {ticket.type === 'Suggestion' && (
                <div className="text-sm text-gray-600 mt-1">
                  Priority: {ticket.priority} • Timeline: {ticket.timeline}
                </div>
              )}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
              ${getStatusBadgeColor(ticket.status)}`}
            >
              {ticket.status}
            </span>
          </div>
          {ticket.type === 'Suggestion' && (
            <div className="text-sm text-gray-600 mt-2 border-t border-gray-100 pt-2">
              <p className="font-medium">Details:</p>
              <p>{ticket.details}</p>
              {ticket.impact && (
                <>
                  <p className="font-medium mt-2">Expected Impact:</p>
                  <p>{ticket.impact}</p>
                </>
              )}
            </div>
          )}
          <div className="text-sm text-gray-500 mb-2 mt-2">
            Submitted on {new Date(ticket.createdAt).toLocaleDateString()}
          </div>
          {ticket.adminResponse && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Response: </span>
                {ticket.adminResponse}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 