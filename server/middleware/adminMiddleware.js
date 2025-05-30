import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

export const protectAdmin = async (req, res, next) => {
  try {
    let token

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get admin from token
      const admin = await Admin.findById(decoded.id).select('-password')
      if (!admin) {
        return res.status(401).json({ message: 'Not authorized to access this route' })
      }

      // Check if admin is active
      if (admin.status !== 'active') {
        return res.status(401).json({ message: 'Your account is not active' })
      }

      req.user = admin
      next()
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized to access this route' })
    }
  } catch (error) {
    console.error('Admin middleware error:', error)
    res.status(500).json({ message: 'Server error' })
  }
} 