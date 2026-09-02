import { Router } from 'express';
import { body } from 'express-validator';
import { 
  createLead, 
  getLeads, 
  getLeadById, 
  updateLeadStatus, 
  deleteLead 
} from '../controllers/leadController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';

const router = Router();

const leadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  validateRequest
];

// Public/Customer can submit inquiries
router.post('/', leadValidation, createLead);

// Admin only for viewing and managing leads pipeline
router.get('/', authenticateToken, requireRole('ADMIN'), getLeads);
router.get('/:id', authenticateToken, requireRole('ADMIN'), getLeadById);
router.put('/:id/status', authenticateToken, requireRole('ADMIN'), updateLeadStatus);
router.put('/:id', authenticateToken, requireRole('ADMIN'), updateLeadStatus);
router.delete('/:id', authenticateToken, requireRole('ADMIN'), deleteLead);

export default router;
