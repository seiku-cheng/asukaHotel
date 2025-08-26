import { Room } from '@/types';

interface StructuredDataProps {
  type: 'hotel' | 'room';
  data?: Room;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const hotelStructuredData = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "朝香ホテル",
    "alternateName": "Asuka Hotel",
    "description": "日本の伝統的なおもてなしと現代的な快適さを兼ね備えた民宿です。",
    "url": "https://asuka-hotel.com",
    "telephone": "+81-3-0000-0000",
    "email": "info@asuka-hotel.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1-2-3",
      "addressLocality": "東京都",
      "addressCountry": "JP",
      "postalCode": "000-0000"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "35.6762",
      "longitude": "139.6503"
    },
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Free WiFi",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification", 
        "name": "Air Conditioning",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "24-hour front desk",
        "value": true
      }
    ],
    "checkinTime": "15:00",
    "checkoutTime": "11:00",
    "numberOfRooms": 6,
    "priceRange": "¥10,000 - ¥12,000"
  };

  const roomStructuredData = data ? {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    "name": data.name,
    "description": data.description,
    "occupancy": {
      "@type": "QuantitativeValue",
      "maxValue": data.maxGuests
    },
    "bed": {
      "@type": "BedDetails",
      "numberOfBeds": data.maxGuests <= 2 ? 1 : 2
    },
    "amenityFeature": data.amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity,
      "value": true
    })),
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": data.size,
      "unitCode": "MTK"
    }
  } : null;

  const structuredData = type === 'hotel' ? hotelStructuredData : roomStructuredData;

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}