import { Router } from 'express';
import { createReview, getReviews, approveReview, replyToReview } from '../controllers/review.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getReviews);
router.post('/', authenticate, createReview);
router.patch('/:id/approve', authenticate, authorize('SUPER_ADMIN', 'MANAGER'), approveReview);
router.patch('/:id/reply', authenticate, authorize('SUPER_ADMIN', 'MANAGER'), replyToReview);

export default router;