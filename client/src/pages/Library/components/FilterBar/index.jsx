import { 
  MagnifyingGlassIcon, 
  FunnelIcon 
} from '@heroicons/react/24/outline'

const CATEGORIES = [
  'All',
  'Technology',
  'Science',
  'Literature',
  'History',
  'Business'
]

export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Search Input */}
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Search books..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-gray-400" />
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="rounded-lg border border-gray-300 py-2 px-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category === 'All' ? '' : category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Filter */}
        <select
          value={filters.availability}
          onChange={(e) => onFilterChange({ availability: e.target.value })}
          className="rounded-lg border border-gray-300 py-2 px-3 focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Books</option>
          <option value="true">Available</option>
          <option value="false">Borrowed</option>
        </select>
      </div>
    </div>
  )
} 