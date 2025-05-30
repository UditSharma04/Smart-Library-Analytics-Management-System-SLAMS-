import mongoose from 'mongoose'
import Book from '../models/Book.js'
import Set from '../models/Set.js'
import dotenv from 'dotenv'

dotenv.config()

const sampleBooks = [
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    description: 'A handbook of agile software craftsmanship',
    category: 'Technology',
    price: 599,
    publisher: 'Prentice Hall',
    pageCount: 464,
    publishedYear: 2008,
    language: 'English'
  },
  {
    title: 'Design Patterns',
    author: 'Erich Gamma',
    isbn: '9780201633610',
    description: 'Elements of Reusable Object-Oriented Software',
    category: 'Technology',
    price: 699,
    publisher: 'Addison-Wesley',
    pageCount: 395,
    publishedYear: 1994,
    language: 'English'
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    isbn: '9780201616224',
    description: 'From Journeyman to Master',
    category: 'Technology',
    price: 549,
    publisher: 'Addison-Wesley',
    pageCount: 352,
    publishedYear: 1999,
    language: 'English'
  }
]

async function seedBooks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await Book.deleteMany({})
    await Set.deleteMany({})
    console.log('Cleared existing books and sets')

    // Add books and create sets
    for (const bookData of sampleBooks) {
      const book = await Book.create(bookData)
      
      // Create a set with some units
      await Set.create({
        bookId: book._id,
        units: [
          { qrCode: `${book._id}-1`, status: 'available' },
          { qrCode: `${book._id}-2`, status: 'available' },
          { qrCode: `${book._id}-3`, status: 'borrowed' }
        ],
        location: {
          block: 'A',
          shelf: '1',
          row: '2',
          column: '3'
        }
      })
    }

    console.log('Database seeded successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedBooks() 