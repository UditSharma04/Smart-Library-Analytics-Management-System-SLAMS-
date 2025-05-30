import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    
    // Debug logs
    console.log('Full request URL:', `${instance.defaults.baseURL}${config.url}`)
    console.log('Token:', token?.substring(0, 20) + '...')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle auth errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data)
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance 