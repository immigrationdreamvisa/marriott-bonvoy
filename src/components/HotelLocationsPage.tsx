import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { PROPERTIES } from '../data/properties';
import { BRANDS } from '../data/brands';
import { ImageWithFallback } from './ImageWithFallback';
import {
  MapPin,
  Star,
  Phone,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Building,
  Sparkles,
  ArrowRight,
  X,
  Compass,
  Check,
  Award,
  Calendar,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  Wifi,
  Waves,
  Utensils,
  Dumbbell
} from 'lucide-react';

export const HotelLocationsPage: React.FC = () => {
  const { goToPropertyDetails, startBookingFlow, goToSearchResults } = useBooking();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [selectedAmenity, setSelectedAmenity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');

  // Quick View Modal
  const [quickViewProperty, setQuickViewProperty] = useState<any>(null);

  const regions = [
    { label: 'All Global Regions', value: 'all' },
    { label: 'North America', value: 'North America' },
    { label: 'Europe', value: 'Europe' },
    { label: 'Asia Pacific', value: 'Asia Pacific' }
  ];

  const categoryTabs = [
    { id: 'all', label: 'All Portfolio' },
    { id: 'luxury', label: 'Classic Luxury' },
    { id: 'beach', label: 'Oceanfront & Coastal' },
    { id: 'city', label: 'Iconic Capitals' },
    { id: 'spa-golf', label: 'Golf & Wellness' }
  ];

  const amenitiesFilterList = [
    { id: 'all', label: 'All Amenities' },
    { id: 'Spa', label: 'Luxury Spa' },
    { id: 'Pool', label: 'Pool & Cabanas' },
    { id: 'Golf', label: 'Golf Access' },
    { id: 'Dining', label: 'Fine Dining' },
    { id: 'Ocean', label: 'Ocean View' },
    { id: 'Fitness', label: '24/7 Fitness' }
  ];

  const getRegionForCountry = (country: string): string => {
    if (['United States', 'USA'].includes(country)) return 'North America';
    if (['United Kingdom', 'France', 'Italy', 'Spain'].includes(country)) return 'Europe';
    if (['Japan', 'French Polynesia'].includes(country)) return 'Asia Pacific';
    return 'North America';
  };

  const filteredHotels = PROPERTIES.filter(property => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand = selectedBrand === 'all' || property.brandId === selectedBrand;
    const region = getRegionForCountry(property.country);
    const matchesRegion = selectedRegion === 'all' || region === selectedRegion;

    // Category Tabs Filter
    let matchesCategory = true;
    if (selectedCategoryTab === 'luxury') {
      matchesCategory = ['the-ritz-carlton', 'st-regis', 'jw-marriott'].includes(property.brandId);
    } else if (selectedCategoryTab === 'beach') {
      matchesCategory =
        property.amenities.some(a => ['Beach', 'Ocean', 'Water'].some(kw => a.toLowerCase().includes(kw.toLowerCase()))) ||
        property.name.toLowerCase().includes('bay') ||
        property.name.toLowerCase().includes('island') ||
        property.city.toLowerCase().includes('beach');
    } else if (selectedCategoryTab === 'city') {
      matchesCategory = ['Tokyo', 'New York', 'Paris', 'London'].includes(property.city);
    } else if (selectedCategoryTab === 'spa-golf') {
      matchesCategory = property.amenities.some(a => ['Spa', 'Golf', 'Wellness'].some(kw => a.includes(kw)));
    }

    // Amenity Filter
    let matchesAmenity = true;
    if (selectedAmenity !== 'all') {
      matchesAmenity = property.amenities.some(a => a.toLowerCase().includes(selectedAmenity.toLowerCase()));
    }

    return matchesSearch && matchesBrand && matchesRegion && matchesCategory && matchesAmenity;
  });

  // Sorting
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    if (sortBy === 'price-asc') return a.startingPrice - b.startingPrice;
    if (sortBy === 'price-desc') return b.startingPrice - a.startingPrice;
    if (sortBy === 'rating') return b.guestRating - a.guestRating;
    return 0; // recommended
  });

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85"
            alt="Hotel Locations Directory"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-amber-400 mb-2 block">
            Global Hotel & Resort Directory
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight mb-4">
            All Hotel Locations & Destinations
          </h1>
          <p className="max-w-3xl mx-auto text-stone-300 text-xs sm:text-base font-light leading-relaxed mb-6">
            Browse our complete portfolio of verified luxury hotels, resorts, and suites across premier global capitals, coastal retreats, and alpine sanctuaries. Best Rate Guaranteed on all official bookings.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
              8,900+ Hotels Globally
            </span>
            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
              Instant Room Availability & Rates
            </span>
            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
              Complimentary Wi-Fi for Members
            </span>
          </div>
        </div>
      </div>

      {/* Main Directory Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Quick City Filters */}
        <div className="mb-6">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
            Popular City Searches:
          </span>
          <div className="flex flex-wrap gap-2">
            {['Kyoto', 'Half Moon Bay', 'Tokyo', 'Orlando', 'Paris', 'New York', 'Venice'].map(city => (
              <button
                key={city}
                onClick={() => setSearchQuery(city)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  searchQuery.toLowerCase() === city.toLowerCase()
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {city}
              </button>
            ))}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-1.5 rounded-full text-xs text-[#8a1538] font-bold hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none border-b border-stone-200">
          {categoryTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategoryTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold whitespace-nowrap rounded-lg transition-colors ${
                selectedCategoryTab === tab.id
                  ? 'bg-[#8a1538] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-xs mb-10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search hotel name, city, or country..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8a1538]"
              />
            </div>

            {/* Brand Filter */}
            <div>
              <select
                value={selectedBrand}
                onChange={e => setSelectedBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8a1538]"
              >
                <option value="all">All Brands Portfolio</option>
                {BRANDS.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <select
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8a1538]"
              >
                {regions.map(r => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#8a1538]"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="price-asc">Sort: Price Low to High</option>
                <option value="price-desc">Sort: Price High to Low</option>
                <option value="rating">Sort: Guest Rating</option>
              </select>
            </div>

          </div>

          {/* Amenities Row */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-stone-100">
            <span className="text-[11px] font-semibold text-stone-500 whitespace-nowrap">Filter Amenity:</span>
            {amenitiesFilterList.map(am => (
              <button
                key={am.id}
                onClick={() => setSelectedAmenity(am.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                  selectedAmenity === am.id
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {am.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
            <span>
              Showing <strong className="text-stone-900">{sortedHotels.length}</strong> verified Marriott properties
            </span>
            {(searchQuery || selectedBrand !== 'all' || selectedRegion !== 'all' || selectedCategoryTab !== 'all' || selectedAmenity !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBrand('all');
                  setSelectedRegion('all');
                  setSelectedCategoryTab('all');
                  setSelectedAmenity('all');
                  setSortBy('recommended');
                }}
                className="text-[#8a1538] font-semibold hover:underline"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedHotels.map(property => {
            const brand = BRANDS.find(b => b.id === property.brandId);
            const firstRoom = property.rooms[0];
            const firstRate = firstRoom?.ratePlans[0];

            return (
              <div
                key={property.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image */}
                <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                  <ImageWithFallback
                    src={property.heroImage || property.images[0]}
                    alt={property.name}
                    fallbackTitle={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20">
                      {brand?.name || 'Marriott'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-full text-xs font-bold text-stone-900 shadow-xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{property.guestRating.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => setQuickViewProperty(property)}
                    className="absolute bottom-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg text-xs backdrop-blur-xs flex items-center gap-1 shadow-sm opacity-90 hover:opacity-100"
                    title="Quick Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-stone-500 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#8a1538] shrink-0" />
                      <span>{property.city}, {property.country}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-stone-900 mb-2 group-hover:text-[#8a1538] transition-colors leading-snug">
                      {property.name}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed">
                      {property.description}
                    </p>

                    {/* Amenities Badges */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {property.amenities.slice(0, 3).map((am, i) => (
                        <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                          {am}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="text-[10px] bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded-md">
                          +{property.amenities.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-stone-500 space-y-1 mb-4 pb-4 border-b border-stone-100">
                      <p className="truncate"><strong>Address:</strong> {property.address}</p>
                      <p><strong>Direct:</strong> {property.phone}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-bold">From</span>
                        <span className="text-xl font-bold font-serif text-stone-900">
                          ${property.startingPrice}
                          <span className="text-xs font-normal text-stone-500 font-sans"> /night</span>
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        Best Rate Guaranteed
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => goToPropertyDetails(property.id)}
                        className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors text-center"
                      >
                        Hotel Details
                      </button>
                      <button
                        onClick={() => {
                          if (firstRoom && firstRate) {
                            startBookingFlow(property.id, firstRoom.id, firstRate.id);
                          } else {
                            goToPropertyDetails(property.id);
                          }
                        }}
                        className="w-full py-2 bg-[#8a1538] hover:bg-[#6b102c] text-white text-xs font-semibold rounded-xl transition-colors text-center shadow-xs"
                      >
                        Book Stay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Quick View Modal */}
      {quickViewProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setQuickViewProperty(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] text-[#8a1538] uppercase font-bold tracking-wider block mb-1">
              Property Quick Overview
            </span>
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-1">
              {quickViewProperty.name}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              {quickViewProperty.address} · {quickViewProperty.phone}
            </p>

            <div className="aspect-16/9 rounded-xl overflow-hidden mb-4 bg-stone-100">
              <img
                src={quickViewProperty.heroImage || quickViewProperty.images[0]}
                alt={quickViewProperty.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
              {quickViewProperty.description}
            </p>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 mb-6">
              <h4 className="font-semibold text-xs text-stone-900 mb-2">Featured Amenities & Services:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-stone-600">
                {quickViewProperty.amenities.map((am: string, i: number) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{am}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Rates From</span>
                <span className="font-serif text-2xl font-bold text-stone-900">${quickViewProperty.startingPrice} <span className="text-xs text-stone-500 font-sans font-normal">/night</span></span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const id = quickViewProperty.id;
                    setQuickViewProperty(null);
                    goToPropertyDetails(id);
                  }}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl"
                >
                  Full Property Details
                </button>
                <button
                  onClick={() => {
                    const p = quickViewProperty;
                    const r = p.rooms[0];
                    const rate = r?.ratePlans[0];
                    setQuickViewProperty(null);
                    if (r && rate) {
                      startBookingFlow(p.id, r.id, rate.id);
                    } else {
                      goToPropertyDetails(p.id);
                    }
                  }}
                  className="px-5 py-2.5 bg-[#8a1538] hover:bg-[#6b102c] text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  Select Room & Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
