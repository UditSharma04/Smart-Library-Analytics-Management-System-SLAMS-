import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  ClockIcon,
  DocumentCheckIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

export default function AdminProfile() {
  const [admin] = useState({
    username: 'admin.librarian',
    email: 'librarian@vit.ac.in',
    role: 'Head Librarian',
    joinedDate: '2023-01-15',
    lastActive: '2024-02-21T10:30:00Z',
    permissions: ['manage_books', 'manage_users', 'manage_issues', 'system_settings'],
    recentActions: [
      {
        id: 1,
        action: 'Approved book request',
        timestamp: '2024-02-21T09:45:00Z',
        details: 'Clean Code by Robert C. Martin'
      },
      {
        id: 2,
        action: 'Updated system settings',
        timestamp: '2024-02-21T08:30:00Z',
        details: 'Modified borrowing rules'
      },
      {
        id: 3,
        action: 'Resolved user issue',
        timestamp: '2024-02-20T16:20:00Z',
        details: 'Reset password for user 22BCE1962'
      }
    ]
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handlePasswordChange = (e) => {
    e.preventDefault()
    // In real implementation, make API call
    toast.success('Password updated successfully')
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleLogout = () => {
    // Implement logout logic
    toast.success('Logged out successfully')
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <UserCircleIcon className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{admin.username}</h1>
                <p className="text-gray-400">{admin.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <p className="text-white">{admin.email}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Joined Date</label>
                <p className="text-white">{new Date(admin.joinedDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Last Active</label>
                <p className="text-white">{new Date(admin.lastActive).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Permissions</label>
              <div className="space-y-2">
                {admin.permissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center gap-2 text-sm text-white bg-gray-700/50 px-3 py-2 rounded-lg"
                  >
                    <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                    {permission.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Password Change */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <KeyIcon className="w-5 h-5" />
            Change Password
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Current Password</label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">New Password</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Update Password
            </button>
          </form>
        </motion.div>
      </div>

      {/* Recent Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-lg font-medium text-white mb-4">Recent Actions</h2>
        <div className="space-y-4">
          {admin.recentActions.map((action) => (
            <div
              key={action.id}
              className="flex items-start gap-3 p-4 bg-gray-700/50 rounded-lg"
            >
              <div className="p-2 bg-gray-600 rounded-lg">
                <DocumentCheckIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{action.action}</p>
                <p className="text-sm text-gray-400">{action.details}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(action.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Cog6ToothIcon className="w-5 h-5" />
          Preferences
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <BellIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-white">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive email alerts for important events</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <ClockIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-white">Auto Logout</p>
                <p className="text-sm text-gray-400">Automatically logout after 30 minutes of inactivity</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 