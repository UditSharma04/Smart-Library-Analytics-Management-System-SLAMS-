import mongoose from 'mongoose'
import Admin from '../models/Admin.js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

const adminData = {
  username: 'admin',
  email: 'admin@library.com',
  password: 'admin123',
  role: 'super_admin',
  permissions: [
    'manage_books',
    'manage_students',
    'manage_borrows',
    'manage_admins',
    'view_reports',
    'manage_settings'
  ],
  status: 'active'
}

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    
    // Clear existing admins
    await Admin.deleteMany({})
    
    // Create new admin
    const admin = await Admin.create(adminData)
    
    console.log('Admin seeded successfully:', {
      username: admin.username,
      email: admin.email,
      role: admin.role
    })
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding admin:', error)
    process.exit(1)
  }
}

seedAdmin() 