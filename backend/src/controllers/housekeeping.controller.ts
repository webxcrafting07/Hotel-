import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function getTasks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, staffId } = req.query;
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (staffId) where.staffId = staffId;

    const tasks = await prisma.housekeepingTask.findMany({
      where,
      include: {
        room: { select: { roomNumber: true, name: true, floor: true } },
        staff: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
}

export async function createTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await prisma.housekeepingTask.create({ data: req.body });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function updateTaskStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await prisma.housekeepingTask.update({
      where: { id },
      data: { status, completedAt: status === 'COMPLETED' ? new Date() : undefined },
    });
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}