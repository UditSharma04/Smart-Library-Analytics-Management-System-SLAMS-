import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const collection = mongoose.connection.collection('books');
    await collection.dropIndex('isbn_1');
    console.log('Successfully dropped isbn_1 index');

  } catch (error) {
    console.error('Error dropping index:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

dropIndex();