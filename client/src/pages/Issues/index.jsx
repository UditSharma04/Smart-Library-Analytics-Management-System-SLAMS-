import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  ChevronDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

// Dummy data - replace with actual API call
const dummyTickets = [
  {
    _id: '1',
    type: 'Book Request',
    title: 'Request for Advanced Database Systems',
    details: 'Need more copies for the Database Management course',
    status: 'pending',
    priority: 'high',
    createdAt: '2024-02-15T10:30:00Z',
    student: {
      name: 'John Doe',
      registerNumber: '22BCE1962',
      email: 'john.doe2022@vitstudent.ac.in'
    },
    adminResponse: ''
  },
  {
    _id: '2',
    type: 'Stock Feedback',
    title: 'Damaged Books in Computer Networks Section',
    details: 'Several books have torn pages and missing covers',
    status: 'in-progress',
    currentStatus: 'Poor',
    demandIndicator: 'High',
    createdAt: '2024-02-14T15:45:00Z',
    student: {
      name: 'Jane Smith',
      registerNumber: '22BCE1963',
      email: 'jane.smith2022@vitstudent.ac.in'
    },
    adminResponse: 'Scheduled for replacement next week'
  },
  {
    _id: '3',
    type: 'Suggestion',
    title: 'Extended Library Hours',
    details: 'Request for 24/7 library access during exam weeks',
    status: 'approved',
    priority: 'medium',
    timeline: 'Next Semester',
    impact: 'Will benefit students preparing for exams',
    createdAt: '2024-02-13T09:15:00Z',
    student: {
      name: 'Alice Johnson',
      registerNumber: '22BCE1964',
      email: 'alice.johnson2022@vitstudent.ac.in'
    },
    adminResponse: 'Approved for implementation during final exams'
  }
]

export default function Issues() {
  const [tickets, setTickets] = useState(dummyTickets)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedTicket, setExpandedTicket] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'border-yellow-400 bg-yellow-400/10'
      case 'approved':
      case 'resolved':
      case 'implemented':
        return 'border-green-400 bg-green-400/10'
      case 'rejected':
        return 'border-red-400 bg-red-400/10'
      case 'reviewed':
      case 'in-progress':
        return 'border-blue-400 bg-blue-400/10'
      default:
        return 'border-gray-400 bg-gray-400/10'
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-400/10 text-yellow-400'
      case 'approved':
      case 'resolved':
      case 'implemented':
        return 'bg-green-400/10 text-green-400'
      case 'rejected':
        return 'bg-red-400/10 text-red-400'
      case 'reviewed':
      case 'in-progress':
        return 'bg-blue-400/10 text-blue-400'
      default:
        return 'bg-gray-400/10 text-gray-400'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Book Request':
        return 'bg-purple-400/10 text-purple-400'
      case 'Stock Feedback':
        return 'bg-indigo-400/10 text-indigo-400'
      case 'Suggestion':
        return 'bg-teal-400/10 text-teal-400'
      default:
        return 'bg-gray-400/10 text-gray-400'
    }
  }

  const handleStatusChange = async (ticketId, newStatus, response) => {
    try {
      // In real implementation, make API call here
      setTickets(tickets.map(ticket => 
        ticket._id === ticketId 
          ? { ...ticket, status: newStatus, adminResponse: response }
          : ticket
      ))
      toast.success('Ticket status updated successfully')
    } catch (error) {
      toast.error('Failed to update ticket status')
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.student.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.student.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === 'all') return matchesSearch
    return matchesSearch && ticket.status === filter
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-white mb-4">
          Issue Management
        </h1>

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <motion.div
              key={ticket._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gray-800 rounded-lg p-4 border-l-4 ${getStatusColor(ticket.status)}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(ticket.type)}`}>
                    {ticket.type}
                  </span>
                  <h3 className="font-medium text-white mt-1">{ticket.title}</h3>
                  <div className="text-sm text-gray-400 mt-1">
                    By: {ticket.student.name} ({ticket.student.registerNumber})
                  </div>
                  {ticket.type === 'Stock Feedback' && (
                    <div className="text-sm text-gray-400 mt-1">
                      Status: {ticket.currentStatus} • Demand: {ticket.demandIndicator}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                    ${getStatusBadgeColor(ticket.status)}`}
                  >
                    {ticket.status}
                  </span>
                  <button 
                    onClick={() => setExpandedTicket(expandedTicket === ticket._id ? null : ticket._id)}
                    className="text-gray-400 hover:text-white"
                  >
                    <ChevronDownIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {expandedTicket === ticket._id && (
                <div className="mt-4 space-y-4 border-t border-gray-700 pt-4">
                  <div className="text-sm text-gray-400">
                    <p className="font-medium text-white mb-1">Details:</p>
                    <p>{ticket.details}</p>
                    {ticket.impact && (
                      <>
                        <p className="font-medium text-white mt-2 mb-1">Expected Impact:</p>
                        <p>{ticket.impact}</p>
                      </>
                    )}
                  </div>

                  {/* Admin Response Section */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3">
                      <select
                        onChange={(e) => {
                          const response = prompt('Enter response message:')
                          if (response) handleStatusChange(ticket._id, e.target.value, response)
                        }}
                        className="px-3 py-1.5 rounded border border-gray-700 bg-gray-800 text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        defaultValue={ticket.status}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                        <option value="approved">Approved</option>
                      </select>
                    </div>

                    {ticket.adminResponse && (
                      <div className="text-sm">
                        <p className="font-medium text-white mb-1">Admin Response:</p>
                        <p className="text-gray-400">{ticket.adminResponse}</p>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    Submitted on {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 