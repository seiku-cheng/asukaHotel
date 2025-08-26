'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

interface BookingDetail {
  id: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  infants: number;
  guestName: string;
  guestEmail: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface RoomPricing {
  id: string;
  roomId: string;
  guestType: 'ADULT' | 'CHILD';
  guestCount: number;
  price: number;
}

interface RoomDetail {
  id: string;
  roomNumber: string;
  name: string;
  nameEn: string;
  nameZh: string;
  type: 'CORNER' | 'STANDARD' | 'CONNECTING';
  pricing: RoomPricing[];
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
  recentBookings: BookingDetail[];
  occupancyRate: number;
  occupiedDays: number;
  totalDaysInMonth: number;
}

export default function RoomDetailPage() {
  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPricingSaving, setIsPricingSaving] = useState(false);
  const [pricingForm, setPricingForm] = useState({
    adult1: 0,
    adult2: 0,
    adult3: 0,
    adult4: 0,
    child: 3000, // Default child price
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'pricing' | 'images' | 'edit'>('overview');
  const router = useRouter();
  const params = useParams();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    nameZh: '',
    type: 'STANDARD' as 'CORNER' | 'STANDARD' | 'CONNECTING',
    maxGuests: 1,
    size: 0,
    amenities: [] as string[],
    description: '',
    descriptionEn: '',
    descriptionZh: '',
    isConnecting: false,
    connectsTo: '',
    isActive: true,
  });

