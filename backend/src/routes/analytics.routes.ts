import { Router } from 'express';
import { getDashboardStats, getRevenueAnalytics, getRoomAnalytics } from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/dashboard', authorize('SUPER_ADMIN', 'MANAGER', 'ACCOUNTANT', 'RECEPTIONIST', 'HOUSEKEEPING'), getDashboardStats);
router.get('/revenue', authorize('SUPER_ADMIN', 'MANAGER', 'ACCOUNTANT'), getRevenueAnalytics);
router.get('/rooms', authorize('SUPER_ADMIN', 'MANAGER'), getRoomAnalytics);

export default router;