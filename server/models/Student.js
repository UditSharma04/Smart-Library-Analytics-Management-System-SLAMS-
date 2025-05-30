import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
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
  department: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Match password method
studentSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const Student = mongoose.model('Student', studentSchema)

export default Student 