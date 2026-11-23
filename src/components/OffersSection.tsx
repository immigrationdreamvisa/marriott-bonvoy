import React from 'react';
import { OFFERS } from '../data/offers';
import { ImageWithFallback } from './ImageWithFallback';
import { Tag, Check, Sparkles, Info, Calendar } from 'lucide-react';

export const OffersSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-24 bg-white text-stone-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#8a1538] font-bold mb-2.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Special Experiences</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-stone-900 leading-[1.2]">
              Exclusive Packages & Member Offers
            </h2>
          </div>
          <p className="text-stone-600 text-sm sm:text-base font-light max-w-md leading-relaxed">
            Elevate your stay with daily dining credits, private sommelier tastings, and bonus Marriott Bonvoy points.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {OFFERS.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col"
            >
              {/* Card Image Banner */}
              <div className="relative h-72 overflow-hidden bg-stone-100">
                <ImageWithFallback
                  src={offer.image}
                  alt={offer.title}
                  fallbackTitle={offer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />
                
                {/* Top Promo Badge */}
                <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-[11px] font-mono font-bold text-[#8a1538] shadow-xs">
                  PROMO: {offer.code}
                </div>

                {/* Top Value Pill */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                  <Sparkles className="w-3 h-3 text-[#c5a059]" />
                  <span>
                    {offer.creditAmount
                      ? `$${offer.creditAmount} Credit Included`
                      : `${offer.discountPercentage}% Stay Savings`}
                  </span>
                </div>

                {/* Subtitle & Title */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase tracking-wider text-stone-200 font-semibold block mb-1">
                    {offer.subtitle}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white drop-shadow-sm leading-snug">
                    {offer.title}
                  </h3>
                </div>
              </div>

              {/* Card Body - Informational / Reading Purpose */}
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between gap-5">
                <div className="space-y-5">
                  {/* Description */}
                  <p className="text-stone-600 text-xs sm:text-sm font-normal leading-relaxed">
                    {offer.description}
                  </p>

                  {/* Inclusions */}
                  <div className="space-y-2.5 pt-4 border-t border-stone-100">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block mb-1">
                      Offer Inclusions:
                    </span>
                    {offer.inclusions.map((inc, iIdx) => (
                      <div key={iIdx} className="flex items-center gap-2 text-xs text-stone-800 font-medium">
                        <Check className="w-3.5 h-3.5 text-[#8a1538] shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Terms & Conditions Notice Box */}
                  {offer.terms && (
                    <div className="p-3 bg-stone-50/90 rounded-xl border border-stone-200/60 flex items-start gap-2 text-[11px] text-stone-500 leading-relaxed">
                      <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>{offer.terms}</span>
                    </div>
                  )}
                </div>

                {/* Footer Bar - Read-Only Informational Metadata */}
                <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>Valid through {offer.validUntil}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 bg-stone-100/90 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200/80 text-xs select-text">
                    <span className="text-[11px] text-stone-500 font-medium">Promo Code:</span>
                    <span className="font-mono font-bold text-[#8a1538]">{offer.code}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
