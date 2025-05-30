import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { 
  BookOpenIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { getMyBooks } from '../../utils/api'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function MyBooks() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [borrows, setBorrows] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchMyBooks()
  }, [])

  const fetchMyBooks = async () => {
    try {
      setLoading(true)
      const data = await getMyBooks()
      console.log('MyBooks data received:', data) // Debug log
      setBorrows(data)
    } catch (err) {
      console.error('Error in fetchMyBooks:', err)
      setError('Failed to fetch your books')
      toast.error('Failed to fetch your books')
    } finally {
      setLoading(false)
    }
  }

  const getDaysRemaining = (dueDate) => {
    const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24))
    return days
  }

  const renderBookCard = (borrow) => {
    console.log('Rendering borrow:', borrow) // Debug log
    if (!borrow || !borrow._id) {
      console.error('Invalid borrow object:', borrow)
      return null
    }

    const book = borrow.book
    if (!book) {
      console.error('Missing book data in borrow:', borrow)
      return null
    }

    const progress = Math.round((borrow.currentPage / book.pageCount) * 100) || 0
    
    return (
      <motion.div
        key={borrow._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="aspect-[3/4] relative overflow-hidden max-w-[200px] mx-auto">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-contain"
              loading="lazy"
              onError={(e) => {
                console.log('Image failed to load:', book.coverImage)
                e.target.src = '/placeholder-book.jpg'
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <BookOpenIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {book.author}
          </p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">
              Borrowed: {format(new Date(borrow.borrowDate), 'PP')}
            </p>
            <p className="text-gray-600">
              Due: {format(new Date(borrow.dueDate), 'PP')}
            </p>
            <p className={`font-medium ${getDaysRemaining(borrow.dueDate) > 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {getDaysRemaining(borrow.dueDate)} days remaining
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 space-y-3">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Reading Progress</span>
              <span className="text-primary font-medium">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                console.log('Navigating with borrow:', borrow) // Debug log
                navigate(`/mybooks/${borrow._id}`)
              }}
              className="flex-1 py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
            >
              View Details
            </button>
            <button
              className="flex-1 py-2 text-sm bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100"
            >
              Rate Book
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={fetchMyBooks} className="text-primary hover:underline">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-heading font-bold text-gray-800 mb-6">
        My Books
      </h1>

      {borrows.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">You haven't borrowed any books yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {borrows.map(renderBookCard)}
        </div>
      )}
    </div>
  )
} 