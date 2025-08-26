'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTranslation } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface Booking {
  id: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  infants: number;
  totalPrice: number;
  status: string;
  room: {
    name: string;
    nameEn: string;
    nameZh: string;
    roomNumber: string;
  };
}

export default function ProfilePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const router = useRouter();
  const { locale } = useLanguage();
  const t = getTranslation(locale);
  const { user, isAuthenticated, logout, token } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }
    
    fetchUserData();
  }, [isAuthenticated, user, router]);

  const fetchUserData = async () => {
    try {
      // Fetch user bookings
      const response = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
      
      setUserInfo(user);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '確認待ち';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoomName = (room: any) => {
    switch (locale) {
      case 'en':
        return room.nameEn;
      case 'zh':
        return room.nameZh;
      default:
        return room.name;
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (passwordError) setPasswordError('');
    if (passwordSuccess) setPasswordSuccess('');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Client-side validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('すべての項目を入力してください');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('新しいパスワードは6文字以上である必要があります');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('新しいパスワードと確認パスワードが一致しません');
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError('新しいパスワードは現在のパスワードと異なる必要があります');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess('パスワードが正常に更新されました');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // Auto-close modal after success
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess('');
        }, 2000);
      } else {
        setPasswordError(data.error || 'パスワード変更に失敗しました');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordError('ネットワークエラーが発生しました');
    } finally {
      setPasswordLoading(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setPasswordSuccess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wa-cream py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-wa-gray">読み込み中...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-wa-cream py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-wa-brown">個人中心</h1>
            <Link 
              href="/"
              className="text-wa-gray hover:text-wa-brown transition-colors"
            >
              ← ホームに戻る
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-wa-brown rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-wa-cream font-bold text-2xl">
                    {userInfo?.name?.charAt(0)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-wa-brown mb-2">
                  {userInfo?.name}
                </h2>
                <p className="text-wa-gray">{userInfo?.email}</p>
              </div>

              <div className="space-y-4">
                <div className="text-center p-4 bg-wa-cream rounded-lg">
                  <div className="text-2xl font-bold text-wa-brown">{bookings.length}</div>
                  <div className="text-sm text-wa-gray">総予約数</div>
                </div>
                
                <div className="text-center p-4 bg-wa-cream rounded-lg">
                  <div className="text-2xl font-bold text-wa-brown">
                    {bookings.filter(b => b.status === 'CONFIRMED').length}
                  </div>
                  <div className="text-sm text-wa-gray">確認済み予約</div>
                </div>

                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full px-4 py-2 bg-wa-brown text-wa-cream rounded-md hover:bg-wa-brown/90 transition-colors"
                >
                  パスワード変更
                </button>

                <button
                  onClick={logout}
                  className="w-full px-4 py-2 bg-red-600 text-wa-cream rounded-md hover:bg-red-700 transition-colors"
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-wa-brown">予約履歴</h3>
                  <Link
                    href="/booking"
                    className="bg-wa-brown text-wa-cream px-4 py-2 rounded-md hover:bg-wa-brown/90 transition-colors text-sm"
                  >
                    新規予約
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-wa-gray mb-4">予約履歴がありません</div>
                    <Link
                      href="/rooms"
                      className="bg-wa-brown text-wa-cream px-6 py-2 rounded-md hover:bg-wa-brown/90 transition-colors"
                    >
                      客室を見る
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-wa-brown">
                              {getRoomName(booking.room)} ({booking.room.roomNumber})
                            </h4>
                            <p className="text-sm text-wa-gray">
                              予約ID: {booking.id}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-wa-gray">チェックイン:</span>
                            <div className="font-medium">
                              {new Date(booking.checkIn).toLocaleDateString('ja-JP')}
                            </div>
                          </div>
                          <div>
                            <span className="text-wa-gray">チェックアウト:</span>
                            <div className="font-medium">
                              {new Date(booking.checkOut).toLocaleDateString('ja-JP')}
                            </div>
                          </div>
                          <div>
                            <span className="text-wa-gray">宿泊人数:</span>
                            <div className="font-medium">
                              大人{booking.adults}名
                              {booking.children > 0 && `, 子供${booking.children}名`}
                              {booking.infants > 0 && `, 幼児${booking.infants}名`}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                          <div className="text-lg font-semibold text-wa-brown">
                            ¥{booking.totalPrice.toLocaleString()}
                          </div>
                          <div className="text-sm text-wa-gray">
                            予約日: {new Date(booking.checkIn).toLocaleDateString('ja-JP')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-wa-brown">パスワード変更</h3>
                  <button
                    onClick={closePasswordModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {passwordError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                      {passwordSuccess}
                    </div>
                  )}

                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-wa-brown mb-2">
                      現在のパスワード
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown focus:border-transparent text-wa-brown"
                      required
                      disabled={passwordLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-wa-brown mb-2">
                      新しいパスワード
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown focus:border-transparent text-wa-brown"
                      required
                      minLength={6}
                      disabled={passwordLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">6文字以上で入力してください</p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-wa-brown mb-2">
                      新しいパスワード（確認）
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown focus:border-transparent text-wa-brown"
                      required
                      disabled={passwordLoading}
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closePasswordModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      disabled={passwordLoading}
                    >
                      キャンセル
                    </button>
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="flex-1 px-4 py-2 bg-wa-brown text-wa-cream rounded-md hover:bg-wa-brown/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {passwordLoading ? '変更中...' : 'パスワード変更'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}