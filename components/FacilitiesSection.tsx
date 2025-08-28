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
    <section className="bg-wa-green/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-wa-brown mb-4 font-noto">
            {t.home.facilities.title}
          </h2>
          <div className="w-20 h-1 bg-wa-brown mx-auto mb-8"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Entertainment Section */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-semibold text-wa-brown mb-4 font-noto">
                {t.home.facilities.entertainment.title}
              </h3>
              <div className="w-16 h-1 bg-wa-brown/50 mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {t.home.facilities.entertainment.items.map((item, index) => (
                <div key={index} className="bg-wa-beige/30 rounded-lg p-4 text-center hover:bg-wa-beige/50 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-wa-brown/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">{facilityIcons[item.name] || '🎯'}</span>
                    </div>
                    <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-3 border-2 border-dashed border-gray-300">
                      <span className="text-gray-400 text-sm">画像</span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-wa-brown mb-2 text-sm">{item.name}</h4>
                  <p className="text-xs text-wa-gray leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dining Section */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-semibold text-wa-brown mb-2 font-noto">
                {t.home.facilities.dining.title}
              </h3>
              <p className="text-wa-brown/70 font-medium mb-4">
                ({t.home.facilities.dining.subtitle})
              </p>
              <div className="w-16 h-1 bg-wa-green/50 mx-auto"></div>
            </div>
            
            <div className="bg-wa-green/5 rounded-lg p-6 text-center hover:bg-wa-green/10 transition-all duration-300">
              <div className="mb-6">
                <div className="w-20 h-20 bg-wa-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🍽️</span>
                </div>
                <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
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