import express from 'express'
import cors from 'cors'
import spaceRoutes from './routes/spaceRoutes.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/spaces', spaceRoutes)

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

export default app 