import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { roomId, checkIn, checkOut } = await request.json();

    if (!roomId || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: '必要な情報が不足しています' },
        { status: 400 }
      );
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return NextResponse.json(
        { 
          available: false, 
          error: 'チェックイン日は今日以降の日付を選択してください' 
        },
        { status: 400 }
      );
    }

    if (checkOutDate <= checkInDate) {
      return NextResponse.json(
        { 
          available: false, 
          error: 'チェックアウト日はチェックイン日より後の日付を選択してください' 
        },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: {
          in: ['CONFIRMED', 'COMPLETED'] // Only check confirmed/completed bookings
        },
        OR: [
          {
            // Booking starts during the requested period
            checkIn: {
              gte: checkInDate,
              lt: checkOutDate
            }
          },
          {
            // Booking ends during the requested period
            checkOut: {
              gt: checkInDate,
              lte: checkOutDate
            }
          },
          {
            // Booking completely encompasses the requested period
            AND: [
              {
                checkIn: {
                  lte: checkInDate
                }
              },
              {
                checkOut: {
                  gte: checkOutDate
                }
              }
            ]
          }
        ]
      }
    });

    const available = conflictingBookings.length === 0;

    return NextResponse.json({
      available,
      conflictingBookings: available ? [] : conflictingBookings.map(booking => ({
        id: booking.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guestName: booking.guestName
      }))
    });

  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}