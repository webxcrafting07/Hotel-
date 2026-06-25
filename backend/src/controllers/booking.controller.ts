import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { generateBookingNumber, generateInvoiceNumber, calculateNights, isWeekend } from '../utils/booking';
import { calculateGST } from '../utils/gst';
import { sendEmail, bookingConfirmationTemplate, invoiceTemplate } from '../utils/email';
import QRCode from 'qrcode';
import { uploadImage } from '../config/cloudinary';

export async function createBooking(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      roomId, checkIn, checkOut, adults, children, extraBeds = 0,
      couponCode, specialRequests, guestName, guestEmail, guestPhone,
    } = req.body;

    const userId = req.user!.userId;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = calculateNights(checkInDate, checkOutDate);

    if (nights < 1) throw new AppError('Invalid dates: check-out must be after check-in', 400);

    // Check availability
    const conflict = await prisma.booking.findFirst({
      where: {
        roomId,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        checkIn: { lt: checkOutDate },
        checkOut: { gt: checkInDate },
      },
    });
    if (conflict) throw new AppError('Room is not available for selected dates', 409);

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new AppError('Room not found', 404);

    // Price calculation (check if weekend)
    const roomPricePerNight = isWeekend(checkInDate)
      ? parseFloat(room.weekendPrice.toString())
      : parseFloat(room.pricePerNight.toString());

    const extraBedPrice = extraBeds * 500; // ₹500 per extra bed per night
    const baseAmount = roomPricePerNight * nights + extraBedPrice * nights;
    const gstCalc = calculateGST(roomPricePerNight, nights);

    let discountAmount = 0;
    let couponId: string | undefined;

    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode,
          isActive: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
        },
      });

      if (coupon) {
        if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
          if (!coupon.minBookingAmount || baseAmount >= parseFloat(coupon.minBookingAmount.toString())) {
            if (coupon.discountType === 'PERCENTAGE') {
              discountAmount = (baseAmount * parseFloat(coupon.discountValue.toString())) / 100;
              if (coupon.maxDiscount) {
                discountAmount = Math.min(discountAmount, parseFloat(coupon.maxDiscount.toString()));
              }
            } else {
              discountAmount = parseFloat(coupon.discountValue.toString());
            }
            couponId = coupon.id;
            await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
          }
        }
      }
    }

    const totalAmount = gstCalc.total + extraBedPrice * nights - discountAmount;
    const bookingNumber = generateBookingNumber();

    const qrData = JSON.stringify({ bookingNumber, roomId, checkIn, checkOut });
    const qrCode = await QRCode.toDataURL(qrData);

    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        userId,
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights,
        adults,
        children,
        extraBeds,
        roomPrice: roomPricePerNight * nights,
        extraBedPrice: extraBedPrice * nights,
        taxAmount: gstCalc.cgst + gstCalc.sgst + gstCalc.igst,
        discountAmount,
        totalAmount,
        couponId,
        specialRequests,
        guestName: guestName || req.user!.email,
        guestEmail: guestEmail || req.user!.email,
        guestPhone,
        qrCode,
      },
      include: { room: true },
    });

    // Create invoice
    const invoiceNumber = generateInvoiceNumber();
    const invoice = await prisma.invoice.create({
      data: {
        bookingId: booking.id,
        invoiceNumber,
        subtotal: parseFloat(room.pricePerNight.toString()) * nights,
        cgst: gstCalc.cgst,
        sgst: gstCalc.sgst,
        igst: gstCalc.igst,
        total: totalAmount,
      },
    });

    // Send confirmation email with invoice
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const bookingWithInvoice = { ...booking, invoice };
      sendEmail({
        to: user.email,
        subject: `Booking Confirmed & Invoice - ${bookingNumber}`,
        html: invoiceTemplate(bookingWithInvoice),
      }).catch(console.error);
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        title: 'Booking Confirmed',
        message: `Your booking ${bookingNumber} has been confirmed!`,
        type: 'SUCCESS',
        link: `/bookings/${booking.id}`,
      },
    });

    res.status(201).json({ success: true, data: booking, message: 'Booking created successfully' });
  } catch (error) {
    next(error);
  }
}

import { v4 as uuidv4 } from 'uuid';

