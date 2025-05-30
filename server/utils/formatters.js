export const formatReviewResponse = (reviewDoc) => {
  return {
    _id: reviewDoc._id.toString(),
    rating: reviewDoc.rating || 0,
    review: reviewDoc.review || '',
    notes: reviewDoc.notes
      .filter(note => note.type === 'note' || note.type === 'notes')
      .map(note => ({
        _id: note._id.toString(),
        content: note.content,
        page: note.page,
        createdAt: note.createdAt,
        type: note.type
      })),
    highlights: reviewDoc.notes
      .filter(note => note.type === 'highlight' || note.type === 'highlights')
      .map(highlight => ({
        _id: highlight._id.toString(),
        content: highlight.content,
        page: highlight.page,
        createdAt: highlight.createdAt,
        type: highlight.type
      }))
  }
} 