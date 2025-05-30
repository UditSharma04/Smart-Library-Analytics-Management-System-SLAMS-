import { useState } from 'react'
import { createSuggestion } from '../../../utils/api'
import { toast } from 'react-hot-toast'

export default function SuggestionsForm({ formData, setFormData }) {
  const [loading, setLoading] = useState(false)

  const categories = [
    'Library Services',
    'Book Collection',
    'Infrastructure',
    'Digital Resources',
    'Others'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.category) {
      toast.error('Please select a category')
      return
    }
    if (!formData.details) {
      toast.error('Please enter suggestion details')
      return
    }

    setLoading(true)
    try {
      const response = await createSuggestion({
        category: formData.category,
        details: formData.details,
        impact: formData.impact,
        priority: formData.priority,
        timeline: formData.timeline
      })

      if (response.success) {
        toast.success('Suggestion submitted successfully!')
        // Reset form
        setFormData({
          category: '',
          details: '',
          impact: '',
          priority: 'medium',
          timeline: 'short-term'
        })
      } else {
        toast.error(response.message || 'Failed to submit suggestion')
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error)
      toast.error(error.response?.data?.message || 'Failed to submit suggestion. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg">
      <div className="space-y-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-white"
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suggestion Details *
          </label>
          <textarea
            required
            rows={4}
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 resize-none"
            placeholder="Describe your suggestion in detail..."
          />
        </div>

        {/* Impact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Impact
          </label>
          <textarea
            rows={2}
            value={formData.impact}
            onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 resize-none"
            placeholder="How will this suggestion improve the library experience?"
          />
        </div>

        {/* Priority Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority Level
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-white"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        {/* Implementation Timeline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Timeline
          </label>
          <select
            value={formData.timeline}
            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-white"
          >
            <option value="short-term">Short Term (1-3 months)</option>
            <option value="medium-term">Medium Term (3-6 months)</option>
            <option value="long-term">Long Term (6+ months)</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? 'Submitting...' : 'Submit Suggestion'}
        </button>
      </div>
    </form>
  )
} 