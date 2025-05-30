import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { seedSpaces } from './seedData.js'

dotenv.config()

async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
    
    await seedSpaces()
    console.log('Seeding completed successfully')
  } catch (error) {
    console.error('Error running seed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

runSeed() 