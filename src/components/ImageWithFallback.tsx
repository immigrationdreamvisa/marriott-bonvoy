import React, { useState } from 'react';
import { Compass } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  className?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Aurelia Luxury Hospitality',
  fallbackTitle,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
      >
        <div className="w-12 h-12 rounded-full border border-stone-700/60 flex items-center justify-center mb-3 text-[#c5a059]/80 bg-stone-800/40">
          <Compass className="w-6 h-6 animate-pulse" />
        </div>
        <span className="font-serif text-sm tracking-widest uppercase text-stone-300 font-medium">
          {fallbackTitle || 'Aurelia Collection'}
        </span>
        <span className="text-[11px] text-stone-500 mt-1">Luxury Hospitality & Resorts</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-stone-900 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-850 animate-pulse flex items-center justify-center">
          <span className="text-[10px] tracking-widest uppercase text-stone-500">Loading sanctuary...</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
