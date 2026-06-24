import { Router } from 'express';
import { makeReservation, getReservations } from '../controllers/restaurant.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/reservations', optionalAuth, makeReservation);
router.get('/reservations', authenticate, authorize('SUPER_ADMIN', 'MANAGER', 'RECEPTIONIST'), getReservations);

export default router;