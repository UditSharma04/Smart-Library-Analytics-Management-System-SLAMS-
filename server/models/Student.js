import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
  registerNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  program: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  school: {
    type: String,
    required: true
  },
  applicationNumber: {
    type: String,
    required: true
  },
  hostel: {
    blockName: String,
    roomNo: String,
    bedType: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Student', studentSchema) 