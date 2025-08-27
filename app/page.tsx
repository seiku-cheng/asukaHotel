'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import RoomCard from '@/components/RoomCard';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';
import StructuredData from '@/components/StructuredData';
import GoogleMap from '@/components/GoogleMap';
import FacilitiesSection from '@/components/FacilitiesSection';
import { Room } from '@/types';
import { getTranslation } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const router = useRouter();
  const { locale } = useLanguage();
  const { isAuthenticated } = useAuth();
  const t = getTranslation(locale);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const openRegisterModal = () => setIsRegisterModalOpen(true);

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  useEffect(() => {
    fetchFeaturedRooms();
  }, []);

  const fetchFeaturedRooms = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/rooms');
      
      if (response.ok) {
        const roomsData = await response.json();
        // Show first 3 active rooms as featured
        setFeaturedRooms(roomsData.slice(0, 3));
      } else {
        console.error('Failed to fetch rooms');
        setFeaturedRooms([]);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setFeaturedRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wa-beige">
      <StructuredData type="hotel" />
      <Header />
      
      <main>
        <section 
          className="relative h-[70vh] bg-gradient-to-r from-wa-brown/20 to-wa-green/20 flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/hero-bg.jpg')`
          }}
        >
          <div className="relative z-10 text-center text-wa-cream max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 font-noto drop-shadow-lg">
              {t.home.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light drop-shadow-md">
              {t.home.subtitle}
            </p>
          </div>
        </section>

        <section className="bg-wa-beige py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-wa-brown mb-4 font-noto">
                {t.home.featured}
              </h2>
              <div className="w-20 h-1 bg-wa-brown mx-auto mb-8"></div>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-wa-gray text-lg">読み込み中...</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {featuredRooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                onClick={() => router.push('/rooms')}
                className="bg-wa-brown text-wa-cream px-10 py-4 rounded-lg hover:bg-wa-brown/90 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t.nav.rooms}
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-wa-brown mb-4 font-noto">
              {t.home.introduction.title}
            </h2>
            <div className="w-20 h-1 bg-wa-brown mx-auto mb-8"></div>
            <p className="text-lg text-wa-gray leading-relaxed max-w-3xl mx-auto">
              {t.home.introduction.description}
            </p>
          </div>
        </section>

        {/* Facilities Section */}
        <FacilitiesSection />

        {/* Location & Map Section */}
        <section className="bg-wa-beige py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-wa-brown mb-4 font-noto">
                アクセス
              </h2>
              <div className="w-20 h-1 bg-wa-brown mx-auto mb-8"></div>
              <p className="text-lg text-wa-gray max-w-3xl mx-auto">
                箱根仙石原の静かな環境にございます。自然豊かな箱根での滞在をお楽しみください。
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Location Information */}
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8">
                <h3 className="text-xl font-semibold text-wa-brown mb-6 font-noto">
                  箱根仙石原寮
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-wa-brown rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-wa-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-wa-brown mb-1">住所</h4>
                      <p className="text-wa-gray">
                        〒250-0631<br/>
                        神奈川県足柄下郡箱根町仙石原
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-wa-brown rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-wa-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6v6m8-6v6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-wa-brown mb-1">交通アクセス</h4>
                      <div className="text-wa-gray space-y-1">
                        <p>• JR小田原駅から箱根登山バス約40分</p>
                        <p>• 「仙石原」バス停より徒歩5分</p>
                        <p>• 東名高速道路御殿場ICより車で約30分</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-wa-brown rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-wa-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-wa-brown mb-1">チェックイン・チェックアウト</h4>
                      <div className="text-wa-gray">
                        <p>チェックイン: 15:00～</p>
                        <p>チェックアウト: ～10:00</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <a 
                      href="https://www.google.com/maps/dir/?api=1&destination=35.2467,139.0233" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-wa-brown text-wa-cream px-6 py-3 rounded-lg hover:bg-wa-brown/90 transition-colors text-center font-medium"
                    >
                      ルート検索
                    </a>
                    <button
                      onClick={() => navigator.clipboard?.writeText('〒250-0631 神奈川県足柄下郡箱根町仙石原')}
                      className="flex-1 border-2 border-wa-brown text-wa-brown px-6 py-3 rounded-lg hover:bg-wa-brown hover:text-wa-cream transition-colors font-medium"
                    >
                      住所をコピー
                    </button>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <GoogleMap className="h-96" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-wa-brown text-wa-cream py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg">{t.common.copyright}</p>
        </div>
      </footer>

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
}