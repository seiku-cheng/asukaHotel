'use client';

import { useState } from 'react';
import { getTranslation } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchFormProps {
  onSearch: (data: SearchData) => void;
}

export interface SearchData {
  checkIn: string;
  checkOut: string;
  guests: number;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const { locale } = useLanguage();
  const t = getTranslation(locale);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ checkIn, checkOut, guests });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-wa-gray mb-2">
            {t.home.search.checkin}
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-wa-gray mb-2">
            {t.home.search.checkout}
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-wa-gray mb-2">
            {t.home.search.guests}
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wa-brown bg-white text-wa-gray"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num} className="text-wa-gray">
                {num} {t.common.person}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-wa-brown text-wa-cream py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors font-medium"
          >
            {t.home.search.searchBtn}
          </button>
        </div>
      </form>
    </div>
  );
}