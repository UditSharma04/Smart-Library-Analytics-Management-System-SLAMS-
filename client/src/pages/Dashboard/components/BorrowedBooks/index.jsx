import { motion } from 'framer-motion'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

const books = [
  {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg',
    dueDate: '2024-02-25',
    progress: 70,
    renewable: true
  },
  {
    id: 2,
    title: 'Design Patterns',
    author: 'Erich Gamma',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg',
    dueDate: '2024-03-01',
    progress: 30,
    renewable: true
  },
  {
    id: 3,
    title: 'Refactoring',
    author: 'Martin Fowler',
    cover: 'https://images-na.ssl-images-amazon.com/images/I/41LBzpPXCOL._SX379_BO1,204,203,200_.jpg',
    dueDate: '2024-02-28',
    progress: 90,
    renewable: false
  }
]

export default function BorrowedBooks() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-gray-800">
          Currently Borrowed
        </h2>
        <button className="text-sm text-primary hover:text-primary-dark">
          View All
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="aspect-[3/4] mb-4">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover rounded-lg shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-800 line-clamp-1">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600">
                {book.author}
              </p>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Due Date</span>
                  <span className="font-mono text-red-500">
                    {new Date(book.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${book.progress}%` }}
                  />
                </div>
              </div>
              {book.renewable && (
                <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-primary hover:text-primary-dark">
                  <ArrowPathIcon className="w-4 h-4" />
                  Renew
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 