import { motion } from 'framer-motion'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  AcademicCapIcon,
  BuildingOfficeIcon,
  ClipboardIcon,
  EnvelopeIcon,
  IdentificationIcon,
  HomeIcon,
  CheckBadgeIcon,
  PrinterIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-8 shadow-sm mb-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-800">
              {user.name || 'Student Name'}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-lg text-gray-600">
                {user.registerNumber}
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                B.Tech
              </span>
              <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                CSE
              </span>
            </div>
            <p className="text-gray-500 mt-2">
              School of Computer Science and Engineering
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <PrinterIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Academic Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-heading font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <AcademicCapIcon className="w-6 h-6 text-primary" />
            Academic Details
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IdentificationIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Registration No.</span>
              </div>
              <button
                onClick={() => copyToClipboard(user.registerNumber)}
                className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
              >
                <span className="font-mono text-gray-700">{user.registerNumber}</span>
                <ClipboardIcon className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            {/* Add more academic details... */}
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-heading font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <EnvelopeIcon className="w-6 h-6 text-primary" />
            Contact Information
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Email</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">{user.email}</span>
                <CheckBadgeIcon className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hostel Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-heading font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <BuildingOfficeIcon className="w-6 h-6 text-primary" />
            Hostel Information
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HomeIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Block & Room</span>
              </div>
              <span className="text-gray-700">Men's Block A - 304</span>
            </div>
            
            {/* Add hostel layout visualization... */}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 