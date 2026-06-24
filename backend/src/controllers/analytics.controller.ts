import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function getDashboardStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const [
      totalRooms, occupiedRooms, todayCheckIns, todayCheckOuts,
      monthlyRevenue, yearlyRevenue, lastMonthRevenue,
      totalBookings, pendingBookings, totalCustomers,
      recentBookings,
    ] = await Promise.all([
      prisma.room.count({ where: { isActive: true } }),
      prisma.room.count({ where: { status: 'OCCUPIED' } }),
      prisma.booking.count({
        where: {
          checkIn: { gte: new Date(today.toDateString()) },
          status: { not: 'CANCELLED' },
        },
      }),
      prisma.booking.count({
        where: {
          checkOut: { gte: new Date(today.toDateString()), lt: new Date(new Date(today.toDateString()).getTime() + 86400000) },
          status: { not: 'CANCELLED' },
        },
      }),
      prisma.booking.aggregate({
        where: { createdAt: { gte: startOfMonth }, status: { not: 'CANCELLED' } },
        _sum: { totalAmount: true },
      }),
      prisma.booking.aggregate({
        where: { createdAt: { gte: startOfYear }, status: { not: 'CANCELLED' } },
        _sum: { totalAmount: true },
      }),
      prisma.booking.aggregate({
        where: { createdAt: { gte: lastMonth, lte: endOfLastMonth }, status: { not: 'CANCELLED' } },
        _sum: { totalAmount: true },
      }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          room: { select: { name: true, roomNumber: true } },
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
    ]);

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    const monthRev = parseFloat(monthlyRevenue._sum.totalAmount?.toString() || '0');
    const lastMonthRev = parseFloat(lastMonthRevenue._sum.totalAmount?.toString() || '0');
    const revenueGrowth = lastMonthRev > 0 ? ((monthRev - lastMonthRev) / lastMonthRev) * 100 : 100;

    res.json({
      success: true,
      data: {
        overview: {
          totalRooms, occupiedRooms, occupancyRate,
          todayCheckIns, todayCheckOuts,
          monthlyRevenue: monthRev,
          yearlyRevenue: parseFloat(yearlyRevenue._sum.totalAmount?.toString() || '0'),
          revenueGrowth: parseFloat(revenueGrowth.toFixed(2)),
          totalBookings, pendingBookings, totalCustomers,
        },
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRevenueAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { period = 'monthly', year = new Date().getFullYear().toString() } = req.query;
    
    const data = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC(${period === 'monthly' ? 'month' : 'week'}, created_at) as period,
        SUM(total_amount) as revenue,
        COUNT(*) as bookings
      FROM bookings
      WHERE EXTRACT(YEAR FROM created_at) = ${parseInt(year as string)}
        AND status != 'CANCELLED'
      GROUP BY period
      ORDER BY period
    `;

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getRoomAnalytics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const rooms = await prisma.room.findMany({
      where: { isActive: true },
      include: {
        bookings: {
          where: { status: { not: 'CANCELLED' } },
          select: { nights: true, totalAmount: true, createdAt: true },
        },
        _count: { select: { bookings: true } },
      },
    });

    const analytics = rooms.map((room) => ({
      id: room.id,
      roomNumber: room.roomNumber,
      name: room.name,
      roomType: room.roomType,
      totalBookings: room._count.bookings,
      totalRevenue: room.bookings.reduce((acc, b) => acc + parseFloat(b.totalAmount.toString()), 0),
      totalNights: room.bookings.reduce((acc, b) => acc + b.nights, 0),
    }));

    res.json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
}