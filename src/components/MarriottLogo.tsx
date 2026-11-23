import React from 'react';
import ritzLogo from '../assets/brands/the-ritz-carlton.png';
import jwLogo from '../assets/brands/jw-marriott.png';
import stregisLogo from '../assets/brands/st-regis.png';

interface MarriottLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'burgundy';
  size?: 'sm' | 'md' | 'lg';
}

export const MarriottLogo: React.FC<MarriottLogoProps> = ({
  className = '',
  variant = 'burgundy',
  size = 'md'
}) => {
  const textColor = variant === 'light' ? '#ffffff' : '#1c1917';
  const coralColor = '#eb6534'; // Authentic Marriott Bonvoy coral accent

  // Proportions matching the official Marriott Bonvoy wordmark lockup:
  // Top: MARRIOTT in uppercase sans-serif bold, letter-spaced, centered
  // Bottom: BONVOY® with BONV + elevated circle O + coral bar below + Y + ®
  const sizeStyles = {
    sm: {
      topSize: '9px',
      topSpacing: '0.24em',
      bottomSize: '18px',
      gap: '2px',
      circleSize: '10px',
      circleBorder: '2.2px',
      barWidth: '12px',
      barHeight: '2px',
      regSize: '7px'
    },
    md: {
      topSize: '11px',
      topSpacing: '0.26em',
      bottomSize: '22px',
      gap: '3px',
      circleSize: '12.5px',
      circleBorder: '2.6px',
      barWidth: '15px',
      barHeight: '2.4px',
      regSize: '8px'
    },
    lg: {
      topSize: '14px',
      topSpacing: '0.28em',
      bottomSize: '28px',
      gap: '4px',
      circleSize: '15.5px',
      circleBorder: '3.2px',
      barWidth: '19px',
      barHeight: '3px',
      regSize: '10px'
    }
  };

  const s = sizeStyles[size];

  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none leading-none ${className}`}
      role="img"
      aria-label="Marriott Bonvoy"
    >
      {/* 1. MARRIOTT */}
      <span
        className="font-extrabold uppercase text-center"
        style={{
          color: textColor,
          fontSize: s.topSize,
          letterSpacing: s.topSpacing,
          paddingLeft: s.topSpacing,
          fontFamily: 'var(--font-sans), "Plus Jakarta Sans", -apple-system, sans-serif',
          lineHeight: 1
        }}
      >
        MARRIOTT
      </span>

      {/* 2. BONVOY® */}
      <div
        className="inline-flex items-center font-black uppercase tracking-tight leading-none"
        style={{
          color: textColor,
          fontSize: s.bottomSize,
          marginTop: s.gap,
          fontFamily: 'var(--font-sans), "Plus Jakarta Sans", -apple-system, sans-serif'
        }}
      >
        <span>BONV</span>

        {/* Custom elevated O with coral underline */}
        <span
          className="inline-flex flex-col items-center justify-between mx-[1.5px] shrink-0"
          style={{
            height: s.bottomSize,
            paddingTop: size === 'sm' ? '0.5px' : '1px',
            paddingBottom: size === 'sm' ? '0.5px' : '1px'
          }}
        >
          {/* Circular O ring */}
          <span
            className="rounded-full shrink-0"
            style={{
              width: s.circleSize,
              height: s.circleSize,
              borderWidth: s.circleBorder,
              borderStyle: 'solid',
              borderColor: textColor,
              boxSizing: 'border-box'
            }}
          />
          {/* Coral accent bar */}
          <span
            className="shrink-0 rounded-[0.5px]"
            style={{
              width: s.barWidth,
              height: s.barHeight,
              backgroundColor: coralColor
            }}
          />
        </span>

        <span>Y</span>

        {/* Registered symbol ® */}
        <span
          className="font-bold self-start ml-0.5"
          style={{
            fontSize: s.regSize,
            marginTop: size === 'sm' ? '0.5px' : '1px',
            color: textColor
          }}
        >
          ®
        </span>
      </div>
    </div>
  );
};

// Official Brand Logos for Featured Brands & Catalogue
export const BrandLogo: React.FC<{
  brandId: string;
  className?: string;
  light?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({
  brandId,
  className = '',
  light = false,
  size = 'md'
}) => {
  const color = light ? '#ffffff' : '#1c1917';
  const subColor = light ? '#d1d5db' : '#57534e';

  const imgSizes = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-10',
    lg: 'h-14 sm:h-16'
  };

  const textSizes = {
    sm: 'text-[9.5px]',
    md: 'text-[11px] sm:text-xs',
    lg: 'text-sm sm:text-base'
  };

  if (brandId === 'the-ritz-carlton') {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        <img
          src={ritzLogo}
          alt="The Ritz-Carlton Crest"
          className={`${imgSizes[size]} w-auto object-contain mb-1.5 transition-transform duration-300 ${
            light ? 'brightness-0 invert' : ''
          }`}
        />
        <span
          className={`font-serif tracking-[0.24em] font-semibold uppercase leading-none ${textSizes[size]}`}
          style={{ color, fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
        >
          THE RITZ-CARLTON
        </span>
      </div>
    );
  }

  if (brandId === 'jw-marriott') {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        <img
          src={jwLogo}
          alt="JW Marriott Griffin Emblem"
          className={`${imgSizes[size]} w-auto object-contain mb-1.5 transition-transform duration-300 ${
            light ? 'brightness-0 invert' : ''
          }`}
        />
        <span
          className={`font-serif tracking-[0.28em] font-bold uppercase leading-none ${textSizes[size]}`}
          style={{ color, fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
        >
          JW MARRIOTT
        </span>
      </div>
    );
  }

  if (brandId === 'st-regis') {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        <img
          src={stregisLogo}
          alt="St. Regis Monogram Crest"
          className={`${imgSizes[size]} w-auto object-contain mb-1.5 transition-transform duration-300 ${
            light ? 'brightness-0 invert' : ''
          }`}
        />
        <span
          className={`font-serif tracking-[0.34em] font-semibold uppercase leading-none ${textSizes[size]}`}
          style={{ color, fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
        >
          ST REGIS
        </span>
      </div>
    );
  }

  if (brandId === 'luxury-collection') {
    return (
      <div className={`flex flex-col items-center justify-center text-center ${className}`}>
        <span className="font-serif tracking-[0.22em] font-semibold uppercase text-xs" style={{ color }}>
          THE LUXURY COLLECTION
        </span>
      </div>
    );
  }

  if (brandId === 'w-hotels') {
    return (
      <div className={`flex flex-col items-center justify-center text-center ${className}`}>
        <span className="font-sans font-black tracking-widest text-base leading-none" style={{ color }}>
          W
        </span>
        <span className="text-[8px] tracking-[0.3em] uppercase mt-0.5" style={{ color: subColor }}>
          HOTELS
        </span>
      </div>
    );
  }

  if (brandId === 'edition') {
    return (
      <div className={`flex flex-col items-center justify-center text-center ${className}`}>
        <span className="font-serif italic tracking-[0.2em] font-bold text-sm uppercase" style={{ color }}>
          EDITION
        </span>
      </div>
    );
  }

  return (
    <span className="font-serif font-bold tracking-wider text-xs uppercase" style={{ color }}>
      {brandId.toUpperCase()}
    </span>
  );
};
