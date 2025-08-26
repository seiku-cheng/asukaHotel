'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

interface RoomStats {
  totalBookings: number;
  confirmedBookings: number;
  monthlyBookings: number;
  monthlyRevenue: number;
}

interface RoomPricing {
  id: string;
  roomId: string;
  guestType: 'ADULT' | 'CHILD';
  guestCount: number;
  price: number;
}

interface Room {
  id: string;
  roomNumber: string;
  name: string;
  nameEn: string;
  nameZh: string;
  type: 'CORNER' | 'STANDARD' | 'CONNECTING';
  maxGuests: number;
  size: number;
  amenities: string[];
  images: string[];
  description: string;
  descriptionEn: string;
  descriptionZh: string;
  isConnecting: boolean;
  connectsTo?: string;
  isActive: boolean;
  pricing: RoomPricing[];
  stats: RoomStats;
}

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'CORNER' | 'STANDARD' | 'CONNECTING'>('ALL');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchRooms();
  }, [router]);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/rooms', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRoomStatus = async (roomId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/rooms/${roomId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        await fetchRooms(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to toggle room status:', error);
    }
  };

  const getRoomTypeText = (type: string) => {
    switch (type) {
      case 'CORNER':
        return '角部屋';
      case 'STANDARD':
        return 'スタンダード';
      case 'CONNECTING':
        return '連結部屋';
      default:
        return type;
    }
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'CORNER':
        return 'bg-purple-100 text-purple-800';
      case 'STANDARD':
        return 'bg-blue-100 text-blue-800';
      case 'CONNECTING':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRooms = rooms.filter(room => 
    filter === 'ALL' || room.type === filter
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-wa-gray">読み込み中...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-wa-brown mb-2">客室管理</h1>
            <p className="text-wa-gray">客室情報の管理と設定</p>
          </div>

          <div className="flex space-x-2">
            {['ALL', 'CORNER', 'STANDARD', 'CONNECTING'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === type
                    ? 'bg-wa-brown text-wa-cream'
                    : 'bg-white text-wa-gray hover:bg-wa-beige'
                }`}
              >
                {type === 'ALL' ? '全て' : getRoomTypeText(type)}
                {type !== 'ALL' && (
                  <span className="ml-2 bg-white bg-opacity-20 rounded-full px-2 py-0.5 text-xs">
                    {rooms.filter(r => r.type === type).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-wa-gray">総客室数</div>
            <div className="text-2xl font-bold text-wa-brown">{rooms.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-wa-gray">稼働中</div>
            <div className="text-2xl font-bold text-wa-green">
              {rooms.filter(r => r.isActive).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-wa-gray">今月予約総数</div>
            <div className="text-2xl font-bold text-wa-brown">
              {rooms.reduce((sum, r) => sum + r.stats.monthlyBookings, 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-wa-gray">今月売上</div>
            <div className="text-2xl font-bold text-wa-brown">
              ¥{rooms.reduce((sum, r) => sum + r.stats.monthlyRevenue, 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Room Image */}
              <div className="relative h-48 bg-gray-200">
                {room.images && room.images[0] && (
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoomTypeColor(room.type)}`}>
                    {getRoomTypeText(room.type)}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    room.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {room.isActive ? '稼働中' : '停止中'}
                  </span>
                </div>
              </div>

              {/* Room Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-wa-brown">{room.name}</h3>
                  <div className="text-right">
                    <div className="text-xs text-wa-gray">Room {room.roomNumber}</div>
                    <div className="text-sm font-bold text-wa-brown">
                      {room.pricing && room.pricing.find(p => p.guestType === 'ADULT' && p.guestCount === 1) ? 
                        `¥${room.pricing.find(p => p.guestType === 'ADULT' && p.guestCount === 1)!.price.toLocaleString()}〜` : 
                        '価格設定未完了'
                      }
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="text-gray-500">面積:</span> {room.size}m²
                  </div>
                  <div>
                    <span className="text-gray-500">定員:</span> {room.maxGuests}名
                  </div>
                  <div>
                    <span className="text-gray-500">今月予約:</span> {room.stats.monthlyBookings}件
                  </div>
                  <div>
                    <span className="text-gray-500">総予約:</span> {room.stats.totalBookings}件
                  </div>
                </div>

                {room.isConnecting && room.connectsTo && (
                  <div className="mb-3 p-2 bg-wa-beige rounded text-sm">
                    <span className="text-wa-brown font-medium">連結可能:</span> {room.connectsTo}
                  </div>
                )}

                {/* Room Stats */}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">今月売上</span>
                    <span className="font-medium text-wa-brown">
                      ¥{room.stats.monthlyRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 mt-4">
                  <Link
                    href={`/admin/rooms/${room.id}`}
                    className="flex-1 bg-wa-brown text-wa-cream text-center py-2 rounded text-sm hover:bg-opacity-90 transition-colors"
                  >
                    詳細・編集
                  </Link>
                  <button
                    onClick={() => toggleRoomStatus(room.id, room.isActive)}
                    className={`px-3 py-2 rounded text-sm transition-colors ${
                      room.isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {room.isActive ? '停止' : '稼働'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {filter === 'ALL' ? '客室がありません' : `${getRoomTypeText(filter)}の客室がありません`}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}