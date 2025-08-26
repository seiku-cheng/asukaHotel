'use client';

import Header from '@/components/Header';
import { getTranslation } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
  const { locale } = useLanguage();
  const t = getTranslation(locale);

  return (
    <div className="min-h-screen bg-wa-beige">
      <Header />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-wa-brown text-center mb-12 font-noto">
            {t.nav.about}
          </h1>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-wa-brown mb-6">{t.about.title}</h2>
            <div className="space-y-6 text-wa-gray leading-relaxed">
              {t.about.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-wa-brown mb-4">{t.about.facilities.title}</h3>
              <ul className="space-y-3 text-wa-gray">
                {t.about.facilities.items.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-wa-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-wa-brown mb-4">{t.about.checkInOut.title}</h3>
              <div className="space-y-3 text-wa-gray">
                <div>
                  <p className="font-medium">{t.about.checkInOut.checkin}</p>
                  <p>{t.about.checkInOut.checkinTime}</p>
                </div>
                <div>
                  <p className="font-medium">{t.about.checkInOut.checkout}</p>
                  <p>{t.about.checkInOut.checkoutTime}</p>
                </div>
                <div className="text-sm">
                  <p>{t.about.checkInOut.note}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-bold text-wa-brown mb-4">{t.about.access.title}</h3>
            <div className="text-wa-gray">
              <p className="mb-4">
                {t.about.access.address}<br />
                {t.about.access.station}
              </p>
              <p className="text-sm">
                {t.about.access.note}
              </p>
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