export async function createGroupBooking(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { rooms, guestName, guestEmail, guestPhone, specialRequests } = req.body;
    const userId = req.user!.userId;
    const groupId = uuidv4();

    if (!Array.isArray(rooms) || rooms.length === 0) {
      throw new AppError('No rooms provided for booking', 400);
    }

    const createdBookings = [];
    let groupTotalAmount = 0;
    let groupTaxAmount = 0;

    for (const roomData of rooms) {
      const { roomId, checkIn, checkOut, adults, children, extraBeds = 0 } = roomData;
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = calculateNights(checkInDate, checkOutDate);

      if (nights < 1) throw new AppError('Invalid dates: check-out must be after check-in', 400);

      // Check availability
      const conflict = await prisma.booking.findFirst({
        where: {
          roomId,
          status: { notIn: ['CANCELLED', 'NO_SHOW'] },
          checkIn: { lt: checkOutDate },
          checkOut: { gt: checkInDate },
        },
      });
      if (conflict) throw new AppError(`Room ${roomId} is not available for selected dates`, 409);

      const room = await prisma.room.findUnique({ where: { id: roomId } });
      if (!room) throw new AppError(`Room ${roomId} not found`, 404);

      const roomPricePerNight = isWeekend(checkInDate)
        ? parseFloat(room.weekendPrice.toString())
        : parseFloat(room.pricePerNight.toString());

      const extraBedPrice = extraBeds * 500;
      const baseAmount = roomPricePerNight * nights + extraBedPrice * nights;
      const gstCalc = calculateGST(roomPricePerNight, nights);

      const totalAmount = gstCalc.total + extraBedPrice * nights;
      const bookingNumber = generateBookingNumber();

      const qrData = JSON.stringify({ bookingNumber, roomId, checkIn: checkInDate, checkOut: checkOutDate });
      const qrCode = await QRCode.toDataURL(qrData);

      const booking = await prisma.booking.create({
        data: {
          bookingNumber,
          groupId,
          userId,
          roomId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          nights,
          adults,
          children,
          extraBeds,
          roomPrice: roomPricePerNight * nights,
          extraBedPrice: extraBedPrice * nights,
          taxAmount: gstCalc.cgst + gstCalc.sgst + gstCalc.igst,
          discountAmount: 0,
          totalAmount,
          specialRequests,
          guestName: guestName || req.user!.email,
          guestEmail: guestEmail || req.user!.email,
          guestPhone,
          qrCode,
        },
        include: { room: true },
      });

      createdBookings.push(booking);
      groupTotalAmount += totalAmount;
      groupTaxAmount += gstCalc.cgst + gstCalc.sgst + gstCalc.igst;
    }

    // Create a single unified invoice for the first booking but with total group amount
    // Ideally Invoice schema should support groupId, but we can attach it to the primary booking
    const primaryBooking = createdBookings[0];
    const invoiceNumber = generateInvoiceNumber();
    const invoice = await prisma.invoice.create({
      data: {
        bookingId: primaryBooking.id,
        invoiceNumber,
        subtotal: groupTotalAmount - groupTaxAmount,
        cgst: groupTaxAmount / 2, // approximation for unified invoice
        sgst: groupTaxAmount / 2,
        igst: 0,
        total: groupTotalAmount,
      },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const bookingWithInvoice = { ...primaryBooking, invoice };
      sendEmail({
        to: user.email,
        subject: `Group Booking Confirmed & Invoice - ${primaryBooking.bookingNumber} (+${createdBookings.length - 1} more)`,
        html: invoiceTemplate(bookingWithInvoice), // This might need a custom group template later
      }).catch(console.error);
    }

    await prisma.notification.create({
      data: {
        userId,
        title: 'Group Booking Confirmed',
        message: `Your group booking for ${createdBookings.length} rooms has been confirmed!`,
        type: 'SUCCESS',
        link: `/bookings`,
      },
    });

    res.status(201).json({ success: true, data: { groupId, bookings: createdBookings, totalAmount: groupTotalAmount }, message: 'Group Booking created successfully' });
  } catch (error) {
    next(error);
  }
}

