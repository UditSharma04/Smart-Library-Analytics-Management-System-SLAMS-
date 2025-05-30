import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import libraryRoutes from './routes/libraryRoutes.js'
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import bookRoutes from './routes/bookRoutes.js'
import spaceRoutes from './routes/spaceRoutes.js'
import fineRoutes from './routes/fineRoutes.js'
import bookRequestRoutes from './routes/bookRequestRoutes.js'
import stockFeedbackRoutes from './routes/stockFeedbackRoutes.js'
import suggestionRoutes from './routes/suggestionRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { seedDatabase, seedSpaces } from './scripts/seedData.js'
import { protect } from './middleware/auth.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import mongoose from 'mongoose'
import Space from './models/Space.js'
import borrowRoutes from './routes/borrowRoutes.js'

dotenv.config()

const app = express()

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    const allowedOrigins = process.env.CORS_ORIGINS ? 
      process.env.CORS_ORIGINS.split(',') : 
      ['http://localhost:5173', 'http://localhost:3000']
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Connect to MongoDB and seed data if needed
const initializeDatabase = async () => {
  try {
    await connectDB()
    
    // Check if seeding is needed
    const shouldSeed = process.env.SEED_DATABASE === 'true'
    if (shouldSeed) {
      await seedDatabase()
    }

    // Check if spaces collection is empty
    const spaceCount = await Space.countDocuments()
    if (spaceCount === 0) {
      console.log('No spaces found, running seed...')
      await seedSpaces()
    }

  } catch (error) {
    console.error('Database initialization error:', error)
    process.exit(1)
  }
}

// Initialize database
initializeDatabase()

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'VIT Chennai Library API Server is running!', 
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Debug middleware
app.use((req, res, next) => {
  console.log('Request:', {
    method: req.method,
    url: req.url,
    originalUrl: req.originalUrl,
    path: req.path,
    baseUrl: req.baseUrl,
    headers: {
      authorization: req.headers.authorization ? 'Bearer ...' : 'none',
      'content-type': req.headers['content-type']
    }
  })
  next()
})

// Routes
app.use('/api/library', libraryRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/spaces', spaceRoutes)
app.use('/api/fines', fineRoutes)
app.use('/api/book-requests', bookRequestRoutes)
app.use('/api/stock-feedback', stockFeedbackRoutes)
app.use('/api/suggestions', suggestionRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/borrow', borrowRoutes)

// Debug route registration
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.originalUrl)
  next()
})

// Add this log to see registered routes
console.log('Registered routes:', 
  app._router.stack
    .filter(r => r.route)
    .map(r => ({
      path: r.route.path,
      methods: Object.keys(r.route.methods)
    }))
)

// After registering all routes, add this debug log
console.log('Available Routes:', 
  app._router.stack
    .filter(r => r.route)
    .map(r => ({
      path: r.route.path,
      method: Object.keys(r.route.methods),
      fullPath: `/api${r.route.path}`
    }))
)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  })
  
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler
app.use((req, res) => {
  console.log('404 Not Found:', {
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  })
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`
  })
})

const PORT = process.env.PORT || 5000

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📅 Started at: ${new Date().toISOString()}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully')
  process.exit(0)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  })
  // Keep the process running but log the error
})

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  })
  process.exit(1)
})

export default app