import React, { useState } from 'react';
import { Property, RatePlan, RoomType } from '../types';
import { BRANDS } from '../data/brands';
import { useBooking } from '../context/BookingContext';
import { ImageWithFallback } from './ImageWithFallback';
import {
  Star,
  MapPin,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface HotelCardProps {
  property: Property;
}

export const HotelCard: React.FC<HotelCardProps> = ({ property }) => {
  const { nightsCount, goToPropertyDetails, startBookingFlow } = useBooking();
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);

  const brand = BRANDS.find(b => b.id === property.brandId);
  const currentRoom: RoomType = property.rooms[selectedRoomIdx] || property.rooms[0];
  const primaryRatePlan: RatePlan = currentRoom?.ratePlans[0];

  // Pricing calculations
  const nightlyRate = primaryRatePlan ? primaryRatePlan.pricePerNight : property.startingPrice;
  const staySubtotal = nightlyRate * nightsCount;
  const estimatedTaxes = Math.round(staySubtotal * 0.12);
  const estimatedResortFee = 50 * nightsCount;
  const totalStayPrice = staySubtotal + estimatedTaxes + estimatedResortFee;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row">
      
      {/* 1. Left: Image Gallery Preview (40% width on lg) */}
      <div className="relative lg:w-5/12 h-72 sm:h-80 lg:h-auto min-h-[300px] overflow-hidden bg-stone-100 group">
        <ImageWithFallback
          src={property.images[currentImgIdx] || property.heroImage}
          alt={property.name}
          fallbackTitle={property.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />

        {/* Brand Tag Overlay */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[10px] uppercase tracking-wider font-bold bg-white/95 text-stone-900 px-3 py-1.5 rounded-full border border-stone-200/80 shadow-xs">
            {brand?.name || 'Marriott Bonvoy Luxury'}
          </span>
        </div>

        {/* Star Rating Badge */}
        <div className="absolute top-4 right-4 z-10 bg-white/95 text-stone-900 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-stone-200/80 font-mono shadow-xs">
          <Star className="w-3.5 h-3.5 text-[#c5a059] fill-[#c5a059]" />
          <span className="font-bold">{property.guestRating.toFixed(2)}</span>
          <span className="text-[10px] text-stone-500">({property.reviewCount})</span>
        </div>

        {/* Gallery Carousel Controls */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous Image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next Image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {property.images.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImgIdx(dotIdx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    dotIdx === currentImgIdx ? 'w-4 bg-white shadow' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 2. Middle & Right: Details & Pricing (60% width on lg) */}
      <div className="lg:w-7/12 p-6 sm:p-7 flex flex-col justify-between">
        
        <div>
          {/* Location & Name */}
          <div className="flex items-center gap-1 text-xs text-stone-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#8a1538] shrink-0" />
            <span>{property.city}, {property.country}</span>
            <span aria-hidden="true" className="mx-1">·</span>
            <span className="capitalize">{property.setting}</span>
          </div>

          <h3
            onClick={() => goToPropertyDetails(property.id)}
            className="font-serif text-2xl text-stone-900 font-bold hover:text-[#8a1538] cursor-pointer transition-colors mb-2"
          >
            {property.name}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4 font-normal">
            {property.tagline}
          </p>

          {/* Key Amenities */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-600 mb-5 pb-4 border-b border-stone-100">
            {property.amenities.slice(0, 4).map((amenity, aIdx) => (
              <span key={aIdx} className="flex items-center gap-1.5">
                <Check className="w-3 h-3 text-[#8a1538]" />
                <span>{amenity}</span>
              </span>
            ))}
          </div>

          {/* Room Type Selector Quick Switcher */}
          {property.rooms.length > 1 && (
            <div className="mb-4">
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block mb-1.5">
                Available Accommodations ({property.rooms.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {property.rooms.map((room, rIdx) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomIdx(rIdx)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors text-left ${
                      selectedRoomIdx === rIdx
                        ? 'bg-[#8a1538] text-white font-semibold'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>{room.name}</span>
                    <span className="text-[11px] ml-1.5 opacity-80">(${room.basePrice})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected Room Details */}
          <div className="bg-[#faf9f6] p-3.5 rounded-xl border border-stone-200/80 mb-4 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-stone-900">{currentRoom.name}</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                {primaryRatePlan?.includesBreakfast ? 'Breakfast Included' : 'Room Only'}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-normal mb-2">
              {currentRoom.sizeSqFt} sq ft · {currentRoom.bedConfiguration} · Max {currentRoom.maxAdults} Adults · {currentRoom.view}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-stone-600">
              <span className="text-emerald-700 font-semibold">Free cancellation</span>
              <span>up to 48 hours prior to arrival</span>
            </div>
          </div>
        </div>

        {/* Pricing Breakdown & Action Row */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider">From</span>
              <span className="font-serif text-2xl font-bold text-stone-900">
                ${nightlyRate.toLocaleString()}
              </span>
              <span className="text-xs text-stone-500 font-normal">/ night</span>
            </div>

            <p className="text-xs text-stone-600 mt-0.5">
              <span className="font-semibold text-stone-900">${totalStayPrice.toLocaleString()} total</span> for {nightsCount} {nightsCount === 1 ? 'night' : 'nights'}
              <span className="text-[10px] text-stone-500 block sm:inline sm:ml-1">
                (incl. ${estimatedTaxes} tax & ${estimatedResortFee} resort fee)
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPropertyDetails(property.id)}
              className="px-4 py-2.5 text-xs uppercase tracking-wider font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
            >
              View Details
            </button>

            <button
              onClick={() => {
                if (currentRoom && primaryRatePlan) {
                  startBookingFlow(property.id, currentRoom.id, primaryRatePlan.id);
                } else {
                  goToPropertyDetails(property.id);
                }
              }}
              className="px-5 py-2.5 text-xs uppercase tracking-wider font-bold text-white bg-[#8a1538] hover:bg-[#6e0f2b] active:scale-[0.98] rounded-lg transition-all whitespace-nowrap shadow-xs flex items-center gap-1.5"
            >
              <span>Select Room</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