export async function getBookings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = '1', limit = '10', status } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const isAdmin = ['SUPER_ADMIN', 'MANAGER', 'RECEPTIONIST'].includes(req.user!.role);
    const where: Record<string, unknown> = {};

    if (!isAdmin) where.userId = req.user!.userId;
    if (status) where.status = status;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          room: { include: { images: { where: { isPrimary: true }, take: 1 } } },
          user: { select: { firstName: true, lastName: true, email: true, phone: true } },
          payments: true,
          invoice: true,
        },
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: { page: parseInt(page as string), limit: take, total, pages: Math.ceil(total / take) },
    });
  } catch (error) {
    next(error);
  }
}

export async function getGroupBooking(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { groupId } = req.params;
    
    const bookings = await prisma.booking.findMany({
      where: { groupId },
      include: {
        room: { include: { images: true } },
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        payments: true,
        invoice: true,
      },
    });

    if (!bookings.length) throw new AppError('Group booking not found', 404);

    let updated = false;
    for (const booking of bookings) {
      if (!booking.qrCode) {
        const qrData = JSON.stringify({ bookingNumber: booking.bookingNumber, roomId: booking.roomId, checkIn: booking.checkIn, checkOut: booking.checkOut });
        const qrCode = await QRCode.toDataURL(qrData);
        await prisma.booking.update({ where: { id: booking.id }, data: { qrCode } });
        booking.qrCode = qrCode;
        updated = true;
      }
    }

    const primaryBooking = bookings[0];
    const totalAmount = bookings.reduce((sum, b) => sum + parseFloat(b.totalAmount.toString()), 0);
    const paidAmount = bookings.reduce((sum, b) => sum + parseFloat(b.paidAmount.toString()), 0);
    const roomsCount = bookings.length;
    
    // Group status logic
    const allPaid = bookings.every((b) => b.paymentStatus === 'PAID');
    const paymentStatus = allPaid ? 'PAID' : (paidAmount > 0 ? 'PARTIAL' : 'PENDING');
    
    // Most severe status wins or all confirmed
    const status = bookings.some((b) => b.status === 'CANCELLED') ? 'CANCELLED' 
                 : bookings.every((b) => b.status === 'CONFIRMED') ? 'CONFIRMED'
                 : primaryBooking.status;

    res.json({
      success: true,
      data: {
        id: groupId,
        groupId,
        bookingNumber: 'Group Booking',
        status,
        paymentStatus,
        totalAmount,
        paidAmount,
        roomsCount,
        checkIn: primaryBooking.checkIn,
        checkOut: primaryBooking.checkOut,
        guestName: primaryBooking.guestName,
        guestEmail: primaryBooking.guestEmail,
        guestPhone: primaryBooking.guestPhone,
        invoice: primaryBooking.invoice,
        bookings,
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getBooking(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    let booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        room: { include: { images: true, amenities: { include: { amenity: true } } } },
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        payments: true,
        invoice: true,
        coupon: true,
      },
    });

    if (!booking) throw new AppError('Booking not found', 404);

    let updated = false;

    // Auto-generate missing QR code for legacy bookings
    if (!booking.qrCode) {
      const qrData = JSON.stringify({ bookingNumber: booking.bookingNumber, roomId: booking.roomId, checkIn: booking.checkIn, checkOut: booking.checkOut });
      const qrCode = await QRCode.toDataURL(qrData);
      await prisma.booking.update({ where: { id: booking.id }, data: { qrCode } });
      booking.qrCode = qrCode;
      updated = true;
    }

    // Auto-generate missing invoice for legacy bookings
    if (!booking.invoice) {
      const invoiceNumber = generateInvoiceNumber();
      const subtotal = parseFloat(booking.totalAmount.toString()) - parseFloat(booking.taxAmount.toString()) + parseFloat(booking.discountAmount.toString());
      const cgst = parseFloat(booking.taxAmount.toString()) / 2;
      const sgst = parseFloat(booking.taxAmount.toString()) / 2;
      
      const newInvoice = await prisma.invoice.create({
        data: {
          bookingId: booking.id,
          invoiceNumber,
          subtotal: subtotal,
          cgst: cgst,
          sgst: sgst,
          igst: 0,
          total: booking.totalAmount,
        },
      });
      booking.invoice = newInvoice as any;
      updated = true;
    }

    const isAdmin = ['SUPER_ADMIN', 'MANAGER', 'RECEPTIONIST'].includes(req.user!.role);
    if (!isAdmin && booking.userId !== req.user!.userId) {
      throw new AppError('Access denied', 403);
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
}

export async function cancelBooking(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new AppError('Booking not found', 404);

    const isAdmin = ['SUPER_ADMIN', 'MANAGER', 'RECEPTIONIST'].includes(req.user!.role);
    if (!isAdmin && booking.userId !== req.user!.userId) {
      throw new AppError('Access denied', 403);
    }

    if (['CANCELLED', 'CHECKED_OUT'].includes(booking.status)) {
      throw new AppError('Booking cannot be cancelled', 400);
    }

    // Refund calculation (75% if >24h before check-in, 50% if <24h)
    const hoursUntilCheckIn = (booking.checkIn.getTime() - Date.now()) / (1000 * 60 * 60);
    const refundPercent = hoursUntilCheckIn > 24 ? 75 : hoursUntilCheckIn > 0 ? 50 : 0;
    const refundAmount = (parseFloat(booking.paidAmount.toString()) * refundPercent) / 100;

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason,
        cancelledAt: new Date(),
        refundAmount,
      },
    });

    await prisma.notification.create({
      data: {
        userId: booking.userId,
        title: 'Booking Cancelled',
        message: `Your booking ${booking.bookingNumber} has been cancelled. Refund: ₹${refundAmount}`,
        type: 'INFO',
      },
    });

    res.json({ success: true, data: updated, message: `Booking cancelled. Refund of ₹${refundAmount} will be processed.` });
  } catch (error) {
    next(error);
  }
}

