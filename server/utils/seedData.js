import mongoose from 'mongoose'
import Student from '../models/Student.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load env variables
dotenv.config({ path: path.join(__dirname, '../.env') })

const dummyStudents = [
  {
    registerNumber: "22BCE1962",
    email: "udit.sharma2022@vitstudent.ac.in",
    password: "123456",
    program: "BTECH",
    branch: "Computer Science and Engineering",
    school: "School of Computer Science and Engineering",
    applicationNumber: "2022298666",
    hostel: {
      blockName: "A Block Mens Hostel (A - Block )",
      roomNo: "443",
      bedType: "4- BED -NAC"
    }
  },
  {
    registerNumber: "22BCE1963",
    email: "john.doe2022@vitstudent.ac.in",
    password: "123456",
    program: "BTECH",
    branch: "Computer Science and Engineering",
    school: "School of Computer Science and Engineering",
    applicationNumber: "2022298667",
    hostel: {
      blockName: "A Block Mens Hostel (A - Block )",
      roomNo: "444",
      bedType: "4- BED -NAC"
    }
  },
  // Generate 18 more entries programmatically
  ...[...Array(18)].map((_, i) => ({
    registerNumber: `22BCE${1964 + i}`,
    email: `student${1964 + i}2022@vitstudent.ac.in`,
    password: "123456",
    program: "BTECH",
    branch: ["Computer Science and Engineering", "Electronics and Communication", "Mechanical Engineering"][i % 3],
    school: ["School of Computer Science and Engineering", "School of Electronics Engineering", "School of Mechanical Engineering"][i % 3],
    applicationNumber: `2022298${668 + i}`,
    hostel: {
      blockName: `${["A", "B", "C"][i % 3]} Block Mens Hostel`,
      roomNo: `${445 + i}`,
      bedType: "4- BED -NAC"
    }
  }))
]

export const setsData = [
  {
    book: '/* book_id_here */',
    totalUnits: 5,
    unitCodes: [
      {
        code: 'SS101-001',
        rfid: 'RF101001',
        status: 'available',
        condition: 'good',
        location: {
          shelf: 'A1',
          row: '1',
          section: 'Social Studies'
        }
      },
      {
        code: 'SS101-002',
        rfid: 'RF101002',
        status: 'available',
        condition: 'good',
        location: {
          shelf: 'A1',
          row: '1',
          section: 'Social Studies'
        }
      },
      // ... more units
    ]
  },
  // ... more sets
]

async function seedDatabase() {
  try {
    // Verify MongoDB URI
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
    
    // Clear existing data
    await Student.deleteMany({})
    console.log('Cleared existing students')
    
    // Hash passwords and insert data
    const hashedStudents = await Promise.all(
      dummyStudents.map(async (student) => {
        const hashedPassword = await bcrypt.hash(student.password, 10)
        return { ...student, password: hashedPassword }
      })
    )
    
    await Student.insertMany(hashedStudents)
    console.log('Database seeded successfully')

    // Log sample data
    const sampleStudent = await Student.findOne().select('-password')
    console.log('\nSample Student Data:')
    console.log(JSON.stringify(sampleStudent, null, 2))

    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase() 