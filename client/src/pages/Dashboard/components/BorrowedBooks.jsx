import { motion } from 'framer-motion'
import { ClockIcon, BookOpenIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

export default function BorrowedBooks({ books = [] }) {
  const navigate = useNavigate()
  const displayBooks = books.slice(0, 3) // Only show first 3 books

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading font-semibold text-gray-800">
          Currently Borrowed Books
        </h2>
        {books.length > 3 && (
          <button
            onClick={() => navigate('/mybooks')}
            className="text-sm text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {books.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No books currently borrowed
        </div>
      ) : (
        <div className="space-y-4">
          {displayBooks.map((book) => (
            <div
              key={book._id}
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
            >
              <div className="w-16 h-20 shrink-0">
                <img
                  src={book.book.coverImage || '/default-book-cover.png'}
                  alt={book.book.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              
              <div className="flex-grow min-w-0">
                <h3 className="font-medium text-gray-800 truncate">
                  {book.book.title}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {book.book.author}
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>Due: {new Date(book.dueDate).toLocaleDateString()}</span>
                  </div>
                  {book.progress > 0 && (
                    <div className="flex items-center gap-1">
                      <BookOpenIcon className="w-4 h-4" />
                      <span>{book.progress}% complete</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                {new Date(book.dueDate) < new Date() ? (
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded">
                    Overdue
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded">
                    Active
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
} 