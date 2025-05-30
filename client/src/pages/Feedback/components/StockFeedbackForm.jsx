import { useState, useEffect } from 'react'
import { createStockFeedback, searchBooks } from '../../../utils/api'
import { toast } from 'react-hot-toast'
import { useDebounce } from '../../../hooks/useDebounce'

export default function StockFeedbackForm({ formData, setFormData }) {
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    const fetchBooks = async () => {
      if (debouncedSearch.trim()) {
        try {
          console.log('Searching for:', debouncedSearch) // Debug log
          const response = await searchBooks(debouncedSearch)
          console.log('Search response:', response) // Debug log
          if (response.success) {
            setSearchResults(response.data)
            setShowResults(true)
          } else {
            setSearchResults([])
            setShowResults(false)
          }
        } catch (error) {
          console.error('Error searching books:', error)
          setSearchResults([])
          setShowResults(false)
        }
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }

    fetchBooks()
  }, [debouncedSearch])

  const handleBookSelect = (book) => {
    setFormData({
      ...formData,
      bookId: book._id,
      selectedBook: book.title
    })
    setSearchQuery(book.title)
    setShowResults(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.bookId) {
      toast.error('Please select a book')
      return
    }
    if (!formData.currentStatus) {
      toast.error('Please select current status')
      return
    }
    if (!formData.studentCount) {
      toast.error('Please enter estimated student count')
      return
    }

    setLoading(true)
    try {
      const response = await createStockFeedback({
        bookId: formData.bookId,
        currentStatus: formData.currentStatus,
        demandIndicator: formData.demandIndicator,
        studentCount: parseInt(formData.studentCount),
        courseAssociation: formData.courseAssociation
      })

      if (response.success) {
        toast.success('Stock feedback submitted successfully!')
        // Reset form
        setFormData({
          bookId: '',
          currentStatus: '',
          demandIndicator: 'low',
          studentCount: '',
          courseAssociation: ''
        })
        setSearchQuery('')
      } else {
        toast.error(response.message || 'Failed to submit feedback')
      }
    } catch (error) {
      console.error('Error submitting stock feedback:', error)
      toast.error(error.response?.data?.message || 'Failed to submit feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Prevent form submission when selecting book from dropdown
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (searchResults.length > 0) {
        handleBookSelect(searchResults[0])
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Book Selection */}
        <div className="md:col-span-2 relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Book *
          </label>
          <input
            type="text"
            placeholder="Search for a book..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setFormData({ ...formData, bookId: '', selectedBook: '' })
            }}
            onKeyDown={handleSearchKeyDown}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
          />
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
              {searchResults.map((book) => (
                <button
                  key={book._id}
                  type="button"
                  onClick={() => handleBookSelect(book)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                >
                  <div className="font-medium">{book.title}</div>
                  <div className="text-sm text-gray-600">
                    by {book.author} • ISBN: {book.isbn}
                  </div>
                </button>
              ))}
            </div>
          )}

          {formData.selectedBook && (
            <div className="mt-2 text-sm text-green-600">
              Selected: {formData.selectedBook}
            </div>
          )}
        </div>

        {/* Current Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Status
          </label>
          <select
            value={formData.currentStatus}
            onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-white"
          >
            <option value="">Select Status</option>
            <option value="sufficient">Sufficient</option>
            <option value="low">Low Stock</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Demand Indicator */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Demand Level
          </label>
          <select
            value={formData.demandIndicator}
            onChange={(e) => setFormData({ ...formData, demandIndicator: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Student Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Students Needing Book
          </label>
          <input
            type="number"
            min="0"
            value={formData.studentCount}
            onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
            placeholder="Enter number of students"
          />
        </div>

        {/* Course Association */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Related Course
          </label>
          <input
            type="text"
            value={formData.courseAssociation}
            onChange={(e) => setFormData({ ...formData, courseAssociation: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
            placeholder="Enter related course"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          Submit Feedback
        </button>
      </div>
    </form>
  )
} 