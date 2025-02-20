import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import QuickStats from './components/QuickStats'
import BorrowedBooks from './components/BorrowedBooks'
import LibrarySpace from './components/LibrarySpace'
import ActivityTimeline from './components/ActivityTimeline'
import QuickActions from './components/QuickActions'
import UpcomingDues from './components/UpcomingDues'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Navigation */}
        <Topbar />

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Quick Stats */}
          <section className="mb-8">
            <QuickStats />
          </section>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <BorrowedBooks />
              <LibrarySpace />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <ActivityTimeline />
              <QuickActions />
              <UpcomingDues />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 