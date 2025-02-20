import Student from '../models/Student.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
  try {
    const { registerNumber, password } = req.body

    // Check if student exists
    const student = await Student.findOne({ registerNumber })
    if (!student) {
      return res.status(401).json({ 
        message: 'Invalid registration number or password' 
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, student.password)
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Invalid registration number or password' 
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: student._id,
        registerNumber: student.registerNumber,
        email: student.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Send response without password
    const { password: _, ...studentData } = student.toObject()

    res.status(200).json({
      message: 'Login successful',
      token,
      student: studentData
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      message: 'An error occurred during login' 
    })
  }
} 