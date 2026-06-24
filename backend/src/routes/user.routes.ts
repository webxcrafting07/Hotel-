import { Router } from 'express';
import {
  updateProfile, changePassword, getWishlist, toggleWishlist,
  getNotifications, markNotificationRead, getAllUsers,
  createStaff, deleteUser
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/wishlist', getWishlist);
router.post('/wishlist/:roomId', toggleWishlist);
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.get('/all', authorize('SUPER_ADMIN', 'MANAGER'), getAllUsers);
router.post('/staff', authorize('SUPER_ADMIN', 'MANAGER'), createStaff);
router.delete('/:id', authorize('SUPER_ADMIN'), deleteUser);

export default router;