import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { ImageWithFallback } from './ImageWithFallback';
import { MapPin, Compass, ArrowRight, CheckCircle2, Star, Sparkles, Building2 } from 'lucide-react';

interface VerifiedDestinationItem {
  id: string;
  name: string;
  city: string;
  country: string;
  region: 'Americas' | 'Europe' | 'Asia Pacific';
  description: string;
  image: string;
  propertyId: string;
  propertyName: string;
  brandName: string;
  startingPrice: number;
  guestRating: number;
  query: string;
}

// ONLY destinations with verified, active, bookable luxury hotels in our collection
const VERIFIED_AVAILABLE_DESTINATIONS: VerifiedDestinationItem[] = [
  {
    id: 'dest-kyoto',
    name: 'Kyoto',
    city: 'Kyoto',
    country: 'Japan',
    region: 'Asia Pacific',
    description: 'Tranquil Meiji-era gardens along the Kamogawa River, Michelin tempura, and Zen serenity.',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
    propertyId: 'ritz-carlton-kyoto',
    propertyName: 'The Ritz-Carlton, Kyoto',
    brandName: 'The Ritz-Carlton',
    startingPrice: 1350,
    guestRating: 4.98,
    query: 'Kyoto'
  },
  {
    id: 'dest-new-york',
    name: 'New York',
    city: 'New York',
    country: 'United States',
    region: 'Americas',
    description: 'Timeless Fifth Avenue Gilded Age glamour, the legendary King Cole Bar, and 24-hour butler care.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    propertyId: 'st-regis-new-york',
    propertyName: 'The St. Regis New York',
    brandName: 'The St. Regis',
    startingPrice: 1650,
    guestRating: 4.97,
    query: 'New York'
  },
  {
    id: 'dest-venice',
    name: 'Venice',
    city: 'Venice',
    country: 'Italy',
    region: 'Europe',
    description: 'A private island oasis on the Venetian Lagoon with centuries-old olive groves and rooftop infinity views.',
    image: 'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?auto=format&fit=crop&w=1200&q=80',
    propertyId: 'jw-marriott-venice',
    propertyName: 'JW Marriott Venice Resort & Spa',
    brandName: 'JW Marriott',
    startingPrice: 680,
    guestRating: 4.91,
    query: 'Venice'
  },
  {
    id: 'dest-bora-bora',
    name: 'Bora Bora',
    city: 'Bora Bora',
    country: 'French Polynesia',
    region: 'Asia Pacific',
    description: 'Iconic overwater villas, crystal turquoise lagoons, private coral reef, and views of Mount Otemanu.',
    image: 'https://images.unsplash.com/photo-1589979481223-deb893043163?auto=format&fit=crop&w=1200&q=80',
    propertyId: 'st-regis-borabora',
    propertyName: 'The St. Regis Bora Bora Resort',
    brandName: 'The St. Regis',
    startingPrice: 1950,
    guestRating: 4.99,
    query: 'Bora Bora'
  },
  {
    id: 'dest-london',
    name: 'London',
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    description: 'Historic Mayfair grandeur overlooking Hyde Park on London’s most prestigious Park Lane address.',
    image: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=1200&q=80',
    propertyId: 'jw-marriott-grosvenor-house',
    propertyName: 'JW Marriott Grosvenor House London',
    brandName: 'JW Marriott',
    startingPrice: 820,
    guestRating: 4.93,
    query: 'London'
  },
  {
    id: 'dest-tokyo',
    name: 'Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia Pacific',
    description: 'Soaring atop Tokyo Midtown in Roppongi, boasting panoramic views of Mount Fuji and Michelin dining.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    propertyId: 'ritz-carlton-tokyo',
    propertyName: 'The Ritz-Carlton, Tokyo',
    brandName: 'The Ritz-Carlton',
    startingPrice: 1100,
    guestRating: 4.94,
    query: 'Tokyo'
  },
  {
    id: 'dest-aspen',
    name: 'Aspen',
    city: 'Aspen',
    country: 'United States',
    region: 'Americas',
    description: 'Slope-side alpine sanctuary at the foot of Aspen Mountain with heated outdoor pool and Remède Spa.',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80',
    propertyId: 'st-regis-aspen',
    propertyName: 'The St. Regis Aspen Resort',
    brandName: 'The St. Regis',
    startingPrice: 1380,
    guestRating: 4.95,
    query: 'Aspen'
  },
  {
    id: 'dest-half-moon-bay',
    name: 'Half Moon Bay',
    city: 'Half Moon Bay',
    country: 'United States',
    region: 'Americas',
    description: 'Rugged Pacific cliffs, championship ocean links golf, and sunset fire pits with coastal bagpipers.',
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1200&q=80',
    propertyId: 'ritz-carlton-half-moon-bay',
    propertyName: 'The Ritz-Carlton, Half Moon Bay',
    brandName: 'The Ritz-Carlton',
    startingPrice: 950,
    guestRating: 4.92,
    query: 'Half Moon Bay'
  },
  {
    id: 'dest-marco-island',
    name: 'Marco Island',
    city: 'Marco Island',
    country: 'United States',
    region: 'Americas',
    description: 'Three miles of powdery white Gulf Coast sands, championship golf, and balmy relaxation.',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    propertyId: 'jw-marriott-marco-island',
    propertyName: 'JW Marriott Marco Island Beach Resort',
    brandName: 'JW Marriott',
    startingPrice: 620,
    guestRating: 4.88,
    query: 'Marco Island'
  }
];

