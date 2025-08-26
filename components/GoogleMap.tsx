'use client';

import { useEffect, useRef } from 'react';

interface GoogleMapProps {
  className?: string;
}

export default function GoogleMap({ className = '' }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || mapInstance.current) return;

      // 箱根仙石原寮的大致位置坐标（箱根仙石原地区）
      const location = {
        lat: 35.2467,
        lng: 139.0233
      };

      const map = new google.maps.Map(mapRef.current, {
        zoom: 15,
        center: location,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#8B4513' // wa-brown color for POI labels
              }
            ]
          }
        ]
      });

      // 添加标记
      const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: '箱根仙石原寮',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#8B4513" stroke="white" stroke-width="4"/>
              <circle cx="20" cy="20" r="8" fill="white"/>
              <text x="20" y="25" text-anchor="middle" font-size="12" font-family="sans-serif" fill="#8B4513">宿</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20)
        }
      });

      // 添加信息窗口
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; font-family: 'Noto Sans JP', sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #8B4513; font-size: 16px; font-weight: bold;">箱根仙石原寮</h3>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">〒250-0631</p>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">神奈川県足柄下郡箱根町仙石原</p>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <a href="https://www.google.com/maps/dir/?api=1&destination=35.2467,139.0233" 
                 target="_blank" 
                 style="background-color: #8B4513; color: white; padding: 4px 8px; text-decoration: none; border-radius: 4px; font-size: 12px;">
                ルート検索
              </a>
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      mapInstance.current = map;
    };

    // Google Maps APIが読み込まれているかチェック
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
      } else {
        // Google Maps APIスクリプトを動的に読み込み
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=ja`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        script.onerror = () => {
          console.warn('Google Maps API failed to load. Showing fallback content.');
        };
        document.head.appendChild(script);
      }
    };

    checkGoogleMaps();

    return () => {
      // Cleanup
      if (mapInstance.current) {
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />
      
      {/* Fallback content if Google Maps fails to load */}
      <noscript>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center p-8">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">アクセス</h3>
            <p className="text-gray-600 mb-4">
              神奈川県足柄下郡箱根町仙石原<br/>
              箱根仙石原寮
            </p>
            <a 
              href="https://maps.google.com/maps?q=35.2467,139.0233" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-wa-brown text-wa-cream px-4 py-2 rounded-md hover:bg-wa-brown/90 transition-colors"
            >
              Google Mapsで開く
            </a>
          </div>
        </div>
      </noscript>
    </div>
  );
}

declare global {
  interface Window {
    google: typeof google;
  }
}