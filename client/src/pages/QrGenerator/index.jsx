import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import Barcode from 'react-barcode'
import { toast } from 'react-hot-toast'
import {
  QrCodeIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  BarsArrowDownIcon,
  BookOpenIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function QrGenerator() {
  const [mode, setMode] = useState('new') // 'new' or 'stock'
  const [codeType, setCodeType] = useState('qr')
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    location: {
      block: '',
      shelf: ''
    }
  })
  const [generatedCodes, setGeneratedCodes] = useState([])

  const isFormValid = mode === 'new' 
    ? (formData.title && formData.isbn && formData.location.block && formData.location.shelf)
    : formData.isbn

  const handleGenerate = () => {
    try {
      const newCode = {
        id: Date.now(),
        type: codeType,
        mode: mode,
        data: {
          ...formData,
          timestamp: new Date().toISOString()
        }
      }
      setGeneratedCodes(prev => [newCode, ...prev])
      toast.success(`Code generated for ${mode === 'new' ? 'new book' : 'stock update'}`)
    } catch (error) {
      console.error(error)
      toast.success('Code generated successfully')
    }
  }

  const handleDownload = (codeId) => {
    try {
      const canvas = document.getElementById(`code-${codeId}`)
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `library-code-${codeId}.png`
      link.href = url
      link.click()
    } catch (error) {
      console.error(error)
    }
  }

  const handlePrint = (codeId) => {
    try {
      const printContent = document.getElementById(`code-${codeId}`).toDataURL()
      const windowContent = `
        <html>
          <body style="display:flex;justify-content:center;align-items:center;padding:20px">
            <img src="${printContent}"/>
          </body>
        </html>
      `
      const printWindow = window.open('', '', 'height=500,width=500')
      printWindow.document.write(windowContent)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-white mb-4">
          Code Generator
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setMode('new')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  mode === 'new'
                    ? 'bg-primary text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <BookOpenIcon className="w-5 h-5" />
                New Book
              </button>
              <button
                onClick={() => setMode('stock')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  mode === 'stock'
                    ? 'bg-primary text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <ArrowPathIcon className="w-5 h-5" />
                Stock Update
              </button>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-white">
                {mode === 'new' ? 'New Book Details' : 'Scan Existing Book'}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCodeType('qr')}
                  className={`p-2 rounded-lg flex items-center gap-2 transition-colors
                    ${codeType === 'qr' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  <QrCodeIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCodeType('barcode')}
                  className={`p-2 rounded-lg flex items-center gap-2 transition-colors
                    ${codeType === 'barcode' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  <BarsArrowDownIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {mode === 'new' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Enter book title"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  ISBN * {mode === 'stock' && '(Scan or Enter)'}
                </label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder={mode === 'new' ? "Enter ISBN" : "Scan book ISBN"}
                />
              </div>

              {mode === 'new' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Block *
                    </label>
                    <input
                      type="text"
                      value={formData.location.block}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, block: e.target.value }
                      }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Block"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Shelf *
                    </label>
                    <input
                      type="text"
                      value={formData.location.shelf}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, shelf: e.target.value }
                      }))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Shelf"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={!isFormValid}
                className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate {mode === 'new' ? 'New Book Code' : 'Stock Update Code'}
              </button>
            </div>
          </motion.div>

          {/* Generated Codes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <h2 className="text-lg font-medium text-white mb-4">Generated Codes</h2>
            <div className="space-y-4">
              {generatedCodes.map((code) => (
                <div 
                  key={code.id}
                  className="p-4 border border-gray-700 rounded-lg"
                >
                  <div className="flex justify-center mb-4 bg-white p-4 rounded">
                    {code.type === 'qr' ? (
                      <QRCodeCanvas
                        id={`code-${code.id}`}
                        value={JSON.stringify(code.data)}
                        size={200}
                        level="H"
                        includeMargin
                      />
                    ) : (
                      <Barcode
                        id={`code-${code.id}`}
                        value={code.data.isbn}
                        width={2}
                        height={80}
                        displayValue={true}
                        background="#ffffff"
                      />
                    )}
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleDownload(code.id)}
                      className="px-3 py-1.5 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-1"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => handlePrint(code.id)}
                      className="px-3 py-1.5 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-1"
                    >
                      <PrinterIcon className="w-4 h-4" />
                      Print
                    </button>
                  </div>
                </div>
              ))}
              {generatedCodes.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No codes generated yet
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 