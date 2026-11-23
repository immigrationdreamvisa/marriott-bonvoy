import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { PROPERTIES } from '../data/properties';
import { DateRangeCalendar } from './DateRangeCalendar';
import {
  MapPin,
  Calendar,
  Search,
  Sparkles,
  Heart,
  Tag,
  Waves,
  BedDouble,
  Landmark,
  X,
  ChevronDown,
  Building2,
  Compass,
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

export const Hero: React.FC = () => {
  const {
    searchParams,
    updateSearchParams,
    goToSearchResults,
    goToOffers,
    goToVacations,
    goToDestinations,
    nightsCount
  } = useBooking();

  // Popover state
  const [activePopover, setActivePopover] = useState<'destination' | 'dates' | null>(null);
  const [destQuery, setDestQuery] = useState(searchParams.destination);
  const destInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Active Category Pill state
  const [activeCategory, setActiveCategory] = useState<'explore' | 'exclusives' | 'water' | 'longer' | 'unique'>('explore');

  // Destination popover tab & geolocation state
  const [destTab, setDestTab] = useState<'options' | 'recent' | 'all'>('options');
  const [isLocating, setIsLocating] = useState(false);
  const [recentDestinations, setRecentDestinations] = useState<RecentItem[]>(() => {
    try {
      const saved = localStorage.getItem('marriott_recent_destinations');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_RECENTS;
  });

  useEffect(() => {
    setDestQuery(searchParams.destination);
  }, [searchParams.destination]);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format date display matching screenshot (e.g., "Mon, Nov 23 - Tue, Nov 24")
  const formatHeroDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Build verified destinations list
  const verifiedDestinations = useMemo(() => {
    const list: { label: string; sub: string; value: string; type: 'all' | 'city' | 'property' }[] = [
      {
        label: 'All Destinations',
        sub: 'Explore all luxury properties worldwide in our portfolio',
        value: '',
        type: 'all'
      }
    ];

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
        label: city,
        sub: count > 1 ? `${count} properties including ${sampleHotel}` : sampleHotel,
        value: city,
        type: 'city'
      });
    });

    PROPERTIES.forEach(prop => {
      list.push({
        label: prop.name,
        sub: `${prop.city}, ${prop.country}`,
        value: prop.name,
        type: 'property'
      });
    });

    return list;
  }, []);

  const filteredDestinations = useMemo(() => {
    if (!destQuery.trim()) return verifiedDestinations;
    const q = destQuery.toLowerCase().trim();
    return verifiedDestinations.filter(
      d => d.label.toLowerCase().includes(q) || d.sub.toLowerCase().includes(q) || d.value.toLowerCase().includes(q)
    );
  }, [destQuery, verifiedDestinations]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActivePopover(null);
    goToSearchResults();
  };

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

  const handleCategoryClick = (category: 'explore' | 'exclusives' | 'water' | 'longer' | 'unique') => {
    setActiveCategory(category);
    if (category === 'explore') {
      goToDestinations();
    } else if (category === 'exclusives') {
      goToOffers();
    } else if (category === 'water') {
      goToSearchResults({ destination: 'Resorts' });
    } else if (category === 'longer') {
      goToVacations('Homes & Villas');
    } else if (category === 'unique') {
      goToVacations('Yacht Collection');
    }
  };

  return (
    <div className="relative min-h-[780px] sm:min-h-[840px] lg:min-h-[880px] flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24 text-stone-900">

      {/* ─── SCENIC BACKGROUND (Clifton Suspension Bridge over Avon Gorge with Twilight & Balloons) ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1531732887023-04b700a93e6e?auto=format&fit=crop&w=2400&q=85"
          alt="Clifton Suspension Bridge over River Gorge"
          className="w-full h-full object-cover object-center scale-102 transition-transform duration-1000"
        />
        {/* Cinematic dark dusk overlay matching the official Marriott Bonvoy screenshot */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/50 via-stone-900/30 to-stone-950/60" />
      </div>

      {/* ─── BOTTOM SOFT WHITE MIST TRANSITION FADE ─── */}
      <div className="absolute bottom-0 inset-x-0 h-28 sm:h-36 bg-gradient-to-t from-[#faf9f6] via-[#faf9f6]/40 to-transparent pointer-events-none z-10" />

      {/* ─── HERO CONTENT CONTAINER ─── */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center">
        
        {/* 1. Main Headline Exactly Matching Screenshot */}
        <h1 className="font-sans font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight text-center drop-shadow-md mb-8 sm:mb-10 max-w-4xl">
          Your Next Trip Starts Here
        </h1>

        {/* 2. Primary Search Card Exactly Matching Screenshot */}
        <div
          ref={cardRef}
          className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-100 text-stone-900 relative transition-all"
        >
          {/* Upper Section: Destination | Dates | Find Hotels Button */}
          <div className="p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-4">
            
            {/* Column 1: Destination */}
            <div className="flex-1 relative">
              <div
                onClick={() => {
                  setActivePopover('destination');
                  setTimeout(() => destInputRef.current?.focus(), 50);
                }}
                className={`w-full min-h-[58px] px-4 py-2.5 rounded-2xl hover:bg-stone-50/80 cursor-pointer flex items-center justify-between transition-colors ${
                  activePopover === 'destination' ? 'bg-stone-50 ring-2 ring-[#1c1917]' : ''
                }`}
              >
                <div className="flex items-start gap-3 overflow-hidden text-left">
                  <MapPin className="w-4 h-4 text-[#eb6534] mt-1 shrink-0" />
                  <div className="truncate">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      DESTINATION
                    </span>
                    <span className="block text-base sm:text-lg font-medium text-stone-900 truncate">
                      {searchParams.destination || 'Where can we take you?'}
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

              {/* Destination Dropdown Popover */}
              {activePopover === 'destination' && (
                <div className="absolute left-0 top-full mt-2 w-full sm:w-[480px] bg-white border border-stone-200 rounded-3xl shadow-2xl p-4 z-[100] animate-in fade-in zoom-in-95 text-left">
                  
                  {/* Search Input Bar */}
                  <div className="relative mb-3.5">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      ref={destInputRef}
                      type="text"
                      placeholder="Search city, region, or luxury hotel..."
                      value={destQuery}
                      onChange={(e) => {
                        setDestQuery(e.target.value);
                        if (e.target.value.trim()) {
                          setDestTab('all');
                        }
                      }}
                      className="w-full bg-stone-50 text-stone-900 text-xs pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#1c1917]"
                    />
                  </div>

                  {/* ─── 2 PRIMARY OPTIONS: LIVE LOCATION & RECENTLY VIEWED ─── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3.5 pb-3.5 border-b border-stone-100">
                    
                    {/* Option 1: Live Location */}
                    <button
                      type="button"
                      onClick={handleUseLiveLocation}
                      className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-stone-50/80 hover:bg-[#eb6534]/10 border border-stone-200/80 hover:border-[#eb6534]/30 text-left transition-all group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#eb6534]/15 text-[#eb6534] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                      </div>
                      <div className="truncate flex-1">
                        <span className="block font-bold text-stone-900 group-hover:text-[#eb6534] text-xs transition-colors">
                          Live Location
                        </span>
                        <span className="block text-[10px] text-stone-500 truncate">
                          {isLocating ? 'Detecting GPS...' : 'Hotels near you'}
                        </span>
                      </div>
                    </button>

                    {/* Option 2: Recently Viewed */}
                    <button
                      type="button"
                      onClick={() => setDestTab('recent')}
                      className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all group cursor-pointer ${
                        destTab === 'recent' && !destQuery.trim()
                          ? 'bg-[#1c1917] text-white border-[#1c1917] shadow-xs'
                          : 'bg-stone-50/80 hover:bg-stone-100 border-stone-200/80 text-stone-900'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                        destTab === 'recent' && !destQuery.trim() ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700 group-hover:scale-105'
                      }`}>
                        <History className="w-4 h-4" />
                      </div>
                      <div className="truncate flex-1">
                        <span className={`block font-bold text-xs ${destTab === 'recent' && !destQuery.trim() ? 'text-white' : 'text-stone-900'}`}>
                          Recently Viewed
                        </span>
                        <span className={`block text-[10px] truncate ${destTab === 'recent' && !destQuery.trim() ? 'text-stone-300' : 'text-stone-500'}`}>
                          {recentDestinations.length} recent stays
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
                          Clear history
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setDestTab('recent');
                          setDestQuery('');
                        }}
                        className="text-[#eb6534] normal-case"
                      >
                        Show recents
                      </button>
                    )}
                  </div>

                  {/* Scrollable Items List */}
                  <div className="max-h-60 overflow-y-auto space-y-1 text-xs pr-1">
                    {/* Render Recently Viewed if destTab === 'recent' and no search query */}
                    {destTab === 'recent' && !destQuery.trim() ? (
                      recentDestinations.length > 0 ? (
                        recentDestinations.map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => handleSelectDestination(r.value, r.name, r.sub)}
                            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center gap-3 truncate mr-2">
                              <Clock className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#eb6534] shrink-0" />
                              <div className="truncate">
                                <p className="font-semibold text-stone-900 group-hover:text-[#eb6534] transition-colors truncate">
                                  {r.name}
                                </p>
                                <p className="text-[11px] text-stone-500 truncate">{r.sub}</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-stone-400 font-medium whitespace-nowrap shrink-0">
                              {r.time}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-stone-500">
                          <p>No recently viewed destinations yet.</p>
                          <button
                            type="button"
                            onClick={() => setDestTab('all')}
                            className="mt-2 text-xs font-semibold text-[#eb6534] hover:underline"
                          >
                            Browse all destinations →
                          </button>
                        </div>
                      )
                    ) : (
                      /* Render Filtered Verified Destinations */
                      filteredDestinations.map((d, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectDestination(d.value, d.label, d.sub)}
                          className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors flex items-start gap-2.5 group cursor-pointer"
                        >
                          {d.type === 'property' ? (
                            <Building2 className="w-3.5 h-3.5 text-[#eb6534] mt-0.5 shrink-0" />
                          ) : d.type === 'all' ? (
                            <Sparkles className="w-3.5 h-3.5 text-[#eb6534] mt-0.5 shrink-0" />
                          ) : (
                            <MapPin className="w-3.5 h-3.5 text-[#eb6534] mt-0.5 shrink-0" />
                          )}
                          <div className="flex-1 truncate">
                            <p className="font-semibold text-stone-900 group-hover:text-[#eb6534] transition-colors truncate">
                              {d.label}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate">{d.sub}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-px h-10 bg-stone-200 shrink-0" />

            {/* Column 2: Dates & Nights */}
            <div className="flex-1 relative">
              <div
                onClick={() => setActivePopover(activePopover === 'dates' ? null : 'dates')}
                className={`w-full min-h-[58px] px-4 py-2.5 rounded-2xl hover:bg-stone-50/80 cursor-pointer flex items-center justify-between transition-colors ${
                  activePopover === 'dates' ? 'bg-stone-50 ring-2 ring-[#1c1917]' : ''
                }`}
              >
                <div className="flex items-start gap-3 overflow-hidden text-left">
                  <Calendar className="w-4 h-4 text-[#eb6534] mt-1 shrink-0" />
                  <div className="truncate">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      {nightsCount} NIGHT{nightsCount > 1 ? 'S' : ''}
                    </span>
                    <span className="block text-base sm:text-lg font-medium text-stone-900 truncate">
                      {formatHeroDate(searchParams.checkIn)} - {formatHeroDate(searchParams.checkOut)}
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${activePopover === 'dates' ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Column 3: Find Hotels Button (Pill Button Matching Screenshot) */}
            <div className="shrink-0 p-1">
              <button
                type="button"
                onClick={() => handleSearchSubmit()}
                className="w-full md:w-auto bg-[#1c1917] hover:bg-black active:scale-[0.98] text-white font-semibold text-sm sm:text-base px-8 sm:px-9 py-3.5 sm:py-4 rounded-full flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                <Search className="w-4 h-4 text-white stroke-[2.5]" />
                <span>Find Hotels</span>
              </button>
            </div>

          </div>

          {/* DateRangeCalendar Popover Anchored to Card */}
          {activePopover === 'dates' && (
            <div className="absolute right-0 top-full mt-2 sm:mt-3 z-[100] w-full sm:w-auto flex justify-end">
              <DateRangeCalendar
                checkIn={searchParams.checkIn}
                checkOut={searchParams.checkOut}
                onChange={(checkIn, checkOut) => {
                  updateSearchParams({ checkIn, checkOut });
                  setActivePopover(null);
                }}
                onClose={() => setActivePopover(null)}
              />
            </div>
          )}

        </div>

        {/* 3. Bottom Category Pills Bar Exactly Matching Screenshot */}
        <div className="mt-8 sm:mt-10 inline-flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-white/10 text-xs sm:text-sm text-white shadow-xl max-w-full overflow-x-auto scrollbar-none">
          
          {/* Pill 1: Explore (Active White Pill) */}
          <button
            onClick={() => handleCategoryClick('explore')}
            className={`rounded-full px-5 py-2 font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeCategory === 'explore'
                ? 'bg-white text-stone-950 shadow-sm'
                : 'text-stone-200 hover:text-white hover:bg-white/10 font-medium'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${activeCategory === 'explore' ? 'text-[#eb6534] fill-[#eb6534]' : 'text-stone-300'}`} />
            <span>Explore</span>
          </button>

          {/* Pill 2: Member Exclusives */}
          <button
            onClick={() => handleCategoryClick('exclusives')}
            className={`rounded-full px-4 sm:px-5 py-2 flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeCategory === 'exclusives'
                ? 'bg-white text-stone-950 font-bold shadow-sm'
                : 'text-stone-200 hover:text-white hover:bg-white/10 font-medium'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-stone-300" />
            <span>Member Exclusives</span>
          </button>

          {/* Pill 3: By the Water */}
          <button
            onClick={() => handleCategoryClick('water')}
            className={`rounded-full px-4 sm:px-5 py-2 flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeCategory === 'water'
                ? 'bg-white text-stone-950 font-bold shadow-sm'
                : 'text-stone-200 hover:text-white hover:bg-white/10 font-medium'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-stone-300" />
            <span>By the Water</span>
          </button>

          {/* Pill 4: Stay Longer */}
          <button
            onClick={() => handleCategoryClick('longer')}
            className={`rounded-full px-4 sm:px-5 py-2 flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeCategory === 'longer'
                ? 'bg-white text-stone-950 font-bold shadow-sm'
                : 'text-stone-200 hover:text-white hover:bg-white/10 font-medium'
            }`}
          >
            <BedDouble className="w-3.5 h-3.5 text-stone-300" />
            <span>Stay Longer</span>
          </button>

          {/* Pill 5: Unique Ways to Stay */}
          <button
            onClick={() => handleCategoryClick('unique')}
            className={`rounded-full px-4 sm:px-5 py-2 flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeCategory === 'unique'
                ? 'bg-white text-stone-950 font-bold shadow-sm'
                : 'text-stone-200 hover:text-white hover:bg-white/10 font-medium'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-stone-300" />
            <span>Unique Ways to Stay</span>
          </button>

        </div>

      </div>

    </div>
  );
};
