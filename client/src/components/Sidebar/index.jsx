import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  HomeIcon,
  BookOpenIcon,
  BookmarkIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

export default function Sidebar({ open, onClose, isCollapsed, setIsCollapsed }) {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: HomeIcon },
    { path: '/library', name: 'Library', icon: BookOpenIcon },
    { path: '/mybooks', name: 'My Books', icon: BookmarkIcon },
    { path: '/spaces', name: 'Study Spaces', icon: AcademicCapIcon },
    { path: '/fines', name: 'Fines & Dues', icon: CurrencyDollarIcon },
    { path: '/feedback', name: 'Request & Feedback', icon: ChatBubbleLeftRightIcon }
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    try {
      // Clear all auth-related data from localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Show success message
      toast.success('Logged out successfully')
      
      // Redirect to login page
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  return (
    <div 
      className={`fixed md:sticky top-0 h-screen flex flex-col bg-white border-r border-gray-200 
        transition-all duration-300 ease-in-out overflow-hidden
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Logo Section */}
      <div className="flex-shrink-0 flex items-center justify-between h-[57px] border-b border-gray-200 px-3">
        {!isCollapsed ? (
          <Link to="/" className="flex items-center gap-3 flex-1 justify-center">
            <img 
              src="/Vellore_Institute_of_Technology_seal_2017.svg.png" 
              alt="VIT Chennai" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold text-black tracking-wide">SLAMS</span>
          </Link>
        ) : (
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full flex justify-center items-center hover:bg-gray-100 rounded-lg py-2"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-500" />
          </button>
        )}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors ml-2"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-start px-4'
            } py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-blue-900 text-white font-medium shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon 
              className={`h-5 w-5 ${
                isCollapsed ? '' : 'mr-3'
              } ${
                isActive(item.path) ? 'text-white' : 'text-gray-500'
              }`}
            />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="flex-shrink-0 p-3 space-y-2 border-t border-gray-200">
        <Link
          to="/profile"
          className={`flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-start px-4'
          } py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors`}
        >
          <UserIcon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'} text-gray-500`} />
          {!isCollapsed && <span>Profile</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 hover:bg-red-50 rounded-lg transition-all"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
} 