export const searchData = {
  books: [
    {
      id: 1,
      type: 'book',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      available: true
    },
    {
      id: 2,
      type: 'book',
      title: 'Design Patterns',
      author: 'Erich Gamma',
      isbn: '9780201633610',
      available: false
    },
    // Add more books...
  ],
  spaces: [
    {
      id: 1,
      type: 'space',
      name: 'Quiet Zone A1',
      capacity: 20,
      available: 15
    },
    {
      id: 2,
      type: 'space',
      name: 'Group Study Room B2',
      capacity: 8,
      available: 3
    },
    // Add more spaces...
  ],
  journals: [
    {
      id: 1,
      type: 'journal',
      title: 'IEEE Software',
      publisher: 'IEEE',
      available: true
    },
    {
      id: 2,
      type: 'journal',
      title: 'ACM Computing Surveys',
      publisher: 'ACM',
      available: true
    },
    // Add more journals...
  ]
} 