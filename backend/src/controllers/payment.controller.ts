import { Request, Response, NextFunction } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Stripe from 'stripe';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { ENV } from '../config/env';

const razorpay = new Razorpay({
  key_id: ENV.RAZORPAY_KEY_ID,
  key_secret: ENV.RAZORPAY_KEY_SECRET,
});

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

export async function createRazorpayOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { bookingId, amount } = req.body;

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new AppError('Booking not found', 404);

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: booking.bookingNumber,
      notes: { bookingId },
    });

    res.json({ success: true, data: { orderId: order.id, amount: order.amount, currency: order.currency, keyId: ENV.RAZORPAY_KEY_ID } });
  } catch (error) {
    next(error);
  }
}

export async function verifyRazorpayPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw new AppError('Invalid payment signature', 400);
    }

    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
    const amount = (paymentDetails.amount as number) / 100;

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount,
        currency: 'INR',
        method: 'RAZORPAY',
        status: 'PAID',
        transactionId: razorpay_payment_id,
        gatewayOrderId: razorpay_order_id,
        gatewayPaymentId: razorpay_payment_id,
        gatewaySignature: razorpay_signature,
      },
    });

    // Update booking payment status
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (booking) {
      const newPaidAmount = parseFloat(booking.paidAmount.toString()) + amount;
      const isPaid = newPaidAmount >= parseFloat(booking.totalAmount.toString());

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          paidAmount: newPaidAmount,
          paymentStatus: isPaid ? 'PAID' : 'PARTIAL',
          status: 'CONFIRMED',
        },
      });
    }

    res.json({ success: true, data: payment, message: 'Payment verified successfully' });
  } catch (error) {
    next(error);
  }
}

export async function createStripeIntent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { bookingId, amount } = req.body;

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new AppError('Booking not found', 404);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'inr',
      metadata: { bookingId, bookingNumber: booking.bookingNumber },
    });

    res.json({ success: true, data: { clientSecret: paymentIntent.client_secret } });
  } catch (error) {
    next(error);
  }
}

export async function getPaymentHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { bookingId } = req.params;
    const payments = await prisma.payment.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
}