import React, { useState, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { HotelCard } from './HotelCard';
import { BookingWidget } from './BookingWidget';
import { BRANDS } from '../data/brands';
import { OFFERS } from '../data/offers';
import { BrandId, Property } from '../types';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  RotateCcw,
  Search,
  Check,
  Tag,
  Sparkles,
  Gift
} from 'lucide-react';

export const HotelSearchResults: React.FC = () => {
  const {
    searchParams,
    updateSearchParams,
    filteredProperties,
    nightsCount
  } = useBooking();

  const [isModifySearchOpen, setIsModifySearchOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States
  const [maxPrice, setMaxPrice] = useState<number>(2500);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedSetting, setSelectedSetting] = useState<string>('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');

  const availableAmenities = [
    'Private Kamogawa River Balconies',
    'Michelin-Starred Tempura Mizuki',
    'Cliffside Heated Infinity Pool',
    'Complimentary Private Shuttle Boat to St. Mark’s Square',
    'Spa by JW Hydrotherapy Circuit',
    'Signature 24-Hour St. Regis Butler Service',
    'Rooftop Eiffel Salon & Bar'
  ];

  const handleBrandToggle = (brandId: BrandId) => {
    let updated: BrandId[];
    if (searchParams.selectedBrands.includes(brandId)) {
      updated = searchParams.selectedBrands.filter(b => b !== brandId);
    } else {
      updated = [...searchParams.selectedBrands, brandId];
    }
    updateSearchParams({ selectedBrands: updated });
  };

  const handleAmenityToggle = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(prev => prev.filter(a => a !== amenity));
    } else {
      setSelectedAmenities(prev => [...prev, amenity]);
    }
  };

  const resetAllFilters = () => {
    setMaxPrice(2500);
    setMinRating(0);
    setSelectedSetting('all');
    setSelectedAmenities([]);
    updateSearchParams({ selectedBrands: [], destination: '' });
  };

  const activeOffer = useMemo(() => {
    if (!searchParams.promoCode) return null;
    return OFFERS.find(o => o.code.toUpperCase() === searchParams.promoCode.toUpperCase()) || null;
  }, [searchParams.promoCode]);

  // Apply filters & sort
  const results = useMemo(() => {
    let list = filteredProperties.filter(property => {
      // Max price
      if (property.startingPrice > maxPrice) return false;
      // Min guest rating
      if (minRating > 0 && property.guestRating < minRating) return false;
      // Setting
      if (selectedSetting !== 'all' && property.setting !== selectedSetting) return false;
      // Amenities
      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every(a =>
          property.amenities.some(propA => propA.toLowerCase().includes(a.toLowerCase()))
        );
        if (!hasAll) return false;
      }
      return true;
    });

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.guestRating - a.guestRating);
    }

    return list;
  }, [filteredProperties, maxPrice, minRating, selectedSetting, selectedAmenities, sortBy]);

  return (
    <div className="bg-[#faf9f6] text-stone-900 min-h-screen pb-24">

      {/* 1. Search Summary Bar (Light Theme) */}
      <div className="bg-white text-stone-900 border-b border-stone-200 py-5 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8a1538] font-bold mb-1">
              <span>Hotel Availability</span>
              <span>·</span>
              <span>{results.length} Properties Found</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-stone-800">
              <span className="font-bold text-stone-950">
                {searchParams.destination || 'All Destinations'}
              </span>
              <span className="text-stone-400">·</span>
              <span>{searchParams.checkIn} to {searchParams.checkOut} ({nightsCount} nights)</span>
              <span className="text-stone-400">·</span>
              <span>{searchParams.rooms} Room, {searchParams.adults + searchParams.children} Guests</span>
            </div>
          </div>

          <button
            onClick={() => setIsModifySearchOpen(!isModifySearchOpen)}
            className="self-start md:self-auto px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs uppercase tracking-wider font-bold rounded-lg border border-stone-200 transition-colors flex items-center gap-2"
          >
            <span>{isModifySearchOpen ? 'Hide Search Form' : 'Modify Search'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${isModifySearchOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Collapsible Modify Search Drawer */}
        {isModifySearchOpen && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 pt-5 border-t border-stone-100 animate-in fade-in">
            <BookingWidget compact />
          </div>
        )}
      </div>

      {/* 2. Main Layout: Filters Sidebar + Results List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Active Special Offer Banner */}
        {activeOffer && (
          <div className="mb-8 p-5 bg-gradient-to-r from-[#8a1538]/10 via-[#8a1538]/5 to-transparent border border-[#8a1538]/25 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#8a1538] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase bg-[#8a1538] text-white px-2.5 py-0.5 rounded-full">
                    OFFER APPLIED: {activeOffer.code}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">
                    Valid through {activeOffer.validUntil}
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                  {activeOffer.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                  {activeOffer.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2.5">
                  {activeOffer.inclusions.slice(0, 3).map((inc, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-800 bg-white/80 px-2 py-0.5 rounded-md border border-stone-200">
                      <Check className="w-3 h-3 text-[#8a1538]" />
                      <span>{inc}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-[#8a1538]/15">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8a1538] text-white text-xs font-bold rounded-lg shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {activeOffer.creditAmount
                    ? `$${activeOffer.creditAmount} Credit Included`
                    : `${activeOffer.discountPercentage}% Stay Savings`}
                </span>
              </span>
              <button
                onClick={() => updateSearchParams({ promoCode: '', selectedBrands: [] })}
                className="text-[11px] text-stone-500 hover:text-stone-800 underline"
              >
                Clear Package
              </button>
            </div>
          </div>
        )}

        {/* Results Controls Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white rounded-lg border border-stone-200 text-xs font-bold text-stone-800 shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters ({searchParams.selectedBrands.length + (selectedSetting !== 'all' ? 1 : 0) + selectedAmenities.length})</span>
            </button>

            <span className="text-xs text-stone-600 font-normal">
              Showing <strong className="text-stone-950 font-bold">{results.length}</strong> hotels & resorts
            </span>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-300 text-stone-800 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#8a1538]"
            >
              <option value="recommended">Marriott Bonvoy Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Guest Rating</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Desktop Filters Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-7 text-xs">

            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="font-serif text-base font-bold text-stone-900">Filter Properties</span>
              <button
                onClick={resetAllFilters}
                className="text-[11px] text-[#8a1538] hover:underline flex items-center gap-1 font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Brand Filter */}
            <div>
              <span className="font-bold text-stone-900 block mb-3 uppercase tracking-wider text-[11px]">
                Hotel Brand
              </span>
              <div className="space-y-2">
                {BRANDS.map(brand => {
                  const isChecked = searchParams.selectedBrands.includes(brand.id);
                  return (
                    <label
                      key={brand.id}
                      className="flex items-center gap-2.5 cursor-pointer text-stone-700 hover:text-stone-950 font-medium"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleBrandToggle(brand.id)}
                        className="rounded border-stone-300 text-[#8a1538] focus:ring-[#8a1538]"
                      />
                      <span>{brand.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                  Max Nightly Rate
                </span>
                <span className="font-mono text-stone-900 font-bold">${maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="700"
                max="2500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#8a1538] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                <span>$700</span>
                <span>$2,500+</span>
              </div>
            </div>


            {/* Guest Rating Filter */}
            <div>
              <span className="font-bold text-stone-900 block mb-2 uppercase tracking-wider text-[11px]">
                Guest Rating
              </span>
              <div className="space-y-1.5">
                {[
                  { label: 'All Ratings (4.9+)', value: 0 },
                  { label: '4.95+ Exceptional', value: 4.95 },
                  { label: '4.97+ Masterpiece', value: 4.97 }
                ].map(item => (
                  <label
                    key={item.value}
                    className="flex items-center gap-2 cursor-pointer text-stone-700 hover:text-stone-950 font-medium"
                  >
                    <input
                      type="radio"
                      name="guestRating"
                      checked={minRating === item.value}
                      onChange={() => setMinRating(item.value)}
                      className="text-[#8a1538] focus:ring-[#8a1538]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Signature Amenities */}
            <div>
              <span className="font-bold text-stone-900 block mb-2.5 uppercase tracking-wider text-[11px]">
                Signature Amenities
              </span>
              <div className="space-y-2">
                {availableAmenities.map((amenity, idx) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <label
                      key={idx}
                      className="flex items-start gap-2 cursor-pointer text-stone-700 hover:text-stone-950 text-[11px] font-medium"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="rounded border-stone-300 text-[#8a1538] focus:ring-[#8a1538] mt-0.5"
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* Results List (9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            {results.length > 0 ? (
              results.map(property => (
                <HotelCard key={property.id} property={property} />
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs">
                <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-[#8a1538]">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl text-stone-900 mb-2">No Matching Properties</h3>
                <p className="text-stone-600 text-sm max-w-md mx-auto mb-6 font-light">
                  No properties matched your current filter combinations. Try clearing specific brand filters or expanding your price range.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-6 py-2.5 bg-[#8a1538] hover:bg-[#6e0f2b] text-white text-xs uppercase tracking-wider font-bold rounded-lg transition-colors"
                >
                  Clear All Filters & Reset Search
                </button>
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full overflow-y-auto p-6 flex flex-col justify-between">
            <div className="space-y-6 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="font-serif text-lg font-bold text-stone-900">Filters</span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-stone-500 hover:text-stone-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Brands */}
              <div>
                <span className="font-bold text-stone-900 block mb-2">Hotel Brands</span>
                <div className="space-y-2">
                  {BRANDS.map(brand => (
                    <label key={brand.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={searchParams.selectedBrands.includes(brand.id)}
                        onChange={() => handleBrandToggle(brand.id)}
                      />
                      <span>{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-bold">Max Price</span>
                  <span className="font-mono">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="700"
                  max="2500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#8a1538]"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 flex gap-3">
              <button
                onClick={resetAllFilters}
                className="w-1/2 py-2.5 border border-stone-300 rounded font-bold text-xs"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-1/2 py-2.5 bg-[#8a1538] text-white rounded font-bold text-xs"
              >
                Show {results.length} Stays
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
