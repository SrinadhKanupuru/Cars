import { Router } from 'express';
import { body } from 'express-validator';
import { 
  createOrder, 
  getMyOrders, 
  getAllOrders, 
  getOrderById, 
  updateOrderStatus 
} from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = Router();

const orderValidation = [
  body('car_id').trim().notEmpty().withMessage('Car ID is required'),
  validateRequest
];

router.use(authenticateToken);

// Customer order operations
router.post('/', orderValidation, createOrder);
router.get('/my', getMyOrders);

// Admin & Single Lookup
router.get('/', requireRole('ADMIN'), getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', requireRole('ADMIN'), updateOrderStatus);
router.put('/:id', requireRole('ADMIN'), updateOrderStatus);

export default router;
