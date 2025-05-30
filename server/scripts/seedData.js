import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import Book from '../models/Book.js'
import Set from '../models/Set.js'
import Review from '../models/Review.js'
import Borrow from '../models/Borrow.js'
import Student from '../models/Student.js'
import Space from '../models/Space.js'
import Fine from '../models/Fine.js'

dotenv.config()

// Sample student data
const sampleStudents = [
  {
    name: "Udit Sharma",
    registerNumber: "22BCE1962",
    email: "udit.sharma2022@vitstudent.ac.in",
    password: "123456",
    program: "BTECH",
    branch: "Computer Science and Engineering",
    school: "School of Computer Science and Engineering",
    applicationNumber: "2022298666",
    department: "Computer Science",
    hostel: {
      blockName: "A Block Mens Hostel (A - Block )",
      roomNo: "443",
      bedType: "4- BED -NAC"
    }
  },
  {
    name: "John Doe",
    registerNumber: "22BCE1963",
    email: "john.doe2022@vitstudent.ac.in",
    password: "123456",
    program: "BTECH",
    branch: "Computer Science and Engineering",
    school: "School of Computer Science and Engineering",
    applicationNumber: "2022298667",
    department: "Computer Science",
    hostel: {
      blockName: "B Block Mens Hostel (B - Block )",
      roomNo: "221",
      bedType: "3- BED -NAC"
    }
  }
]

// Sample space data
const spaceData = {
  libraryCapacity: {
    current: 234,
    total: 500,
    lastUpdated: new Date()
  },
  discussionRooms: [
    {
      roomId: 'DR1',
      name: 'Discussion Room 1',
      capacity: 8,
      status: 'available',
      features: ['Whiteboard', 'TV Screen', 'Power Outlets'],
      currentBooking: null,
      currentUser: null,
      bookingHistory: []
    },
    {
      roomId: 'DR2',
      name: 'Discussion Room 2',
      capacity: 8,
      status: 'available',
      features: ['Whiteboard', 'Projector', 'Power Outlets'],
      currentBooking: null,
      currentUser: null,
      bookingHistory: []
    },
    {
      roomId: 'DR3',
      name: 'Discussion Room 3',
      capacity: 6,
      status: 'available',
      features: ['Whiteboard', 'Power Outlets'],
      currentBooking: null,
      currentUser: null,
      bookingHistory: []
    },
    {
      roomId: 'DR4',
      name: 'Discussion Room 4',
      capacity: 6,
      status: 'available',
      features: ['TV Screen', 'Power Outlets'],
      currentBooking: null,
      currentUser: null,
      bookingHistory: []
    },
    {
      roomId: 'DR5',
      name: 'Discussion Room 5',
      capacity: 8,
      status: 'available',
      features: ['Whiteboard', 'TV Screen', 'Power Outlets'],
      currentBooking: null,
      currentUser: null,
      bookingHistory: []
    }
  ]
}

// Sample books data
const sampleBooks = [
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    description: 'A handbook of agile software craftsmanship',
    coverImage: 'https://m.media-amazon.com/images/I/41xShlnTZTL._SX200_.jpg',
    publishedYear: 2008,
    publisher: 'Prentice Hall',
    pageCount: 464,
    language: 'English',
    category: 'Technology',
    subCategory: 'Software Engineering',
    price: 599,
    edition: '1st',
    format: 'Hardcover',
    tags: ['Programming', 'Software Engineering', 'Best Practices'],
    metadata: {
      deweyDecimal: '005.1',
      libraryOfCongress: 'QA76.73.J38',
      originalLanguage: 'English'
    },
    borrowingDetails: {
      loanPeriod: 14,
      renewalsAllowed: 2,
      lateFeePerDay: 5
    }
  },
  {
    title: 'Design Patterns',
    author: 'Erich Gamma',
    isbn: '9780201633610',
    description: 'Elements of Reusable Object-Oriented Software',
    coverImage: 'https://m.media-amazon.com/images/I/51szD9HC9pL._SX200_.jpg',
    publishedYear: 1994,
    publisher: 'Addison-Wesley',
    pageCount: 395,
    language: 'English',
    category: 'Technology',
    subCategory: 'Software Design',
    price: 699,
    edition: '1st',
    format: 'Hardcover',
    tags: ['Programming', 'Software Design', 'Object-Oriented'],
    metadata: {
      deweyDecimal: '005.1',
      libraryOfCongress: 'QA76.64',
      originalLanguage: 'English'
    },
    borrowingDetails: {
      loanPeriod: 14,
      renewalsAllowed: 2,
      lateFeePerDay: 5
    }
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    isbn: '9780201616224',
    description: 'From Journeyman to Master',
    coverImage: 'https://m.media-amazon.com/images/I/41HXiIojloL._SX200_.jpg',
    publishedYear: 1999,
    publisher: 'Addison-Wesley',
    pageCount: 352,
    language: 'English',
    category: 'Technology',
    subCategory: 'Software Engineering',
    price: 549,
    edition: '1st',
    format: 'Paperback',
    tags: ['Programming', 'Software Engineering', 'Career'],
    metadata: {
      deweyDecimal: '005.1',
      libraryOfCongress: 'QA76.6',
      originalLanguage: 'English'
    },
    borrowingDetails: {
      loanPeriod: 14,
      renewalsAllowed: 2,
      lateFeePerDay: 5
    }
  },
  {
    title: 'Refactoring',
    author: 'Martin Fowler',
    isbn: '9780134757599',
    description: 'Improving the Design of Existing Code',
    coverImage: 'https://m.media-amazon.com/images/I/51K-M5hR8+L._SX200_.jpg',
    publishedYear: 2018,
    publisher: 'Addison-Wesley',
    pageCount: 448,
    language: 'English',
    category: 'Technology',
    subCategory: 'Software Engineering',
    price: 649,
    edition: '2nd',
    format: 'Hardcover',
    tags: ['Programming', 'Software Engineering', 'Refactoring'],
    metadata: {
      deweyDecimal: '005.1',
      libraryOfCongress: 'QA76.76.R42',
      originalLanguage: 'English'
    },
    borrowingDetails: {
      loanPeriod: 14,
      renewalsAllowed: 2,
      lateFeePerDay: 5
    }
  },
  {
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '9780262033848',
    description: 'A Comprehensive Guide to Algorithms',
    coverImage: 'https://m.media-amazon.com/images/I/51+qR7+Q0jL._SX200_.jpg',
    publishedYear: 2009,
    publisher: 'MIT Press',
    pageCount: 1312,
    language: 'English',
    category: 'Technology',
    subCategory: 'Computer Science',
    price: 799,
    edition: '3rd',
    format: 'Hardcover',
    tags: ['Algorithms', 'Computer Science', 'Programming'],
    metadata: {
      deweyDecimal: '005.1',
      libraryOfCongress: 'QA76.6.C662',
      originalLanguage: 'English'
    },
    borrowingDetails: {
      loanPeriod: 14,
      renewalsAllowed: 2,
      lateFeePerDay: 5
    }
  }
]

