import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { PROPERTIES } from '../data/properties';
import { BRANDS } from '../data/brands';
import { VALID_PROMO_CODES } from '../data/offers';
import { BrandId } from '../types';
import { DateRangeCalendar } from './DateRangeCalendar';
import { RoomsAndGuestsSelector } from './RoomsAndGuestsSelector';
import {
  Search,
  Calendar,
  Users,
  MapPin,
  ChevronDown,
  X,
  Check,
  Tag,
  Building2,
  Sparkles,
  Navigation,
  History,
  Clock
} from 'lucide-react';

interface RecentItem {
  id: string;
  name: string;
  sub: string;
  value: string;
  time: string;
}

const DEFAULT_RECENTS: RecentItem[] = [
  { id: '1', name: 'The Ritz-Carlton, Kyoto', sub: 'Kyoto, Japan · Luxury Sanctuary', value: 'Kyoto', time: 'Viewed 2h ago' },
  { id: '2', name: 'JW Marriott Venice Resort & Spa', sub: 'Venice, Italy · Private Island', value: 'Venice', time: 'Viewed yesterday' },
  { id: '3', name: 'The St. Regis Bora Bora Resort', sub: 'Bora Bora, French Polynesia · Overwater Villas', value: 'Bora Bora', time: 'Viewed 3d ago' },
  { id: '4', name: 'The Tokyo EDITION, Toranomon', sub: 'Tokyo, Japan · Skyline Landmark', value: 'Tokyo', time: 'Viewed last week' }
];

