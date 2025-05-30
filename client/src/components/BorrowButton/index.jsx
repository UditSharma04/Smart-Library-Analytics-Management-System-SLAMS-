import { useState } from 'react'
import BorrowModal from '../BorrowModal'

export default function BorrowButton({ book, onBorrow, className = '' }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={!book.availableUnits}
        className={`px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {book.availableUnits ? 'Borrow Now' : 'Not Available'}
      </button>

      <BorrowModal
        book={book}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBorrow={onBorrow}
      />
    </>
  )
} 