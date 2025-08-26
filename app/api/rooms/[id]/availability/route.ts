import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roomId } = await params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Fetch all bookings for this room in the date range
    const bookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: {
          in: ['CONFIRMED', 'COMPLETED']
        },
        OR: [
          {
            checkIn: {
              lte: new Date(endDate),
              gte: new Date(startDate)
            }
          },
          {
            checkOut: {
              lte: new Date(endDate),
              gte: new Date(startDate)
            }
          },
          {
            AND: [
              {
                checkIn: {
                  lte: new Date(startDate)
                }
              },
              {
                checkOut: {
                  gte: new Date(endDate)
                }
              }
            ]
          }
        ]
      },
      select: {
        checkIn: true,
        checkOut: true,
      }
    });

    // Generate booked dates array
    const bookedDates: { date: string; status: 'booked' | 'checkin' | 'checkout' }[] = [];

    bookings.forEach(booking => {
      // Convert to UTC date strings to avoid timezone issues
      const checkInDate = new Date(booking.checkIn).toISOString().split('T')[0];
      const checkOutDate = new Date(booking.checkOut).toISOString().split('T')[0];
      
      // Create Date objects in UTC to ensure consistent comparison
      const checkIn = new Date(checkInDate + 'T00:00:00Z');
      const checkOut = new Date(checkOutDate + 'T00:00:00Z');
      
      // Add all dates from check-in to check-out (excluding check-out)
      const current = new Date(checkIn);

      while (current < checkOut) {
        bookedDates.push({
          date: current.toISOString().split('T')[0],
          status: 'booked'
        });
        current.setUTCDate(current.getUTCDate() + 1);
      }
    });

    // Remove duplicates and sort
    const uniqueBookedDates = bookedDates
      .filter((date, index, arr) => 
        arr.findIndex(d => d.date === date.date) === index
      )
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      bookedDates: uniqueBookedDates,
    });
  } catch (error) {
    console.error('Availability fetch error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}