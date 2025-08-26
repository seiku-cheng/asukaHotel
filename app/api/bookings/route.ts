import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateRoomPrice } from '@/lib/pricing';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { 
      roomId, 
      checkIn, 
      checkOut, 
      adults, 
      children, 
      infants, 
      guestName, 
      guestEmail, 
      guestPhone 
    } = await request.json();

    // 检查是否有登录用户
    const currentUser = getUserFromRequest(request);

    if (!roomId || !checkIn || !checkOut || adults === undefined || adults === null || !guestName || !guestEmail || !guestPhone) {
      return NextResponse.json(
        { error: '必要な情報が不足しています' },
        { status: 400 }
      );
    }

    if (adults < 1) {
      return NextResponse.json(
        { error: '大人の人数は1名以上である必要があります' },
        { status: 400 }
      );
    }

    // Get room information for price calculation
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json(
        { error: '客室が見つかりません' },
        { status: 404 }
      );
    }

    // Calculate nights and total price using new pricing system
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const pricingResult = await calculateRoomPrice(
      roomId,
      {
        adults: adults || 0,
        children: children || 0,
        infants: infants || 0,
      },
      nights
    );

    // Check room availability - same logic as check-availability API
    const existingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
        OR: [
          {
            // Existing booking starts during the requested period
            checkIn: {
              gte: checkInDate,
              lt: checkOutDate
            }
          },
          {
            // Existing booking ends during the requested period
            checkOut: {
              gt: checkInDate,
              lte: checkOutDate
            }
          },
          {
            // Existing booking completely encompasses the requested period
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
        ],
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'この期間は既に予約されています' },
        { status: 409 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        adults: adults || 0,
        children: children || 0,
        infants: infants || 0,
        guestName,
        guestEmail,
        guestPhone,
        totalPrice: pricingResult.totalPrice,
        status: 'PENDING',
        userId: currentUser?.userId || null, // 关联登录用户
      },
      include: {
        room: {
          select: {
            name: true,
            nameEn: true,
            nameZh: true,
          },
        },
      },
    });

    // TODO: Send confirmation email

    return NextResponse.json({
      success: true,
      booking,
      pricingBreakdown: pricingResult,
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // Get user's bookings
    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        room: {
          select: {
            name: true,
            nameEn: true,
            nameZh: true,
            roomNumber: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      bookings,
      total: bookings.length,
    });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}