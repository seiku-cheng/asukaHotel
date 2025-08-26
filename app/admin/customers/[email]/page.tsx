'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

interface BookingDetail {
  id: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  createdAt: string;
  room: {
    name: string;
    nameEn: string;
    nameZh: string;
    type: string;
  };
}

interface CustomerDetail {
  email: string;
  name: string;
  phone: string;
  firstBooking: string;
  lastBooking: string;
  statistics: {
    totalBookings: number;
    totalSpent: number;
    averageBookingValue: number;
    confirmedBookings: number;
    cancelledBookings: number;
    completedBookings: number;
    favoriteRoomTypes: string[];
  };
  bookings: BookingDetail[];
}

export default function CustomerDetailPage() {
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings'>('overview');
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (params.email) {
      fetchCustomerDetail();
    }
  }, [router, params.email]);

  const fetchCustomerDetail = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const email = decodeURIComponent(params.email as string);
      
      const response = await fetch(`/api/admin/customers/${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomer(data);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      } else if (response.status === 404) {
        router.push('/admin/customers');
      }
    } catch (error) {
      console.error('Failed to fetch customer detail:', error);
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-wa-gray">読み込み中...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!customer) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="text-gray-500">顧客が見つかりません</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/admin/customers" className="hover:text-wa-brown">
            顧客管理
          </Link>
          <span>›</span>
          <span className="text-wa-brown">{customer.name}</span>
        </div>

        {/* Customer Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-wa-brown rounded-full flex items-center justify-center">
                <span className="text-wa-cream font-bold text-xl">
                  {customer.name.charAt(0)}
                </span>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-wa-brown">{customer.name}</h1>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {customer.email}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {customer.phone}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">顧客ランク</div>
              <div className="text-lg font-semibold text-wa-brown">
                {customer.statistics.totalBookings >= 5 ? 'VIP' : 
                 customer.statistics.totalBookings >= 2 ? 'リピーター' : '新規'}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-wa-gray">総予約数</div>
            <div className="text-2xl font-bold text-wa-brown">{customer.statistics.totalBookings}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-wa-gray">総消費額</div>
            <div className="text-2xl font-bold text-wa-brown">¥{customer.statistics.totalSpent.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-wa-gray">平均予約額</div>
            <div className="text-2xl font-bold text-wa-brown">¥{customer.statistics.averageBookingValue.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-wa-gray">完了予約</div>
            <div className="text-2xl font-bold text-wa-brown">{customer.statistics.completedBookings}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-wa-brown text-wa-brown'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                概要
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-wa-brown text-wa-brown'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                予約履歴 ({customer.bookings.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-wa-brown mb-4">顧客情報</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">初回利用日</span>
                        <div className="text-gray-900">{new Date(customer.firstBooking).toLocaleDateString('ja-JP')}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">最終利用日</span>
                        <div className="text-gray-900">{new Date(customer.lastBooking).toLocaleDateString('ja-JP')}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">好みの部屋タイプ</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {customer.statistics.favoriteRoomTypes.map((type) => (
                            <span
                              key={type}
                              className="px-2 py-1 bg-wa-beige text-wa-brown text-xs rounded-full"
                            >
                              {getRoomTypeText(type)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-wa-brown mb-4">予約統計</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">確認済み予約</span>
                        <span className="font-medium text-wa-brown">{customer.statistics.confirmedBookings} 件</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">完了予約</span>
                        <span className="font-medium text-wa-brown">{customer.statistics.completedBookings} 件</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">キャンセル予約</span>
                        <span className="font-medium text-red-600">{customer.statistics.cancelledBookings} 件</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between">
                          <span className="text-gray-600">キャンセル率</span>
                          <span className="font-medium text-wa-brown">
                            {customer.statistics.totalBookings > 0 
                              ? Math.round((customer.statistics.cancelledBookings / customer.statistics.totalBookings) * 100)
                              : 0
                            }%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {customer.bookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <h4 className="font-medium text-gray-900">{booking.room.name}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="block text-xs text-gray-500">チェックイン</span>
                            {new Date(booking.checkIn).toLocaleDateString('ja-JP')}
                          </div>
                          <div>
                            <span className="block text-xs text-gray-500">チェックアウト</span>
                            {new Date(booking.checkOut).toLocaleDateString('ja-JP')}
                          </div>
                          <div>
                            <span className="block text-xs text-gray-500">宿泊人数</span>
                            {booking.guests}名
                          </div>
                          <div>
                            <span className="block text-xs text-gray-500">予約日</span>
                            {new Date(booking.createdAt).toLocaleDateString('ja-JP')}
                          </div>
                        </div>
                        {booking.notes && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">備考:</span>
                            <p className="text-sm text-gray-600">{booking.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-semibold text-wa-brown">
                          ¥{booking.totalPrice.toLocaleString()}
                        </div>
                        <Link
                          href={`/admin/bookings`}
                          className="text-xs text-wa-brown hover:text-wa-brown/80"
                        >
                          予約詳細 →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}