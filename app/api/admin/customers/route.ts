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

export async function GET(request: NextRequest) {
  try {
    await verifyAuth(request);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Get all registered customers
    const registeredUsersWhere: any = {
      role: 'CUSTOMER'
    };
    if (search) {
      registeredUsersWhere.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const registeredUsers = await prisma.user.findMany({
      where: registeredUsersWhere,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: { bookings: true }
        },
        bookings: {
          select: {
            totalPrice: true,
            createdAt: true,
            guestPhone: true,
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform registered users data
    const registeredCustomers = registeredUsers.map(user => ({
      email: user.email,
      name: user.name,
      phone: user.bookings.length > 0 ? user.bookings[0].guestPhone : '',
      totalBookings: user._count.bookings,
      totalSpent: user.bookings.reduce((sum, booking) => sum + booking.totalPrice, 0),
      firstBooking: user.bookings.length > 0 ? user.bookings[0].createdAt : user.createdAt,
      lastBooking: user.bookings.length > 0 ? user.bookings[user.bookings.length - 1].createdAt : user.createdAt,
      isRegistered: true,
    }));

    // Get customers from bookings (who may not be registered)
    const bookingWhereClause: any = {};
    if (search) {
      bookingWhereClause.OR = [
        { guestName: { contains: search } },
        { guestEmail: { contains: search } },
        { guestPhone: { contains: search } },
      ];
    }

    // Get unique guest customers from bookings (excluding registered users)
    const registeredEmails = registeredUsers.map(user => user.email);
    if (registeredEmails.length > 0) {
      bookingWhereClause.guestEmail = {
        notIn: registeredEmails
      };
    }

    const bookingCustomers = await prisma.booking.groupBy({
      by: ['guestEmail'],
      where: bookingWhereClause,
      _count: {
        id: true,
      },
      _sum: {
        totalPrice: true,
      },
      _min: {
        createdAt: true,
        guestName: true,
        guestPhone: true,
      },
      _max: {
        createdAt: true,
      },
      orderBy: {
        _max: {
          createdAt: 'desc',
        },
      },
    });

    const guestCustomers = bookingCustomers.map(customer => ({
      email: customer.guestEmail,
      name: customer._min.guestName,
      phone: customer._min.guestPhone,
      totalBookings: customer._count.id,
      totalSpent: customer._sum.totalPrice || 0,
      firstBooking: customer._min.createdAt,
      lastBooking: customer._max.createdAt,
      isRegistered: false,
    }));

    // Combine and sort all customers
    const allCustomers = [...registeredCustomers, ...guestCustomers]
      .sort((a, b) => new Date(b.lastBooking).getTime() - new Date(a.lastBooking).getTime());

    // Apply pagination
    const totalCustomers = allCustomers.length;
    const totalPages = Math.ceil(totalCustomers / limit);
    const paginatedCustomers = allCustomers.slice(skip, skip + limit);

    return NextResponse.json({
      customers: paginatedCustomers,
      pagination: {
        page,
        limit,
        total: totalCustomers,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Customers fetch error:', error);
    
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