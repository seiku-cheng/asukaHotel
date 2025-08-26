'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { getTranslation } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const pathname = usePathname();
  const { locale, setLocale } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
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

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const getLinkClass = (path: string) => {
    return isActive(path)
      ? "text-wa-brown font-semibold border-b-2 border-wa-brown transition-colors"
      : "text-wa-gray hover:text-wa-brown transition-colors";
  };

  const getMobileLinkClass = (path: string) => {
    return isActive(path)
      ? "text-wa-brown font-semibold py-2 border-l-4 border-wa-brown pl-4 transition-colors"
      : "text-wa-gray hover:text-wa-brown transition-colors py-2";
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-wa-brown font-noto">
              箱根仙石原寮
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={getLinkClass('/')}>
              {t.nav.home}
            </Link>
            <Link href="/rooms" className={getLinkClass('/rooms')}>
              {t.nav.rooms}
            </Link>
            <Link href="/floorplan" className={getLinkClass('/floorplan')}>
              楼層平面図
            </Link>
            <Link href="/about" className={getLinkClass('/about')}>
              {t.nav.about}
            </Link>
            <Link href="/contact" className={getLinkClass('/contact')}>
              {t.nav.contact}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <span className="text-wa-gray">ようこそ、</span>
                <Link href="/profile" className="text-wa-brown font-medium hover:text-wa-brown/80">
                  {user?.name}様
                </Link>
                <span className="text-wa-gray">|</span>
                <button
                  onClick={logout}
                  className="text-wa-gray hover:text-wa-brown underline"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <button 
                  onClick={openLoginModal}
                  className="text-wa-gray hover:text-wa-brown transition-colors"
                >
                  ログイン
                </button>
                <span className="text-wa-gray">|</span>
                <button 
                  onClick={openRegisterModal}
                  className="text-wa-gray hover:text-wa-brown transition-colors"
                >
                  会員登録
                </button>
              </div>
            )}

            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              className="text-sm border border-gray-300 rounded px-2 py-1 bg-white text-wa-gray focus:text-wa-brown focus:border-wa-brown"
            >
              <option value="ja" className="text-wa-gray">日本語</option>
              <option value="en" className="text-wa-gray">English</option>
              <option value="zh" className="text-wa-gray">中文</option>
            </select>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-wa-gray hover:text-wa-brown"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link href="/" className={getMobileLinkClass('/')}>
                {t.nav.home}
              </Link>
              <Link href="/rooms" className={getMobileLinkClass('/rooms')}>
                {t.nav.rooms}
              </Link>
              <Link href="/floorplan" className={getMobileLinkClass('/floorplan')}>
                楼層平面図
              </Link>
              <Link href="/about" className={getMobileLinkClass('/about')}>
                {t.nav.about}
              </Link>
              <Link href="/contact" className={getMobileLinkClass('/contact')}>
                {t.nav.contact}
              </Link>
              
              {/* Mobile User Menu */}
              <div className="border-t pt-2 mt-2">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <Link href="/profile" className="text-sm text-wa-brown font-medium hover:text-wa-brown/80">
                      個人中心 ({user?.name}様)
                    </Link>
                    <button
                      onClick={logout}
                      className="text-left text-sm text-wa-gray hover:text-wa-brown"
                    >
                      ログアウト
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <button 
                      onClick={openLoginModal}
                      className="text-left text-sm text-wa-gray hover:text-wa-brown transition-colors"
                    >
                      ログイン
                    </button>
                    <button 
                      onClick={openRegisterModal}
                      className="text-left text-sm text-wa-gray hover:text-wa-brown transition-colors"
                    >
                      会員登録
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

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
    </header>
  );
}