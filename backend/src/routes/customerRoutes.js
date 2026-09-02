import { Router } from 'express';
import { 
  getMyProfile, 
  updateMyProfile, 
  getAllCustomers, 
  getCustomerById 
} from '../controllers/customerController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticateToken);

// Customer self-management
router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);

// Admin customer directory
router.get('/', requireRole('ADMIN'), getAllCustomers);
router.get('/:id', requireRole('ADMIN'), getCustomerById);

export default router;
