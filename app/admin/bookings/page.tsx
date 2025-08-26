'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface Booking {
  id: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  createdAt: string;
  room: {
    name: string;
    nameEn: string;
    nameZh: string;
  };
}

interface Room {
  id: string;
  name: string;
  nameEn: string;
  nameZh: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [roomFilter, setRoomFilter] = useState<string>('ALL');
  const [rooms, setRooms] = useState<Room[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchBookings();
    fetchRooms();
  }, [router]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchBookings(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '未確認';
      case 'CONFIRMED':
        return '確認済み';
      case 'CANCELLED':
        return 'キャンセル';
      case 'COMPLETED':
        return '完了';
      default:
        return status;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const statusMatch = filter === 'ALL' || booking.status === filter;
    const roomMatch = roomFilter === 'ALL' || booking.roomId === roomFilter;
    return statusMatch && roomMatch;
  });

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
            <h1 className="text-2xl font-bold text-wa-brown mb-2">予約管理</h1>
            <p className="text-wa-gray">宿泊予約の管理と確認</p>
          </div>
          
          <button
            onClick={() => {
              fetchBookings();
              fetchRooms();
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-wa-brown text-wa-cream rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            {isLoading ? '更新中...' : '更新'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex space-x-2">
            {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-wa-brown text-wa-cream'
                    : 'bg-white text-wa-gray hover:bg-wa-beige'
                }`}
              >
                {status === 'ALL' ? '全て' : getStatusText(status)}
                {status !== 'ALL' && (
                  <span className="ml-2 bg-white bg-opacity-20 rounded-full px-2 py-0.5 text-xs">
                    {bookings.filter(b => b.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Room Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-wa-gray">客室:</label>
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-wa-gray focus:outline-none focus:ring-2 focus:ring-wa-brown"
            >
              <option value="ALL">全ての客室</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    予約情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    宿泊者情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    宿泊詳細
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{booking.room.name}</div>
                        <div className="text-gray-500">予約ID: {booking.id.slice(-8)}</div>
                        <div className="text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString('ja-JP')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{booking.guestName}</div>
                        <div className="text-gray-500">{booking.guestEmail}</div>
                        <div className="text-gray-500">{booking.guestPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-900">
                          {new Date(booking.checkIn).toLocaleDateString('ja-JP')} 〜 
                          {new Date(booking.checkOut).toLocaleDateString('ja-JP')}
                        </div>
                        <div className="text-gray-500">{booking.guests}名</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ¥{booking.totalPrice.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {booking.status === 'PENDING' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                            className="bg-wa-green text-wa-cream px-3 py-1 rounded text-xs hover:bg-opacity-90 transition-colors"
                          >
                            確認
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                            className="bg-wa-red text-wa-cream px-3 py-1 rounded text-xs hover:bg-opacity-90 transition-colors"
                          >
                            キャンセル
                          </button>
                        </div>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                          className="bg-wa-brown text-wa-cream px-3 py-1 rounded text-xs hover:bg-opacity-90 transition-colors"
                        >
                          完了
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {filter === 'ALL' ? '予約がありません' : `${getStatusText(filter)}の予約がありません`}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}