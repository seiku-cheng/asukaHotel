import Link from 'next/link';
import Image from 'next/image';
import { Room } from '@/types';
import { getTranslation } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const { locale } = useLanguage();
  const t = getTranslation(locale);
  
  const getRoomName = () => {
    switch (locale) {
      case 'en': return room.nameEn;
      case 'zh': return room.nameZh;
      default: return room.name;
    }
  };

  const getRoomDescription = () => {
    switch (locale) {
      case 'en': return room.descriptionEn;
      case 'zh': return room.descriptionZh;
      default: return room.description;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={room.images[0] || '/images/placeholder.jpg'}
          alt={getRoomName()}
          fill
          className="object-cover"
        />
        {room.isConnecting && (
          <div className="absolute top-2 right-2 bg-wa-red text-wa-cream px-2 py-1 rounded text-xs">
            {t.common.connecting}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-wa-brown mb-2">{getRoomName()}</h3>
        <p className="text-wa-gray text-sm mb-3 line-clamp-2">{getRoomDescription()}</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-wa-gray">
            {room.size}m² • {room.maxGuests}{t.common.person}
          </span>
          <span className="font-bold text-wa-brown">
            ¥{room.pricing?.adult?.[0]?.price ? room.pricing.adult[0].price.toLocaleString() : '0'}〜{t.rooms.pricePerNight}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="text-xs bg-wa-beige text-wa-brown px-2 py-1 rounded"
            >
              {amenity}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="text-xs text-wa-gray">
              +{room.amenities.length - 3}
            </span>
          )}
        </div>

        <Link
          href={`/rooms/${room.id}`}
          className="block w-full text-center bg-wa-brown text-wa-cream py-2 rounded hover:bg-opacity-90 transition-colors"
        >
          {t.rooms.viewDetails}
        </Link>
      </div>
    </div>
  );
}