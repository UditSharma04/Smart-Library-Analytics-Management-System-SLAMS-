import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getBooks } from '../../utils/api'
import BookCard from '../../components/BookCard'
import Pagination from '../../components/Pagination'
import FilterBar from './components/FilterBar'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function Library() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    category: '',
    availability: ''
  })
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1
  })

  useEffect(() => {
    fetchBooks()
  }, [filters])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      console.log('Fetching books with filters:', filters) // Debug log
      const data = await getBooks(filters)
      console.log('Received books data:', data) // Debug log
      setBooks(data.books)
      setPagination({
        total: data.total,
        pages: data.pages,
        currentPage: data.currentPage
      })
    } catch (err) {
      console.error('Error fetching books:', err) // Debug log
      setError(err.response?.data?.message || 'Error fetching books')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-heading font-bold text-gray-800 mb-4">
          Library Catalog
        </h1>
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      </motion.div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard 
                key={book._id} 
                book={book}
                availableUnits={book.availableUnits}
                totalUnits={book.totalUnits}
              />
            ))}
          </div>

          {books.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No books found matching your criteria
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
} 