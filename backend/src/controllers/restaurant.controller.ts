import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function makeReservation(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, phone, date, time, guests, occasion, requests } = req.body;
    
    const reservation = await prisma.restaurantReservation.create({
      data: {
        name, email, phone, date: new Date(date), time, guests,
        occasion, requests, userId: req.user?.userId,
      },
    });

    res.status(201).json({ success: true, data: reservation, message: 'Reservation created successfully' });
  } catch (error) {
    next(error);
  }
}

export async function getReservations(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const reservations = await prisma.restaurantReservation.findMany({
      orderBy: { date: 'desc' },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    res.json({ success: true, data: reservations });
  } catch (error) {
    next(error);
  }
}