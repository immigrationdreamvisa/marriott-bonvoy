import React, { useState, useRef, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { MarriottLogo } from './MarriottLogo';
import { HelpModal } from './HelpModal';
import { LanguageModal } from './LanguageModal';
import { BRANDS } from '../data/brands';
import {
  Menu,
  X,
  User as UserIcon,
  Calendar,
  ChevronDown,
  ShieldCheck,
  Compass,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Globe,
  Briefcase
} from 'lucide-react';
import { BrandId } from '../types';

export const Header: React.FC = () => {
  const {
    currentView,
    goToHome,
    goToBrands,
    goToSearchResults,
    goToBrandDetail,
    goToMyBookings,
    goToDestinations,
    goToVacations,
    goToMeetings,
    goToMembership,
    goToOffers,
    goToHotelLocations,
    goToGolf,
    goToResidences,
    goToDineDrink,
    goToOutdoors,
    goToInsurance,
    goToBusinessProgram,
    goToCreditCards,
    goToTravelTips,
    setIsAuthModalOpen,
    setAuthModalTab,
    openBrandsModal,
    isBrandsModalOpen
  } = useBooking();

  const { user, isAuthenticated, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [brandsDropdownOpen, setBrandsDropdownOpen] = useState(false);
  const [bookMenuOpen, setBookMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);

  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const bookButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        bookMenuOpen &&
        megaMenuRef.current &&
        !megaMenuRef.current.contains(target) &&
        bookButtonRef.current &&
        !bookButtonRef.current.contains(target)
      ) {
        setBookMenuOpen(false);
      }
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(target)) {
        setBrandsDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [bookMenuOpen]);

  // Safety check: ensure no legacy Elena user is retained
  useEffect(() => {
    if (user?.firstName?.toLowerCase().includes('elena') || user?.email?.toLowerCase().includes('elena')) {
      signOut();
    }
  }, [user, signOut]);

  const handleBrandSelect = (brandId: BrandId) => {
    setBrandsDropdownOpen(false);
    goToBrandDetail(brandId);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#1c1917] border-b border-stone-800 text-stone-100 transition-all shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">

          {/* Left: Official Marriott Bonvoy Logo */}
          <div className="flex items-center shrink-0 z-10">
            <button
              onClick={() => {
                setBookMenuOpen(false);
                goToHome();
              }}
              className="flex items-center gap-2 group focus:outline-none whitespace-nowrap hover:opacity-90 transition-opacity"
              aria-label="Marriott Bonvoy Home"
            >
              <MarriottLogo size="md" variant="light" />
            </button>
          </div>

          {/* Center: Main Navigation Links: Book | Offers | Brands */}
          <nav className="hidden lg:flex items-center justify-center gap-8 xl:gap-9 text-xs font-semibold text-stone-200 absolute left-1/2 -translate-x-1/2">

            {/* 1. Book (with Mega Menu toggle) */}
            <button
              ref={bookButtonRef}
              onClick={() => {
                setBrandsDropdownOpen(false);
                setBookMenuOpen(!bookMenuOpen);
              }}
              className={`relative py-2.5 transition-colors whitespace-nowrap hover:text-white ${bookMenuOpen || currentView === 'home' || currentView === 'search-results' || currentView === 'hotel-locations' || currentView === 'golf'
                ? 'text-white font-bold'
                : 'text-stone-300'
                }`}
            >
              <span>Book</span>
              {(bookMenuOpen || currentView === 'home') && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#eb6534]" />
              )}
            </button>

            {/* 2. Offers */}
            <button
              onClick={() => {
                setBookMenuOpen(false);
                goToOffers();
              }}
              className={`relative py-2.5 transition-colors whitespace-nowrap hover:text-white ${currentView === 'offers' ? 'text-white font-bold' : 'text-stone-300'
                }`}
            >
              <span>Offers</span>
              {currentView === 'offers' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#eb6534]" />
              )}
            </button>

            {/* 3. Brands (Navigates to Dedicated Brands Section) */}
            <button
              type="button"
              onClick={() => {
                setBookMenuOpen(false);
                goToBrands();
              }}
              className={`relative py-2.5 transition-colors whitespace-nowrap hover:text-white cursor-pointer ${currentView === 'brands' || currentView === 'brand-detail' ? 'text-white font-bold' : 'text-stone-300'
                }`}
            >
              <span>Brands</span>
              {(currentView === 'brands' || currentView === 'brand-detail') && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#eb6534]" />
              )}
            </button>

          </nav>

          {/* Right Utility Navigation: Help | English | Trips */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0 z-10">

            {/* Help */}
            <button
              onClick={() => setHelpModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-stone-300 hover:text-white transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-stone-300" />
              <span>Help</span>
            </button>

            {/* English */}
            <button
              onClick={() => setLanguageModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-stone-300 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4 text-stone-300" />
              <span>English</span>
            </button>



            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>

        {/* ─── BOOK MEGA MENU (EXACTLY MATCHING USER SCREENSHOT) ─── */}
        {bookMenuOpen && (
          <div
            ref={megaMenuRef}
            className="absolute top-full left-0 right-0 w-full bg-white border-b border-stone-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2"
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 flex flex-col md:flex-row gap-8 lg:gap-14">

              {/* Left Section: 2 Columns of Curated Booking Links */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-5 text-sm">

                {/* Column 1 */}
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToHotelLocations();
                    }}
                    className="block text-left text-stone-900 hover:text-[#8a1538] font-medium transition-colors cursor-pointer"
                  >
                    Find a Hotel
                  </button>

                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToVacations('Homes & Villas');
                    }}
                    className="block text-left text-stone-900 hover:text-[#8a1538] font-medium transition-colors cursor-pointer"
                  >
                    Homes & Villas
                  </button>

                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToDestinations();
                    }}
                    className="block text-left text-stone-900 hover:text-[#8a1538] font-medium transition-colors cursor-pointer"
                  >
                    Explore Destinations
                  </button>

                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToHotelLocations();
                    }}
                    className="block text-left text-stone-900 hover:text-[#8a1538] font-medium transition-colors cursor-pointer"
                  >
                    Hotel Locations
                  </button>

                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToBrandDetail('the-ritz-carlton');
                    }}
                    className="block text-left text-stone-900 hover:text-[#8a1538] font-medium transition-colors cursor-pointer"
                  >
                    Luxury Travel
                  </button>

                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToVacations('Yacht Collection');
                    }}
                    className="block text-left text-stone-900 hover:text-[#8a1538] font-medium transition-colors cursor-pointer"
                  >
                    The Ritz-Carlton Yacht Collection
                  </button>

                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToVacations('Escapes & Packages');
                    }}
                    className="block text-left text-stone-900 hover:text-[#8a1538] font-medium transition-colors cursor-pointer"
                  >
                    Marriott Vacation Club
                  </button>

                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToSearchResults({ destination: 'Resorts' });
                    }}
                    className="block text-left text-stone-900 hover:text-[#8a1538] font-medium transition-colors cursor-pointer"
                  >
                    Resorts
                  </button>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToVacations('All-Inclusive');
                    }}
                    className="block text-left text-stone-900 hover:text-[#8a1538] font-medium transition-colors cursor-pointer"
                  >
                    All-Inclusive Vacations
                  </button>

                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToTravelTips();
                    }}
                    className="block text-left text-stone-900 hover:text-[#8a1538] font-medium transition-colors cursor-pointer"
                  >
                    Travel Tips & Ideas
                  </button>

                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToResidences();
                    }}
                    className="block text-left text-stone-900 hover:text-[#8a1538] font-medium transition-colors cursor-pointer"
                  >
                    Residences
                  </button>

                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToDineDrink();
                    }}
                    className="block text-left text-stone-900 hover:text-[#8a1538] font-medium transition-colors cursor-pointer"
                  >
                    Dine & Drink
                  </button>

                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToGolf();
                    }}
                    className="block text-left text-stone-900 hover:text-[#8a1538] font-medium transition-colors cursor-pointer"
                  >
                    Golf
                  </button>

                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToOutdoors();
                    }}
                    className="block text-left text-stone-900 hover:text-[#8a1538] font-medium transition-colors cursor-pointer"
                  >
                    Explore Outdoors
                  </button>

                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToInsurance();
                    }}
                    className="block text-left text-stone-900 hover:text-[#8a1538] font-medium transition-colors cursor-pointer"
                  >
                    Travel Insurance
                  </button>

                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToBusinessProgram();
                    }}
                    className="block text-left text-stone-900 hover:text-[#8a1538] font-medium transition-colors cursor-pointer"
                  >
                    Small & Midsize Business Program
                  </button>
                </div>

              </div>

              {/* Right Section: Featured Card with Vertical Divider */}
              <div className="border-t md:border-t-0 md:border-l border-stone-200 pt-6 md:pt-0 md:pl-8 lg:pl-12 max-w-sm w-full shrink-0 flex flex-col justify-between">
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"
                    alt="Vacation Rentals Curated by Us for You"
                    className="w-full h-44 object-cover mb-4"
                  />
                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-2 leading-snug">
                    Vacation Rentals Curated by Us for You
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    Spread out while you earn & redeem points at Homes & Villas by Marriott Bonvoy.
                  </p>
                  <button
                    onClick={() => {
                      setBookMenuOpen(false);
                      goToVacations('Homes & Villas');
                    }}
                    className="border border-stone-900 rounded-full px-5 py-2 text-xs font-semibold text-stone-900 hover:bg-stone-900 hover:text-white transition-colors"
                  >
                    Explore Homes
                  </button>
                </div>

                <button
                  onClick={() => setBookMenuOpen(false)}
                  className="self-end text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium mt-6 cursor-pointer"
                >
                  <span>✕</span> Close
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#1c1917] border-b border-stone-800 px-6 py-6 space-y-4 text-sm font-semibold text-stone-200 max-h-[85vh] overflow-y-auto">
            <div className="pb-3 border-b border-stone-800 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#eb6534] font-bold">Marriott Bonvoy Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-2 text-xs pb-3 border-b border-stone-800">
              <button
                onClick={() => {
                  goToSearchResults();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 bg-stone-900 rounded-lg text-left hover:bg-stone-800 font-semibold text-white"
              >
                Find a Hotel
              </button>
              <button
                onClick={() => {
                  goToGolf();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 bg-stone-900 rounded-lg text-left hover:bg-stone-800 font-semibold text-[#eb6534]"
              >
                Golf Resorts
              </button>
              <button
                onClick={() => {
                  goToHotelLocations();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 bg-stone-900 rounded-lg text-left hover:bg-stone-800 font-semibold text-white"
              >
                Hotel Locations
              </button>
              <button
                onClick={() => {
                  goToVacations();
                  setMobileMenuOpen(false);
                }}
                className="p-2.5 bg-stone-900 rounded-lg text-left hover:bg-stone-800 font-semibold text-white"
              >
                Homes & Villas
              </button>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                goToBrands();
              }}
              className="block w-full text-left py-2 hover:text-white flex items-center justify-between"
            >
              <span>Our Luxury Brands</span>
              <span className="text-[10px] uppercase font-bold text-[#eb6534] bg-[#eb6534]/15 px-2 py-0.5 rounded-full">
                3 Brands
              </span>
            </button>

            <button
              onClick={() => {
                goToOffers();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 hover:text-white"
            >
              Offers & Promotions
            </button>

            <button
              onClick={() => {
                goToDestinations();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 hover:text-white"
            >
              Explore Destinations
            </button>

            <div className="pt-4 border-t border-stone-800 space-y-2">
              <button
                onClick={() => {
                  goToMyBookings();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center bg-stone-800 hover:bg-stone-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>My Trips</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Help Modal */}
      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />

      {/* Language Modal */}
      <LanguageModal isOpen={languageModalOpen} onClose={() => setLanguageModalOpen(false)} />
    </>
  );
};