  // Image upload states
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDeletingImage, setIsDeletingImage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (params.id) {
      fetchRoomDetail();
    }
  }, [router, params.id]);

  const fetchRoomDetail = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/rooms/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRoom(data);
        setFormData({
          name: data.name,
          nameEn: data.nameEn,
          nameZh: data.nameZh,
          type: data.type,
          maxGuests: data.maxGuests,
          size: data.size,
          amenities: data.amenities || [],
          description: data.description,
          descriptionEn: data.descriptionEn,
          descriptionZh: data.descriptionZh,
          isConnecting: data.isConnecting,
          connectsTo: data.connectsTo || '',
          isActive: data.isActive,
        });
        
        // Initialize pricing form with existing data
        if (data.pricing) {
          const adultPricing = data.pricing.filter(p => p.guestType === 'ADULT');
          const childPricing = data.pricing.find(p => p.guestType === 'CHILD');
          
          setPricingForm({
            adult1: adultPricing.find(p => p.guestCount === 1)?.price || 0,
            adult2: adultPricing.find(p => p.guestCount === 2)?.price || 0,
            adult3: adultPricing.find(p => p.guestCount === 3)?.price || 0,
            adult4: adultPricing.find(p => p.guestCount === 4)?.price || 0,
            child: childPricing?.price || 3000,
          });
        }
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      } else if (response.status === 404) {
        router.push('/admin/rooms');
      }
    } catch (error) {
      console.error('Failed to fetch room detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePricingSave = async () => {
    if (!room) return;

    setIsPricingSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/rooms/${room.id}/pricing`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pricingForm),
      });

      if (response.ok) {
        // Refresh room data to get updated pricing
        await fetchRoomDetail();
        alert('価格設定を更新しました');
      } else {
        const error = await response.json();
        alert(error.error || '価格更新に失敗しました');
      }
    } catch (error) {
      console.error('Failed to update pricing:', error);
      alert('価格更新に失敗しました');
    } finally {
      setIsPricingSaving(false);
    }
  };

  const handleSave = async () => {
    if (!room) return;

    setIsSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/rooms/${room.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedRoom = await response.json();
        setRoom({ ...room, ...updatedRoom });
        setIsEditing(false);
        setActiveTab('overview');
        alert('客室情報を更新しました');
      } else {
        const error = await response.json();
        alert(error.error || '更新に失敗しました');
      }
    } catch (error) {
      console.error('Failed to update room:', error);
      alert('更新に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAmenitiesChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const getRoomTypeText = (type: string) => {
    switch (type) {
      case 'CORNER': return '角部屋';
      case 'STANDARD': return 'スタンダード';
      case 'CONNECTING': return '連結部屋';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '未確認';
      case 'CONFIRMED': return '確認済み';
      case 'CANCELLED': return 'キャンセル';
      case 'COMPLETED': return '完了';
      default: return status;
    }
  };

  const availableAmenities = [
    'エアコン', 'WiFi', '冷蔵庫', '電子レンジ', 'バスタオル', 'シャンプー',
    'ボディソープ', 'ドライヤー', 'テレビ', '湯沸かしポット', '連結ドア'
  ];

  // Image upload functions
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    setUploadError('');

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/rooms/${params.id}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh room data to get updated images
        await fetchRoomDetail();
        // Clear the input
        event.target.value = '';
      } else {
        setUploadError(data.error || 'アップロードに失敗しました');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('アップロードに失敗しました');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleImageDelete = async (imageUrl: string) => {
    if (!confirm('この画像を削除しますか？')) return;

    setIsDeletingImage(imageUrl);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/rooms/${params.id}/images?image=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh room data to get updated images
        await fetchRoomDetail();
      } else {
        alert(data.error || '削除に失敗しました');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('削除に失敗しました');
    } finally {
      setIsDeletingImage(null);
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

  if (!room) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="text-gray-500">客室が見つかりません</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/admin/rooms" className="hover:text-wa-brown">
            客室管理
          </Link>
          <span>›</span>
          <span className="text-wa-brown">{room.name}</span>
        </div>

        {/* Room Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              {room.images && room.images[0] && (
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="w-20 h-20 object-cover rounded-lg mr-4"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-wa-brown">{room.name}</h1>
                <div className="mt-2 flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    room.type === 'CORNER' ? 'bg-purple-100 text-purple-800' :
                    room.type === 'STANDARD' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {getRoomTypeText(room.type)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    room.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {room.isActive ? '稼働中' : '停止中'}
                  </span>
                  <span className="text-sm text-gray-600">{room.size}m² | {room.maxGuests}名まで</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-wa-brown">
                ¥{room.pricing && room.pricing.find(p => p.guestType === 'ADULT' && p.guestCount === 1) ? 
                  room.pricing.find(p => p.guestType === 'ADULT' && p.guestCount === 1)!.price.toLocaleString() : 
                  '設定なし'
                }〜
              </div>
              <div className="text-sm text-gray-500">1名あたり/泊</div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-wa-gray">今月稼働率</div>
            <div className="text-2xl font-bold text-wa-brown">{room.occupancyRate}%</div>
            <div className="text-xs text-gray-500">{room.occupiedDays}/{room.totalDaysInMonth} 日</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-wa-gray">総予約数</div>
            <div className="text-2xl font-bold text-wa-brown">{room.recentBookings.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-wa-gray">今月売上予測</div>
            <div className="text-2xl font-bold text-wa-brown">
              ¥{room.pricing && room.pricing.find(p => p.guestType === 'ADULT' && p.guestCount === 1) ? 
                (room.pricing.find(p => p.guestType === 'ADULT' && p.guestCount === 1)!.price * room.occupiedDays).toLocaleString() : 
                '0'
              }
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-wa-gray">平均稼働率</div>
            <div className="text-2xl font-bold text-wa-brown">
              {Math.round((room.occupancyRate + 65) / 2)}%
            </div>
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
                予約履歴 ({room.recentBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pricing'
                    ? 'border-wa-brown text-wa-brown'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                価格設定
              </button>
              <button
                onClick={() => setActiveTab('images')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'images'
                    ? 'border-wa-brown text-wa-brown'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                画像管理 ({room.images ? room.images.length : 0})
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'edit'
                    ? 'border-wa-brown text-wa-brown'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                編集
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-wa-brown mb-4">客室情報</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-500">客室名</span>
                        <div className="text-gray-900">{room.name}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">English Name</span>
                        <div className="text-gray-900">{room.nameEn}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">中文名称</span>
                        <div className="text-gray-900">{room.nameZh}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">説明</span>
                        <div className="text-gray-900">{room.description}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-wa-brown mb-4">設備・アメニティ</h3>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-1 bg-wa-beige text-wa-brown text-xs rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {room.isConnecting && room.connectsTo && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <span className="text-yellow-800 font-medium">連結可能:</span>
                        <span className="ml-2 text-yellow-700">{room.connectsTo}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-wa-brown">最近の予約履歴</h3>
                {room.recentBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h4 className="font-medium text-gray-900">{booking.guestName}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
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
                            大人{booking.adults}名{booking.children > 0 && `, 小学生${booking.children}名`}{booking.infants > 0 && `, 幼児${booking.infants}名`}
                          </div>
                          <div>
                            <span className="block text-xs text-gray-500">予約日</span>
                            {new Date(booking.createdAt).toLocaleDateString('ja-JP')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-semibold text-wa-brown">
                          ¥{booking.totalPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {room.recentBookings.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    予約履歴がありません
                  </div>
                )}
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-wa-brown mb-4">価格設定</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    各利用人数毎の1名あたりの料金を設定してください。小学生未満は無料です。
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Adult Pricing */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-wa-brown mb-4">大人料金（円/人/泊）</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          1名利用時 *
                        </label>
                        <input
                          type="number"
                          value={pricingForm.adult1}
                          onChange={(e) => setPricingForm(prev => ({ ...prev, adult1: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                          placeholder="12000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          2名利用時 *
                        </label>
                        <input
                          type="number"
                          value={pricingForm.adult2}
                          onChange={(e) => setPricingForm(prev => ({ ...prev, adult2: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                          placeholder="8000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          3名利用時 *
                        </label>
                        <input
                          type="number"
                          value={pricingForm.adult3}
                          onChange={(e) => setPricingForm(prev => ({ ...prev, adult3: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                          placeholder="6000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          4名利用時 *
                        </label>
                        <input
                          type="number"
                          value={pricingForm.adult4}
                          onChange={(e) => setPricingForm(prev => ({ ...prev, adult4: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                          placeholder="5000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Child Pricing */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-wa-brown mb-4">小学生料金（円/人/泊）</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        小学生（一律料金） *
                      </label>
                      <input
                        type="number"
                        value={pricingForm.child}
                        onChange={(e) => setPricingForm(prev => ({ ...prev, child: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                        placeholder="3000"
                      />
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <div className="text-sm text-blue-800">
                        <div className="font-medium mb-1">注意事項:</div>
                        <ul className="text-xs space-y-1">
                          <li>• 小学生未満のお子様は無料です</li>
                          <li>• 小学生料金は人数に関係なく一律です</li>
                          <li>• 大人の人数が多いほど割安になります</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Pricing Display */}
                {room.pricing && room.pricing.length > 0 && (
                  <div className="bg-wa-beige p-4 rounded-lg">
                    <h4 className="font-medium text-wa-brown mb-3">現在の設定</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {room.pricing.filter(p => p.guestType === 'ADULT').map((pricing) => (
                        <div key={pricing.id} className="bg-white rounded px-3 py-2">
                          <div className="text-gray-600">大人{pricing.guestCount}名</div>
                          <div className="font-bold text-wa-brown">¥{pricing.price.toLocaleString()}</div>
                        </div>
                      ))}
                      {room.pricing.filter(p => p.guestType === 'CHILD').map((pricing) => (
                        <div key={pricing.id} className="bg-white rounded px-3 py-2">
                          <div className="text-gray-600">小学生</div>
                          <div className="font-bold text-wa-brown">¥{pricing.price.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      // Reset form to current pricing
                      if (room.pricing) {
                        const adultPricing = room.pricing.filter(p => p.guestType === 'ADULT');
                        const childPricing = room.pricing.find(p => p.guestType === 'CHILD');
                        
                        setPricingForm({
                          adult1: adultPricing.find(p => p.guestCount === 1)?.price || 0,
                          adult2: adultPricing.find(p => p.guestCount === 2)?.price || 0,
                          adult3: adultPricing.find(p => p.guestCount === 3)?.price || 0,
                          adult4: adultPricing.find(p => p.guestCount === 4)?.price || 0,
                          child: childPricing?.price || 3000,
                        });
                      }
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    リセット
                  </button>
                  <button
                    onClick={handlePricingSave}
                    disabled={isPricingSaving}
                    className="px-6 py-2 bg-wa-brown text-wa-cream rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPricingSaving ? '保存中...' : '価格を保存'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-wa-brown mb-4">画像管理</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    客室の画像をアップロード・管理できます。複数の画像を選択して一度にアップロードできます。
                  </p>
                </div>

                {/* Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="space-y-4">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">画像をアップロード</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        JPG、PNG形式（最大5MB）。複数選択可能。
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <label className="relative cursor-pointer bg-wa-brown text-wa-cream px-6 py-2 rounded-md hover:bg-wa-brown/90 transition-colors">
                        <span>{isUploadingImages ? 'アップロード中...' : '画像を選択'}</span>
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          disabled={isUploadingImages}
                        />
                      </label>
                    </div>

                    {uploadError && (
                      <div className="text-red-600 text-sm">{uploadError}</div>
                    )}
                  </div>
                </div>

                {/* Current Images */}
                <div>
                  <h4 className="text-md font-semibold text-wa-brown mb-4">
                    現在の画像 ({room.images ? room.images.length : 0}枚)
                  </h4>
                  
                  {room.images && room.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {room.images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`${room.name} - 画像 ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <button
                              onClick={() => handleImageDelete(imageUrl)}
                              disabled={isDeletingImage === imageUrl}
                              className="opacity-0 group-hover:opacity-100 bg-red-600 text-wa-cream px-3 py-1 rounded text-sm hover:bg-red-700 transition-all disabled:opacity-50"
                            >
                              {isDeletingImage === imageUrl ? '削除中...' : '削除'}
                            </button>
                          </div>
                          <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-wa-cream px-2 py-1 rounded text-xs">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      アップロードされた画像がありません
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'edit' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-wa-brown mb-4">基本情報</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          客室名 *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          English Name *
                        </label>
                        <input
                          type="text"
                          value={formData.nameEn}
                          onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          中文名称 *
                        </label>
                        <input
                          type="text"
                          value={formData.nameZh}
                          onChange={(e) => setFormData(prev => ({ ...prev, nameZh: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          客室タイプ *
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                        >
                          <option value="STANDARD">スタンダード</option>
                          <option value="CORNER">角部屋</option>
                          <option value="CONNECTING">連結部屋</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Specs */}
                  <div>
                    <h3 className="text-lg font-semibold text-wa-brown mb-4">仕様・料金</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          料金設定
                        </label>
                        <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                          価格設定は価格矩阵管理画面で設定してください。
                          {room.pricing && room.pricing.length > 0 ? (
                            <div className="mt-2">
                              <div className="text-xs text-gray-500">現在の基本料金:</div>
                              <div className="font-medium">大人1名: ¥{room.pricing.find(p => p.guestType === 'ADULT' && p.guestCount === 1)?.price.toLocaleString() || 'なし'}</div>
                            </div>
                          ) : (
                            <div className="mt-2 text-red-600">価格が設定されていません</div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          最大収容人数 *
                        </label>
                        <input
                          type="number"
                          value={formData.maxGuests}
                          onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: parseInt(e.target.value) || 1 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          面積（m²） *
                        </label>
                        <input
                          type="number"
                          value={formData.size}
                          onChange={(e) => setFormData(prev => ({ ...prev, size: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                          required
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="mr-2"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          稼働中
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold text-wa-brown mb-4">アメニティ</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {availableAmenities.map((amenity) => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={(e) => handleAmenitiesChange(amenity, e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      日本語説明
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      English Description
                    </label>
                    <textarea
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      中文说明
                    </label>
                    <textarea
                      value={formData.descriptionZh}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionZh: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                    />
                  </div>
                </div>

                {/* Connecting Room */}
                {formData.type === 'CONNECTING' && (
                  <div>
                    <h3 className="text-lg font-semibold text-wa-brown mb-4">連結設定</h3>
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={formData.isConnecting}
                        onChange={(e) => setFormData(prev => ({ ...prev, isConnecting: e.target.checked }))}
                        className="mr-2"
                      />
                      <label className="text-sm font-medium text-gray-700">連結可能</label>
                      {formData.isConnecting && (
                        <input
                          type="text"
                          value={formData.connectsTo}
                          onChange={(e) => setFormData(prev => ({ ...prev, connectsTo: e.target.value }))}
                          placeholder="連結先客室ID"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setFormData({
                        name: room.name,
                        nameEn: room.nameEn,
                        nameZh: room.nameZh,
                        type: room.type,
                        maxGuests: room.maxGuests,
                        size: room.size,
                        amenities: room.amenities || [],
                        description: room.description,
                        descriptionEn: room.descriptionEn,
                        descriptionZh: room.descriptionZh,
                        isConnecting: room.isConnecting,
                        connectsTo: room.connectsTo || '',
                        isActive: room.isActive,
                      });
                      setActiveTab('overview');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 bg-wa-brown text-wa-cream rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? '保存中...' : '保存'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}