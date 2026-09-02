import { Router } from 'express';
import { 
  getDashboardMetrics, 
  getSalesReport, 
  getRevenueReport, 
  getTopBrands, 
  getRecentOrders, 
  getRecentLeads 
} from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = Router();

// Admin only for analytics and reporting
router.use(authenticateToken, requireRole('ADMIN'));

router.get('/dashboard', getDashboardMetrics);
router.get('/sales', getSalesReport);
router.get('/revenue', getRevenueReport);
router.get('/top-brands', getTopBrands);
router.get('/recent-orders', getRecentOrders);
router.get('/recent-leads', getRecentLeads);

export default router;
