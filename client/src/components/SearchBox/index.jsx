import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  FunnelIcon,
  CheckIcon,
  BookOpenIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { searchData } from '../../data/searchData'

const filters = [
  { id: 'all', label: 'All' },
  { id: 'books', label: 'Books', icon: BookOpenIcon },
  { id: 'spaces', label: 'Study Spaces', icon: UserGroupIcon },
  { id: 'journals', label: 'Journals', icon: DocumentTextIcon }
]

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = []
      
      const searchInCategory = (category) => {
        return searchData[category].filter(item => {
          const searchableText = Object.values(item)
            .filter(val => typeof val === 'string')
            .join(' ')
            .toLowerCase()
          return searchableText.includes(query.toLowerCase())
        })
      }

      if (selectedFilter === 'all') {
        Object.keys(searchData).forEach(category => {
          searchResults.push(...searchInCategory(category))
        })
      } else {
        searchResults.push(...searchInCategory(selectedFilter))
      }

      setResults(searchResults)
      setShowResults(true)
    } else {
      setResults([])
      setShowResults(false)
    }
  }, [query, selectedFilter])

  const handleClear = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
  }

  const getIcon = (type) => {
    switch (type) {
      case 'book':
        return BookOpenIcon
      case 'space':
        return UserGroupIcon
      case 'journal':
        return DocumentTextIcon
      default:
        return BookOpenIcon
    }
  }

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            placeholder="Search books, spaces, journals..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
            >
              <XMarkIcon className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            px-4 py-3 rounded-xl border border-gray-200 
            hover:bg-gray-50 transition-colors
            ${showFilters ? 'bg-gray-50 text-primary border-primary' : 'text-gray-700'}
          `}
        >
          <FunnelIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 right-14 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20"
          >
            {results.map((result) => {
              const Icon = getIcon(result.type)
              return (
                <button
                  key={`${result.type}-${result.id}`}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <Icon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {result.title || result.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {result.author || result.publisher || `Capacity: ${result.capacity}`}
                    </p>
                  </div>
                  <span className={`
                    ml-auto text-xs px-2 py-1 rounded-full
                    ${result.available 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'}
                  `}>
                    {result.available ? 'Available' : 'Unavailable'}
                  </span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Dropdown */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10"
          >
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setSelectedFilter(filter.id)
                  setShowFilters(false)
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
              >
                <span className="text-gray-700">{filter.label}</span>
                {selectedFilter === filter.id && (
                  <CheckIcon className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 