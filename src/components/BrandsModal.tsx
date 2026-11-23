import React, { useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { BRANDS } from '../data/brands';
import { BrandLogo } from './MarriottLogo';
import { ImageWithFallback } from './ImageWithFallback';
import { X, ArrowRight, Building2, Sparkles, Check } from 'lucide-react';
import { BrandId } from '../types';

export const BrandsModal: React.FC = () => {
  const {
    isBrandsModalOpen,
    closeBrandsModal,
    activeModalBrandId,
    setActiveModalBrandId,
    goToBrandDetail,
    goToSearchResults
  } = useBooking();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isBrandsModalOpen) {
        closeBrandsModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBrandsModalOpen, closeBrandsModal]);

  if (!isBrandsModalOpen) return null;

  // We only show the 3 requested luxury brands: The Ritz-Carlton, JW Marriott, St. Regis
  const activeBrands = BRANDS.slice(0, 3);
  const selectedBrand = activeBrands.find(b => b.id === activeModalBrandId) || activeBrands[0];

  const handleSelectBrand = (id: BrandId) => {
    setActiveModalBrandId(id);
  };

  const handleExploreHotels = (brandId: BrandId) => {
    closeBrandsModal();
    goToSearchResults({ selectedBrands: [brandId] });
  };

  const handleDiscoverStory = (brandId: BrandId) => {
    closeBrandsModal();
    goToBrandDetail(brandId);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={closeBrandsModal}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-[#faf9f6] text-stone-900 rounded-3xl shadow-2xl border border-stone-200 w-full max-w-4xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a1538] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Marriott Bonvoy Luxury Portfolio</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Our Celebrated Brands
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Select a brand below to view hotels, signature privileges, and brand story.
            </p>
          </div>

          <button
            type="button"
            onClick={closeBrandsModal}
            className="w-9 h-9 rounded-full border border-stone-200 hover:border-stone-400 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors shrink-0"
            aria-label="Close brands modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ─── 3 BRAND TILES GRID (MATCHING SCREENSHOT) ─── */}
        <div className="mt-6">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-3">
            SELECT A BRAND (3 ICONIC LUXURY HOUSES)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {activeBrands.map((brand) => {
              const isSelected = selectedBrand.id === brand.id;
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => handleSelectBrand(brand.id)}
                  className={`relative w-full rounded-2xl p-6 sm:p-7 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer min-h-[110px] sm:min-h-[125px] ${
                    isSelected
                      ? 'bg-white border-2 border-stone-950 shadow-lg ring-4 ring-stone-950/5 scale-[1.02]'
                      : 'bg-white border border-stone-200/90 hover:border-stone-400 hover:shadow-md'
                  }`}
                >
                  {/* Selected Indicator Pill */}
                  {isSelected && (
                    <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#1c1917] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}

                  {/* Brand Logo & Crest Centered */}
                  <BrandLogo brandId={brand.id} className="transition-transform group-hover:scale-105 duration-300" />
                  
                  {/* Property Count Badge */}
                  <span className="text-[10px] font-mono font-medium text-stone-400 mt-2">
                    {brand.propertyCount} Hotels Worldwide
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── ACTIVE BRAND DETAIL PREVIEW PANEL ─── */}
        <div className="mt-8 bg-white border border-stone-200 rounded-2xl p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            
            {/* Left: Brand Visual Banner */}
            <div className="relative w-full md:w-5/12 h-48 sm:h-56 rounded-xl overflow-hidden shrink-0 bg-stone-100">
              <ImageWithFallback
                src={selectedBrand.coverImage}
                alt={selectedBrand.name}
                fallbackTitle={selectedBrand.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                  {selectedBrand.category}
                </span>
                <h3 className="font-serif text-xl font-bold mt-2 text-white drop-shadow-sm">
                  {selectedBrand.name}
                </h3>
              </div>
            </div>

            {/* Right: Description, Perks & Actions */}
            <div className="flex-1 flex flex-col justify-between h-full">
              <div>
                <p className="font-serif italic text-[#8a1538] text-sm font-semibold mb-2">
                  "{selectedBrand.tagline}"
                </p>
                <p className="text-stone-600 text-xs sm:text-sm font-normal leading-relaxed mb-4">
                  {selectedBrand.description}
                </p>

                {/* Signature Privileges */}
                <div className="pt-3 border-t border-stone-100 mb-5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-2.5">
                    Signature Brand Privileges
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-700">
                    {selectedBrand.signaturePerks.map((perk, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-stone-50 p-2 rounded-lg border border-stone-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8a1538] shrink-0 mt-1.5" />
                        <span className="font-medium text-stone-800 leading-snug">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => handleExploreHotels(selectedBrand.id)}
                  className="w-full sm:w-auto flex-1 py-3 px-5 bg-[#1c1917] hover:bg-black active:scale-[0.98] text-white text-xs uppercase tracking-wider font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Explore {selectedBrand.name} Hotels</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDiscoverStory(selectedBrand.id)}
                  className="w-full sm:w-auto py-3 px-5 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs uppercase tracking-wider font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Brand Story</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8a1538]" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
