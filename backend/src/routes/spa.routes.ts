import { Router } from 'express';
import { getSpaServices, bookSpaAppointment, getSpaAppointments } from '../controllers/spa.controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/services', getSpaServices);
router.post('/appointments', optionalAuth, bookSpaAppointment);
router.get('/appointments', authenticate, getSpaAppointments);

export default router;