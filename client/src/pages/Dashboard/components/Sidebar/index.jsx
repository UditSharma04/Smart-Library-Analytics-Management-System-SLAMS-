import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  ClockIcon,
  CurrencyDollarIcon,
  QuestionMarkCircleIcon,
  QrCodeIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

const menuItems = [
  { icon: HomeIcon, label: 'Overview', path: '/dashboard' },
  { icon: BookOpenIcon, label: 'My Books', path: '/dashboard/books' },
  { icon: UserGroupIcon, label: 'Study Spaces', path: '/dashboard/spaces' },
  { icon: ClockIcon, label: 'Reading History', path: '/dashboard/history' },
  { icon: CurrencyDollarIcon, label: 'Fines & Dues', path: '/dashboard/fines' },
  { icon: QuestionMarkCircleIcon, label: 'Help & Support', path: '/dashboard/help' }
]

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate()
  
  return (
    <>
      {/* Sidebar */}
      <div 
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300
          ${isOpen ? 'w-64' : 'w-20'}
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {isOpen ? (
            <span className="text-xl font-heading font-bold text-primary">SLAMS</span>
          ) : (
            <span className="text-xl font-heading font-bold text-primary mx-auto">S</span>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              whileHover={{ x: 5 }}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center px-3 py-2 rounded-lg text-gray-600 hover:bg-primary/5 hover:text-primary
                transition-colors group
              `}
            >
              <item.icon className="w-6 h-6" />
              {isOpen && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Quick QR Scanner Access */}
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <button
            className={`
              w-full flex items-center justify-center px-3 py-2 rounded-lg bg-primary text-white
              hover:bg-primary-dark transition-colors
            `}
          >
            <QrCodeIcon className="w-6 h-6" />
            {isOpen && <span className="ml-2">Scan QR</span>}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
} 