interface BookingWidgetProps {
  compact?: boolean;
  showRoomsAndGuests?: boolean;
  showBrands?: boolean;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({
  compact = false,
  showRoomsAndGuests = true,
  showBrands = false
}) => {
  const {
    searchParams,
    updateSearchParams,
    goToSearchResults,
    nightsCount
  } = useBooking();

  // Active dropdown popover
  const [activePopover, setActivePopover] = useState<'destination' | 'dates' | 'guests' | 'promo' | null>(null);

  // Destination autocomplete search state
  const [destQuery, setDestQuery] = useState(searchParams.destination);
  const destInputRef = useRef<HTMLInputElement>(null);

  // Tab & Live Location state for Destination Popover
  const [destTab, setDestTab] = useState<'recent' | 'all'>('recent');
  const [isLocating, setIsLocating] = useState(false);
  const [recentDestinations, setRecentDestinations] = useState<RecentItem[]>(() => {
    try {
      const saved = localStorage.getItem('marriott_recent_destinations');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_RECENTS;
  });

  const handleSelectDestination = (val: string, name?: string, sub?: string) => {
    updateSearchParams({ destination: val });
    setDestQuery(val);
    setActivePopover('dates');

    if (val && val !== 'All Destinations') {
      const newItem: RecentItem = {
        id: Date.now().toString(),
        name: name || val,
        sub: sub || 'Verified Marriott Destination',
        value: val,
        time: 'Just now'
      };
      setRecentDestinations(prev => {
        const filtered = prev.filter(p => p.value.toLowerCase() !== val.toLowerCase());
        const updated = [newItem, ...filtered].slice(0, 6);
        try {
          localStorage.setItem('marriott_recent_destinations', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };

  const handleUseLiveLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false);
          handleSelectDestination('Current Location (Near You)', 'Live Location', 'Nearby Marriott Bonvoy Hotels');
        },
        () => {
          setIsLocating(false);
          handleSelectDestination('Current Location (Near You)', 'Live Location', 'Nearby Marriott Bonvoy Hotels');
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      handleSelectDestination('Current Location (Near You)', 'Live Location', 'Nearby Marriott Bonvoy Hotels');
    }
  };

  const clearRecents = () => {
    setRecentDestinations([]);
    try {
      localStorage.removeItem('marriott_recent_destinations');
    } catch {}
  };

  useEffect(() => {
    setDestQuery(searchParams.destination);
  }, [searchParams.destination]);

  // Build verified destination options dynamically from real inventory
  const verifiedDestinations = useMemo(() => {
    const list: { label: string; sub: string; value: string; type: 'all' | 'city' | 'property' }[] = [
      {
        label: 'All Destinations',
        sub: 'Explore all luxury properties worldwide in our portfolio',
        value: '',
        type: 'all'
      }
    ];

    // Unique cities from PROPERTIES
    const cityMap = new Map<string, string[]>();
    PROPERTIES.forEach(prop => {
      const existing = cityMap.get(prop.city) || [];
      existing.push(prop.name);
      cityMap.set(prop.city, existing);
    });

    cityMap.forEach((hotels, city) => {
      const sampleHotel = hotels[0];
      const count = hotels.length;
      list.push({
        label: `${city}`,
        sub: count > 1 ? `${count} properties including ${sampleHotel}` : sampleHotel,
        value: city,
        type: 'city'
      });
    });

    // Individual verified properties
    PROPERTIES.forEach(prop => {
      list.push({
        label: prop.name,
        sub: `${prop.city}, ${prop.country} · ${prop.tagline.slice(0, 50)}...`,
        value: prop.name,
        type: 'property'
      });
    });

    return list;
  }, []);

  const filteredDestinations = useMemo(() => {
    if (!destQuery.trim()) {
      return verifiedDestinations;
    }
    const q = destQuery.toLowerCase().trim();
    return verifiedDestinations.filter(
      d => d.label.toLowerCase().includes(q) || d.sub.toLowerCase().includes(q) || d.value.toLowerCase().includes(q)
    );
  }, [destQuery, verifiedDestinations]);

  // Promo Code Validation
  const [promoInput, setPromoInput] = useState(searchParams.promoCode);
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  const applyPromo = (code: string) => {
    const upper = code.trim().toUpperCase();
    if (!upper) {
      updateSearchParams({ promoCode: '' });
      setPromoFeedback(null);
      return;
    }
    if (VALID_PROMO_CODES[upper]) {
      updateSearchParams({ promoCode: upper });
      setPromoFeedback(`Applied: ${VALID_PROMO_CODES[upper].name}`);
    } else {
      setPromoFeedback('Invalid code. Try "BONVOYVIP" or "RITZRECONNECT"');
    }
  };

  // Close popover on outside click
  const widgetRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format date display
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
    } catch {
      return dateStr;
    }
  };

  // Summary string for guests
  const guestsSummary = useMemo(() => {
    const r = searchParams.rooms;
    const a = searchParams.adults;
    const c = searchParams.children;
    const roomStr = `${r} ${r === 1 ? 'Room' : 'Rooms'}`;
    const adultStr = `${a} ${a === 1 ? 'Adult' : 'Adults'}`;
    const childStr = c > 0 ? `, ${c} ${c === 1 ? 'Child' : 'Children'}` : '';
    return `${roomStr}, ${adultStr}${childStr}`;
  }, [searchParams.rooms, searchParams.adults, searchParams.children]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActivePopover(null);
    goToSearchResults();
  };

  return (
    <div
      ref={widgetRef}
      className={`relative w-full ${
        compact ? 'bg-white border border-stone-200' : 'bg-white border border-stone-200 shadow-xl'
      } rounded-2xl text-stone-900 p-4 sm:p-5 transition-all`}
    >
      {/* Brand Ribbon / Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-3.5 border-b border-stone-100 text-xs">
        {showBrands ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-stone-500 font-semibold uppercase tracking-wider text-[11px] mr-1">Brand:</span>
            
            <button
              type="button"
              onClick={() => updateSearchParams({ selectedBrands: [] })}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                searchParams.selectedBrands.length === 0
                  ? 'bg-[#8a1538] text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 bg-stone-100'
              }`}
            >
              All Brands
            </button>

            {BRANDS.map(brand => {
              const isSelected = searchParams.selectedBrands.includes(brand.id);
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => {
                    let updated: BrandId[];
                    if (isSelected) {
                      updated = searchParams.selectedBrands.filter(id => id !== brand.id);
                    } else {
                      updated = [...searchParams.selectedBrands, brand.id];
                    }
                    updateSearchParams({ selectedBrands: updated });
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#8a1538] text-white shadow-xs'
                      : 'text-stone-700 hover:text-stone-900 bg-stone-100'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                  <span>{brand.name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold flex items-center gap-2">
            <span>Official Marriott Bonvoy Reservation Engine</span>
          </div>
        )}

        {/* Member rates / Promo button */}
        <button
          type="button"
          onClick={() => setActivePopover(activePopover === 'promo' ? null : 'promo')}
          className="flex items-center gap-1.5 text-stone-600 hover:text-[#8a1538] font-semibold transition-colors py-1 px-2.5 rounded-lg hover:bg-stone-50 ml-auto"
        >
          <Tag className="w-3.5 h-3.5 text-[#8a1538]" />
          <span>{searchParams.promoCode ? `Promo: ${searchParams.promoCode}` : 'Special Rates & Promo'}</span>
        </button>
      </div>

      {/* Main Booking Controls Grid */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3 items-stretch">
        
        {/* 1. Destination Input */}
        <div className={`relative ${showRoomsAndGuests ? 'md:col-span-4' : 'md:col-span-5'}`}>
          <div
            onClick={() => {
              setActivePopover('destination');
              setTimeout(() => destInputRef.current?.focus(), 50);
            }}
            className={`w-full h-full min-h-[60px] px-4 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100/70 border ${
              activePopover === 'destination' ? 'border-[#8a1538] ring-1 ring-[#8a1538]' : 'border-stone-200'
            } cursor-pointer flex items-center justify-between transition-colors`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <MapPin className="w-5 h-5 text-[#8a1538] shrink-0" />
              <div className="truncate text-left">
                <span className="block text-[10px] uppercase tracking-wider text-stone-500 font-bold">
                  Destination
                </span>
                <span className="block text-sm font-semibold text-stone-900 truncate">
                  {searchParams.destination || 'Where would you like to travel?'}
                </span>
              </div>
            </div>

            {searchParams.destination && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  updateSearchParams({ destination: '' });
                  setDestQuery('');
                }}
                className="p-1 hover:text-stone-900 text-stone-400"
                aria-label="Clear destination"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Destination Dropdown */}
          {activePopover === 'destination' && (
            <div className="absolute left-0 top-full mt-2 w-full sm:w-[460px] bg-white border border-stone-200 rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 text-left">
              
              {/* Search Input */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  ref={destInputRef}
                  type="text"
                  placeholder="Type destination, city, or hotel name..."
                  value={destQuery}
                  onChange={(e) => {
                    setDestQuery(e.target.value);
                    if (e.target.value.trim()) setDestTab('all');
                  }}
                  className="w-full bg-stone-50 text-stone-900 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#8a1538]"
                />
              </div>

              {/* ─── 2 PRIMARY OPTIONS: LIVE LOCATION & RECENTLY VIEWED ─── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 pb-3 border-b border-stone-100">
                
                {/* 1. Live Location */}
                <button
                  type="button"
                  onClick={handleUseLiveLocation}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-50 hover:bg-[#8a1538]/10 border border-stone-200/80 text-left transition-all group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#8a1538]/15 text-[#8a1538] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="truncate flex-1">
                    <span className="block font-bold text-stone-900 group-hover:text-[#8a1538] text-xs transition-colors">
                      Live Location
                    </span>
                    <span className="block text-[10px] text-stone-500 truncate">
                      {isLocating ? 'Detecting GPS...' : 'Hotels near you'}
                    </span>
                  </div>
                </button>

                {/* 2. Recently Viewed */}
                <button
                  type="button"
                  onClick={() => setDestTab('recent')}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all group cursor-pointer ${
                    destTab === 'recent' && !destQuery.trim()
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 hover:bg-stone-100 border-stone-200/80 text-stone-900'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                    destTab === 'recent' && !destQuery.trim() ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700 group-hover:scale-105'
                  }`}>
                    <History className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate flex-1">
                    <span className={`block font-bold text-xs ${destTab === 'recent' && !destQuery.trim() ? 'text-white' : 'text-stone-900'}`}>
                      Recently Viewed
                    </span>
                    <span className={`block text-[10px] truncate ${destTab === 'recent' && !destQuery.trim() ? 'text-stone-300' : 'text-stone-500'}`}>
                      {recentDestinations.length} recent
                    </span>
                  </div>
                </button>

              </div>

              {/* List Header */}
              <div className="text-[10px] uppercase tracking-wider text-stone-400 font-bold px-1 py-1 flex items-center justify-between mb-1">
                <span>
                  {destTab === 'recent' && !destQuery.trim()
                    ? `Recently Viewed (${recentDestinations.length})`
                    : `Verified Destinations (${filteredDestinations.length})`}
                </span>
                {destTab === 'recent' && !destQuery.trim() ? (
                  recentDestinations.length > 0 && (
                    <button
                      type="button"
                      onClick={clearRecents}
                      className="text-stone-400 hover:text-stone-700 normal-case"
                    >
                      Clear
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setDestTab('recent');
                      setDestQuery('');
                    }}
                    className="text-[#8a1538] normal-case"
                  >
                    Show recents
                  </button>
                )}
              </div>

              {/* List Content */}
              <div className="max-h-60 overflow-y-auto space-y-1 text-xs pr-1">
                {destTab === 'recent' && !destQuery.trim() ? (
                  recentDestinations.length > 0 ? (
                    recentDestinations.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleSelectDestination(r.value, r.name, r.sub)}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 truncate mr-2">
                          <Clock className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#8a1538] shrink-0" />
                          <div className="truncate">
                            <p className="font-semibold text-stone-900 group-hover:text-[#8a1538] transition-colors truncate">
                              {r.name}
                            </p>
                            <p className="text-[10px] text-stone-500 truncate">{r.sub}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400 font-medium whitespace-nowrap shrink-0">
                          {r.time}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-stone-500">
                      <p>No recently viewed destinations.</p>
                    </div>
                  )
                ) : (
                  filteredDestinations.length > 0 ? (
                    filteredDestinations.map((d, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectDestination(d.value, d.label, d.sub)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors flex items-start gap-2.5 group cursor-pointer"
                      >
                        {d.type === 'property' ? (
                          <Building2 className="w-3.5 h-3.5 text-[#8a1538] mt-0.5 shrink-0" />
                        ) : d.type === 'all' ? (
                          <Sparkles className="w-3.5 h-3.5 text-[#8a1538] mt-0.5 shrink-0" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-[#8a1538] mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1 truncate">
                          <p className="font-semibold text-stone-900 group-hover:text-[#8a1538] transition-colors truncate">
                            {d.label}
                          </p>
                          <p className="text-[11px] text-stone-500 truncate">{d.sub}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-stone-500">
                      <p className="font-medium text-stone-700">No matching verified hotels found</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2. Check-in & Check-out Calendar Trigger */}
        <div className={`relative ${showRoomsAndGuests ? 'md:col-span-4' : 'md:col-span-5'}`}>
          <div
            onClick={() => setActivePopover(activePopover === 'dates' ? null : 'dates')}
            className={`w-full h-full min-h-[60px] px-4 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100/70 border ${
              activePopover === 'dates' ? 'border-[#8a1538] ring-1 ring-[#8a1538]' : 'border-stone-200'
            } cursor-pointer flex items-center justify-between transition-colors`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#8a1538] shrink-0" />
              <div className="text-left">
                <span className="block text-[10px] uppercase tracking-wider text-stone-500 font-bold">
                  Dates
                </span>
                <span className="block text-xs sm:text-sm font-semibold text-stone-900">
                  {formatDateDisplay(searchParams.checkIn)} – {formatDateDisplay(searchParams.checkOut)}
                  <span className="text-stone-500 text-[11px] ml-1.5 font-normal">
                    ({nightsCount} {nightsCount === 1 ? 'night' : 'nights'})
                  </span>
                </span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-stone-500 shrink-0 transition-transform ${activePopover === 'dates' ? 'rotate-180' : ''}`} />
          </div>

          {/* Interactive DateRangeCalendar Dropdown */}
          {activePopover === 'dates' && (
            <div className="absolute left-0 lg:-left-20 top-full mt-2 z-50">
              <DateRangeCalendar
                checkIn={searchParams.checkIn}
                checkOut={searchParams.checkOut}
                onChange={(checkIn, checkOut) => {
                  updateSearchParams({ checkIn, checkOut });
                  if (showRoomsAndGuests) {
                    setActivePopover('guests');
                  } else {
                    setActivePopover(null);
                  }
                }}
                onClose={() => setActivePopover(null)}
              />
            </div>
          )}
        </div>

        {/* 3. Rooms and Guests Selector (only if enabled) */}
        {showRoomsAndGuests && (
          <div className="relative md:col-span-2.5">
            <div
              onClick={() => setActivePopover(activePopover === 'guests' ? null : 'guests')}
              className={`w-full h-full min-h-[60px] px-4 py-2.5 rounded-xl bg-stone-50 hover:bg-stone-100/70 border ${
                activePopover === 'guests' ? 'border-[#8a1538] ring-1 ring-[#8a1538]' : 'border-stone-200'
              } cursor-pointer flex items-center justify-between transition-colors`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Users className="w-5 h-5 text-[#8a1538] shrink-0" />
                <div className="text-left truncate">
                  <span className="block text-[10px] uppercase tracking-wider text-stone-500 font-bold">
                    Rooms & Guests
                  </span>
                  <span className="block text-xs sm:text-sm font-semibold text-stone-900 truncate">
                    {guestsSummary}
                  </span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-stone-500 shrink-0 transition-transform ${activePopover === 'guests' ? 'rotate-180' : ''}`} />
            </div>

            {/* Interactive Rooms & Guests Popover */}
            {activePopover === 'guests' && (
              <div className="absolute right-0 top-full mt-2 z-50">
                <RoomsAndGuestsSelector
                  rooms={searchParams.rooms}
                  adults={searchParams.adults}
                  childrenCount={searchParams.children}
                  childrenAges={searchParams.childrenAges}
                  onChange={(data) => {
                    updateSearchParams(data);
                  }}
                  onClose={() => setActivePopover(null)}
                />
              </div>
            )}
          </div>
        )}

        {/* 4. Find Hotels Button */}
        <div className={showRoomsAndGuests ? 'md:col-span-1.5' : 'md:col-span-2'}>
          <button
            type="submit"
            className="w-full h-full min-h-[60px] bg-[#8a1538] hover:bg-[#6e0f2b] active:scale-[0.98] text-white font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md px-3"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span className={showRoomsAndGuests ? 'md:hidden lg:inline' : 'inline'}>Find Hotels</span>
          </button>
        </div>

      </form>

      {/* Promo Code Popover Modal */}
      {activePopover === 'promo' && (
        <div className="mt-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs animate-in fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-stone-900">Promotional & Special Rates</span>
            <button
              type="button"
              onClick={() => setActivePopover(null)}
              className="text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. BONVOYVIP, RITZRECONNECT"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className="flex-1 bg-white text-stone-900 uppercase px-3 py-2 rounded-lg border border-stone-300 focus:outline-none focus:border-[#8a1538]"
            />
            <button
              type="button"
              onClick={() => applyPromo(promoInput)}
              className="px-4 py-2 bg-[#8a1538] text-white font-semibold rounded-lg hover:bg-[#6e0f2b]"
            >
              Apply
            </button>
          </div>
          {promoFeedback && (
            <p className="mt-2 text-[11px] text-[#8a1538] font-semibold">{promoFeedback}</p>
          )}
        </div>
      )}
    </div>
  );
};
