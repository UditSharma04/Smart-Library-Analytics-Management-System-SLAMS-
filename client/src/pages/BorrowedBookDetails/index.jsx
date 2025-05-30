import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  BanknotesIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  StarIcon as StarOutlineIcon,
  PencilIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
  PencilSquareIcon,
  BookmarkIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { format, differenceInDays } from 'date-fns'
import { getBorrowDetails, updateReadingProgress, getMyBookReview, addOrUpdateReview, addNote, deleteNote, reportIssue } from '../../utils/api'
import { toast } from 'react-hot-toast'
import { StarIcon } from '@heroicons/react/24/solid'

const BorrowedBookDetails = () => {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [borrowDetails, setBorrowDetails] = useState(null)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [review, setReview] = useState(null)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [noteType, setNoteType] = useState('note')
  const [notePage, setNotePage] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('notes') // 'notes' or 'highlights'
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportType, setReportType] = useState('damage')
  const [reportDescription, setReportDescription] = useState('')

  useEffect(() => {
    if (!bookId || bookId === 'undefined') {
      console.error('Invalid bookId:', bookId)
      navigate('/mybooks')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('Fetching details for bookId:', bookId)
        const data = await getBorrowDetails(bookId)
        console.log('Received data:', data)

        if (!data || !data.borrow) {
          throw new Error('Invalid response format')
        }

        setBorrowDetails(data.borrow)
        
        // Set review data from the response
        if (data.review) {
          setReview(data.review)
          setRating(data.review.rating || 0)
          setReviewText(data.review.review || '')
        } else {
          setReview(null)
          setRating(0)
          setReviewText('')
        }

      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err.response?.data?.message || 'Failed to fetch book details')
        toast.error('Failed to fetch book details')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [bookId, navigate])

  const refreshData = async () => {
    try {
      const data = await getBorrowDetails(bookId)
      setBorrowDetails(data.borrow)
      if (data.review) {
        setReview(data.review)
        setRating(data.review.rating || 0)
        setReviewText(data.review.review || '')
      } else {
        setReview(null)
        setRating(0)
        setReviewText('')
      }
    } catch (err) {
      console.error('Error refreshing data:', err)
      toast.error('Failed to refresh data')
    }
  }

  const handleSubmitReview = async () => {
    if (!rating) {
      toast.error('Please select a rating')
      return
    }

    try {
      setSubmitting(true)
      const reviewData = await addOrUpdateReview(borrowDetails.book._id, {
        rating,
        review: reviewText.trim()
      })
      console.log('Review update response:', reviewData)
      
      // Update the local state with the response
      setReview(reviewData)
      setRating(reviewData.rating || 0)
      setReviewText(reviewData.review || '')
      
      toast.success('Review updated successfully')
    } catch (err) {
      console.error('Error updating review:', err)
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddNote = async () => {
    if (!noteContent || !notePage) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setSubmitting(true)
      // Use singular form for type
      const noteType = activeTab === 'notes' ? 'note' : 'highlight'
      const noteData = await addNote(borrowDetails.book._id, {
        type: noteType,
        content: noteContent,
        page: parseInt(notePage)
      })
      console.log('Note add response:', noteData)
      
      // Update the local state with the response
      setReview(noteData)
      
      setShowNoteModal(false)
      setNoteContent('')
      setNotePage('')
      toast.success(`${activeTab === 'notes' ? 'Note' : 'Highlight'} added successfully`)
    } catch (err) {
      console.error('Error adding note:', err)
      toast.error(err.response?.data?.message || 'Failed to add note')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this?')) return

    try {
      await deleteNote(borrowDetails.book._id, noteId)
      await refreshData()
      toast.success(`${activeTab === 'notes' ? 'Note' : 'Highlight'} deleted successfully`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    }
  }

  const handleReportIssue = async () => {
    if (!reportDescription) {
      toast.error('Please describe the issue')
      return
    }

    try {
      setSubmitting(true)
      await reportIssue(borrowDetails.book._id, {
        type: reportType,
        description: reportDescription
      })
      setShowReportModal(false)
      setReportDescription('')
      toast.success('Issue reported successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to report issue')
    } finally {
      setSubmitting(false)
    }
  }

  const renderNotes = () => {
    if (!review?.notes?.length) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <BookmarkIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-1">No notes yet</p>
          <p className="text-sm text-gray-400">
            Add your first note to keep track of important passages
          </p>
        </div>
      )
    }

    return review.notes.map(note => (
      <div key={note._id} className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-sm text-gray-600">Page {note.page}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-sm text-gray-600">
              {format(new Date(note.createdAt), 'PP')}
            </span>
          </div>
          <button
            onClick={() => handleDeleteNote(note._id)}
            className="text-gray-400 hover:text-red-500"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
      </div>
    ))
  }

  const renderHighlights = () => {
    if (!review?.highlights?.length) {
      return (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-1">No highlights yet</p>
          <p className="text-sm text-gray-400">
            Highlight important passages to reference later
          </p>
        </div>
      )
    }

    return review.highlights.map(highlight => (
      <div key={highlight._id} className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-sm text-gray-600">Page {highlight.page}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-sm text-gray-600">
              {format(new Date(highlight.createdAt), 'PP')}
            </span>
          </div>
          <button
            onClick={() => handleDeleteNote(highlight._id)}
            className="text-gray-400 hover:text-red-500"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{highlight.content}</p>
      </div>
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error || !borrowDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || 'Failed to load book details'}</p>
        <button
          onClick={() => navigate('/mybooks')}
          className="text-primary hover:underline"
        >
          Back to My Books
        </button>
      </div>
    )
  }

  // Format dates safely
  const formatDate = (date) => {
    try {
      return format(new Date(date), 'PPP')
    } catch (err) {
      return 'Invalid date'
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/mybooks')}
        className="flex items-center text-gray-600 hover:text-primary mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to My Books
      </button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Book Cover & Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-[3/4] relative overflow-hidden max-w-[200px] mx-auto"
          >
            {borrowDetails.book.coverImage ? (
              <img
                src={borrowDetails.book.coverImage}
                alt={borrowDetails.book.title}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  console.error('Failed to load image:', borrowDetails.book.coverImage)
                  e.target.src = '/placeholder-book.jpg' // Make sure you have this placeholder image
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <BookOpenIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </motion.div>

          {/* Basic Book Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h1 className="text-xl font-heading font-bold text-gray-800">
              {borrowDetails.book?.title}
            </h1>
            <p className="text-gray-600">{borrowDetails.book?.author}</p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <BookOpenIcon className="w-4 h-4" />
                <span>{borrowDetails.book.pageCount} pages</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                <span>Due {format(new Date(borrowDetails.dueDate), 'PP')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ChartBarIcon className="w-4 h-4" />
                <span>Progress: {borrowDetails.progress}%</span>
              </div>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="mt-4 w-full py-2 px-4 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
            >
              <ExclamationCircleIcon className="w-5 h-5" />
              Report Issue
            </button>
          </div>
        </div>

        {/* Borrowing Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 space-y-6"
        >
          {/* Borrowing Timeline */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-blue-500" />
              Borrowing Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Borrowed On</p>
                  <p className="font-medium">{formatDate(borrowDetails.borrowDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-medium">{formatDate(borrowDetails.dueDate)}</p>
                </div>
              </div>
              
              {/* Days Remaining/Overdue */}
              {borrowDetails.status === 'active' ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    {Math.abs(borrowDetails.daysRemaining || 0)} days remaining
                  </p>
                </div>
              ) : (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-800 font-medium">
                    {Math.abs(borrowDetails.daysRemaining || 0)} days overdue
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Fine Details (if any) */}
          {borrowDetails.fine > 0 && (
            <div className="bg-red-50 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-800">
                <BanknotesIcon className="w-5 h-5" />
                Fine Details
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-red-800">Late Fee</span>
                  <span className="font-medium text-red-800">₹{borrowDetails.fine}</span>
                </div>
                <p className="text-sm text-red-700">
                  Please clear the fine at the library counter to continue borrowing books.
                </p>
              </div>
            </div>
          )}

          {/* Notes & Reviews Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            {/* Title and Add Note Button */}
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ChatBubbleLeftIcon className="w-5 h-5 text-primary" />
                Notes & Reviews
              </h2>
              <button
                onClick={() => setShowNoteModal(true)}
                className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
              >
                <PencilIcon className="w-4 h-4" />
                Add Note
              </button>
            </div>

            {/* Rating Section */}
            <div className="border-b pb-4 mb-4">
              <div className="flex flex-col gap-2">
                {/* Current Rating Display */}
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <StarIcon 
                          className={`w-6 h-6 ${
                            star <= (review?.rating || rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {review?.rating ? `${review.rating}/5` : 'Not rated yet'}
                  </span>
                </div>

                {/* Current Review Display */}
                {review?.review && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <p className="text-sm text-gray-700 italic">"{review.review}"</p>
                  </div>
                )}

                {/* Review Input */}
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                />
                <button
                  onClick={handleSubmitReview}
                  disabled={!rating || submitting}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : review?.review ? 'Update Review' : 'Submit Review'}
                </button>
              </div>
            </div>

            {/* Notes and Highlights Section */}
            <div className="mt-8">
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'notes'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Notes ({review?.notes?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('highlights')}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === 'highlights'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Highlights ({review?.highlights?.length || 0})
                </button>
              </div>

              <div className="space-y-4">
                {activeTab === 'notes' ? renderNotes() : renderHighlights()}
              </div>

              <button
                onClick={() => setShowNoteModal(true)}
                className="mt-4 w-full py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
              >
                Add {activeTab === 'notes' ? 'Note' : 'Highlight'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Note/Highlight Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-heading font-semibold">
                Add {activeTab === 'notes' ? 'Note' : 'Highlight'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Number
                </label>
                <input
                  type="number"
                  value={notePage}
                  onChange={(e) => setNotePage(e.target.value)}
                  min="1"
                  max={borrowDetails.book.pageCount}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={`Write your ${activeTab === 'notes' ? 'note' : 'highlight'} here...`}
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={!noteContent || !notePage || submitting}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {submitting ? 'Saving...' : `Save ${activeTab === 'notes' ? 'Note' : 'Highlight'}`}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-heading font-semibold">Report Issue</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="damage">Physical Damage</option>
                  <option value="missing">Missing Pages</option>
                  <option value="content">Content Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Please describe the issue in detail..."
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleReportIssue}
                disabled={!reportDescription || submitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default BorrowedBookDetails 