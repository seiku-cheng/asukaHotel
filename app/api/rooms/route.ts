import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMinimumRoomPrice } from '@/lib/pricing';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = parseInt(searchParams.get('guests') || '1');

    // Get only active rooms
    const rooms = await prisma.room.findMany({
      where: {
        isActive: true,
      },
      orderBy: { id: 'asc' },
    });

    // Filter rooms by availability if dates are provided
    let availableRooms = rooms;

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Get rooms that have conflicting bookings
      const conflictingBookings = await prisma.booking.findMany({
        where: {
          status: {
            in: ['PENDING', 'CONFIRMED'],
          },
          OR: [
            {
              checkIn: {
                lte: checkInDate,
              },
              checkOut: {
                gt: checkInDate,
              },
            },
            {
              checkIn: {
                lt: checkOutDate,
              },
              checkOut: {
                gte: checkOutDate,
              },
            },
            {
              checkIn: {
                gte: checkInDate,
              },
              checkOut: {
                lte: checkOutDate,
              },
            },
          ],
        },
        select: {
          roomId: true,
        },
      });

      const bookedRoomIds = conflictingBookings.map(booking => booking.roomId);
      availableRooms = rooms.filter(room => !bookedRoomIds.includes(room.id));
    }

    // Filter by guest capacity
    if (guests > 1) {
      availableRooms = availableRooms.filter(room => room.maxGuests >= guests);
    }

    // Transform data for frontend with minimum pricing
    const roomsData = await Promise.all(
      availableRooms.map(async (room) => {
        const minPrice = await getMinimumRoomPrice(room.id);
        return {
          id: room.id,
          roomNumber: room.roomNumber,
          name: room.name,
          nameEn: room.nameEn,
          nameZh: room.nameZh,
          type: room.type.toLowerCase(),
          price: minPrice, // Show minimum price (1 adult)
          maxGuests: room.maxGuests,
          size: room.size,
          amenities: JSON.parse(room.amenities),
          images: JSON.parse(room.images),
          description: room.description,
          descriptionEn: room.descriptionEn,
          descriptionZh: room.descriptionZh,
          isConnecting: room.isConnecting,
          connectsTo: room.connectsTo,
        };
      })
    );

    return NextResponse.json(roomsData);
  } catch (error) {
    console.error('Rooms fetch error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}