import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function verifyAuth(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error('認証が必要です');
  }

  const token = authorization.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET) as any;
  
  return decoded;
}

export async function GET(request: NextRequest) {
  try {
    await verifyAuth(request);

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get all bookings
    const totalBookings = await prisma.booking.count();

    // Get pending bookings
    const pendingBookings = await prisma.booking.count({
      where: {
        status: 'PENDING',
      },
    });

    // Get today's check-ins
    const todayCheckins = await prisma.booking.count({
      where: {
        checkIn: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    // Get today's check-outs
    const todayCheckouts = await prisma.booking.count({
      where: {
        checkOut: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    // Get total revenue (this month)
    const monthlyBookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
        status: 'CONFIRMED',
      },
      select: {
        totalPrice: true,
      },
    });

    const totalRevenue = monthlyBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    // Calculate occupancy rate (simplified: bookings this month / total room days)
    const totalRooms = 6; // 6 rooms available
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const totalRoomDays = totalRooms * daysInMonth;
    
    const occupiedDays = await prisma.booking.findMany({
      where: {
        checkIn: {
          gte: startOfMonth,
        },
        status: 'CONFIRMED',
      },
      select: {
        checkIn: true,
        checkOut: true,
      },
    });

    const totalOccupiedDays = occupiedDays.reduce((sum, booking) => {
      const nights = Math.ceil((booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return sum + nights;
    }, 0);

    const occupancyRate = Math.round((totalOccupiedDays / totalRoomDays) * 100);

    return NextResponse.json({
      totalBookings,
      pendingBookings,
      todayCheckins,
      todayCheckouts,
      totalRevenue,
      occupancyRate,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: '認証が無効です' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}