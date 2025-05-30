import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  BookOpenIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowRightIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import BorrowButton from '../BorrowButton'

export default function BookCard({ book, onBorrow }) {
  const { availableUnits, totalUnits, status } = book

  // Get status text based on units
  const getStatusText = () => {
    if (totalUnits === 0) return 'No Units'
    return `${availableUnits}/${totalUnits} Available`
  }

  // Get status color and icon based on availability ratio
  const getStatusInfo = () => {
    if (totalUnits === 0) {
      return {
        color: 'bg-gray-100 text-gray-700',
        icon: ExclamationTriangleIcon
      }
    }

    const ratio = availableUnits / totalUnits
    if (ratio === 0) {
      return {
        color: 'bg-red-100 text-red-700',
        icon: XCircleIcon
      }
    }
    if (ratio === 1) {
      return {
        color: 'bg-green-100 text-green-700',
        icon: CheckCircleIcon
      }
    }
    return {
      color: 'bg-yellow-100 text-yellow-700',
      icon: WrenchScrewdriverIcon
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
    >
      <div className="aspect-[3/4] relative mb-4">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
            <BookOpenIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`
          absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium
          ${statusInfo.color}
        `}>
          {getStatusText()}
        </div>
      </div>

      <h3 className="font-heading font-semibold text-gray-800 mb-1 line-clamp-2">
        {book.title}
      </h3>
      
      <p className="text-sm text-gray-600 mb-2">
        {book.author}
      </p>

      <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-gray-500">
          {book.category}
        </span>
        <div className="flex items-center gap-1">
          <statusInfo.icon className={`w-5 h-5 ${statusInfo.color.split(' ')[1]}`} />
          <span className={`text-xs ${statusInfo.color.split(' ')[1]}`}>
            {book.availabilityRatio}
          </span>
        </div>
      </div>

      {/* Buttons Container */}
      <div className="mt-4 space-y-3">
        <BorrowButton 
          book={book}
          onBorrow={onBorrow}
          className="w-full"
        />

        <Link 
          to={`/library/${book._id}`}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
        >
          View Details
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  )
} 