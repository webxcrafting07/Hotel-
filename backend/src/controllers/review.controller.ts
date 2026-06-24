import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export async function createReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { roomId, rating, title, comment, images } = req.body;
    const userId = req.user!.userId;

    const hasStay = await prisma.booking.findFirst({
      where: { userId, roomId, status: 'CHECKED_OUT' },
    });

    const review = await prisma.review.create({
      data: {
        userId, roomId, rating, title, comment,
        images: images || [],
        isVerified: !!hasStay,
      },
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
}

export async function getReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { roomId, page = '1', limit = '10' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: Record<string, unknown> = { isApproved: true };
    if (roomId) where.roomId = roomId;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
      }),
      prisma.review.count({ where }),
    ]);

    const avgRating = reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

    res.json({ success: true, data: reviews, meta: { total, avgRating } });
  } catch (error) {
    next(error);
  }
}

export async function approveReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const review = await prisma.review.update({ where: { id }, data: { isApproved: true } });
    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
}

export async function replyToReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const review = await prisma.review.update({
      where: { id },
      data: { adminReply: reply, repliedAt: new Date() },
    });
    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
}