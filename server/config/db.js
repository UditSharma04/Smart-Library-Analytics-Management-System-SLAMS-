import mongoose from 'mongoose';
import { seedStudents } from '../scripts/seedData.js';
import seedSpaces from '../scripts/seedSpaces.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed data if needed
    const Student = mongoose.model('Student');
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      await seedStudents();
    }

    const Space = mongoose.model('Space');
    const spaceCount = await Space.countDocuments();
    if (spaceCount === 0) {
      await seedSpaces();
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB; 