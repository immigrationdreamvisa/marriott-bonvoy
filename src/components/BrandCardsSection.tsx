import React, { useState } from 'react';
import { BRANDS } from '../data/brands';
import { PROPERTIES } from '../data/properties';
import { useBooking } from '../context/BookingContext';
import { BrandLogo } from './MarriottLogo';
import { ImageWithFallback } from './ImageWithFallback';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Building2,
  Star,
  MapPin,
  Check,
  ShieldCheck,
  Award,
  Crown,
  ChevronRight
} from 'lucide-react';
import { BrandId } from '../types';

export const BrandCardsSection: React.FC = () => {
  const { openBrandsModal, goToBrandDetail, goToPropertyDetails, goToSearchResults } = useBooking();

  // Exactly the 3 requested luxury brands
  const brands = BRANDS.slice(0, 3);
  const [selectedBrandId, setSelectedBrandId] = useState<BrandId>('the-ritz-carlton');

  const activeBrand = brands.find((b) => b.id === selectedBrandId) || brands[0];
  const brandProperties = PROPERTIES.filter((p) => p.brandId === activeBrand.id).slice(0, 3);

  // Distinct perk iconography for luxury aesthetic
  const perkIcons = [Crown, Award, ShieldCheck, Sparkles];

  return (
    <section id="brands-section" className="py-20 lg:py-28 bg-[#faf9f6] text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── SECTION HEADER ─── */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#8a1538] font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Luxury Portfolio</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-stone-900 leading-[1.2] mb-4">
            Three Legendary Houses of Luxury
          </h2>
          <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
            From the legendary ladies and gentlemen of The Ritz-Carlton to the mindful well-being of JW Marriott and the timeless Gilded Age glamour of St. Regis, discover the pinnacle of global hospitality.
          </p>
        </div>

        {/* ─── 3 BRAND SELECTOR TILES (INTERACTIVE SWITCHER) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-12 sm:mb-16">
          {brands.map((brand) => {
            const isSelected = brand.id === activeBrand.id;
            return (
              <button
                key={brand.id}
                type="button"
                onClick={() => setSelectedBrandId(brand.id as BrandId)}
                className={`group relative w-full rounded-2xl p-7 sm:p-9 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer min-h-[145px] sm:min-h-[165px] ${
                  isSelected
                    ? 'bg-white border-2 border-stone-950 shadow-xl ring-4 ring-stone-950/5 scale-[1.02]'
                    : 'bg-white/80 hover:bg-white border border-stone-200 hover:border-stone-400 hover:shadow-lg'
                }`}
              >
                {/* Active Indicator Badge */}
                {isSelected && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 bg-[#1c1917] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Active</span>
                  </span>
                )}

                {/* Brand Vector Emblem & Typography */}
                <BrandLogo
                  brandId={brand.id}
                  className="transition-transform duration-300 group-hover:scale-105"
                />

                {/* Property Count Badge */}
                <div className="mt-3 flex items-center gap-2">
                  <span className={`text-[11px] font-mono font-medium transition-colors ${
                    isSelected ? 'text-stone-900 font-bold' : 'text-stone-400 group-hover:text-stone-600'
                  }`}>
                    {brand.propertyCount} Hotels Worldwide
                  </span>
                </div>

                {/* Subtle switch prompt */}
                <span className={`text-[10px] font-semibold mt-1 transition-opacity ${
                  isSelected ? 'text-[#8a1538]' : 'text-stone-400 opacity-0 group-hover:opacity-100'
                }`}>
                  {isSelected ? 'Currently Viewing' : 'Click to Explore Brand'}
                </span>
              </button>
            );
          })}
        </div>

        {/* ─── DEDICATED ACTIVE BRAND FEATURE SHOWCASE ─── */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden mb-16 transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Left: Brand Hero Banner */}
            <div className="lg:col-span-5 relative min-h-[340px] sm:min-h-[420px] bg-stone-900 overflow-hidden group">
              <ImageWithFallback
                src={activeBrand.coverImage}
                alt={activeBrand.name}
                fallbackTitle={activeBrand.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-stone-950/20" />
              
              <div className="absolute top-6 left-6">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 text-white shadow-sm">
                  {activeBrand.category}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl inline-block mb-3 shadow-md">
                  <BrandLogo brandId={activeBrand.id} />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1 drop-shadow-sm">
                  {activeBrand.name}
                </h3>
                <p className="text-xs sm:text-sm text-stone-200 font-light italic font-serif">
                  "{activeBrand.tagline}"
                </p>
              </div>
            </div>

            {/* Right: Brand Philosophy & Privileges */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8a1538] font-bold mb-2">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Hospitality Philosophy</span>
                </div>
                
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 mb-4 leading-snug">
                  {activeBrand.name}: A Vision of Refinement
                </h3>
                
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed mb-4 font-normal">
                  {activeBrand.description}
                </p>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-8 font-light">
                  {activeBrand.philosophy}
                </p>

                {/* Signature Brand Privileges (Full, Untruncated, Luxury Badges) */}
                <div className="mb-8">
                  <span className="text-[11px] uppercase font-bold tracking-[0.18em] text-stone-400 block mb-3">
                    Signature Brand Privileges & Hallmarks
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {activeBrand.signaturePerks.map((perk, idx) => {
                      const IconComponent = perkIcons[idx % perkIcons.length];
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 hover:border-stone-300 hover:bg-stone-100/70 transition-all"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#8a1538]/10 text-[#8a1538] flex items-center justify-center shrink-0 mt-0.5">
                            <IconComponent className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-stone-900 block leading-snug">
                              {perk}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="button"
                  onClick={() => goToSearchResults({ selectedBrands: [activeBrand.id] })}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#1c1917] hover:bg-black active:scale-[0.98] text-white text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Explore {activeBrand.name} Hotels</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => goToBrandDetail(activeBrand.id)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs uppercase tracking-wider font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Brand Story & Heritage</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8a1538]" />
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* ─── FEATURED PROPERTIES FOR THIS BRAND ─── */}
        <div className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.22em] text-[#8a1538] font-bold block mb-1.5">
                Flagship Destinations
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
                Featured {activeBrand.name} Addresses
              </h3>
            </div>
            <button
              onClick={() => goToSearchResults({ selectedBrands: [activeBrand.id] })}
              className="text-xs uppercase tracking-wider font-bold text-stone-900 hover:text-[#8a1538] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View All {activeBrand.propertyCount} Hotels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {brandProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => goToPropertyDetails(property.id)}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
              >
                {/* Photo & Badges */}
                <div className="relative h-56 sm:h-60 overflow-hidden bg-stone-100">
                  <ImageWithFallback
                    src={property.heroImage}
                    alt={property.name}
                    fallbackTitle={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-mono font-bold text-stone-900 flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 text-[#c5a059] fill-[#c5a059]" />
                    <span>{property.guestRating.toFixed(2)}</span>
                    <span className="text-stone-400 font-normal">({property.reviewCount})</span>
                  </div>
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white drop-shadow-sm">
                    <span className="text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8a1538]" />
                      {property.city}, {property.country}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-serif text-lg text-stone-900 font-bold mb-2 group-hover:text-[#8a1538] transition-colors leading-snug">
                      {property.name}
                    </h4>
                    <p className="text-stone-600 text-xs leading-relaxed line-clamp-2 mb-4 font-normal">
                      {property.tagline || property.description}
                    </p>

                    {/* Highlights tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {property.amenities.slice(0, 2).map((amenity, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Book CTA */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider block">From</span>
                      <span className="text-base font-bold text-stone-900 font-mono">
                        ${property.startingPrice.toLocaleString()}
                        <span className="text-xs font-normal text-stone-500"> / night</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => goToPropertyDetails(property.id)}
                      className="px-4 py-2 bg-[#1c1917] hover:bg-[#8a1538] text-white text-xs uppercase tracking-wider font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── QUICK MODAL TRIGGER FOOTNOTE ─── */}
        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={() => openBrandsModal(activeBrand.id)}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-700 hover:text-[#8a1538] tracking-wider uppercase transition-colors p-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8a1538]" />
            <span>Open Brands Portfolio Modal with All 3 Brands</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};