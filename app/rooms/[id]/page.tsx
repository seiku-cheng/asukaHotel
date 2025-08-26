'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import PhotoCarousel from '@/components/PhotoCarousel';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import { Room, PricingResult } from '@/types';
import { getTranslation } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function RoomDetailPage() {
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [nights, setNights] = useState(0);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const { locale } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const t = getTranslation(locale);

  useEffect(() => {
    if (params.id) {
      fetchRoomDetail(params.id as string);
    }
  }, [params.id]);

  const fetchRoomDetail = async (roomId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/rooms/${roomId}`);
      
      if (response.ok) {
        const roomData = await response.json();
        setRoom(roomData);
      } else if (response.status === 404) {
        setRoom(null);
      } else {
        console.error('Failed to fetch room detail');
        setRoom(null);
      }
    } catch (error) {
      console.error('Error fetching room detail:', error);
      setRoom(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
      
      if (room && diffDays > 0) {
        checkAvailability(checkIn, checkOut);
        calculatePrice();
      }
    } else {
      setAvailabilityMessage('');
      setPricingResult(null);
    }
  }, [checkIn, checkOut, room]);

  useEffect(() => {
    if (checkIn && checkOut && nights > 0 && room) {
      calculatePrice();
    }
  }, [adults, children, infants, checkIn, checkOut, nights, room]);

  const calculatePrice = async () => {
    if (!room || !checkIn || !checkOut || nights <= 0) return;

    try {
      setIsCalculatingPrice(true);
      const response = await fetch(`/api/rooms/${room.id}/calculate-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adults,
          children,
          infants,
          checkIn,
          checkOut,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setPricingResult(result);
      } else {
        const error = await response.json();
        console.error('Price calculation error:', error);
        setPricingResult(null);
      }
    } catch (error) {
      console.error('Price calculation error:', error);
      setPricingResult(null);
    } finally {
      setIsCalculatingPrice(false);
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

  const getRoomDescription = () => {
    if (!room) return '';
    switch (locale) {
      case 'en': return room.descriptionEn;
      case 'zh': return room.descriptionZh;
      default: return room.description;
    }
  };

  const checkAvailability = async (startDate: string, endDate: string) => {
    if (!room || !startDate || !endDate) return false;

    const checkInDate = new Date(startDate);
    const checkOutDate = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      setAvailabilityMessage('✗ チェックイン日は今日以降の日付を選択してください');
      return false;
    }

    if (checkOutDate <= checkInDate) {
      setAvailabilityMessage('✗ チェックアウト日はチェックイン日より後の日付を選択してください');
      return false;
    }

    try {
      setIsCheckingAvailability(true);
      setAvailabilityMessage('');

      const response = await fetch('/api/bookings/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: room.id,
          checkIn: startDate,
          checkOut: endDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.available) {
          setAvailabilityMessage('✓ このお部屋は選択された日程でご利用いただけます');
          return true;
        } else {
          if (data.error) {
            setAvailabilityMessage(`✗ ${data.error}`);
          } else {
            setAvailabilityMessage('✗ 申し訳ございませんが、選択された日程は既に予約されています');
          }
          return false;
        }
      } else {
        setAvailabilityMessage(data.error || '予約状況の確認中にエラーが発生しました');
        return false;
      }
    } catch (error) {
      console.error('Availability check error:', error);
      setAvailabilityMessage('予約状況の確認中にエラーが発生しました');
      return false;
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleBooking = async () => {
    if (!room || !checkIn || !checkOut) {
      alert(t.roomDetail.selectDates);
      return;
    }
    
    const totalGuests = adults + children + infants;
    if (totalGuests > room.maxGuests) {
      alert(t.roomDetail.maxGuestsExceeded.replace('{max}', room.maxGuests.toString()));
      return;
    }

    if (adults < 1) {
      alert('大人の人数は1名以上である必要があります');
      return;
    }

    // Check availability before proceeding
    const isAvailable = await checkAvailability(checkIn, checkOut);
    if (!isAvailable) {
      return;
    }

    const bookingData = {
      roomId: room.id,
      checkIn,
      checkOut,
      adults,
      children,
      infants,
      nights,
      totalPrice: pricingResult?.totalPrice || 0,
    };

    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    router.push('/booking');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-wa-beige">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-wa-gray">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-wa-beige">
        <Header />
        <div className="flex items-center justify-center h-64">
          <p className="text-wa-gray">{t.roomDetail.roomNotFound}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wa-beige">
      <Header />
      
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center text-wa-brown hover:text-wa-brown/80 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t.common.back}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Image area (2/3 width) */}
            <div className="lg:col-span-2">
              <div className="h-96 lg:h-[600px]">
                <PhotoCarousel 
                  images={room.images} 
                  alt={getRoomName()} 
                />
              </div>
            </div>

            {/* Right side - Info area (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
                {/* Room Basic Info - More Compact */}
                <div className="mb-3">
                  <h1 className="text-lg font-bold text-wa-brown mb-1 font-noto">
                    {getRoomName()}
                  </h1>
                  <div className="text-xs text-wa-gray flex flex-wrap items-center gap-2">
                    <span>Room {room.roomNumber}</span>
                    <span>•</span>
                    <span>{room.size}m²</span>
                    <span>•</span>
                    <span>{room.maxGuests}{t.common.person}まで</span>
                    {room.isConnecting && (
                      <span className="bg-wa-red text-wa-cream px-1 py-0.5 rounded text-xs ml-2">
                        連結可能
                      </span>
                    )}
                  </div>
                </div>

                {/* Amenities - More Compact */}
                <div className="mb-3">
                  <h3 className="font-medium text-wa-brown mb-1 text-xs">{t.roomDetail.amenities}</h3>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="text-xs bg-wa-beige text-wa-brown px-1 py-0.5 rounded">
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="text-xs text-wa-gray">+{room.amenities.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Pricing Information - Condensed */}
                {room.pricing && (
                  <div className="mb-4 p-3 bg-wa-beige rounded-lg border border-wa-brown/10">
                    <h3 className="font-bold text-wa-brown mb-2 text-center text-sm">料金表</h3>
                    
                    {/* Adult Pricing Table - Condensed */}
                    <div className="mb-2">
                      <h4 className="font-medium text-wa-brown mb-1 text-xs">大人料金（1名あたり/泊）</h4>
                      <div className="space-y-1">
                        {room.pricing.adult.map((pricing) => (
                          <div key={pricing.id} className="flex justify-between items-center bg-white rounded px-2 py-1 text-xs">
                            <span className="text-wa-gray">{pricing.guestCount}名</span>
                            <span className="text-wa-brown font-bold">¥{pricing.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Child Pricing - Condensed */}
                    {room.pricing.child.length > 0 && (
                      <div className="mb-2">
                        <div className="bg-white rounded px-2 py-1 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-wa-gray">小学生</span>
                            <span className="text-wa-brown font-bold">¥{room.pricing.child[0].price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes - Condensed */}
                    <div className="text-xs text-wa-brown bg-white rounded px-2 py-1 text-center">
                      ※ 小学生未満無料
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-wa-gray mb-1">
                          {t.home.search.checkin}
                        </label>
                        <input
                          type="date"
                          value={checkIn}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-wa-gray mb-1">
                          {t.home.search.checkout}
                        </label>
                        <input
                          type="date"
                          value={checkOut}
                          min={checkIn || new Date().toISOString().split('T')[0]}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                        />
                      </div>
                    </div>

                    {/* Guest selection - Condensed */}
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-wa-gray mb-1">
                          大人
                        </label>
                        <select
                          value={adults}
                          onChange={(e) => setAdults(Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                        >
                          {Array.from({ length: room.maxGuests }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num} className="text-wa-brown">
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-wa-gray mb-1">
                          小学生
                        </label>
                        <select
                          value={children}
                          onChange={(e) => setChildren(Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                        >
                          {Array.from({ length: Math.max(0, room.maxGuests - adults) + 1 }, (_, i) => i).map(num => (
                            <option key={num} value={num} className="text-wa-brown">
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-wa-gray mb-1">
                          幼児
                        </label>
                        <select
                          value={infants}
                          onChange={(e) => setInfants(Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                        >
                          {Array.from({ length: Math.max(0, room.maxGuests - adults - children) + 1 }, (_, i) => i).map(num => (
                            <option key={num} value={num} className="text-wa-brown">
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Price calculation display - Condensed */}
                    {pricingResult && nights > 0 && (
                      <div className="bg-wa-beige p-3 rounded">
                        <h4 className="font-medium text-wa-brown mb-2 text-sm">料金詳細 ({nights}泊)</h4>
                        <div className="space-y-1 text-xs">
                          {pricingResult.breakdown.adults.count > 0 && (
                            <div className="flex justify-between">
                              <span className="text-wa-gray">大人{pricingResult.breakdown.adults.count}名×¥{pricingResult.breakdown.adults.unitPrice.toLocaleString()}×{nights}泊</span>
                              <span className="text-wa-brown font-medium">¥{pricingResult.breakdown.adults.totalPrice.toLocaleString()}</span>
                            </div>
                          )}
                          {pricingResult.breakdown.children.count > 0 && (
                            <div className="flex justify-between">
                              <span className="text-wa-gray">小学生{pricingResult.breakdown.children.count}名×¥{pricingResult.breakdown.children.unitPrice.toLocaleString()}×{nights}泊</span>
                              <span className="text-wa-brown font-medium">¥{pricingResult.breakdown.children.totalPrice.toLocaleString()}</span>
                            </div>
                          )}
                          {pricingResult.breakdown.infants.count > 0 && (
                            <div className="flex justify-between">
                              <span className="text-wa-gray">幼児{pricingResult.breakdown.infants.count}名</span>
                              <span className="text-wa-green font-medium">無料</span>
                            </div>
                          )}
                          <div className="border-t pt-1 font-bold flex justify-between text-sm text-wa-brown">
                            <span>合計</span>
                            <span>¥{pricingResult.totalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {isCalculatingPrice && (
                      <div className="text-center text-wa-gray text-xs">
                        <span className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-wa-brown mr-1"></span>
                        計算中...
                      </div>
                    )}

                    {/* Availability Status - Condensed */}
                    {(checkIn && checkOut) && (
                      <div className="mb-3">
                        {isCheckingAvailability ? (
                          <div className="text-center text-wa-gray text-xs">
                            <span className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-wa-brown mr-1"></span>
                            確認中...
                          </div>
                        ) : availabilityMessage && (
                          <div className={`text-center text-xs p-1 rounded ${
                            availabilityMessage.startsWith('✓') 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {availabilityMessage}
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={handleBooking}
                      disabled={isCheckingAvailability || isCalculatingPrice || (availabilityMessage && !availabilityMessage.startsWith('✓'))}
                      className="w-full bg-wa-brown text-wa-cream py-2 rounded-md hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isCheckingAvailability || isCalculatingPrice ? '確認中...' : t.rooms.book}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Calendar */}
          <div className="mt-12">
            <AvailabilityCalendar roomId={room.id} />
          </div>

          {room.connectsTo && (
            <div className="mt-12 bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-wa-brown mb-4">{t.roomDetail.connectingRoom}</h3>
              <p className="text-wa-gray mb-4">
                {t.roomDetail.connectingDescription}
              </p>
              <button
                onClick={() => router.push(`/rooms/${room.connectsTo}`)}
                className="text-wa-brown hover:text-wa-brown/80 transition-colors font-medium"
              >
                {t.roomDetail.viewConnectingRoom} →
              </button>
            </div>
          )}
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