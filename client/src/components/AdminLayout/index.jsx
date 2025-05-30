import { useState } from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { 
  HomeIcon, 
  UsersIcon, 
  QrCodeIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function AdminLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}')

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/admin/dashboard' },
    { name: 'QR Generator', icon: QrCodeIcon, path: '/admin/qr-generator' },
    { name: 'Users', icon: UsersIcon, path: '/admin/users' },
    { name: 'Issues', icon: ExclamationCircleIcon, path: '/admin/issues' },
    { name: 'Profile', icon: UserCircleIcon, path: '/admin/profile' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-200 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 bg-gray-900">
            <span className="text-xl font-bold text-white">Admin Portal</span>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <UserCircleIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{adminData.username}</p>
                <p className="text-xs text-gray-400">{adminData.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-gray-800 h-16 flex items-center px-4 shadow-md">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-400 hover:text-white mr-4"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-white">
            Library Management System
          </h1>
        </div>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 