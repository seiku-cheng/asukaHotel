import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@asuka-hotel.com' },
    update: {},
    create: {
      email: 'admin@asuka-hotel.com',
      name: 'Administrator',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Created admin user:', admin.email)

  // Seed room data with new pricing structure
  const roomsData = [
    {
      id: 'room-201',
      roomNumber: '201',
      name: '東側角部屋',
      nameEn: 'East Corner Room',
      nameZh: '东侧角房',
      type: 'CORNER',
      maxGuests: 4,
      size: 25,
      amenities: JSON.stringify(['エアコン', 'WiFi', '冷蔵庫', '電子レンジ', 'バスタオル']),
      images: JSON.stringify([]),
      description: '朝日が美しく差し込む東側の角部屋です。静かで快適な滞在をお楽しみいただけます。',
      descriptionEn: 'East corner room with beautiful morning sunlight. Enjoy a quiet and comfortable stay.',
      descriptionZh: '朝阳美丽的东侧角房。享受安静舒适的住宿体验。',
    },
    {
      id: 'room-202',
      roomNumber: '202',
      name: 'スタンダードルーム（202号室）',
      nameEn: 'Standard Room (Room 202)',
      nameZh: '标准间（202号房）',
      type: 'STANDARD',
      maxGuests: 4,
      size: 20,
      amenities: JSON.stringify(['エアコン', 'WiFi', '冷蔵庫', 'バスタオル']),
      images: JSON.stringify([]),
      description: '快適で機能的なスタンダードルームです。必要な設備が揃っています。',
      descriptionEn: 'Comfortable and functional standard room with all necessary amenities.',
      descriptionZh: '舒适实用的标准间，配备所有必需设施。',
    },
    {
      id: 'room-203',
      roomNumber: '203',
      name: '中央連結部屋（203号室）',
      nameEn: 'Central Connecting Room (203)',
      nameZh: '中央连通房（203）',
      type: 'CONNECTING',
      maxGuests: 4,
      size: 22,
      amenities: JSON.stringify(['エアコン', 'WiFi', '冷蔵庫', 'バスタオル', '連結ドア']),
      images: JSON.stringify([]),
      description: '204号室と繋がることができる特別な部屋です。グループ旅行に最適。',
      descriptionEn: 'Special room that can connect to room 204. Perfect for group travel.',
      descriptionZh: '可与204号房相连的特殊房间，非常适合团体旅行。',
      isConnecting: true,
      connectsTo: 'room-204',
    },
    {
      id: 'room-204',
      roomNumber: '204',
      name: '中央連結部屋（204号室）',
      nameEn: 'Central Connecting Room (204)',
      nameZh: '中央连通房（204）',
      type: 'CONNECTING',
      maxGuests: 4,
      size: 22,
      amenities: JSON.stringify(['エアコン', 'WiFi', '冷蔵庫', 'バスタオル', '連結ドア']),
      images: JSON.stringify([]),
      description: '203号室と繋がることができる特別な部屋です。グループ旅行に最適。',
      descriptionEn: 'Special room that can connect to room 203. Perfect for group travel.',
      descriptionZh: '可与203号房相连的特殊房间，非常适合团体旅行。',
      isConnecting: true,
      connectsTo: 'room-203',
    },
    {
      id: 'room-205',
      roomNumber: '205',
      name: 'スタンダードルーム（205号室）',
      nameEn: 'Standard Room (Room 205)',
      nameZh: '标准间（205号房）',
      type: 'STANDARD',
      maxGuests: 4,
      size: 20,
      amenities: JSON.stringify(['エアコン', 'WiFi', '冷蔵庫', 'バスタオル']),
      images: JSON.stringify([]),
      description: '快適で機能的なスタンダードルームです。必要な設備が揃っています。',
      descriptionEn: 'Comfortable and functional standard room with all necessary amenities.',
      descriptionZh: '舒适实用的标准间，配备所有必需设施。',
    },
    {
      id: 'room-206',
      roomNumber: '206',
      name: '西側角部屋',
      nameEn: 'West Corner Room',
      nameZh: '西侧角房',
      type: 'CORNER',
      maxGuests: 4,
      size: 25,
      amenities: JSON.stringify(['エアコン', 'WiFi', '冷蔵庫', '電子レンジ', 'バスタオル']),
      images: JSON.stringify([]),
      description: '夕日が美しく見える西側の角部屋です。ロマンチックな滞在をお楽しみください。',
      descriptionEn: 'West corner room with beautiful sunset views. Enjoy a romantic stay.',
      descriptionZh: '可欣赏美丽夕阳的西侧角房。享受浪漫的住宿体验。',
    },
  ]

  for (const roomData of roomsData) {
    await prisma.room.upsert({
      where: { id: roomData.id },
      update: {},
      create: roomData,
    })
  }

  console.log('Seeded rooms data')

  // Create pricing data for all rooms
  const pricingData = [
    // Corner Rooms (201, 206) pricing
    { roomId: 'room-201', guestType: 'ADULT', guestCount: 1, price: 12000 },
    { roomId: 'room-201', guestType: 'ADULT', guestCount: 2, price: 8000 },
    { roomId: 'room-201', guestType: 'ADULT', guestCount: 3, price: 6000 },
    { roomId: 'room-201', guestType: 'ADULT', guestCount: 4, price: 5000 },
    { roomId: 'room-201', guestType: 'CHILD', guestCount: 1, price: 3000 },
    
    { roomId: 'room-206', guestType: 'ADULT', guestCount: 1, price: 12000 },
    { roomId: 'room-206', guestType: 'ADULT', guestCount: 2, price: 8000 },
    { roomId: 'room-206', guestType: 'ADULT', guestCount: 3, price: 6000 },
    { roomId: 'room-206', guestType: 'ADULT', guestCount: 4, price: 5000 },
    { roomId: 'room-206', guestType: 'CHILD', guestCount: 1, price: 3000 },

    // Standard Rooms (202, 205) pricing
    { roomId: 'room-202', guestType: 'ADULT', guestCount: 1, price: 11000 },
    { roomId: 'room-202', guestType: 'ADULT', guestCount: 2, price: 8000 },
    { roomId: 'room-202', guestType: 'ADULT', guestCount: 3, price: 6000 },
    { roomId: 'room-202', guestType: 'ADULT', guestCount: 4, price: 5000 },
    { roomId: 'room-202', guestType: 'CHILD', guestCount: 1, price: 3000 },

    { roomId: 'room-205', guestType: 'ADULT', guestCount: 1, price: 11000 },
    { roomId: 'room-205', guestType: 'ADULT', guestCount: 2, price: 8000 },
    { roomId: 'room-205', guestType: 'ADULT', guestCount: 3, price: 6000 },
    { roomId: 'room-205', guestType: 'ADULT', guestCount: 4, price: 5000 },
    { roomId: 'room-205', guestType: 'CHILD', guestCount: 1, price: 3000 },

    // Connecting Rooms (203, 204) pricing
    { roomId: 'room-203', guestType: 'ADULT', guestCount: 1, price: 11000 },
    { roomId: 'room-203', guestType: 'ADULT', guestCount: 2, price: 8000 },
    { roomId: 'room-203', guestType: 'ADULT', guestCount: 3, price: 6000 },
    { roomId: 'room-203', guestType: 'ADULT', guestCount: 4, price: 5000 },
    { roomId: 'room-203', guestType: 'CHILD', guestCount: 1, price: 3000 },

    { roomId: 'room-204', guestType: 'ADULT', guestCount: 1, price: 11000 },
    { roomId: 'room-204', guestType: 'ADULT', guestCount: 2, price: 8000 },
    { roomId: 'room-204', guestType: 'ADULT', guestCount: 3, price: 6000 },
    { roomId: 'room-204', guestType: 'ADULT', guestCount: 4, price: 5000 },
    { roomId: 'room-204', guestType: 'CHILD', guestCount: 1, price: 3000 },
  ]

  for (const pricing of pricingData) {
    await prisma.roomPricing.upsert({
      where: {
        roomId_guestType_guestCount: {
          roomId: pricing.roomId,
          guestType: pricing.guestType,
          guestCount: pricing.guestCount,
        },
      },
      update: {},
      create: pricing,
    })
  }

  console.log('Seeded pricing data')

  // Add some sample settings
  await prisma.settings.upsert({
    where: { key: 'hotel_name' },
    update: {},
    create: {
      key: 'hotel_name',
      value: '箱根仙石原寮',
    },
  })

  await prisma.settings.upsert({
    where: { key: 'hotel_email' },
    update: {},
    create: {
      key: 'hotel_email',
      value: 'asuka.hotel@seiku.co.jp',
    },
  })

  console.log('Seeded settings')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })