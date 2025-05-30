export const validateBookRequest = (data) => {
  const { title, justification } = data

  if (!title) {
    return 'Book title is required'
  }

  if (!justification) {
    return 'Justification is required'
  }

  if (data.unitsCount && (data.unitsCount < 1 || data.unitsCount > 100)) {
    return 'Units count must be between 1 and 100'
  }

  return null
} 