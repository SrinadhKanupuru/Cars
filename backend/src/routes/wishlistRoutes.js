import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Protected for authenticated users / customers
router.use(authenticateToken);

router.get('/', getWishlist);
router.post('/:carId', addToWishlist);
router.delete('/:carId', removeFromWishlist);

export default router;
