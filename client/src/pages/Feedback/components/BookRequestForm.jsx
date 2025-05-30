import { useState } from 'react'
import { createBookRequest } from '../../../utils/api'
import { toast } from 'react-hot-toast'

export default function BookRequestForm({ formData, setFormData, onSubmit, loading }) {
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await createBookRequest(formData)
      if (response.success) {
        toast.success('Book request submitted successfully!')
        // Reset form
        setFormData({
          title: '',
          author: '',
          isbn: '',
          publisher: '',
          edition: '',
          courseRelevance: '',
          urgencyLevel: 'medium',
          justification: '',
          similarBooks: '',
          unitsCount: 1,
          referenceLinks: ''
        })
      } else {
        toast.error(response.message || 'Failed to submit request')
      }
    } catch (error) {
      console.error('Error submitting book request:', error)
      toast.error(error.response?.data?.message || 'Failed to submit request. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Book Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
            placeholder="Enter book title"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
            placeholder="Enter author name"
          />
        </div>

        {/* ISBN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ISBN
          </label>
          <input
            type="text"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
            placeholder="Enter ISBN"
          />
        </div>

        {/* Publisher */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Publisher
          </label>
          <input
            type="text"
            value={formData.publisher}
            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
            placeholder="Enter publisher name"
          />
        </div>

        {/* Edition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Edition
          </label>
          <input
            type="text"
            value={formData.edition}
            onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
            placeholder="Enter edition (e.g., 2nd Edition)"
          />
        </div>

        {/* Urgency Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Urgency Level
          </label>
          <select
            value={formData.urgencyLevel}
            onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Course Relevance */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course/Subject Relevance
          </label>
          <input
            type="text"
            value={formData.courseRelevance}
            onChange={(e) => setFormData({ ...formData, courseRelevance: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
            placeholder="Enter related course or subject"
          />
        </div>

        {/* Similar Books */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Similar Books in Library
          </label>
          <input
            type="text"
            value={formData.similarBooks}
            onChange={(e) => setFormData({ ...formData, similarBooks: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
            placeholder="List any similar books already in the library"
          />
        </div>

        {/* Units Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Units Needed
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={formData.unitsCount}
            onChange={(e) => setFormData({ ...formData, unitsCount: parseInt(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
          />
        </div>

        {/* Reference Links */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reference Links
          </label>
          <input
            type="text"
            value={formData.referenceLinks}
            onChange={(e) => setFormData({ ...formData, referenceLinks: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
            placeholder="Amazon/Goodreads links (optional)"
          />
        </div>

        {/* Justification */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Justification *
          </label>
          <textarea
            required
            rows={4}
            value={formData.justification}
            onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 resize-none"
            placeholder="Why is this book needed?"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  )
} 