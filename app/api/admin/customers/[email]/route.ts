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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    await verifyAuth(request);
    const { email } = await params;

    const customerEmail = decodeURIComponent(email);

    // Get customer's bookings
    const bookings = await prisma.booking.findMany({
      where: {
        guestEmail: customerEmail,
      },
      include: {
        room: {
          select: {
            name: true,
            nameEn: true,
            nameZh: true,
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (bookings.length === 0) {
      return NextResponse.json(
        { error: '顧客が見つかりません' },
        { status: 404 }
      );
    }

    // Calculate customer statistics
    const totalBookings = bookings.length;
    const totalSpent = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
    const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;

    // Get unique room types booked
    const roomTypes = [...new Set(bookings.map(b => b.room.type))];

    // Calculate average booking value
    const averageBookingValue = totalBookings > 0 ? Math.round(totalSpent / totalBookings) : 0;

    // Get customer info from latest booking
    const latestBooking = bookings[0];

    const customerInfo = {
      email: customerEmail,
      name: latestBooking.guestName,
      phone: latestBooking.guestPhone,
      firstBooking: bookings[bookings.length - 1].createdAt,
      lastBooking: latestBooking.createdAt,
      statistics: {
        totalBookings,
        totalSpent,
        averageBookingValue,
        confirmedBookings,
        cancelledBookings,
        completedBookings,
        favoriteRoomTypes: roomTypes,
      },
      bookings,
    };

    return NextResponse.json(customerInfo);
  } catch (error) {
    console.error('Customer detail fetch error:', error);
    
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