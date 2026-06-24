import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { firstName, lastName, phone },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, role: true },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new AppError('Current password is incorrect', 400);

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
}

export async function getWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user!.userId },
      include: { room: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
    });
    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
}

export async function toggleWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { roomId } = req.params;
    const userId = req.user!.userId;

    const existing = await prisma.wishlist.findUnique({ where: { userId_roomId: { userId, roomId } } });

    if (existing) {
      await prisma.wishlist.delete({ where: { userId_roomId: { userId, roomId } } });
      res.json({ success: true, message: 'Removed from wishlist', data: { inWishlist: false } });
    } else {
      await prisma.wishlist.create({ data: { userId, roomId } });
      res.json({ success: true, message: 'Added to wishlist', data: { inWishlist: true } });
    }
  } catch (error) {
    next(error);
  }
}

export async function getNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.notification.update({ where: { id }, data: { isRead: true } });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
}

export async function getAllUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page = '1', limit = '20', role, search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const where: Record<string, unknown> = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, isActive: true, createdAt: true, loyaltyPoints: true },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ success: true, data: users, pagination: { page: parseInt(page as string), limit: take, total } });
  } catch (error) {
    next(error);
  }
}

export async function createStaff(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    
    // Ensure only SUPER_ADMIN or MANAGER can create staff
    if (!['SUPER_ADMIN', 'MANAGER'].includes(req.user!.role)) {
      throw new AppError('Insufficient permissions to create staff', 403);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new AppError('Email already in use', 400);

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role || 'RECEPTIONIST',
        isEmailVerified: true,
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
    });

    res.status(201).json({ success: true, data: newUser, message: 'Staff created successfully' });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    if (req.user!.role !== 'SUPER_ADMIN') {
      throw new AppError('Only Super Admin can delete users', 403);
    }

    if (id === req.user!.userId) {
      throw new AppError('Cannot delete yourself', 400);
    }

    // Since deleting a user with existing bookings will cause a Prisma foreign key error,
    // we do a soft delete or try to hard delete.
    // If the user has bookings, hard delete will fail. The simplest and safest approach is to hard delete if possible, otherwise deactivate.
    // Let's just delete the user. If Prisma throws P2003, we deactivate them.
    try {
      await prisma.user.delete({ where: { id } });
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (e: any) {
      if (e.code === 'P2003') {
        // Foreign key constraint failed, soft delete instead
        await prisma.user.update({
          where: { id },
          data: { isActive: false },
        });
        res.json({ success: true, message: 'User deactivated because they have related records (bookings, etc.)' });
      } else {
        throw e;
      }
    }
  } catch (error) {
    next(error);
  }
}