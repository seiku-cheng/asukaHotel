'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/i18n';

export default function FacilitiesSection() {
  const { locale } = useLanguage();
  const t = getTranslation(locale);

  const facilityIcons: { [key: string]: string } = {
    'ピアノ': '🎹',
    'カラオケ': '🎤',
    '囲碁': '⚫',
    '麻雀': '🀄',
    'ゴルフ練習': '🏌️‍♂️',
    'ゴルフコース': '⛳',
    'Piano': '🎹',
    'Karaoke': '🎤',
    'Go': '⚫',
    'Mahjong': '🀄',
    'Golf Practice': '🏌️‍♂️',
    'Golf Course': '⛳',
    '钢琴': '🎹',
    '卡拉OK': '🎤',
    '围棋': '⚫',
    '麻将': '🀄',
    '高尔夫练习': '🏌️‍♂️',
    '高尔夫球场': '⛳'
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-wa-brown mb-6 font-noto">
            {t.home.facilities.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Entertainment Section */}
          <div className="bg-wa-beige rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-wa-brown mb-6 font-noto text-center">
              {t.home.facilities.entertainment.title}
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {t.home.facilities.entertainment.items.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <div className="w-20 h-20 bg-wa-brown/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">{facilityIcons[item.name] || '🎯'}</span>
                    </div>
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <span className="text-gray-400">画像</span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-wa-brown mb-2">{item.name}</h4>
                  <p className="text-sm text-wa-gray">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dining Section */}
          <div className="bg-wa-green/10 rounded-lg p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-wa-brown mb-2 font-noto">
                {t.home.facilities.dining.title}
              </h3>
              <p className="text-wa-brown/70 font-medium">
                ({t.home.facilities.dining.subtitle})
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="mb-6">
                <div className="w-24 h-24 bg-wa-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🍽️</span>
                </div>
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-gray-400">料亭画像</span>
                </div>
              </div>
              <p className="text-wa-gray leading-relaxed">
                {t.home.facilities.dining.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}