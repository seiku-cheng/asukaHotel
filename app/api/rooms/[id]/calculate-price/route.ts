import { NextRequest, NextResponse } from 'next/server';
import { calculateRoomPrice } from '@/lib/pricing';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roomId } = await params;
    const body = await request.json();
    
    const { adults, children, infants, checkIn, checkOut } = body;

    // Validate input
    if (!adults || adults < 1) {
      return NextResponse.json(
        { error: '大人の人数は1名以上である必要があります' },
        { status: 400 }
      );
    }

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'チェックイン日とチェックアウト日は必須です' },
        { status: 400 }
      );
    }

    // Calculate nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return NextResponse.json(
        { error: 'チェックアウト日はチェックイン日より後である必要があります' },
        { status: 400 }
      );
    }

    // Calculate pricing
    const pricingResult = await calculateRoomPrice(
      roomId,
      {
        adults: adults || 0,
        children: children || 0,
        infants: infants || 0,
      },
      nights
    );

    return NextResponse.json(pricingResult);
  } catch (error) {
    console.error('Price calculation error:', error);
    return NextResponse.json(
      { error: '料金計算中にエラーが発生しました' },
      { status: 500 }
    );
  }
}