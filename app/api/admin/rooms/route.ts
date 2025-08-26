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

    const rooms = await prisma.room.findMany({
      include: {
        pricing: true,
      },
      orderBy: { id: 'asc' },
    });

    // Get booking statistics for each room
    const roomsWithStats = await Promise.all(
      rooms.map(async (room) => {
        const totalBookings = await prisma.booking.count({
          where: { roomId: room.id },
        });

        const confirmedBookings = await prisma.booking.count({
          where: { 
            roomId: room.id, 
            status: 'CONFIRMED' 
          },
        });

        const currentMonth = new Date();
        currentMonth.setDate(1);
        const nextMonth = new Date(currentMonth);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const monthlyBookings = await prisma.booking.count({
          where: {
            roomId: room.id,
            checkIn: {
              gte: currentMonth,
              lt: nextMonth,
            },
            status: 'CONFIRMED',
          },
        });

        const monthlyRevenue = await prisma.booking.aggregate({
          where: {
            roomId: room.id,
            checkIn: {
              gte: currentMonth,
              lt: nextMonth,
            },
            status: 'CONFIRMED',
          },
          _sum: {
            totalPrice: true,
          },
        });

        return {
          ...room,
          amenities: JSON.parse(room.amenities),
          images: JSON.parse(room.images),
          stats: {
            totalBookings,
            confirmedBookings,
            monthlyBookings,
            monthlyRevenue: monthlyRevenue._sum.totalPrice || 0,
          },
        };
      })
    );

    return NextResponse.json(roomsWithStats);
  } catch (error) {
    console.error('Rooms fetch error:', error);
    
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