'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { getTranslation } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { locale } = useLanguage();
  const t = getTranslation(locale);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
        
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        setErrorMessage(data.error || 'お問い合わせの送信に失敗しました');
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      setErrorMessage('サーバーエラーが発生しました。しばらく経ってから再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-wa-beige">
      <Header />
      
      <main className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-wa-brown text-center mb-12 font-noto">
            {t.nav.contact}
          </h1>

          {showSuccess && (
            <div className="bg-wa-green text-wa-cream p-4 rounded-lg mb-8 text-center">
              {t.contact.success}
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8 text-center">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-wa-brown mb-6">{t.contact.title}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-wa-gray mb-1">
                    {t.contact.name} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-wa-gray mb-1">
                    {t.contact.email} *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-wa-gray mb-1">
                    {t.contact.message} *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-wa-brown text-wa-cream py-3 rounded-md hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t.contact.sending : t.contact.send}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-wa-brown mb-4">{t.contact.phone.title}</h3>
                <div className="space-y-2 text-wa-gray">
                  <p className="text-xl font-bold text-wa-brown">{t.contact.phone.number}</p>
                  <p className="text-lg font-bold text-wa-brown">{t.contact.phone.mobile}</p>
                  <p className="text-sm font-medium">{t.contact.phone.contact}</p>
                  <p>{t.contact.phone.hours}</p>
                  <p className="text-sm">
                    {t.contact.phone.note}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-wa-brown mb-4">{t.contact.emailContact.title}</h3>
                <div className="text-wa-gray">
                  <p className="font-medium">{t.contact.emailContact.address}</p>
                  <p className="text-sm mt-2">
                    {t.contact.emailContact.note}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-wa-brown mb-4">{t.contact.location.title}</h3>
                <div className="text-wa-gray">
                  <p>{t.contact.location.address}</p>
                  <p>{t.contact.location.city}</p>
                  <p className="mt-2 text-sm">
                    {t.contact.location.station}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-wa-brown mb-4">{t.contact.faq.title}</h3>
                <div className="space-y-3 text-sm text-wa-gray">
                  {t.contact.faq.items.map((item, index) => (
                    <div key={index}>
                      <p className="font-medium">Q. {item.q}</p>
                      <p>A. {item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
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