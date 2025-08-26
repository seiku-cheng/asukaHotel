import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { verifyEmailConnection, sendBookingConfirmationEmail } from '@/lib/email';

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

export async function POST(request: NextRequest) {
  try {
    await verifyAuth(request);

    const { testEmail } = await request.json();

    if (!testEmail) {
      return NextResponse.json(
        { error: 'テスト送信先メールアドレスが必要です' },
        { status: 400 }
      );
    }

    // Check email configuration
    try {
      const isConnected = await verifyEmailConnection();
      if (!isConnected) {
        return NextResponse.json(
          { error: 'Gmail接続に失敗しました。管理画面でGmail設定を確認してください。' },
          { status: 500 }
        );
      }
    } catch (configError) {
      console.error('Email configuration error:', configError);
      return NextResponse.json(
        { error: `Gmail設定エラー: ${configError instanceof Error ? configError.message : 'Gmail設定が未設定または無効です'}` },
        { status: 500 }
      );
    }

    // Send test email
    const testData = {
      guestName: 'テスト太郎',
      guestEmail: testEmail,
      bookingId: 'TEST-' + Date.now(),
      roomName: '東側角部屋',
      roomNumber: '201',
      checkInDate: new Date('2024-12-25'),
      checkOutDate: new Date('2024-12-27'),
      totalPrice: 24000,
      adults: 2,
      children: 1,
      infants: 0,
    };

    await sendBookingConfirmationEmail(testData);

    return NextResponse.json({
      success: true,
      message: `テストメールを ${testEmail} に送信しました`,
    });
  } catch (error) {
    console.error('Test email error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: '認証が無効です' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: `メール送信に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}` },
      { status: 500 }
    );
  }
}