export const calculateDueDate = (startDate, days) => {
  const dueDate = new Date(startDate)
  dueDate.setDate(dueDate.getDate() + days)
  return dueDate
}

export const calculateFine = (dueDate, returnDate = new Date()) => {
  if (returnDate <= dueDate) return 0
  
  const daysLate = Math.ceil(
    (returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  const finePerDay = 5 // ₹5 per day
  return daysLate * finePerDay
} 