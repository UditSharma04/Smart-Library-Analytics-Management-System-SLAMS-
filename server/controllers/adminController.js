import Admin from '../models/Admin.js'
import jwt from 'jsonwebtoken'

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id, isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body

    const admin = await Admin.findOne({ username })

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (admin.status !== 'active') {
      return res.status(403).json({ message: 'Account is not active' })
    }

    // Update last login
    admin.lastLogin = new Date()
    await admin.save()

    res.json({
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      token: generateToken(admin._id)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select('-password')
    res.json(admin)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private/Admin
export const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id)
    
    if (admin) {
      admin.email = req.body.email || admin.email
      if (req.body.password) {
        admin.password = req.body.password
      }
      
      const updatedAdmin = await admin.save()
      
      res.json({
        _id: updatedAdmin._id,
        username: updatedAdmin.username,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        permissions: updatedAdmin.permissions
      })
    } else {
      res.status(404).json({ message: 'Admin not found' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 