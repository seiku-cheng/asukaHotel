'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { getTranslation } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FloorPlanPage() {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const { locale } = useLanguage();
  const t = getTranslation(locale);

  return (
    <div className="min-h-screen bg-wa-cream">
      <Header />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-wa-brown mb-4 font-noto">
              楼層平面図
            </h1>
            <p className="text-lg text-wa-gray max-w-4xl mx-auto">
              箱根仙石原寮の各フロアの間取りをご確認いただけます。お部屋の配置や設備をご覧ください。
            </p>
          </div>

          {/* Floor Selection */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setSelectedFloor(1)}
                className={`px-6 py-3 font-medium transition-colors ${
                  selectedFloor === 1
                    ? 'bg-wa-brown text-wa-cream'
                    : 'bg-white text-wa-brown hover:bg-wa-beige'
                }`}
              >
                1階
              </button>
              <button
                onClick={() => setSelectedFloor(2)}
                className={`px-6 py-3 font-medium transition-colors ${
                  selectedFloor === 2
                    ? 'bg-wa-brown text-wa-cream'
                    : 'bg-white text-wa-brown hover:bg-wa-beige'
                }`}
              >
                2階
              </button>
            </div>
          </div>

          {/* Floor Plan Display */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-wa-brown mb-2">
                {selectedFloor}階平面図
              </h2>
              <p className="text-wa-gray">
                {selectedFloor === 1 
                  ? 'ラウンジやフロント、共用施設がございます'
                  : '客室エリアとなっております'
                }
              </p>
            </div>

            {/* Floor Plan Image Container */}
            <div className="relative w-full max-w-5xl mx-auto">
              <div className="aspect-[4/3] bg-gray-100 rounded-lg border border-gray-300 overflow-hidden">
                <img
                  src={`/images/floor-${selectedFloor}f.png`}
                  alt={`${selectedFloor}階平面図`}
                  className="w-full h-full object-contain bg-white"
                  onError={(e) => {
                    // Fallback to placeholder when image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-gray-500">{selectedFloor}階平面図</p>
                    <p className="text-sm text-gray-400 mt-2">
                      管理者が画像をアップロードできます
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Information */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedFloor === 1 ? (
                <>
                  <div className="bg-wa-beige p-4 rounded-lg">
                    <h3 className="font-semibold text-wa-brown mb-2">共用エリア</h3>
                    <ul className="text-sm text-wa-gray space-y-1">
                      <li>• フロント・受付</li>
                      <li>• ラウンジ</li>
                      <li>• 共用バスルーム</li>
                      <li>• 階段・エレベーター</li>
                    </ul>
                  </div>
                  <div className="bg-wa-beige p-4 rounded-lg">
                    <h3 className="font-semibold text-wa-brown mb-2">施設</h3>
                    <ul className="text-sm text-wa-gray space-y-1">
                      <li>• Wi-Fi完備</li>
                      <li>• 荷物預かりサービス</li>
                      <li>• 観光案内</li>
                      <li>• 自動販売機</li>
                    </ul>
                  </div>
                  <div className="bg-wa-beige p-4 rounded-lg">
                    <h3 className="font-semibold text-wa-brown mb-2">アクセス</h3>
                    <ul className="text-sm text-wa-gray space-y-1">
                      <li>• メインエントランス</li>
                      <li>• 駐車場入口</li>
                      <li>• 緊急出口</li>
                      <li>• バリアフリー対応</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-wa-beige p-4 rounded-lg">
                    <h3 className="font-semibold text-wa-brown mb-2">客室タイプ</h3>
                    <ul className="text-sm text-wa-gray space-y-1">
                      <li>• 東側角部屋 (201)</li>
                      <li>• スタンダードルーム (202)</li>
                      <li>• 連結ルーム (203-204)</li>
                      <li>• スタンダードルーム (205)</li>
                    </ul>
                  </div>
                  <div className="bg-wa-beige p-4 rounded-lg">
                    <h3 className="font-semibold text-wa-brown mb-2">共用設備</h3>
                    <ul className="text-sm text-wa-gray space-y-1">
                      <li>• 各階バスルーム</li>
                      <li>• 給湯室</li>
                      <li>• Wi-Fi完備</li>
                      <li>• 緊急避難設備</li>
                    </ul>
                  </div>
                  <div className="bg-wa-beige p-4 rounded-lg">
                    <h3 className="font-semibold text-wa-brown mb-2">眺望</h3>
                    <ul className="text-sm text-wa-gray space-y-1">
                      <li>• 箱根の山々</li>
                      <li>• 仙石原の自然</li>
                      <li>• 朝日・夕日</li>
                      <li>• 静寂な環境</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-12 text-center">
            <div className="inline-flex space-x-4">
              <a
                href="/rooms"
                className="bg-wa-brown text-wa-cream px-6 py-3 rounded-lg hover:bg-wa-brown/90 transition-colors font-medium"
              >
                客室一覧を見る
              </a>
              <a
                href="/about"
                className="border-2 border-wa-brown text-wa-brown px-6 py-3 rounded-lg hover:bg-wa-brown hover:text-wa-cream transition-colors font-medium"
              >
                施設について
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-wa-brown text-wa-cream py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>{t.common.copyright}</p>
        </div>
      </footer>
    </div>
  );
}