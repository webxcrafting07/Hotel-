import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function getSpaServices(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const services = await prisma.spaService.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
}

export async function bookSpaAppointment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { serviceId, date, time, name, email, phone, notes } = req.body;
    const service = await prisma.spaService.findUnique({ where: { id: serviceId } });
    
    const appointment = await prisma.spaAppointment.create({
      data: {
        serviceId, date: new Date(date), time, name, email, phone, notes,
        userId: req.user?.userId,
        amount: service?.price || 0,
      },
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
}

export async function getSpaAppointments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const appointments = await prisma.spaAppointment.findMany({
      where: req.user?.role === 'CUSTOMER' ? { userId: req.user.userId } : {},
      include: { service: true, staff: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: { date: 'desc' },
    });
    res.json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
}