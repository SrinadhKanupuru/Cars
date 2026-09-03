import { Router } from 'express';
import { body } from 'express-validator';
import { 
  getCars, 
  getCarById, 
  createCar, 
  updateCar, 
  deleteCar 
} from '../controllers/carController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = Router();

const carValidation = [
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year').optional().isInt({ min: 1900, max: 2030 }).withMessage('Valid model year is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid positive price is required'),
  body('horsepower').optional().isInt({ min: 1 }).withMessage('Valid horsepower is required'),
  body('engine').optional().trim(),
  body('transmission').optional().trim(),
  body('vin').optional().trim(),
  validateRequest
];

// Public / Customer can view cars
router.get('/', getCars);
router.get('/:id', getCarById);

// Admin only for modifying inventory
router.post('/', authenticateToken, requireRole('ADMIN'), carValidation, createCar);
router.put('/:id', authenticateToken, requireRole('ADMIN'), updateCar);
router.delete('/:id', authenticateToken, requireRole('ADMIN'), deleteCar);

export default router;
