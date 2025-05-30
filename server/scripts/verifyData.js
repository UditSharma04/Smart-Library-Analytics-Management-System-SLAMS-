import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Book from '../models/Book.js'
import Borrow from '../models/Borrow.js'

dotenv.config()

async function verifyData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    
    // Check books
    const books = await Book.find()
    console.log('\nBooks with missing images:')
    books.forEach(book => {
      if (!book.coverImage) {
        console.log(`Book ${book.title} is missing coverImage`)
      }
    })

    // Check borrows with populated books
    const borrows = await Borrow.find().populate('book')
    console.log('\nBorrows with book details:')
    borrows.forEach(borrow => {
      console.log({
        borrowId: borrow._id,
        bookId: borrow.book?._id,
        title: borrow.book?.title,
        hasImage: !!borrow.book?.coverImage
      })
    })

    // Add this function to verify book data
    const verifyBookImages = async () => {
      const books = await Book.find({}, 'title coverImage')
      console.log('\nChecking book images:')
      books.forEach(book => {
        if (!book.coverImage) {
          console.log(`Book "${book.title}" is missing coverImage`)
        } else {
          console.log(`Book "${book.title}" has image: ${book.coverImage}`)
        }
      })
    }

    // Call it in your verify function
    await verifyBookImages()

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

verifyData() 