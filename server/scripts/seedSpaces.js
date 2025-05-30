import mongoose from 'mongoose'
import Space from '../models/Space.js'

const seedSpaces = async () => {
  try {
    // Clear existing data
    await Space.deleteMany({})

    // Create initial space data
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
          upcomingBookings: []
        },
        {
          roomId: 'DR2',
          name: 'Discussion Room 2',
          capacity: 8,
          status: 'in-use',
          features: ['Whiteboard', 'Projector', 'Power Outlets'],
          upcomingBookings: []
        },
        {
          roomId: 'DR3',
          name: 'Discussion Room 3',
          capacity: 6,
          status: 'available',
          features: ['Whiteboard', 'Power Outlets'],
          upcomingBookings: []
        },
        {
          roomId: 'DR4',
          name: 'Discussion Room 4',
          capacity: 6,
          status: 'in-use',
          features: ['TV Screen', 'Power Outlets'],
          upcomingBookings: []
        },
        {
          roomId: 'DR5',
          name: 'Discussion Room 5',
          capacity: 8,
          status: 'available',
          features: ['Whiteboard', 'TV Screen', 'Power Outlets'],
          upcomingBookings: []
        }
      ]
    }

    await Space.create(spaceData)
    console.log('Spaces seeded successfully!')
  } catch (error) {
    console.error('Error seeding spaces:', error)
  }
}

export default seedSpaces 