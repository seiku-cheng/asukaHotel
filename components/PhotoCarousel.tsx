'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PhotoCarouselProps {
  images: string[];
  alt: string;
}

export default function PhotoCarousel({ images, alt }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (images.length === 0) {
    return (
      <div className="relative h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">画像がありません</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative h-96 rounded-lg overflow-hidden">
        <Image
          src={images[currentIndex] || '/images/placeholder.jpg'}
          alt={`${alt} ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="前の画像"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="次の画像"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-wa-brown' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`画像 ${index + 1}に移動`}
            />
          ))}
        </div>
      )}

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative h-20 rounded overflow-hidden border-2 transition-colors ${
                index === currentIndex 
                  ? 'border-wa-brown' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={image || '/images/placeholder.jpg'}
                alt={`${alt} サムネイル ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}