import { Router } from 'express';
import { body } from 'express-validator';
import { 
  recordPayment, 
  getMyPayments, 
  getAllPayments, 
  getPaymentById, 
  updatePaymentStatus 
} from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = Router();

const paymentValidation = [
  body('order_id').isInt().withMessage('Valid order ID is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Valid positive payment amount is required'),
  body('payment_method').trim().notEmpty().withMessage('Payment method is required'),
  validateRequest
];

router.use(authenticateToken);

// Customer transactions
router.post('/', paymentValidation, recordPayment);
router.get('/my', getMyPayments);

// Admin & Details
router.get('/', requireRole('ADMIN'), getAllPayments);
router.get('/:id', getPaymentById);
router.put('/:id/status', requireRole('ADMIN'), updatePaymentStatus);

export default router;
