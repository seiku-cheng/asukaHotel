'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Room, Booking } from '@/types';
import { getTranslation } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface BookingData {
  roomId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  infants: number;
  nights: number;
  totalPrice: number;
}

export default function BookingPage() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const router = useRouter();
  const { locale } = useLanguage();
  const { user, isAuthenticated, token } = useAuth();
  const t = getTranslation(locale);

  useEffect(() => {
    const savedBookingData = localStorage.getItem('bookingData');
    if (savedBookingData) {
      const data: BookingData = JSON.parse(savedBookingData);
      setBookingData(data);
      
      // Fetch room data from API
      fetchRoomData(data.roomId);
    } else {
      router.push('/rooms');
    }
  }, [router]);

  // Auto-fill user information for logged in users
  useEffect(() => {
    if (isAuthenticated && user) {
      setGuestName(user.name);
      setGuestEmail(user.email);
    }
  }, [isAuthenticated, user]);

  const fetchRoomData = async (roomId: string) => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`);
      if (response.ok) {
        const roomData = await response.json();
        setRoom(roomData);
      } else {
        console.error('Failed to fetch room data');
        // If room is not available, redirect to rooms page
        router.push('/rooms');
      }
    } catch (error) {
      console.error('Error fetching room data:', error);
      router.push('/rooms');
    }
  };

  const getRoomName = () => {
    if (!room) return '';
    switch (locale) {
      case 'en': return room.nameEn;
      case 'zh': return room.nameZh;
      default: return room.name;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData || !room) return;

    setIsSubmitting(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if user is logged in
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          roomId: bookingData.roomId,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          adults: bookingData.adults,
          children: bookingData.children,
          infants: bookingData.infants,
          guestName,
          guestEmail,
          guestPhone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        localStorage.removeItem('bookingData');
        
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        alert(data.error || t.booking.error);
      }
    } catch (error) {
      alert(t.booking.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendConfirmationEmail = async (booking: Booking) => {
    console.log('予約確認メール送信:', {
      to: booking.guestEmail,
      subject: '予約確認 - 朝香ホテル',
      booking,
    });
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-wa-beige">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-wa-green rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-wa-brown mb-2">{t.booking.success}</h2>
            <p className="text-wa-gray mb-4">
              {t.booking.confirmationEmail}<br />
              {t.booking.redirectMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!bookingData || !room) {
    return (
      <div className="min-h-screen bg-wa-beige">
        <Header />
        <div className="flex items-center justify-center h-64">
          <p className="text-wa-gray">{t.booking.bookingNotFound}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wa-beige">
      <Header />
      
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center text-wa-brown hover:text-wa-brown/80 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.common.back}
          </button>

          <h1 className="text-3xl font-bold text-wa-brown mb-8 font-noto text-center">
            {t.booking.title}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-wa-brown mb-4">{t.booking.bookingDetails}</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-wa-gray">{t.booking.room}</span>
                  <span className="font-medium text-wa-brown">{getRoomName()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-wa-gray">{t.booking.checkin}</span>
                  <span className="font-medium text-wa-brown">{bookingData.checkIn}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-wa-gray">{t.booking.checkout}</span>
                  <span className="font-medium text-wa-brown">{bookingData.checkOut}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-wa-gray">{t.booking.nights}</span>
                  <span className="font-medium text-wa-brown">{bookingData.nights}{t.common.night}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-wa-gray">{t.booking.guests}</span>
                  <span className="font-medium text-wa-brown">
                    大人{bookingData.adults}名
                    {bookingData.children > 0 && `, 小学生${bookingData.children}名`}
                    {bookingData.infants > 0 && `, 幼児${bookingData.infants}名`}
                  </span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-wa-brown">
                    <span>{t.booking.totalPrice}</span>
                    <span>¥{bookingData.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-wa-brown mb-4">{t.booking.guestInfo}</h2>
              
              {!isAuthenticated && (
                <div className="bg-wa-beige border border-wa-brown/20 rounded-md p-4 mb-6">
                  <div className="flex items-center">
                    <div className="text-wa-brown">
                      <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">
                        <a href="/login" className="text-wa-brown hover:underline font-medium">ログイン</a>
                        または
                        <a href="/register" className="text-wa-brown hover:underline font-medium">会員登録</a>
                        していただくと、次回のご予約時に情報が自動入力されます
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {isAuthenticated && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                  <div className="flex items-center">
                    <div className="text-green-600">
                      <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">
                        {user?.name}様としてログイン中 - お客様情報が自動入力されました
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-wa-gray mb-1">
                    {t.booking.guestName} *
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-wa-gray mb-1">
                    {t.booking.guestEmail} *
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-wa-gray mb-1">
                    {t.booking.guestPhone} *
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                    required
                  />
                </div>

                <div className="bg-wa-beige p-4 rounded-md">
                  <h3 className="font-medium text-wa-brown mb-2">{t.booking.cancellationPolicy}</h3>
                  <ul className="text-sm text-wa-gray space-y-1">
                    {t.booking.cancellationRules.map((rule, index) => (
                      <li key={index}>• {rule}</li>
                    ))}
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-wa-brown text-wa-cream py-3 rounded-md hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t.booking.processing : t.booking.confirm}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-wa-brown text-wa-cream py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>{t.common.copyright}</p>
        </div>
      </footer>
    </div>
  );
}