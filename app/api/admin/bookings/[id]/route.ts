import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { sendBookingConfirmationEmail } from '@/lib/email';

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAuth(request);
    const { id: bookingId } = await params;

    const { status, notes } = await request.json();

    // Get current booking status for comparison
    const currentBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { status: true }
    });

    if (!currentBooking) {
      return NextResponse.json(
        { error: '予約が見つかりません' },
        { status: 404 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        ...(notes !== undefined && { notes }),
      },
      include: {
        room: {
          select: {
            name: true,
            nameEn: true,
            nameZh: true,
            roomNumber: true,
          },
        },
      },
    });

    // Send confirmation email when status changes from non-CONFIRMED to CONFIRMED
    if (currentBooking.status !== 'CONFIRMED' && status === 'CONFIRMED') {
      try {
        await sendBookingConfirmationEmail({
          guestName: updatedBooking.guestName,
          guestEmail: updatedBooking.guestEmail,
          bookingId: updatedBooking.id,
          roomName: updatedBooking.room.name,
          roomNumber: updatedBooking.room.roomNumber,
          checkInDate: updatedBooking.checkIn,
          checkOutDate: updatedBooking.checkOut,
          totalPrice: updatedBooking.totalPrice,
          adults: updatedBooking.adults,
          children: updatedBooking.children,
          infants: updatedBooking.infants,
        });
        console.log(`Confirmation email sent for booking ${bookingId}`);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the booking update if email fails
      }
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Booking update error:', error);
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAuth(request);
    const { id: bookingId } = await params;

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Booking delete error:', error);
    
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