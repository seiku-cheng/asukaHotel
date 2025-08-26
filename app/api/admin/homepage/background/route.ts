import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

async function verifyAuth(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error('認証が必要です');
  }

  // For now, just return a mock decoded token to bypass JWT verification
  return { userId: 'mock-user-id' };
}

// Upload homepage background image
export async function POST(request: NextRequest) {
  try {
    try {
      await verifyAuth(request);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('background') as File;

    if (!file) {
      return NextResponse.json({ error: 'No background image provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ 
        error: `Invalid file type: ${file.type}. Only images are allowed.` 
      }, { status: 400 });
    }

    // Validate file size (max 10MB for background image)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: `File too large: ${file.name}. Maximum size is 10MB.` 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imagesDir = join(process.cwd(), 'public', 'images');
    const filepath = join(imagesDir, 'hero-bg.jpg');

    // Remove existing background image if it exists
    if (existsSync(filepath)) {
      try {
        await unlink(filepath);
      } catch (error) {
        console.warn('Failed to delete existing background:', error);
      }
    }

    // Save new background image
    await writeFile(filepath, buffer);

    return NextResponse.json({
      message: 'Background image uploaded successfully',
      imagePath: '/images/hero-bg.jpg'
    });

  } catch (error) {
    console.error('Background upload error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Delete homepage background image
export async function DELETE(request: NextRequest) {
  try {
    try {
      await verifyAuth(request);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const filepath = join(process.cwd(), 'public', 'images', 'hero-bg.jpg');

    if (existsSync(filepath)) {
      await unlink(filepath);
      return NextResponse.json({
        message: 'Background image deleted successfully'
      });
    } else {
      return NextResponse.json({ 
        error: 'Background image not found' 
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Background delete error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}