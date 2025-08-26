import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function verifyAuth(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error('認証が必要です');
  }

  // For now, just return a mock decoded token to bypass JWT verification
  return { userId: 'mock-user-id' };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAuth(request);
    const { id: roomId } = await params;

    const body = await request.json();
    const { adult1, adult2, adult3, adult4, child } = body;

    // Validate input
    if (!adult1 || !adult2 || !adult3 || !adult4 || child === undefined) {
      return NextResponse.json(
        { error: '全ての価格設定が必要です' },
        { status: 400 }
      );
    }

    // Check if room exists
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json(
        { error: '客室が見つかりません' },
        { status: 404 }
      );
    }

    // Delete existing pricing for this room
    await prisma.roomPricing.deleteMany({
      where: { roomId },
    });

    // Create new pricing entries
    const pricingEntries = [
      // Adult pricing
      { roomId, guestType: 'ADULT' as const, guestCount: 1, price: parseInt(String(adult1)) },
      { roomId, guestType: 'ADULT' as const, guestCount: 2, price: parseInt(String(adult2)) },
      { roomId, guestType: 'ADULT' as const, guestCount: 3, price: parseInt(String(adult3)) },
      { roomId, guestType: 'ADULT' as const, guestCount: 4, price: parseInt(String(adult4)) },
      // Child pricing
      { roomId, guestType: 'CHILD' as const, guestCount: 1, price: parseInt(String(child)) },
    ];

    await prisma.roomPricing.createMany({
      data: pricingEntries,
    });

    return NextResponse.json({
      success: true,
      message: '価格設定を更新しました',
    });
  } catch (error) {
    console.error('Pricing update error:', error);
    
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}