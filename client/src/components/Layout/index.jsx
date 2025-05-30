import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar'
import { Bars3Icon } from '@heroicons/react/24/outline'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isCollapsed ? 'pl-16' : 'pl-64'
      } md:pl-0`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-600 hover:text-gray-900"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* Page Title - Hidden on Mobile */}
            <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
              Library Dashboard
            </h1>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {user?.name?.split(' ')[0]}
              </span>
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
} 