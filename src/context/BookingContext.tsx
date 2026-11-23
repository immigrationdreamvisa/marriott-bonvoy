import React, { createContext, useContext, useState, useMemo } from 'react';
import { SearchParams, BrandId, Property, RoomType, RatePlan, Reservation } from '../types';
import { PROPERTIES } from '../data/properties';
import { VALID_PROMO_CODES } from '../data/offers';

export type ViewType =
  | 'home'
  | 'brands'
  | 'search-results'
  | 'property-details'
  | 'brand-detail'
  | 'booking-flow'
  | 'confirmation'
  | 'my-bookings'
  | 'offers'
  | 'destinations'
  | 'vacations'
  | 'careers'
  | 'meetings'
  | 'membership'
  | 'hotel-locations'
  | 'golf'
  | 'residences'
  | 'dine-drink'
  | 'outdoors'
  | 'insurance'
  | 'business-program'
  | 'credit-cards'
  | 'travel-tips';

interface BookingContextType {
  searchParams: SearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParams>>;
  updateSearchParams: (updates: Partial<SearchParams>) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string | null) => void;
  selectedRatePlanId: string | null;
  setSelectedRatePlanId: (id: string | null) => void;
  selectedBrandId: BrandId | null;
  setSelectedBrandId: (id: BrandId | null) => void;
  activeConfirmedReservation: Reservation | null;
  setActiveConfirmedReservation: (res: Reservation | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'signin' | 'register' | 'lookup';
  setAuthModalTab: (tab: 'signin' | 'register' | 'lookup') => void;
  isBrandsModalOpen: boolean;
  setIsBrandsModalOpen: (open: boolean) => void;
  activeModalBrandId: BrandId;
  setActiveModalBrandId: (id: BrandId) => void;
  openBrandsModal: (brandId?: BrandId) => void;
  closeBrandsModal: () => void;
  
  // Navigation actions
  goToHome: () => void;
  goToBrands: () => void;
  goToSearchResults: (overrideParams?: Partial<SearchParams>) => void;
  goToPropertyDetails: (propertyId: string) => void;
  goToBrandDetail: (brandId: BrandId) => void;
  goToOffers: () => void;
  goToMyBookings: () => void;
  goToDestinations: () => void;
  goToVacations: (category?: string) => void;
  goToCareers: () => void;
  goToMeetings: () => void;
  goToMembership: () => void;
  goToHotelLocations: () => void;
  goToGolf: () => void;
  goToResidences: () => void;
  goToDineDrink: () => void;
  goToOutdoors: () => void;
  goToInsurance: () => void;
  goToBusinessProgram: () => void;
  goToCreditCards: () => void;
  goToTravelTips: () => void;
  startBookingFlow: (propertyId: string, roomId: string, ratePlanId: string) => void;
  
  // Helpers
  vacationCategory: string;
  setVacationCategory: (category: string) => void;
  selectedProperty: Property | null;
  selectedRoom: RoomType | null;
  selectedRatePlan: RatePlan | null;
  nightsCount: number;
  filteredProperties: Property[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Helper to get default dates (e.g. 14 days from now for 4 nights)
const getDefaultDates = () => {
  const checkInDate = new Date();
  checkInDate.setDate(checkInDate.getDate() + 14);
  const checkOutDate = new Date(checkInDate);
  checkOutDate.setDate(checkOutDate.getDate() + 4);

  const format = (d: Date) => d.toISOString().split('T')[0];
  return {
    checkIn: format(checkInDate),
    checkOut: format(checkOutDate)
  };
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const defaultDates = useMemo(() => getDefaultDates(), []);

  const [searchParams, setSearchParams] = useState<SearchParams>({
    destination: '',
    checkIn: defaultDates.checkIn,
    checkOut: defaultDates.checkOut,
    rooms: 1,
    adults: 2,
    children: 0,
    childrenAges: [],
    selectedBrands: [],
    promoCode: ''
  });

  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedRatePlanId, setSelectedRatePlanId] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<BrandId | null>(null);
  const [activeConfirmedReservation, setActiveConfirmedReservation] = useState<Reservation | null>(null);
  const [vacationCategory, setVacationCategory] = useState<string>('All');

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'register' | 'lookup'>('register');
  const [isBrandsModalOpen, setIsBrandsModalOpen] = useState(false);
  const [activeModalBrandId, setActiveModalBrandId] = useState<BrandId>('the-ritz-carlton');

  const openBrandsModal = (brandId?: BrandId) => {
    if (brandId) {
      setActiveModalBrandId(brandId);
    }
    setIsBrandsModalOpen(true);
  };

  const closeBrandsModal = () => {
    setIsBrandsModalOpen(false);
  };

  const updateSearchParams = (updates: Partial<SearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...updates }));
  };

  const calculateNights = (inDate: string, outDate: string) => {
    try {
      const d1 = new Date(inDate);
      const d2 = new Date(outDate);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const nightsCount = useMemo(() => {
    return calculateNights(searchParams.checkIn, searchParams.checkOut);
  }, [searchParams.checkIn, searchParams.checkOut]);

  const selectedProperty = useMemo(() => {
    if (!selectedPropertyId) return null;
    return PROPERTIES.find(p => p.id === selectedPropertyId) || null;
  }, [selectedPropertyId]);

  const selectedRoom = useMemo(() => {
    if (!selectedProperty || !selectedRoomId) return null;
    return selectedProperty.rooms.find(r => r.id === selectedRoomId) || null;
  }, [selectedProperty, selectedRoomId]);

  const selectedRatePlan = useMemo(() => {
    if (!selectedRoom || !selectedRatePlanId) return null;
    return selectedRoom.ratePlans.find(rp => rp.id === selectedRatePlanId) || null;
  }, [selectedRoom, selectedRatePlanId]);

  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter(property => {
      // Destination filter
      if (searchParams.destination.trim()) {
        const query = searchParams.destination.toLowerCase().trim();
        const matchesCity = property.city.toLowerCase().includes(query);
        const matchesCountry = property.country.toLowerCase().includes(query);
        const matchesRegion = property.region.toLowerCase().includes(query);
        const matchesName = property.name.toLowerCase().includes(query);
        if (!matchesCity && !matchesCountry && !matchesRegion && !matchesName) {
          return false;
        }
      }

      // Brand filter
      if (searchParams.selectedBrands.length > 0) {
        if (!searchParams.selectedBrands.includes(property.brandId)) {
          return false;
        }
      }

      // Occupancy check across available rooms
      const totalGuests = searchParams.adults + searchParams.children;
      const hasSuitableRoom = property.rooms.some(
        r => r.maxAdults >= searchParams.adults && (r.maxAdults + r.maxChildren) >= totalGuests
      );
      if (!hasSuitableRoom) {
        return false;
      }

      return true;
    });
  }, [searchParams]);

  // Navigation handlers
  const goToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToSearchResults = (overrideParams?: Partial<SearchParams>) => {
    if (overrideParams) {
      setSearchParams(prev => ({ ...prev, ...overrideParams }));
    }
    setCurrentView('search-results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPropertyDetails = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    // Select first room and rate plan by default for smooth UX
    const prop = PROPERTIES.find(p => p.id === propertyId);
    if (prop && prop.rooms.length > 0) {
      setSelectedRoomId(prop.rooms[0].id);
      if (prop.rooms[0].ratePlans.length > 0) {
        setSelectedRatePlanId(prop.rooms[0].ratePlans[0].id);
      }
    }
    setCurrentView('property-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToBrandDetail = (brandId: BrandId) => {
    setSelectedBrandId(brandId);
    setCurrentView('brand-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToBrands = () => {
    setCurrentView('brands');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToOffers = () => {
    setCurrentView('offers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToMyBookings = () => {
    setCurrentView('my-bookings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToDestinations = () => {
    setCurrentView('destinations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToVacations = (category?: string) => {
    if (category) {
      setVacationCategory(category);
    }
    setCurrentView('vacations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToCareers = () => {
    setCurrentView('careers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToMeetings = () => {
    setCurrentView('meetings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToMembership = () => {
    setCurrentView('membership');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHotelLocations = () => {
    setCurrentView('hotel-locations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToGolf = () => {
    setCurrentView('golf');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToResidences = () => {
    setCurrentView('residences');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToDineDrink = () => {
    setCurrentView('dine-drink');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToOutdoors = () => {
    setCurrentView('outdoors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToInsurance = () => {
    setCurrentView('insurance');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToBusinessProgram = () => {
    setCurrentView('business-program');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToCreditCards = () => {
    setCurrentView('credit-cards');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToTravelTips = () => {
    setCurrentView('travel-tips');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startBookingFlow = (propertyId: string, roomId: string, ratePlanId: string) => {
    setSelectedPropertyId(propertyId);
    setSelectedRoomId(roomId);
    setSelectedRatePlanId(ratePlanId);
    setCurrentView('booking-flow');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        setSearchParams,
        updateSearchParams,
        currentView,
        setCurrentView,
        selectedPropertyId,
        setSelectedPropertyId,
        selectedRoomId,
        setSelectedRoomId,
        selectedRatePlanId,
        setSelectedRatePlanId,
        selectedBrandId,
        setSelectedBrandId,
        activeConfirmedReservation,
        setActiveConfirmedReservation,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        isBrandsModalOpen,
        setIsBrandsModalOpen,
        activeModalBrandId,
        setActiveModalBrandId,
        openBrandsModal,
        closeBrandsModal,
        goToHome,
        goToBrands,
        goToSearchResults,
        goToPropertyDetails,
        goToBrandDetail,
        goToOffers,
        goToMyBookings,
        goToDestinations,
        goToVacations,
        goToCareers,
        goToMeetings,
        goToMembership,
        goToHotelLocations,
        goToGolf,
        goToResidences,
        goToDineDrink,
        goToOutdoors,
        goToInsurance,
        goToBusinessProgram,
        goToCreditCards,
        goToTravelTips,
        startBookingFlow,
        vacationCategory,
        setVacationCategory,
        selectedProperty,
        selectedRoom,
        selectedRatePlan,
        nightsCount,
        filteredProperties
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
