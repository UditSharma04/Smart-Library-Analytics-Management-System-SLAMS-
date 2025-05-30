import jwt from 'jsonwebtoken'
import Student from '../models/Student.js'

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1]
    console.log('Received token:', token)

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log('Decoded token:', decoded)

      const student = await Student.findById(decoded.id)
      console.log('Found student:', student?._id)

      if (!student) {
        return res.status(401).json({ message: 'Student not found' })
      }

      req.user = student
      next()
    } catch (error) {
      console.error('Token verification error:', error)
      return res.status(401).json({ message: 'Invalid token' })
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({ message: 'Authentication failed' })
  }
}

export const protectAdmin = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await Student.findById(decoded.id)

    if (!req.user || !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized as admin' })
    }

    next()
  } catch (error) {
    console.error('Auth error:', error)
    res.status(401).json({ message: 'Not authorized' })
  }
} 