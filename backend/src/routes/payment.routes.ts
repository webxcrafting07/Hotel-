import { Router } from 'express';
import {
  createRazorpayOrder, verifyRazorpayPayment,
  createStripeIntent, getPaymentHistory,
} from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/razorpay/order', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);
router.post('/stripe/intent', createStripeIntent);
router.get('/history/:bookingId', getPaymentHistory);

export default router;