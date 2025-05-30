import mongoose from 'mongoose'
import Library from '../models/Library.js'
import dotenv from 'dotenv'
import Set from '../models/Set.js'
import { setsData } from '../utils/seedData.js'

dotenv.config()

const mockBooks = [
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
    price: 45.99,
    penalty: 5,
    availability: {
      status: true
    },
    location: {
      shelf: {
        number: "A1",
        title: "Programming Fundamentals"
      },
      section: "Technology"
    },
    details: {
      publisher: "Prentice Hall",
      publishedYear: 2008,
      edition: "1st",
      pages: 464,
      language: "English",
      genre: ["Programming", "Software Engineering"],
      description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees..."
    }
  },
  {
    title: "Design Patterns",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    isbn: "9780201633610",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg",
    price: 54.99,
    penalty: 5,
    availability: {
      status: false
    },
    location: {
      shelf: {
        number: "A2",
        title: "Software Architecture"
      },
      section: "Technology"
    },
    details: {
      publisher: "Addison-Wesley",
      publishedYear: 1994,
      edition: "1st",
      pages: 416,
      language: "English",
      genre: ["Software Design", "Programming"],
      description: "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems."
    }
  },
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
    isbn: "9780262033848",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg",
    price: 89.99,
    penalty: 8,
    availability: {
      status: true
    },
    location: {
      shelf: {
        number: "B1",
        title: "Algorithms & Data Structures"
      },
      section: "Technology"
    },
    details: {
      publisher: "MIT Press",
      publishedYear: 2009,
      edition: "3rd",
      pages: 1312,
      language: "English",
      genre: ["Algorithms", "Computer Science"],
      description: "The latest edition of the essential text and reference in the field of computer algorithms."
    }
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    isbn: "9780201616224",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780201616224-L.jpg",
    price: 49.99,
    penalty: 5,
    availability: {
      status: true
    },
    location: {
      shelf: {
        number: "A1",
        title: "Programming Fundamentals"
      },
      section: "Technology"
    },
    details: {
      publisher: "Addison-Wesley",
      publishedYear: 1999,
      edition: "1st",
      pages: 352,
      language: "English",
      genre: ["Programming", "Software Engineering"],
      description: "Written as a series of self-contained sections and filled with entertaining anecdotes, thoughtful examples, and interesting analogies."
    }
  },
  {
    title: "Database System Concepts",
    author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
    isbn: "9780073523323",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780073523323-L.jpg",
    price: 79.99,
    penalty: 7,
    availability: {
      status: true
    },
    location: {
      shelf: {
        number: "C1",
        title: "Database Systems"
      },
      section: "Technology"
    },
    details: {
      publisher: "McGraw-Hill",
      publishedYear: 2010,
      edition: "6th",
      pages: 1376,
      language: "English",
      genre: ["Database", "Computer Science"],
      description: "Database System Concepts provides a comprehensive introduction to the field of database systems."
    }
  },
  {
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum, David J. Wetherall",
    isbn: "9780132126953",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780132126953-L.jpg",
    price: 82.99,
    penalty: 7,
    availability: {
      status: true
    },
    location: {
      shelf: {
        number: "D1",
        title: "Computer Networks"
      },
      section: "Technology"
    },
    details: {
      publisher: "Prentice Hall",
      publishedYear: 2010,
      edition: "5th",
      pages: 960,
      language: "English",
      genre: ["Networking", "Computer Science"],
      description: "A comprehensive look at computer networking from the inside out."
    }
  },
  {
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    isbn: "9780136042594",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780136042594-L.jpg",
    price: 99.99,
    penalty: 8,
    availability: {
      status: false
    },
    location: {
      shelf: {
        number: "E1",
        title: "Artificial Intelligence"
      },
      section: "Technology"
    },
    details: {
      publisher: "Prentice Hall",
      publishedYear: 2009,
      edition: "3rd",
      pages: 1152,
      language: "English",
      genre: ["Artificial Intelligence", "Computer Science"],
      description: "The leading textbook in Artificial Intelligence, used in over 1400 universities in over 125 countries."
    }
  },
  {
    title: "Operating System Concepts",
    author: "Abraham Silberschatz, Peter B. Galvin, Greg Gagne",
    isbn: "9781118063330",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781118063330-L.jpg",
    price: 79.99,
    penalty: 7,
    availability: {
      status: true
    },
    location: {
      shelf: {
        number: "F1",
        title: "Operating Systems"
      },
      section: "Technology"
    },
    details: {
      publisher: "Wiley",
      publishedYear: 2012,
      edition: "9th",
      pages: 976,
      language: "English",
      genre: ["Operating Systems", "Computer Science"],
      description: "The ninth edition of Operating System Concepts continues to evolve to provide a solid theoretical foundation for understanding operating systems."
    }
  }
]

async function seedLibrary() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    
    // Clear existing data
    await Library.deleteMany({})
    await Set.deleteMany({})
    
    // Insert mock books
    const books = await Library.insertMany(mockBooks)
    console.log('Library seeded successfully!')

    // Create sets for each book
    const sets = books.map(book => ({
      book: book._id,
      totalUnits: Math.floor(Math.random() * 3) + 3, // 3-5 units per book
      unitCodes: Array.from({ length: 5 }, (_, i) => ({
        code: `${book._id.toString().slice(-6)}-${(i + 1).toString().padStart(3, '0')}`,
        rfid: `RF${book._id.toString().slice(-6)}${(i + 1).toString().padStart(3, '0')}`,
        status: 'available',
        condition: 'good',
        location: {
          shelf: book.location.shelf.number,
          row: `Row ${Math.floor(i / 2) + 1}`,
          section: book.location.section
        }
      }))
    }))

    await Set.insertMany(sets)
    console.log('Sets seeded successfully!')

    // Log some sample data
    const sampleSet = await Set.findOne().populate('book')
    console.log('\nSample Set Data:')
    console.log(JSON.stringify({
      bookTitle: sampleSet.book.title,
      totalUnits: sampleSet.totalUnits,
      sampleUnit: sampleSet.unitCodes[0]
    }, null, 2))

    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedLibrary() 