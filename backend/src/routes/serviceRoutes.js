import { Router } from 'express';
import { body } from 'express-validator';
import { 
  getAllServices, 
  createService, 
  updateService, 
  deleteService, 
  bookService, 
  getMyServiceBookings, 
  getAllServiceBookings, 
  updateServiceBookingStatus 
} from '../controllers/serviceController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = Router();

const bookingValidation = [
  body('service_id').isInt().withMessage('Valid service ID is required'),
  body('customer_name').trim().notEmpty().withMessage('Customer name is required'),
  body('customer_email').isEmail().withMessage('Valid customer email is required'),
  body('car_model').trim().notEmpty().withMessage('Car model is required'),
  body('scheduled_date').isISO8601().toDate().withMessage('Valid schedule date is required (YYYY-MM-DD)'),
  validateRequest
];

// Public services catalog
router.get('/', getAllServices);

// Booking services (Public / Authenticated)
router.post('/bookings', (req, res, next) => {
  // Optional auth
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticateToken(req, res, next);
  }
  next();
}, bookingValidation, bookService);

// Customer bookings view
router.get('/bookings/my', authenticateToken, getMyServiceBookings);

// Admin service and workshop booking management
router.post('/', authenticateToken, requireRole('ADMIN'), createService);
router.put('/:id', authenticateToken, requireRole('ADMIN'), updateService);
router.delete('/:id', authenticateToken, requireRole('ADMIN'), deleteService);

router.get('/bookings', authenticateToken, requireRole('ADMIN'), getAllServiceBookings);
router.put('/bookings/:id/status', authenticateToken, requireRole('ADMIN'), updateServiceBookingStatus);

export default router;
