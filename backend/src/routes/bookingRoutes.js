import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  approveBooking,
  rejectBooking,
  completeBooking,
  cancelBooking
} from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

// User & Public endpoints
router.post('/', createBooking); // User create booking
router.get('/my', authenticateToken, getMyBookings); // User get own bookings
router.get('/:id', authenticateToken, getBookingById); // User or Admin get booking
router.put('/:id/cancel', authenticateToken, cancelBooking); // User cancel pending booking

// Admin endpoints
router.get('/admin/all', authenticateToken, requireRole(['admin', 'ADMIN', 'SuperAdmin', 'DealershipPrincipal']), getAllBookings);
router.put('/admin/:id/approve', authenticateToken, requireRole(['admin', 'ADMIN', 'SuperAdmin', 'DealershipPrincipal']), approveBooking);
router.put('/admin/:id/reject', authenticateToken, requireRole(['admin', 'ADMIN', 'SuperAdmin', 'DealershipPrincipal']), rejectBooking);
router.put('/admin/:id/complete', authenticateToken, requireRole(['admin', 'ADMIN', 'SuperAdmin', 'DealershipPrincipal']), completeBooking);

export default router;
