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

// Upload floor plan image
export async function POST(request: NextRequest) {
  try {
    try {
      await verifyAuth(request);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('floorplan') as File;
    const floor = formData.get('floor') as string; // "2" or "3"

    if (!file) {
      return NextResponse.json({ error: 'No floor plan image provided' }, { status: 400 });
    }

    if (!floor || !['1', '2'].includes(floor)) {
      return NextResponse.json({ error: 'Invalid floor number. Must be 1 or 2.' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ 
        error: `Invalid file type: ${file.type}. Only images are allowed.` 
      }, { status: 400 });
    }

    // Validate file size (max 10MB for floor plan)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: `File too large: ${file.name}. Maximum size is 10MB.` 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imagesDir = join(process.cwd(), 'public', 'images');
    const filename = `floor-${floor}f.png`;
    const filepath = join(imagesDir, filename);

    // Remove existing floor plan if it exists
    if (existsSync(filepath)) {
      try {
        await unlink(filepath);
      } catch (error) {
        console.warn(`Failed to delete existing floor plan ${floor}F:`, error);
      }
    }

    // Save new floor plan image
    await writeFile(filepath, buffer);

    return NextResponse.json({
      message: `${floor}階の平面図をアップロードしました`,
      imagePath: `/images/${filename}`,
      floor: floor
    });

  } catch (error) {
    console.error('Floor plan upload error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Delete floor plan image
export async function DELETE(request: NextRequest) {
  try {
    try {
      await verifyAuth(request);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const floor = searchParams.get('floor');

    if (!floor || !['1', '2'].includes(floor)) {
      return NextResponse.json({ error: 'Invalid floor number. Must be 1 or 2.' }, { status: 400 });
    }

    const filename = `floor-${floor}f.png`;
    const filepath = join(process.cwd(), 'public', 'images', filename);

    if (existsSync(filepath)) {
      await unlink(filepath);
      return NextResponse.json({
        message: `${floor}階の平面図を削除しました`,
        floor: floor
      });
    } else {
      return NextResponse.json({ 
        error: `${floor}階の平面図が見つかりません` 
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Floor plan delete error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}