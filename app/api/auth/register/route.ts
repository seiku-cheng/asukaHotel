import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // 验证必填字段
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '姓名、邮箱和密码都是必填项' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度至少为6位' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在（使用原始SQL）
    const existingUsers = await prisma.$queryRaw<{email: string}[]>`
      SELECT email FROM User WHERE email = ${email}
    `;

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 加密密码
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 生成用户ID
    const userId = `customer-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    
    // 使用原始SQL创建用户，避免Prisma枚举问题
    await prisma.$executeRaw`
      INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
      VALUES (${userId}, ${name}, ${email}, ${hashedPassword}, 'CUSTOMER', datetime('now'), datetime('now'))
    `;
    
    // 构造用户对象返回
    const user = {
      id: userId,
      name,
      email,
      role: 'CUSTOMER',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    // 返回用户信息（不包含密码）和token
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: '注册失败，请重试' },
      { status: 500 }
    );
  }
}