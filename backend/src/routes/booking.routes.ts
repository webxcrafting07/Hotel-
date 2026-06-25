import { Router } from 'express';
import {
  createBooking, getBookings, getBooking, cancelBooking,
  checkIn, checkOut, getTodaysActivity, createOfflineBooking, sendInvoiceEmail, createGroupBooking, getGroupBooking
} from '../controllers/booking.controller';
import { authenticate, authorize } from '../middleware/auth';
import { bookingLimiter } from '../middleware/rateLimiter';
import { upload } from '../middleware/upload';
import { validate } from '../middleware/validate';
import { createBookingSchema, offlineBookingSchema } from '../validators/booking.validator';

const router = Router();

router.use(authenticate);

router.post('/', bookingLimiter, validate(createBookingSchema), createBooking);
router.post('/group', bookingLimiter, createGroupBooking);
router.post('/offline', authorize('SUPER_ADMIN', 'MANAGER', 'RECEPTIONIST'), upload.single('idProof'), validate(offlineBookingSchema), createOfflineBooking);
router.get('/', getBookings);
router.get('/today', authorize('SUPER_ADMIN', 'MANAGER', 'RECEPTIONIST'), getTodaysActivity);
router.get('/group/:groupId', authenticate, getGroupBooking);
router.get('/:id', getBooking);
router.patch('/:id/cancel', cancelBooking);
router.patch('/:id/check-in', authorize('SUPER_ADMIN', 'MANAGER', 'RECEPTIONIST'), upload.single('idProof'), checkIn);
router.patch('/:id/check-out', authorize('SUPER_ADMIN', 'MANAGER', 'RECEPTIONIST'), checkOut);
router.post('/:id/send-invoice', authorize('SUPER_ADMIN', 'MANAGER', 'RECEPTIONIST'), sendInvoiceEmail);

export default router;