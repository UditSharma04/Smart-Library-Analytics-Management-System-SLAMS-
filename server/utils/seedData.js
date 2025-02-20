import mongoose from 'mongoose'
import Student from '../models/Student.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

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

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    
    // Clear existing data
    await Student.deleteMany({})
    
    // Hash passwords and insert data
    const hashedStudents = await Promise.all(
      dummyStudents.map(async (student) => {
        const hashedPassword = await bcrypt.hash(student.password, 10)
        return { ...student, password: hashedPassword }
      })
    )
    
    await Student.insertMany(hashedStudents)
    console.log('Database seeded successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase() 