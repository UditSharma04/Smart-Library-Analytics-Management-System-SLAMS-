import PDFDocument from 'pdfkit'
import { format } from 'date-fns'

export const generateReceipt = (fine, stream) => {
  try {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    })

    doc.pipe(stream)

    // Helper for formatted date
    const formatDate = (date) => {
      try {
        return format(new Date(date), 'PPpp')
      } catch (error) {
        return 'Date not available'
      }
    }

    // Add header with styling
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .text('VIT Chennai', { align: 'center' })
       .fontSize(20)
       .font('Helvetica')
       .text('Library Management System', { align: 'center' })
       .fontSize(16)
       .text('Fine Payment Receipt', { align: 'center' })
       .moveDown(2)

    // Add receipt details in a box
    doc.rect(50, doc.y, 500, 100)
       .stroke()
       .moveDown(0.5)

    // Receipt info
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Receipt Details', { align: 'center' })
       .moveDown(0.5)
       .font('Helvetica')
       .text(`Receipt Number: ${fine.receiptNumber}`, { align: 'left', indent: 20 })
       .text(`Issue Date: ${formatDate(fine.paymentDate)}`, { align: 'left', indent: 20 })
       .moveDown(2)

    // Student details
    doc.font('Helvetica-Bold')
       .text('Student Information', { underline: true })
       .moveDown(0.5)
       .font('Helvetica')
       .text(`Name: ${fine.student.name}`)
       .text(`Register Number: ${fine.student.registerNumber}`)
       .moveDown(1.5)

    // Fine details
    doc.font('Helvetica-Bold')
       .text('Fine Details', { underline: true })
       .moveDown(0.5)
       .font('Helvetica')
       .text(`Book Title: ${fine.book.title}`)
       .text(`Due Date: ${formatDate(fine.dueDate)}`)
       .text(`Return Date: ${formatDate(fine.returnDate)}`)
       .text(`Days Late: ${fine.daysLate}`)
       .moveDown(1.5)

    // Payment details
    doc.font('Helvetica-Bold')
       .text('Payment Information', { underline: true })
       .moveDown(0.5)
       .font('Helvetica')
       .text(`Amount Paid: ₹${fine.amount}`)
       .text(`Payment Method: ${fine.paymentMethod?.toUpperCase() || 'ONLINE'}`)
       .text(`Payment Status: ${fine.status?.toUpperCase()}`)
       .moveDown(2)

    // Add a line for signature
    doc.lineWidth(0.5)
       .moveTo(350, doc.y)
       .lineTo(500, doc.y)
       .stroke()
       .text('Librarian\'s Signature', 350, doc.y + 5)
       .moveDown(2)

    // Footer
    doc.fontSize(10)
       .text('This is a computer generated receipt. No signature required.', { align: 'center' })
       .moveDown(0.5)
       .text('For any queries, please contact the library at library@vit.ac.in', { align: 'center' })
       .text('VIT Chennai - Library Management System', { align: 'center' })

    // Add timestamp at bottom
    doc.fontSize(8)
       .text(`Generated on: ${format(new Date(), 'PPpp')}`, 50, doc.page.height - 50)

    doc.end()
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
} 