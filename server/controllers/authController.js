import Student from '../models/Student.js'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

// Login student
export const login = async (req, res) => {
  try {
    const { registerNumber, password } = req.body
    const student = await Student.findOne({ registerNumber })

    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcryptjs.compare(password, student.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({
      token,
      user: {
        id: student._id,
        name: student.name,
        registerNumber: student.registerNumber,
        email: student.email
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Login failed' })
  }
}

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user exists
    let user = await Student.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    // Create user
    user = await Student.create({
      name,
      email,
      password: hashedPassword
    })

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Registration failed' })
  }
}

// Get student profile
export const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-password')
    res.json(student)
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Failed to get profile' })
  }
} 