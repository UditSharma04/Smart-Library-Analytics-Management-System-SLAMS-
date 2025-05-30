import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import { format, addDays } from 'date-fns'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from '../../utils/axios'

export default function BorrowModal({ book, isOpen, onClose, onBorrow }) {
  console.log('Book data received in modal:', book)

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    duration: '14', // Default 14 days
    purpose: '',
    agreementChecked: false
  })

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.agreementChecked) {
      toast.error('Please agree to the terms and conditions')
      return
    }

    try {
      setLoading(true)
      
      // Simple borrow request
      await axios.post(`/borrow/${book._id}`, {
        duration: parseInt(formData.duration),
        purpose: formData.purpose
      })
      
      toast.success('Book borrowed successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to borrow book')
    } finally {
      setLoading(false)
    }
  }

  const dueDate = addDays(new Date(), parseInt(formData.duration))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-semibold">
              Borrow Book
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Book Info */}
          <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="w-20 h-24 shrink-0">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                  <BookOpenIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
              <p className="text-xs text-gray-500 mt-2">
                Status: {book.availability ? 'Available' : 'Not Available'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Duration Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Borrow Duration
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                required
              >
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="21">21 days</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Due date will be: {format(dueDate, 'PPP')}
              </p>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose of Borrowing
              </label>
              <textarea
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                rows="3"
                placeholder="e.g., Course reference, Research, Personal reading"
                required
              />
            </div>

            {/* Agreement */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="agreement"
                checked={formData.agreementChecked}
                onChange={(e) => setFormData(prev => ({ ...prev, agreementChecked: e.target.checked }))}
                className="mt-1"
              />
              <label htmlFor="agreement" className="text-sm text-gray-600">
                I agree to return the book in good condition by the due date. I understand that late returns will incur fines and damaged books will require replacement costs.
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.agreementChecked}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Confirm Borrow'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
} 