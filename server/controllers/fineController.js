import Fine from '../models/Fine.js'
import Borrow from '../models/Borrow.js'
import { calculateFine } from '../utils/dateUtils.js'
import { generateReceipt } from '../utils/pdfGenerator.js'

export const getFines = async (req, res) => {
  try {
    console.log('\ngetFines called')
    console.log('User from request:', {
      id: req.user?._id,
      name: req.user?.name,
      registerNumber: req.user?.registerNumber
    })
    
    const studentId = req.user?._id
    console.log('Using student ID:', studentId)

    // Get pending fines
    const pendingFines = await Fine.find({ 
      student: studentId,
      status: 'pending'
    })
    .populate('book', 'title')
    .sort('-createdAt')
    
    console.log('\nFound pending fines:', {
      count: pendingFines.length,
      fines: pendingFines.map(fine => ({
        id: fine._id,
        bookTitle: fine.book?.title,
        amount: fine.amount,
        dueDate: fine.dueDate
      }))
    })

    // Get payment history
    const paidFines = await Fine.find({
      student: studentId,
      status: 'paid'
    })
    .populate('book', 'title')
    .sort('-paymentDate')
    
    console.log('Raw paid fines:', paidFines)

    // Calculate total outstanding
    const total = pendingFines.reduce((sum, fine) => sum + fine.amount, 0)

    const response = {
      total,
      items: pendingFines.map(fine => ({
        id: fine._id,
        bookTitle: fine.book?.title || 'Unknown Book',
        dueDate: fine.dueDate,
        returnDate: fine.returnDate,
        daysLate: fine.daysLate,
        amount: fine.amount,
        status: fine.status
      })),
      history: paidFines.map(fine => ({
        id: fine._id,
        bookTitle: fine.book?.title || 'Unknown Book',
        amount: fine.amount,
        paidOn: fine.paymentDate,
        status: fine.status,
        receiptNumber: fine.receiptNumber
      }))
    }

    console.log('Final response:', response)
    res.json(response)
  } catch (error) {
    console.error('Error in getFines:', error)
    res.status(500).json({ 
      message: 'Failed to fetch fines',
      error: error.message 
    })
  }
}

export const payFine = async (req, res) => {
  try {
    const { fineId } = req.params
    const { paymentMethod } = req.body

    const fine = await Fine.findById(fineId)
    if (!fine) {
      return res.status(404).json({ message: 'Fine not found' })
    }

    // Update fine status
    fine.status = 'paid'
    fine.paymentDate = new Date()
    fine.paymentMethod = paymentMethod
    fine.receiptNumber = `RCP${Date.now()}`
    await fine.save()

    res.json({ 
      message: 'Payment successful',
      receiptNumber: fine.receiptNumber
    })
  } catch (error) {
    console.error('Error processing payment:', error)
    res.status(500).json({ message: 'Payment failed' })
  }
}

export const downloadReceipt = async (req, res) => {
  try {
    const { fineId } = req.params
    const fine = await Fine.findById(fineId)
      .populate('book', 'title')
      .populate('student', 'name registerNumber')

    if (!fine) {
      return res.status(404).json({ message: 'Receipt not found' })
    }

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=receipt-${fine.receiptNumber}.pdf`
    )

    // Generate and stream the PDF
    generateReceipt(fine, res)

  } catch (error) {
    console.error('Error downloading receipt:', error)
    res.status(500).json({ message: 'Failed to download receipt' })
  }
}

export const createFine = async (req, res) => {
  try {
    const { bookId, borrowId, amount, type } = req.body
    const studentId = req.user._id

    const fine = await Fine.create({
      student: studentId,
      book: bookId,
      borrow: borrowId,
      amount,
      type,
      dueDate: new Date(),
      status: 'pending'
    })

    res.status(201).json(fine)
  } catch (error) {
    console.error('Error creating fine:', error)
    res.status(500).json({ message: 'Failed to create fine' })
  }
} 