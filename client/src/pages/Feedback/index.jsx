import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpenIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { Tab } from '@headlessui/react'

// Import form components
import BookRequestForm from './components/BookRequestForm'
import StockFeedbackForm from './components/StockFeedbackForm'
import SuggestionsForm from './components/SuggestionsForm'
import TicketHistory from './components/TicketHistory'
import { getFeedbackMetrics } from '../../utils/api'

export default function Feedback() {
  const [selectedTab, setSelectedTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const tabs = [
    { name: 'Request Books', icon: BookOpenIcon },
    { name: 'Stock Feedback', icon: DocumentTextIcon },
    { name: 'Suggestions', icon: ChatBubbleLeftRightIcon },
    { name: 'My Tickets', icon: ClockIcon }
  ]

  const [bookRequest, setBookRequest] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    edition: '',
    courseRelevance: '',
    urgencyLevel: 'medium',
    justification: '',
    similarBooks: '',
    unitsCount: 1,
    referenceLinks: ''
  })

  const [stockFeedback, setStockFeedback] = useState({
    bookId: '',
    currentStatus: '',
    usageStats: '',
    demandIndicator: 'medium',
    studentCount: '',
    courseAssociation: '',
    priorityLevel: 'medium'
  })

  const [suggestion, setSuggestion] = useState({
    category: '',
    details: '',
    impact: '',
    documents: null
  })

  const [metrics, setMetrics] = useState({
    totalRequests: { value: '...', trend: 'Loading...' },
    approvalRate: { value: '...', trend: 'Loading...' },
    responseTime: { value: '...', trend: 'Loading...' }
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await getFeedbackMetrics()
        if (response.success) {
          setMetrics(response.data)
        }
      } catch (error) {
        console.error('Error fetching metrics:', error)
      }
    }

    fetchMetrics()
  }, [])

  const handleBookRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // API call here
      setSuccessMessage('Book request submitted successfully!')
    } catch (error) {
      setErrorMessage('Failed to submit book request')
    }
    setLoading(false)
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 rounded-xl mb-6">
        <h1 className="text-2xl font-bold mb-2">Request & Feedback</h1>
        <p className="text-blue-100">Help us improve your library experience</p>
      </div>

      {/* Stats Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Total Requests"
          value={metrics.totalRequests.value}
          icon={DocumentTextIcon}
          trend={metrics.totalRequests.trend}
        />
        <StatsCard
          title="Approval Rate"
          value={metrics.approvalRate.value}
          icon={CheckCircleIcon}
          trend={metrics.approvalRate.trend}
        />
        <StatsCard
          title="Avg. Response Time"
          value={metrics.responseTime.value}
          icon={ClockIcon}
          trend={metrics.responseTime.trend}
        />
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {errorMessage}
        </div>
      )}

      {/* Tabs */}
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-2 rounded-xl bg-blue-900/20 p-1 mb-6">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) => `
                w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400
                focus:outline-none focus:ring-2
                ${selected
                  ? 'bg-white text-blue-900 shadow'
                  : 'text-blue-700 hover:bg-white/[0.12] hover:text-blue-800'
                }
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </div>
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {/* Book Request Form */}
          <Tab.Panel>
            <BookRequestForm
              formData={bookRequest}
              setFormData={setBookRequest}
              onSubmit={handleBookRequest}
              loading={loading}
            />
          </Tab.Panel>

          {/* Stock Feedback Form */}
          <Tab.Panel>
            <StockFeedbackForm
              formData={stockFeedback}
              setFormData={setStockFeedback}
            />
          </Tab.Panel>

          {/* Suggestions Form */}
          <Tab.Panel>
            <SuggestionsForm
              formData={suggestion}
              setFormData={setSuggestion}
            />
          </Tab.Panel>

          {/* Tickets History */}
          <Tab.Panel>
            <TicketHistory />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

// Stats Card Component
function StatsCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="w-6 h-6 text-blue-700" />
        </div>
        <span className="text-sm text-gray-500">{trend}</span>
      </div>
      <h3 className="text-2xl font-semibold font-mono">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  )
} 