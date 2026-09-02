import { Router } from 'express';
import { body } from 'express-validator';
import { 
  bookTestDrive, 
  getMyTestDrives, 
  getAllTestDrives, 
  getTestDriveById, 
  updateTestDriveStatus 
} from '../controllers/testDriveController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = Router();

const testDriveValidation = [
  body('car_id').trim().notEmpty().withMessage('Car ID is required'),
  body('preferred_date').isISO8601().toDate().withMessage('Valid date is required (YYYY-MM-DD)'),
  body('preferred_time').trim().notEmpty().withMessage('Preferred time is required'),
  validateRequest
];

router.use(authenticateToken);

// Customer bookings
router.post('/', testDriveValidation, bookTestDrive);
router.get('/my', getMyTestDrives);

// Admin & Single Lookup
router.get('/', requireRole('ADMIN'), getAllTestDrives);
router.get('/:id', getTestDriveById);
router.put('/:id/status', requireRole('ADMIN'), updateTestDriveStatus);

export default router;