export async function checkIn(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { idProofType, guestAddress, roomId, checkInTime } = req.body;
    let idProofUrl = undefined;

    // Check if file was uploaded
    // Use type assertion since req is extended Express Request
    const reqWithFile = req as any;
    if (reqWithFile.file) {
      const b64 = reqWithFile.file.buffer.toString('base64');
      const dataURI = `data:${reqWithFile.file.mimetype};base64,${b64}`;
      const uploadResult = await uploadImage(dataURI, 'id-proofs');
      idProofUrl = uploadResult.url;
    }

    const bookingBeforeUpdate = await prisma.booking.findUnique({ where: { id } });
    if (!bookingBeforeUpdate) throw new AppError('Booking not found', 404);

    const updateData: any = { status: 'CHECKED_IN', checkInTime: checkInTime ? new Date(checkInTime) : new Date() };
    if (idProofUrl) updateData.idProofUrl = idProofUrl;
    if (idProofType) updateData.idProofType = idProofType;
    if (guestAddress) updateData.guestAddress = guestAddress;

    let newRoomId = bookingBeforeUpdate.roomId;
    if (roomId && roomId !== bookingBeforeUpdate.roomId) {
      updateData.roomId = roomId;
      newRoomId = roomId;
      // Mark old room as AVAILABLE since it's no longer booked for this stay
      await prisma.room.update({ where: { id: bookingBeforeUpdate.roomId }, data: { status: 'AVAILABLE' } });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    await prisma.room.update({ where: { id: newRoomId }, data: { status: 'OCCUPIED' } });
    res.json({ success: true, data: booking, message: 'Check-in successful' });
  } catch (error) {
    next(error);
  }
}

