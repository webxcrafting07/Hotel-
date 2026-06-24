import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    roomId: z.string().uuid('Invalid room ID'),
    checkIn: z.string().datetime({ offset: true }).or(z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date string' })),
    checkOut: z.string().datetime({ offset: true }).or(z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date string' })),
    adults: z.coerce.number().int().min(1, 'At least 1 adult is required'),
    children: z.coerce.number().int().min(0).default(0),
    extraBeds: z.coerce.number().int().min(0).default(0),
    guestName: z.string().optional(),
    guestEmail: z.string().email('Invalid email').optional().or(z.literal('')),
    guestPhone: z.string().optional(),
    specialRequests: z.string().optional(),
    paymentMethod: z.enum(['CASH', 'UPI', 'CARD', 'NET_BANKING', 'WALLET', 'RAZORPAY', 'STRIPE']).optional(),
  }),
});

export const offlineBookingSchema = createBookingSchema.deepPartial().extend({
  body: createBookingSchema.shape.body.extend({
    roomId: z.string().uuid('Invalid room ID'),
    checkIn: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
    checkOut: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date string' }),
    adults: z.coerce.number().int().min(1),
    guestName: z.string().min(2, 'Guest name is required for walk-in bookings'),
    guestPhone: z.string().min(10, 'Valid phone number is required'),
    guestAddress: z.string().optional(),
  }),
});
