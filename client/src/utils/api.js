import axios from './axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Book related API calls
export const getBooks = async (params = {}) => {
  try {
    console.log('API call params:', params) // Debug log
    const response = await axios.get('/library/books', {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || '',
        category: params.category || '',
        availability: params.availability || ''
      }
    })
    console.log('API response:', response.data) // Debug log
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const getBookDetails = async (id) => {
  const response = await axios.get(`/library/books/${id}`)
  return response.data
}

export const searchBooks = async (query) => {
  try {
    if (!query?.trim()) {
      return { success: true, data: [] }
    }

    const response = await api.get('/library/books/search', {
      params: { query: query.trim() }
    })
    
    return response.data
  } catch (error) {
    console.error('Error searching books:', error)
    return { success: true, data: [] }
  }
}

export const fetchBooks = async (params) => {
  const response = await api.get('/library', { params })
  return response.data
}

export const fetchBookDetails = async (id) => {
  const response = await api.get(`/library/${id}`)
  return response.data
}

export const borrowBook = async (bookId, duration) => {
  const response = await api.post(`/library/${bookId}/borrow`, { duration })
  return response.data
}

export const getMyBooks = async () => {
  try {
    console.log('Fetching my books') // Debug log
    const response = await api.get('/library/mybooks')
    console.log('MyBooks response:', response.data) // Debug log
    return response.data
  } catch (error) {
    console.error('Error in getMyBooks:', error)
    throw error
  }
}

export const rateBook = async (bookId, rating, review) => {
  const response = await api.post(`/library/${bookId}/rate`, { rating, review })
  return response.data
}

export const getBorrowDetails = async (bookId) => {
  try {
    console.log('Fetching borrow details for:', bookId) // Debug log
    if (!bookId || bookId === 'undefined') {
      throw new Error('Invalid borrow ID')
    }
    const response = await api.get(`/library/borrows/${bookId}`)
    console.log('Borrow details response:', response.data) // Debug log
    return response.data
  } catch (error) {
    console.error('Error in getBorrowDetails:', error)
    throw error
  }
}

export const updateReadingProgress = async (bookId, currentPage) => {
  const response = await api.patch(`/library/borrow/${bookId}/progress`, { currentPage })
  return response.data
}

export const getBookReviews = async (bookId) => {
  const response = await api.get(`/library/books/${bookId}/reviews`)
  return response.data
}

export const getMyBookReview = async (bookId) => {
  console.log('Fetching review for bookId:', bookId)
  try {
    const response = await api.get(`/library/books/${bookId}/review`)
    return response.data
  } catch (error) {
    console.error('Error fetching review:', error)
    return null // Return null if no review exists
  }
}

export const addOrUpdateReview = async (bookId, data) => {
  try {
    const response = await api.post(`/library/books/${bookId}/review`, data)
    return response.data
  } catch (error) {
    console.error('Error adding/updating review:', error)
    throw error
  }
}

export const addNote = async (bookId, data) => {
  try {
    const response = await api.post(`/library/books/${bookId}/notes`, data)
    return response.data
  } catch (error) {
    console.error('Error adding note:', error)
    throw error
  }
}

export const deleteNote = async (bookId, noteId) => {
  try {
    const response = await api.delete(`/library/books/${bookId}/notes/${noteId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting note:', error)
    throw error
  }
}

export const verifyBookCode = async (data) => {
  const response = await api.post('/library/verify-code', data)
  return response.data
}

export const verifyExit = async (data) => {
  const response = await api.post('/library/verify-exit', data)
  return response.data
}

// Add admin login function
export const adminLogin = async (credentials) => {
  const response = await api.post('/admin/login', credentials)
  return response.data
}

export const addNewBook = async (bookData) => {
  const response = await api.post('/library/books', bookData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const addBookUnit = async (formData) => {
  try {
    const response = await api.post('/library/books/unit', formData)
    return response.data
  } catch (error) {
    console.error('API Error:', error);
    throw error
  }
}

export const reportIssue = async (bookId, data) => {
  try {
    const response = await api.post(`/library/books/${bookId}/report`, data)
    return response.data
  } catch (error) {
    console.error('Error reporting issue:', error)
    throw error
  }
}

export const getMyReports = async () => {
  try {
    const response = await api.get('/library/my-reports')
    return response.data
  } catch (error) {
    console.error('Error fetching reports:', error)
    throw error
  }
}

export const getBookReports = async (bookId) => {
  try {
    const response = await api.get(`/library/books/${bookId}/reports`)
    return response.data
  } catch (error) {
    console.error('Error fetching book reports:', error)
    throw error
  }
}

export const createBookRequest = async (requestData) => {
  try {
    const response = await api.post('/book-requests', requestData)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const getMyBookRequests = async () => {
  try {
    const response = await api.get('/book-requests/my-requests')
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const createStockFeedback = async (feedbackData) => {
  try {
    const response = await api.post('/stock-feedback', feedbackData)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const getMyStockFeedback = async () => {
  try {
    const response = await api.get('/stock-feedback/my-feedback')
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Add this function to combine both types of tickets
export const getAllMyTickets = async () => {
  try {
    const [bookRequests, stockFeedback] = await Promise.all([
      getMyBookRequests(),
      getMyStockFeedback()
    ])

    // Combine and format both types of tickets
    const tickets = [
      ...(bookRequests.data || []).map(req => ({
        ...req,
        type: 'Book Request'
      })),
      ...(stockFeedback.data || []).map(feed => ({
        ...feed,
        type: 'Stock Feedback',
        title: feed.selectedBook || 'Book Stock Feedback'
      }))
    ]

    // Sort by creation date, newest first
    tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return {
      success: true,
      data: tickets
    }
  } catch (error) {
    console.error('Error fetching tickets:', error)
    throw error
  }
}

export const createSuggestion = async (formData) => {
  try {
    const response = await api.post('/suggestions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const getMySuggestions = async () => {
  try {
    const response = await api.get('/suggestions/my-suggestions')
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const getFeedbackMetrics = async () => {
  try {
    const response = await api.get('/feedback/metrics')
    return response.data
  } catch (error) {
    console.error('Error fetching metrics:', error)
    throw error
  }
}

export default api 