export async function createOfflineBooking(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      roomId, checkIn, checkOut,
      guestName, guestEmail, guestPhone, guestAddress, paymentMethod, idProofType
    } = req.body;

    const adults = parseInt(req.body.adults || '1');
    const children = parseInt(req.body.children || '0');
    const extraBeds = parseInt(req.body.extraBeds || '0');

    let idProofUrl = undefined;
    const reqWithFile = req as any;
    if (reqWithFile.file) {
      const b64 = reqWithFile.file.buffer.toString('base64');
      const dataURI = `data:${reqWithFile.file.mimetype};base64,${b64}`;
      const uploadResult = await uploadImage(dataURI, 'id-proofs');
      idProofUrl = uploadResult.url;
    }

    const userId = req.user!.userId;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = calculateNights(checkInDate, checkOutDate);

    if (nights < 1) throw new AppError('Invalid dates: check-out must be after check-in', 400);

    const conflict = await prisma.booking.findFirst({
      where: {
        roomId,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        checkIn: { lt: checkOutDate },
        checkOut: { gt: checkInDate },
      },
    });
    if (conflict) throw new AppError('Room is not available for selected dates', 409);

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new AppError('Room not found', 404);

    const roomPricePerNight = isWeekend(checkInDate)
      ? parseFloat(room.weekendPrice.toString())
      : parseFloat(room.pricePerNight.toString());

    const extraBedPrice = extraBeds * 500;
    const baseAmount = roomPricePerNight * nights + extraBedPrice * nights;
    const gstCalc = calculateGST(roomPricePerNight, nights);
    const totalAmount = gstCalc.total + extraBedPrice * nights;
    const bookingNumber = generateBookingNumber();

    const qrData = JSON.stringify({ bookingNumber, roomId, checkIn, checkOut });
    const qrCode = await QRCode.toDataURL(qrData);

    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        userId,
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights,
        adults,
        children,
        extraBeds,
        roomPrice: roomPricePerNight * nights,
        extraBedPrice: extraBedPrice * nights,
        taxAmount: gstCalc.cgst + gstCalc.sgst + gstCalc.igst,
        discountAmount: 0,
        totalAmount,
        paidAmount: paymentMethod === 'CASH' ? totalAmount : 0,
        guestName,
        guestEmail,
        guestPhone,
        guestAddress,
        idProofUrl,
        idProofType,
        isOffline: true,
        status: 'CONFIRMED',
        paymentStatus: paymentMethod === 'CASH' ? 'PAID' : 'PENDING',
        qrCode,
      },
      include: { room: true },
    });

    const invoiceNumber = generateInvoiceNumber();
    const invoice = await prisma.invoice.create({
      data: {
        bookingId: booking.id,
        invoiceNumber,
        subtotal: parseFloat(room.pricePerNight.toString()) * nights,
        cgst: gstCalc.cgst,
        sgst: gstCalc.sgst,
        igst: gstCalc.igst,
        total: totalAmount,
      },
    });

    if (guestEmail) {
      const bookingWithInvoice = { ...booking, invoice };
      sendEmail({
        to: guestEmail,
        subject: `Booking Confirmed & Invoice - ${bookingNumber}`,
        html: invoiceTemplate(bookingWithInvoice),
      }).catch(console.error);
    }

    if (paymentMethod === 'CASH') {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: totalAmount,
          currency: 'INR',
          method: 'CASH',
          status: 'PAID',
          transactionId: `OFFLINE_${bookingNumber}`,
        }
      });
    }

    res.status(201).json({ success: true, data: booking, message: 'Offline booking created successfully' });
  } catch (error) {
    next(error);
  }
}

export async function checkOut(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { checkOutTime } = req.body;
    const booking = await prisma.booking.update({
      where: { id },
      data: { status: 'CHECKED_OUT', checkOutTime: checkOutTime ? new Date(checkOutTime) : new Date() },
    });

    await prisma.room.update({ where: { id: booking.roomId }, data: { status: 'CLEANING' } });
    res.json({ success: true, data: booking, message: 'Check-out successful' });
  } catch (error) {
    next(error);
  }
}

export async function sendInvoiceEmail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { room: true, invoice: true }
    });

    if (!booking) throw new AppError('Booking not found', 404);
    if (!booking.invoice) throw new AppError('Invoice not generated yet', 400);
    if (!booking.guestEmail) throw new AppError('No email provided for this guest', 400);

    const html = invoiceTemplate(booking);

    await sendEmail({
      to: booking.guestEmail,
      subject: `Invoice / Bill for Booking #${booking.bookingNumber}`,
      html,
    });

    res.json({ success: true, message: 'Invoice emailed successfully' });
  } catch (error) {
    next(error);
  }
}
export async function getTodaysActivity(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const [checkIns, checkOuts, newBookings] = await Promise.all([
      prisma.booking.count({ where: { checkIn: { gte: startOfDay, lt: endOfDay }, status: { not: 'CANCELLED' } } }),
      prisma.booking.count({ where: { checkOut: { gte: startOfDay, lt: endOfDay }, status: { not: 'CANCELLED' } } }),
      prisma.booking.count({ where: { createdAt: { gte: startOfDay, lt: endOfDay } } }),
    ]);

    res.json({ success: true, data: { checkIns, checkOuts, newBookings } });
  } catch (error) {
    next(error);
  }
}