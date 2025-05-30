import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from '../../axios'
import toast from 'react-hot-toast'
import {
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CreditCardIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

export default function Fines() {
  const [fines, setFines] = useState({
    total: 0,
    items: [],
    history: []
  })

  const [loading, setLoading] = useState(true)
  const [payingFineId, setPayingFineId] = useState(null)
  const [downloadingReceiptId, setDownloadingReceiptId] = useState(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedFine, setSelectedFine] = useState(null)

  useEffect(() => {
    fetchFines()
  }, [])

  const fetchFines = async () => {
    try {
      console.log('Fetching fines...')
      const { data } = await axios.get('/fines')
      console.log('Fines data received:', data)
      setFines(data || { total: 0, items: [], history: [] })
    } catch (error) {
      console.error('Error details:', error.response || error)
      toast.error('Failed to fetch fines')
      setFines({ total: 0, items: [], history: [] })
    } finally {
      setLoading(false)
    }
  }

  const openPaymentModal = (fine) => {
    setSelectedFine(fine)
    setIsPaymentModalOpen(true)
  }

  const handlePayFine = async () => {
    if (!selectedFine) return
    
    try {
      setPayingFineId(selectedFine.id)
      setIsPaymentModalOpen(false)
      
      await axios.post(`/fines/${selectedFine.id}/pay`, {
        paymentMethod: 'online'
      })
      toast.success('Payment successful')
      fetchFines()
    } catch (error) {
      console.error('Payment error:', error.response?.data || error)
      toast.error(error.response?.data?.message || 'Payment failed')
    } finally {
      setPayingFineId(null)
      setSelectedFine(null)
    }
  }

  const handleDownloadReceipt = async (fineId) => {
    try {
      setDownloadingReceiptId(fineId)
      
      // Make request with responseType blob
      const response = await axios.get(`/fines/${fineId}/receipt`, {
        responseType: 'blob'
      })

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `receipt-${fineId}.pdf`)
      
      // Append to html link element page
      document.body.appendChild(link)
      
      // Start download
      link.click()
      
      // Clean up and remove the link
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Receipt downloaded')
    } catch (error) {
      console.error('Receipt error:', error.response?.data || error)
      toast.error(error.response?.data?.message || 'Failed to download receipt')
    } finally {
      setDownloadingReceiptId(null)
    }
  }

  const PaymentModal = () => (
    <Transition appear show={isPaymentModalOpen} as={Fragment}>
      <Dialog 
        as="div"
        className="relative z-10"
        onClose={() => setIsPaymentModalOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Confirm Payment
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to pay the fine of ₹{selectedFine?.amount} for {selectedFine?.bookTitle}?
                  </p>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none"
                    onClick={handlePayFine}
                  >
                    Pay Now
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                    onClick={() => setIsPaymentModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-red-100 rounded-full">
            <CurrencyDollarIcon className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-800">
              Fines & Dues
            </h1>
            <p className="text-gray-600">
              Total Outstanding: ₹{fines?.total || 0}
            </p>
          </div>
        </div>

        {/* Current Fines */}
        <div className="space-y-4">
          {fines?.items?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pending fines
            </div>
          ) : (
            fines?.items?.map((fine) => (
              <div
                key={fine.id}
                className="border border-red-100 rounded-lg p-4 bg-red-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800">{fine.bookTitle}</h3>
                  <span className="text-red-600 font-medium">₹{fine.amount}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>Due: {new Date(fine.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    <span>{fine.daysLate} days late</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => openPaymentModal(fine)}
                    disabled={payingFineId === fine.id}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
                  >
                    {payingFineId === fine.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCardIcon className="w-4 h-4" />
                        Pay Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-heading font-semibold text-gray-800 mb-6">
          Payment History
        </h2>

        <div className="space-y-4">
          {fines?.history?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No payment history
            </div>
          ) : (
            fines?.history?.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{payment.bookTitle}</h3>
                  <p className="text-sm text-gray-600">
                    Paid on {new Date(payment.paidOn).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-green-600 font-medium">
                    ₹{payment.amount}
                  </span>
                  <button
                    onClick={() => handleDownloadReceipt(payment.id)}
                    disabled={downloadingReceiptId === payment.id}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <DocumentArrowDownIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      <PaymentModal />
    </div>
  )
} 