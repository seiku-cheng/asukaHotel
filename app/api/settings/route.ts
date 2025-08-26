import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.settings.findMany();

    // Transform settings array to key-value object
    const settingsObject: { [key: string]: string } = {};
    settings.forEach(setting => {
      settingsObject[setting.key] = setting.value;
    });

    // Return default settings if none found
    const defaultSettings = {
      hotel_name: '箱根仙石原寮',
      hotel_email: 'asuka.hotel@seiku.co.jp',
      hotel_phone: '(0460) 83-9465',
      hotel_mobile: '(090) 3215-3202',
      hotel_address: '〒250-0631 神奈川県足柄下郡箱根町仙石原 1236',
      ...settingsObject,
    };

    return NextResponse.json(defaultSettings);
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}