import jwt from 'jsonwebtoken'
import Student from '../models/Student.js'
import Admin from '../models/Admin.js'

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      console.log('No token provided')
      return res.status(401).json({ message: 'Not authorized - No token' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const student = await Student.findById(decoded.id).select('-password')
      
      if (!student) {
        console.log('Student not found')
        return res.status(401).json({ message: 'Not authorized - Invalid user' })
      }

      req.user = student
      next()
    } catch (error) {
      console.log('Token verification error:', error)
      return res.status(401).json({ message: 'Not authorized - Invalid token' })
    }
  } catch (error) {
    console.log('Auth middleware error:', error)
    res.status(500).json({ message: 'Server error in auth middleware' })
  }
}

export const protectAdmin = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      if (!decoded.isAdmin) {
        throw new Error('Not authorized as admin')
      }

      req.user = await Admin.findById(decoded.id).select('-password')

      if (!req.user || req.user.status !== 'active') {
        throw new Error('Admin not found or inactive')
      }

      next()
    } else {
      res.status(401).json({ message: 'Not authorized, no token' })
    }
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
} 