// Create sets with QR code images
const generateQRImageUrl = (code) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${code}`
}

// Export the seedSpaces function
export const seedSpaces = async () => {
  try {
    // Clear existing spaces
    await Space.deleteMany({})

    await Space.create({
      name: 'Main Library',
      type: 'study_room',
      capacity: 500,
      libraryCapacity: {
        current: 234,
        total: 500,
        lastUpdated: new Date()
      },
      discussionRooms: [
        {
          roomId: 'DR1',
          name: 'Discussion Room 1',
          capacity: 8,
          status: 'maintenance',
          features: ['Whiteboard', 'TV Screen', 'Power Outlets'],
          currentBooking: null,
          bookingHistory: []
        },
        {
          roomId: 'DR2',
          name: 'Discussion Room 2',
          capacity: 8,
          status: 'available',
          features: ['Whiteboard', 'Projector', 'Power Outlets'],
          currentBooking: null,
          bookingHistory: []
        },
        {
          roomId: 'DR3',
          name: 'Discussion Room 3',
          capacity: 6,
          status: 'available',
          features: ['Whiteboard', 'Power Outlets'],
          currentBooking: null,
          bookingHistory: []
        },
        {
          roomId: 'DR4',
          name: 'Discussion Room 4',
          capacity: 6,
          status: 'available',
          features: ['TV Screen', 'Power Outlets'],
          currentBooking: null,
          bookingHistory: []
        },
        {
          roomId: 'DR5',
          name: 'Discussion Room 5',
          capacity: 8,
          status: 'available',
          features: ['Whiteboard', 'TV Screen', 'Power Outlets'],
          currentBooking: null,
          bookingHistory: []
        }
      ]
    })
    console.log('Space data seeded successfully')
  } catch (error) {
    console.error('Error seeding space data:', error)
  }
}

// Export other seed functions
export const seedStudents = async () => {
  try {
    await Student.deleteMany()
    const hashedPassword = await bcrypt.hash('password123', 10)
    await Student.create({
      name: 'Test Student',
      registerNumber: '20CS001',
      email: 'test@example.com',
      password: hashedPassword,
      department: 'Computer Science'
    })
    console.log('Students seeded successfully')
  } catch (error) {
    console.error('Error seeding students:', error)
  }
}

export const seedFines = async (studentId, borrowId, bookId) => {
  await Fine.create([
    {
      student: studentId,
      book: bookId,
      borrow: borrowId,
      amount: 50,
      type: 'overdue',
      status: 'pending',
      dueDate: new Date()
    },
    {
      student: studentId,
      book: bookId,
      borrow: borrowId,
      amount: 100,
      type: 'damage',
      status: 'pending',
      dueDate: new Date()
    }
  ])
}

// Main seed function
export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...')
    
    // Clear existing data
    await Book.deleteMany({})
    await Set.deleteMany({})
    await Review.deleteMany({})
    await Borrow.deleteMany({})
    await Student.deleteMany({})
    await Space.deleteMany({})
    await Fine.deleteMany({})
    
    // Run all seed functions
    await seedSpaces()
    await seedStudents()
    // Add other seed functions as needed
    
    console.log('All seed operations completed')
  } catch (error) {
    console.error('Error in seed operations:', error)
    throw error
  }
} 