export const DestinationsSection: React.FC = () => {
  const { goToSearchResults, goToPropertyDetails, goToDestinations } = useBooking();
  const [showAll, setShowAll] = useState(false);

  // Show 6 curated by default or all 9 upon expansion
  const displayedDestinations = showAll
    ? VERIFIED_AVAILABLE_DESTINATIONS
    : VERIFIED_AVAILABLE_DESTINATIONS.slice(0, 6);

  return (
    <section className="py-20 lg:py-24 bg-white text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#8a1538] font-bold mb-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Available Luxury Destinations</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-stone-900 leading-[1.2]">
              Explore Iconic Locations
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-2 font-light">
              Every featured destination has verified hotels available now for direct reservation with Marriott Bonvoy Member rates.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 self-start md:self-auto">
            <button
              onClick={() => goToSearchResults({ destination: '', selectedBrands: [] })}
              className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-stone-700 hover:text-[#8a1538] transition-colors"
            >
              <span>All Available Hotels ({VERIFIED_AVAILABLE_DESTINATIONS.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grid of Verified Destination Cards (All Have Available Hotels) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => goToSearchResults({ destination: dest.query })}
              className="group relative h-[420px] rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-between p-6 sm:p-7"
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-stone-100">
                <ImageWithFallback
                  src={dest.image}
                  alt={dest.name}
                  fallbackTitle={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
              </div>

              {/* Top Verified Available Pill */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-white border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Available Hotel</span>
                </span>

                <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-mono font-bold text-stone-900 shadow-xs">
                  <Star className="w-3 h-3 text-[#c5a059] fill-[#c5a059]" />
                  <span>{dest.guestRating.toFixed(2)}</span>
                </span>
              </div>

              {/* Bottom Destination Metadata */}
              <div className="relative z-10 text-white">
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-stone-200 font-semibold mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>{dest.country}</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1 group-hover:text-stone-100 transition-colors">
                  {dest.name}
                </h3>

                {/* Specific Available Property Callout */}
                <div className="mb-2">
                  <span className="text-xs text-[#eb6534] font-semibold">
                    {dest.propertyName}
                  </span>
                </div>

                <p className="text-stone-200 text-xs font-light leading-relaxed line-clamp-2 mb-4">
                  {dest.description}
                </p>

                <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-stone-300 uppercase tracking-wider block">From</span>
                    <span className="font-mono font-bold text-white text-sm">
                      ${dest.startingPrice.toLocaleString()}
                      <span className="text-[11px] font-normal text-stone-300"> / night</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-white group-hover:text-[#c5a059] transition-colors">
                    <span>Explore Hotel</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Toggle to see all 9 verified destinations */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-6 py-3 border border-stone-300 hover:border-stone-900 rounded-full text-xs font-bold uppercase tracking-wider text-stone-800 hover:bg-stone-900 hover:text-white transition-all shadow-xs cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-[#8a1538]" />
            <span>
              {showAll
                ? 'Show Top 6 Destinations'
                : `Show All ${VERIFIED_AVAILABLE_DESTINATIONS.length} Available Destinations`}
            </span>
          </button>
        </div>

      </div>
    </section>
  );
};
