import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

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

// Get email settings
export async function GET(request: NextRequest) {
  try {
    await verifyAuth(request);

    const gmailUser = await prisma.settings.findUnique({
      where: { key: 'gmail_user' }
    });

    const gmailPassword = await prisma.settings.findUnique({
      where: { key: 'gmail_app_password' }
    });

    return NextResponse.json({
      gmailUser: gmailUser?.value || '',
      hasPassword: !!gmailPassword?.value,
    });
  } catch (error) {
    console.error('Get email settings error:', error);
    
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

// Update email settings
export async function POST(request: NextRequest) {
  try {
    await verifyAuth(request);

    const { gmailUser, gmailAppPassword } = await request.json();

    if (!gmailUser) {
      return NextResponse.json(
        { error: 'Gmail アドレスは必須です' },
        { status: 400 }
      );
    }

    // Check if password is required (when no existing password)
    const existingPassword = await prisma.settings.findUnique({
      where: { key: 'gmail_app_password' }
    });

    if (!existingPassword?.value && !gmailAppPassword) {
      return NextResponse.json(
        { error: 'Gmail アプリパスワードは必須です' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(gmailUser)) {
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください' },
        { status: 400 }
      );
    }

    // Update or create gmail_user setting
    await prisma.settings.upsert({
      where: { key: 'gmail_user' },
      update: { value: gmailUser },
      create: {
        key: 'gmail_user',
        value: gmailUser,
      },
    });

    // Update or create gmail_app_password setting only if provided
    if (gmailAppPassword) {
      await prisma.settings.upsert({
        where: { key: 'gmail_app_password' },
        update: { value: gmailAppPassword },
        create: {
          key: 'gmail_app_password',
          value: gmailAppPassword,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Gmail設定が保存されました',
    });
  } catch (error) {
    console.error('Save email settings error:', error);
    
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