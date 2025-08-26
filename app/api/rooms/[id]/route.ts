import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRoomPricingOptions } from '@/lib/pricing';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const room = await prisma.room.findUnique({
      where: { 
        id,
        isActive: true, // Only return active rooms
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: '客室が見つかりません' },
        { status: 404 }
      );
    }

    // Get pricing options for this room
    const pricingOptions = await getRoomPricingOptions(room.id);

    // Transform data for frontend
    const roomData = {
      id: room.id,
      roomNumber: room.roomNumber,
      name: room.name,
      nameEn: room.nameEn,
      nameZh: room.nameZh,
      type: room.type.toLowerCase(),
      maxGuests: room.maxGuests,
      size: room.size,
      amenities: JSON.parse(room.amenities),
      images: JSON.parse(room.images),
      description: room.description,
      descriptionEn: room.descriptionEn,
      descriptionZh: room.descriptionZh,
      isConnecting: room.isConnecting,
      connectsTo: room.connectsTo,
      pricing: pricingOptions,
    };

    return NextResponse.json(roomData);
  } catch (error) {
    console.error('Room detail fetch error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}