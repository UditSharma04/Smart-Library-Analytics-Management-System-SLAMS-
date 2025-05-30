import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  BookOpenIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  UserCircleIcon,
  BuildingLibraryIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

// Dummy data based on seed structure
const dummyUsers = [
  {
    id: '1',
    registerNumber: "22BCE1962",
    email: "udit.sharma2022@vitstudent.ac.in",
    program: "BTECH",
    branch: "Computer Science and Engineering",
    school: "School of Computer Science and Engineering",
    borrowHistory: [
      {
        bookId: '1',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        borrowDate: '2024-01-15',
        returnDate: '2024-01-29',
        status: 'returned'
      },
      {
        bookId: '2',
        title: 'Design Patterns',
        author: 'Erich Gamma',
        borrowDate: '2024-02-01',
        returnDate: '2024-02-15',
        status: 'active'
      }
    ]
  },
  {
    id: '2',
    registerNumber: "22BCE1963",
    email: "john.doe2022@vitstudent.ac.in",
    program: "BTECH",
    branch: "Computer Science and Engineering",
    school: "School of Computer Science and Engineering",
    borrowHistory: [
      {
        bookId: '3',
        title: 'Refactoring',
        author: 'Martin Fowler',
        borrowDate: '2024-01-20',
        returnDate: '2024-02-03',
        status: 'overdue'
      }
    ]
  },
  // Generate more dummy users
  ...[...Array(8)].map((_, i) => ({
    id: `${i + 3}`,
    registerNumber: `22BCE${1964 + i}`,
    email: `student${1964 + i}2022@vitstudent.ac.in`,
    program: "BTECH",
    branch: ["Computer Science and Engineering", "Electronics and Communication", "Mechanical Engineering"][i % 3],
    school: ["School of Computer Science and Engineering", "School of Electronics Engineering", "School of Mechanical Engineering"][i % 3],
    borrowHistory: [
      {
        bookId: `${i + 4}`,
        title: ['The Pragmatic Programmer', 'Introduction to Algorithms', 'Computer Networks'][i % 3],
        author: ['Andrew Hunt', 'Thomas H. Cormen', 'Andrew S. Tanenbaum'][i % 3],
        borrowDate: '2024-02-01',
        returnDate: '2024-02-15',
        status: ['active', 'returned', 'overdue'][i % 3]
      }
    ]
  }))
]

export default function Users() {
  const [expandedUser, setExpandedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredUsers = dummyUsers.filter(user => {
    const matchesSearch = 
      user.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.branch.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === 'all') return matchesSearch
    if (filter === 'active') return matchesSearch && user.borrowHistory.some(b => b.status === 'active')
    if (filter === 'overdue') return matchesSearch && user.borrowHistory.some(b => b.status === 'overdue')
    return matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-blue-400 bg-blue-400/10'
      case 'returned': return 'text-green-400 bg-green-400/10'
      case 'overdue': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-white mb-4">
          Users Management
        </h1>
        
        {/* Search and Filter */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Users</option>
            <option value="active">With Active Borrows</option>
            <option value="overdue">With Overdue Books</option>
          </select>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-700"
            >
              {/* User Summary */}
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-700/50"
                onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <UserCircleIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{user.registerNumber}</h3>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white">
                  {expandedUser === user.id ? (
                    <ChevronUpIcon className="w-5 h-5" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Expanded Details */}
              {expandedUser === user.id && (
                <div className="p-4 border-t border-gray-700">
                  {/* Academic Info */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <AcademicCapIcon className="w-4 h-4" />
                        <span>{user.program} - {user.branch}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <BuildingLibraryIcon className="w-4 h-4" />
                        <span>{user.school}</span>
                      </div>
                    </div>
                  </div>

                  {/* Borrowing History */}
                  <div>
                    <h4 className="font-medium text-white mb-3">Borrowing History</h4>
                    <div className="space-y-3">
                      {user.borrowHistory.map((borrow) => (
                        <div 
                          key={borrow.bookId}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50"
                        >
                          <div className="flex items-center gap-3">
                            <BookOpenIcon className="w-5 h-5 text-gray-400" />
                            <div>
                              <h5 className="font-medium text-white">{borrow.title}</h5>
                              <p className="text-sm text-gray-400">{borrow.author}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(borrow.status)}`}>
                              {borrow.status === 'active' && <ClockIcon className="w-3 h-3 mr-1" />}
                              {borrow.status === 'returned' && <CheckCircleIcon className="w-3 h-3 mr-1" />}
                              {borrow.status === 'overdue' && <ExclamationCircleIcon className="w-3 h-3 mr-1" />}
                              {borrow.status.charAt(0).toUpperCase() + borrow.status.slice(1)}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {borrow.borrowDate} - {borrow.returnDate}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 