import express from 'express'
import { getFines, payFine, downloadReceipt } from '../controllers/fineController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

console.log('Registering fine routes')

router.get('/', protect, getFines)
router.post('/:fineId/pay', protect, payFine)
router.get('/:fineId/receipt', protect, downloadReceipt)

export default router 