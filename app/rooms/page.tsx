'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import RoomCard from '@/components/RoomCard';
import SearchForm, { SearchData } from '@/components/SearchForm';
import { Room } from '@/types';
import { getTranslation } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';

function RoomsContent() {
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchData, setSearchData] = useState<SearchData>({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });
  
  const searchParams = useSearchParams();
  const { locale } = useLanguage();
  const t = getTranslation(locale);

  useEffect(() => {
    const checkIn = searchParams.get('checkIn') || '';
    const checkOut = searchParams.get('checkOut') || '';
    const guests = parseInt(searchParams.get('guests') || '1');

    setSearchData({ checkIn, checkOut, guests });
    
    // Fetch rooms from API
    fetchRooms({ checkIn, checkOut, guests });
  }, [searchParams]);

  const fetchRooms = async (searchParams?: SearchData) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      if (searchParams?.checkIn) params.append('checkIn', searchParams.checkIn);
      if (searchParams?.checkOut) params.append('checkOut', searchParams.checkOut);
      if (searchParams?.guests && searchParams.guests > 1) params.append('guests', searchParams.guests.toString());

      const response = await fetch(`/api/rooms?${params.toString()}`);
      
      if (response.ok) {
        const roomsData = await response.json();
        setFilteredRooms(roomsData);
      } else {
        console.error('Failed to fetch rooms');
        setFilteredRooms([]);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setFilteredRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (data: SearchData) => {
    setSearchData(data);
    fetchRooms(data);
  };

  const sortRooms = (sortBy: string) => {
    let sorted = [...filteredRooms];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'size-large':
        sorted.sort((a, b) => b.size - a.size);
        break;
      case 'guests':
        sorted.sort((a, b) => b.maxGuests - a.maxGuests);
        break;
    }
    setFilteredRooms(sorted);
  };

  return (
    <div className="min-h-screen bg-wa-beige flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-lg text-wa-brown mb-4">{t.rooms.sortBy}</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => sortRooms('price-low')}
                    className="block w-full text-left py-2 px-3 hover:bg-wa-beige rounded text-sm text-wa-gray hover:text-wa-brown"
                  >
                    {t.rooms.sortOptions.priceLow}
                  </button>
                  <button
                    onClick={() => sortRooms('price-high')}
                    className="block w-full text-left py-2 px-3 hover:bg-wa-beige rounded text-sm text-wa-gray hover:text-wa-brown"
                  >
                    {t.rooms.sortOptions.priceHigh}
                  </button>
                  <button
                    onClick={() => sortRooms('size-large')}
                    className="block w-full text-left py-2 px-3 hover:bg-wa-beige rounded text-sm text-wa-gray hover:text-wa-brown"
                  >
                    {t.rooms.sortOptions.sizeLarge}
                  </button>
                  <button
                    onClick={() => sortRooms('guests')}
                    className="block w-full text-left py-2 px-3 hover:bg-wa-beige rounded text-sm text-wa-gray hover:text-wa-brown"
                  >
                    {t.rooms.sortOptions.guests}
                  </button>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-wa-brown mb-3">{t.rooms.roomTypes}</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-wa-gray">{t.rooms.roomTypeOptions.corner}</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-wa-gray">{t.rooms.roomTypeOptions.standard}</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-wa-gray">{t.rooms.roomTypeOptions.connecting}</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            <div className="lg:w-3/4">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-wa-brown mb-2 font-noto">
                  {t.rooms.title}
                </h1>
                <p className="text-wa-gray">
                  {filteredRooms.length}{t.rooms.foundRooms}
                  {searchData.guests > 1 && ` (${searchData.guests}${t.rooms.guestsCapacity})`}
                </p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-wa-gray">読み込み中...</div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredRooms.map((room) => (
                      <RoomCard key={room.id} room={room} />
                    ))}
                  </div>

                  {filteredRooms.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-wa-gray text-lg">
                        {t.rooms.noResults.title}
                      </p>
                      <p className="text-wa-gray">
                        {t.rooms.noResults.subtitle}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-wa-brown text-wa-cream py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>{t.common.copyright}</p>
        </div>
      </footer>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-wa-beige flex items-center justify-center">
        <div className="text-wa-brown">読み込み中...</div>
      </div>
    }>
      <RoomsContent />
    </Suspense>
  );
}