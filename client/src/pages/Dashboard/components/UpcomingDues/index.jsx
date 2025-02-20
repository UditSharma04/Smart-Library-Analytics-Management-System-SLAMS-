import { motion } from 'framer-motion'
import { format, isBefore } from 'date-fns'
import { BookOpenIcon } from '@heroicons/react/24/outline'

const dueBooks = [
  {
    id: 1,
    title: 'Clean Code',
    dueDate: '2024-02-25',
    fine: 0
  },
  {
    id: 2,
    title: 'Design Patterns',
    dueDate: '2024-03-01',
    fine: 0
  },
  {
    id: 3,
    title: 'Refactoring',
    dueDate: '2024-02-20',
    fine: 50
  }
]

export default function UpcomingDues() {
  const today = new Date()

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-heading font-semibold text-gray-800 mb-6">
        Upcoming Due Dates
      </h2>

      <div className="space-y-4">
        {dueBooks.map((book, index) => {
          const dueDate = new Date(book.dueDate)
          const isOverdue = isBefore(dueDate, today)

          return (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                flex items-center gap-4 p-4 rounded-lg
                ${isOverdue ? 'bg-red-50' : 'bg-gray-50'}
              `}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${isOverdue ? 'bg-red-100 text-red-500' : 'bg-primary/10 text-primary'}
              `}>
                <BookOpenIcon className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">
                  {book.title}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-sm ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                    Due: {format(dueDate, 'MMM dd, yyyy')}
                  </p>
                  {book.fine > 0 && (
                    <span className="text-sm font-medium text-red-500">
                      Fine: ₹{book.fine}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Calendar View Toggle */}
      <button className="w-full mt-6 py-2 text-sm text-primary hover:text-primary-dark border border-primary/20 rounded-lg">
        View Calendar
      </button>
    </div>
  )
} 