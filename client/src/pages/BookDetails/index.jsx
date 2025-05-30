import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  BookOpenIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  BuildingLibraryIcon,
  LanguageIcon,
  ArrowTopRightOnSquareIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import { getBookDetails, verifyBookCode, borrowBook } from '../../utils/api'
import { toast } from 'react-hot-toast'
import BorrowModal from '../../components/BorrowModal'
import { Html5QrcodeScanner } from 'html5-qrcode'

const UnitStatusBadge = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'available':
        return {
          color: 'bg-green-100 text-green-700',
          icon: CheckCircleIcon
        }
      case 'borrowed':
        return {
          color: 'bg-red-100 text-red-700',
          icon: XCircleIcon
        }
      case 'maintenance':
        return {
          color: 'bg-yellow-100 text-yellow-700',
          icon: WrenchScrewdriverIcon
        }
      case 'lost':
        return {
          color: 'bg-gray-100 text-gray-700',
          icon: ExclamationTriangleIcon
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-700',
          icon: QuestionMarkCircleIcon
        }
    }
  }

  const { color, icon: Icon } = getStatusInfo()

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${color}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium capitalize">{status}</span>
    </div>
  )
}

export default function BookDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showBorrowModal, setShowBorrowModal] = useState(false)
  const [borrowing, setBorrowing] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [verifiedUnit, setVerifiedUnit] = useState(null)
  const [duration, setDuration] = useState(7)
  const [scanner, setScanner] = useState(null)
  const [units, setUnits] = useState([])

  useEffect(() => {
    fetchBook()
  }, [id])

  useEffect(() => {
    if (showScanner) {
      const qrScanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      )
      
      qrScanner.render((decodedText) => {
        handleScan(decodedText)
        qrScanner.clear()
      }, (error) => {
        console.error(error)
      })

      setScanner(qrScanner)
    } else if (scanner) {
      scanner.clear()
      setScanner(null)
    }
  }, [showScanner])

  const fetchBook = async () => {
    try {
      setLoading(true)
      const data = await getBookDetails(id)
      setBook(data)
      
      // Get unit statuses
      const availableUnits = data.availableUnits || 0
      const totalUnits = data.totalUnits || 0
      
      // Create units array for display
      const unitStatuses = []
      if (data.set?.units) {
        data.set.units.forEach(unit => {
          unitStatuses.push({
            code: unit.qrCode,
            status: unit.status,
            condition: unit.condition,
            borrower: unit.currentBorrower
          })
        })
      }
      setUnits(unitStatuses)
    } catch (err) {
      setError('Failed to fetch book details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleScan = async (decodedText) => {
    try {
      const response = await verifyBookCode({ code: decodedText })
      if (response.bookId === id) {
        setVerifiedUnit(response)
        setShowScanner(false)
        toast.success('Book unit verified successfully')
      } else {
        toast.error('Invalid book code')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to verify book code')
    }
  }

  const handleBorrow = async () => {
    if (!verifiedUnit) {
      setShowScanner(true)
      return
    }

    try {
      setBorrowing(true)
      await borrowBook(id, {
        duration,
        unitCode: verifiedUnit.unitCode,
        rfid: verifiedUnit.rfid
      })
      toast.success('Book borrowed successfully! Please verify at reception.')
      navigate('/mybooks')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to borrow book')
    } finally {
      setBorrowing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || 'Book not found'}</p>
        <button
          onClick={() => navigate('/library')}
          className="text-primary hover:underline"
        >
          Back to Library
        </button>
      </div>
    )
  }

  console.log('Book availability before showing borrow button:', book.availability)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/library')}
        className="flex items-center text-gray-600 hover:text-primary mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to Library
      </button>

      {/* Unit Status Section - Moved to top */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Unit Status</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Total Units:</span>
            <span className="text-sm font-medium">{book.availabilityRatio}</span>
          </div>
        </div>
        
        {units.length > 0 ? (
          <div className="grid gap-4">
            {units.map((unit, index) => (
              <div 
                key={unit.code || index}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="font-medium text-gray-600">#{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">Unit {unit.qrCode}</div>
                    <div className="text-sm text-gray-600">
                      Condition: {unit.condition}
                    </div>
                  </div>
                </div>
                <UnitStatusBadge status={unit.status} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No units available for this book
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="md:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-[3/4] relative rounded-xl overflow-hidden shadow-lg"
          >
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <BookOpenIcon className="w-20 h-20 text-gray-400" />
              </div>
            )}
          </motion.div>
        </div>

        {/* Book Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 space-y-6"
        >
          {/* Title and Author */}
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-800 mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-gray-600">{book.author}</p>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600">Price</div>
              <div className="text-xl font-semibold">₹{book.price}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600">Status</div>
              <div className={`text-xl font-semibold ${book.availableUnits > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {book.availableUnits > 0 ? 'Available' : 'Not Available'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600">Late Fee</div>
              <div className="text-xl font-semibold">₹{book.borrowingDetails.lateFeePerDay}/day</div>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">ISBN</div>
                <div className="font-mono">{book.isbn}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Pages</div>
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="w-5 h-5 text-gray-500" />
                  {book.pageCount}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Publisher</div>
                <div>{book.publisher}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Published Year</div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-gray-500" />
                  {book.publishedYear}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Edition</div>
                <div>{book.edition}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Language</div>
                <div className="flex items-center gap-2">
                  <LanguageIcon className="w-5 h-5 text-gray-500" />
                  {book.language}
                </div>
              </div>
            </div>

            {book.location && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Location</div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-gray-500" />
                  <span>
                    Block {book.location.block} - Shelf {book.location.shelf} 
                    (Row {book.location.row}, Column {book.location.column})
                  </span>
                </div>
              </div>
            )}

            <div>
              <div className="text-sm text-gray-600 mb-2">Description</div>
              <p className="text-gray-700 leading-relaxed">
                {book.description}
              </p>
            </div>

            {book.tags && book.tags.length > 0 && (
              <div>
                <div className="text-sm text-gray-600 mb-2">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {book.availableUnits > 0 && (
            <div className="flex gap-4">
              <button
                onClick={() => setShowBorrowModal(true)}
                className="flex-1 py-3 px-6 rounded-lg text-white font-medium bg-primary hover:bg-primary-dark"
              >
                Borrow Book
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Borrow Modal */}
      {showBorrowModal && (
        <BorrowModal
          book={book}
          onClose={() => setShowBorrowModal(false)}
          onBorrow={handleBorrow}
        />
      )}
    </div>
  )
} 