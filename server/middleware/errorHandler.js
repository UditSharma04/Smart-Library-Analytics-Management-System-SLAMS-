export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)
  
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ message: 'Invalid ID format' })
  }

  res.status(500).json({
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
} 