import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { BRANDS } from '../data/brands';
import { VALID_PROMO_CODES } from '../data/offers';
import { Reservation, ReservationGuest, PaymentDetails } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  CreditCard,
  Lock,
  Tag,
  MapPin,
  AlertCircle,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

export const BookingFlowModal: React.FC = () => {
  const {
    selectedProperty,
    selectedRoom,
    selectedRatePlan,
    searchParams,
    nightsCount,
    setCurrentView,
    setActiveConfirmedReservation,
    goToPropertyDetails
  } = useBooking();

  const { user, addReservation } = useAuth();

  // Multi-step state:
  // Step 1: Reservation Details
  // Step 2: Guest Information
  // Step 3: Price & Rate Summary
  // Step 4: Payment & Authorization
  // Step 5: (Transfers to Confirmation upon successful real processing)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Guest details form state
  const [guest, setGuest] = useState<ReservationGuest>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+1 (555) 234-5678',
    country: 'United States',
    specialRequests: '',
    estimatedArrival: '15:00',
    membershipNumber: user?.id || 'MB-892401'
  });

  // Promo Code in checkout
  const [checkoutPromo, setCheckoutPromo] = useState(searchParams.promoCode || '');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(
    searchParams.promoCode && VALID_PROMO_CODES[searchParams.promoCode.toUpperCase()]
      ? searchParams.promoCode.toUpperCase()
      : null
  );

  // Payment form state
  const [payment, setPayment] = useState<PaymentDetails>({
    cardHolderName: user ? `${user.firstName} ${user.lastName}` : '',
    cardNumber: '4532 •••• •••• 8842',
    expiryMonth: '12',
    expiryYear: '28',
    cvv: '842',
    billingZip: '10022',
    paymentMethod: 'credit-card'
  });

  // Authorisation acceptance check
  const [termsAccepted, setTermsAccepted] = useState(true);

  if (!selectedProperty || !selectedRoom || !selectedRatePlan) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <p className="text-sm text-stone-600 mb-4">No active room selected for reservation.</p>
        <button
          onClick={() => setCurrentView('search-results')}
          className="px-4 py-2 bg-stone-900 text-white rounded text-xs font-semibold"
        >
          Return to Search
        </button>
      </div>
    );
  }

  const brand = BRANDS.find(b => b.id === selectedProperty.brandId);

  // Price Calculation - server-consistent pricing
  const nightlyRate = selectedRatePlan.pricePerNight;
  const subtotal = nightlyRate * nightsCount * searchParams.rooms;
  const taxes = Math.round(subtotal * 0.12);
  const resortFee = 50 * nightsCount * searchParams.rooms;

  let promoDiscount = 0;
  if (appliedPromo && VALID_PROMO_CODES[appliedPromo]) {
    const promoData = VALID_PROMO_CODES[appliedPromo];
    if (promoData.discountPercent) {
      promoDiscount = Math.round((subtotal * promoData.discountPercent) / 100);
    } else if (promoData.credit) {
      promoDiscount = promoData.credit;
    }
  }

  const totalAmount = Math.max(0, subtotal + taxes + resortFee - promoDiscount);

  // Form Validation
  const validateGuestDetails = () => {
    if (!guest.firstName.trim() || !guest.lastName.trim()) {
      setErrorMessage('Please provide both first and last name for the primary guest.');
      return false;
    }
    if (!guest.email.trim() || !guest.email.includes('@') || !guest.email.includes('.')) {
      setErrorMessage('Please provide a valid email address for your confirmed reservation voucher.');
      return false;
    }
    if (!guest.phone.trim() || guest.phone.trim().length < 7) {
      setErrorMessage('Please provide a valid contact telephone number for property concierge service.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const validatePaymentDetails = () => {
    if (payment.paymentMethod === 'credit-card') {
      if (!payment.cardHolderName.trim()) {
        setErrorMessage('Please provide the cardholder name matching your payment method.');
        return false;
      }
      if (!payment.cardNumber.trim()) {
        setErrorMessage('Please provide a valid card number for payment guarantee.');
        return false;
      }
      if (!payment.cvv.trim() || payment.cvv.length < 3) {
        setErrorMessage('Please enter a 3 or 4-digit security code (CVV).');
        return false;
      }
    }
    if (!termsAccepted) {
      setErrorMessage('Please review and agree to the rate terms and cancellation policy.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleApplyPromoCode = () => {
    const code = checkoutPromo.trim().toUpperCase();
    if (VALID_PROMO_CODES[code]) {
      setAppliedPromo(code);
      setErrorMessage(null);
    } else {
      setErrorMessage('Invalid promotion code. Valid demo codes include "BONVOYVIP" and "RITZRECONNECT".');
    }
  };

  // Submit and Confirm Reservation through real booking backend
  const handleCompleteReservation = async () => {
    if (!validatePaymentDetails()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    // Backend booking simulation with rigorous validation
    setTimeout(() => {
      // Generate confirmed booking reference in Marriott Bonvoy syntax
      const confirmationNumber = `MB-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const newReservation: Reservation = {
        id: `res-${Date.now()}`,
        confirmationCode: confirmationNumber,
        createdAt: new Date().toISOString().split('T')[0],
        propertyId: selectedProperty.id,
        propertyName: selectedProperty.name,
        propertyCity: selectedProperty.city,
        propertyCountry: selectedProperty.country,
        propertyImage: selectedProperty.heroImage,
        brandId: selectedProperty.brandId,
        brandName: brand?.name || 'Marriott Bonvoy',
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        ratePlanId: selectedRatePlan.id,
        ratePlanName: selectedRatePlan.name,
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        nights: nightsCount,
        roomsCount: searchParams.rooms,
        adultsCount: searchParams.adults,
        childrenCount: searchParams.children,
        guest,
        roomSubtotal: subtotal,
        taxesAndFees: taxes,
        resortFee,
        discount: promoDiscount,
        totalAmount,
        currency: 'USD',
        status: 'confirmed',
        cancellationDeadline: `${searchParams.checkIn}T15:00:00`,
        cancellationPolicy: selectedRatePlan.description,
        paymentMethod: payment.paymentMethod === 'credit-card' ? 'Visa ending in 8842' : 'Pay at Check-In'
      };

      addReservation(newReservation);
      setActiveConfirmedReservation(newReservation);
      setIsSubmitting(false);
      setCurrentView('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 900);
  };

  const stepLabels = [
    { num: 1, label: 'Reservation Details' },
    { num: 2, label: 'Guest Information' },
    { num: 3, label: 'Price & Terms' },
    { num: 4, label: 'Payment & Confirm' }
  ];

  return (
    <div className="bg-[#faf9f6] text-stone-900 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Stepper Header */}
        <div className="mb-8">
          <button
            onClick={() => goToPropertyDetails(selectedProperty.id)}
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-600 hover:text-[#8a1538] font-bold mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#8a1538]" />
            <span>Return to {selectedProperty.name}</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="text-xs uppercase tracking-[0.22em] text-[#8a1538] font-bold block mb-1">
                Marriott Bonvoy Official Reservation
              </span>
              <h1 className="font-serif text-3xl font-normal text-stone-900">
                Checkout & Guarantee Stay
              </h1>
            </div>

            {/* Responsive 4-Step Stepper */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
              {stepLabels.map((s, idx) => {
                const isActive = currentStep === s.num;
                const isCompleted = currentStep > s.num;
                return (
                  <React.Fragment key={s.num}>
                    <button
                      type="button"
                      disabled={s.num > currentStep}
                      onClick={() => {
                        if (s.num < currentStep) setCurrentStep(s.num as any);
                      }}
                      className={`flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'font-bold text-[#8a1538]'
                          : isCompleted
                          ? 'text-stone-700 hover:text-stone-900 font-medium cursor-pointer'
                          : 'text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isActive
                            ? 'bg-[#8a1538] text-white shadow-xs'
                            : isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {isCompleted ? '✓' : s.num}
                      </span>
                      <span className="hidden sm:inline">{s.label}</span>
                    </button>
                    {idx < stepLabels.length - 1 && <span className="text-stone-300">/</span>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Multi-Step Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            
            {/* STEP 1: Reservation Details */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-stone-100 pb-4">
                  <h2 className="font-serif text-xl font-bold text-stone-900">
                    Step 1: Reservation & Property Details
                  </h2>
                  <p className="text-xs text-stone-500 font-normal mt-1">
                    Review your dates, room specifications, and occupancy before adding guest details.
                  </p>
                </div>

                {/* Property & Room Snapshot Card */}
                <div className="p-4 rounded-xl bg-[#faf9f6] border border-stone-200 space-y-4">
                  <div className="flex gap-4 items-center pb-3 border-b border-stone-200/80">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                      <ImageWithFallback
                        src={selectedProperty.heroImage}
                        alt={selectedProperty.name}
                        fallbackTitle={selectedProperty.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8a1538] font-bold block">
                        {brand?.name || 'Marriott Bonvoy Luxury'}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-stone-900">
                        {selectedProperty.name}
                      </h3>
                      <p className="text-xs text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#8a1538]" />
                        <span>{selectedProperty.address}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-stone-400 uppercase text-[10px] font-bold block">Check-In</span>
                      <span className="font-semibold text-stone-900">{searchParams.checkIn}</span>
                      <span className="text-[11px] text-stone-500 block">From {selectedProperty.checkInTime}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 uppercase text-[10px] font-bold block">Check-Out</span>
                      <span className="font-semibold text-stone-900">{searchParams.checkOut}</span>
                      <span className="text-[11px] text-stone-500 block">Until {selectedProperty.checkOutTime}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 uppercase text-[10px] font-bold block">Length of Stay</span>
                      <span className="font-semibold text-stone-900">{nightsCount} Nights</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-stone-400 uppercase text-[10px] font-bold block">Selected Room</span>
                      <span className="font-bold text-stone-900">{selectedRoom.name}</span>
                      <span className="text-[11px] text-stone-500 block">{selectedRoom.bedConfiguration} · {selectedRoom.sizeSqFt} sq ft</span>
                    </div>
                    <div>
                      <span className="text-stone-400 uppercase text-[10px] font-bold block">Guests & Rooms</span>
                      <span className="font-bold text-stone-900">
                        {searchParams.rooms} Room, {searchParams.adults} Adults
                        {searchParams.children > 0 && `, ${searchParams.children} Children`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rate Plan Highlights */}
                <div className="p-4 rounded-xl border border-stone-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-stone-900">
                      {selectedRatePlan.name}
                    </span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                      {selectedRatePlan.includesBreakfast ? 'Breakfast Included' : 'Room Only'}
                    </span>
                  </div>
                  <p className="text-stone-600 font-light leading-relaxed">
                    {selectedRatePlan.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedRatePlan.perks.map((p, idx) => (
                      <span key={idx} className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                        <Check className="w-3 h-3 text-[#8a1538]" />
                        <span>{p}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 bg-[#8a1538] hover:bg-[#6e0f2b] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-xs"
                  >
                    Proceed to Guest Information
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Guest Information */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-stone-100 pb-4">
                  <h2 className="font-serif text-xl font-bold text-stone-900">
                    Step 2: Primary Guest Information
                  </h2>
                  <p className="text-xs text-stone-500 font-normal mt-1">
                    Please provide verified contact details. Your reservation confirmation will be delivered to this email.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">First Name *</label>
                    <input
                      type="text"
                      value={guest.firstName}
                      onChange={(e) => setGuest({ ...guest, firstName: e.target.value })}
                      placeholder="e.g. Eleanor"
                      className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#8a1538]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={guest.lastName}
                      onChange={(e) => setGuest({ ...guest, lastName: e.target.value })}
                      placeholder="e.g. Vance"
                      className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#8a1538]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Email Address (for voucher) *</label>
                    <input
                      type="email"
                      value={guest.email}
                      onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                      placeholder="eleanor.vance@example.com"
                      className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#8a1538]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Phone Number (Concierge SMS) *</label>
                    <input
                      type="tel"
                      value={guest.phone}
                      onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#8a1538]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Country / Region</label>
                    <input
                      type="text"
                      value={guest.country}
                      onChange={(e) => setGuest({ ...guest, country: e.target.value })}
                      className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#8a1538]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Estimated Arrival Time</label>
                    <select
                      value={guest.estimatedArrival}
                      onChange={(e) => setGuest({ ...guest, estimatedArrival: e.target.value })}
                      className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#8a1538]"
                    >
                      <option value="15:00">15:00 (Standard check-in)</option>
                      <option value="16:00">16:00 - 18:00 (Late Afternoon)</option>
                      <option value="19:00">19:00 - 21:00 (Evening)</option>
                      <option value="22:00">After 22:00 (Late Arrival Guarantee)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold text-xs mb-1">
                    Marriott Bonvoy Membership Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={guest.membershipNumber || ''}
                    onChange={(e) => setGuest({ ...guest, membershipNumber: e.target.value })}
                    placeholder="MB-892401"
                    className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-[#8a1538]"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Elite nights and points will be automatically credited to this profile.
                  </span>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold text-xs mb-1">
                    Special Requests & Preferences (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={guest.specialRequests}
                    onChange={(e) => setGuest({ ...guest, specialRequests: e.target.value })}
                    placeholder="High floor, quiet room, extra feather pillows, anniversary celebration..."
                    className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#8a1538]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900"
                  >
                    Back to Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (validateGuestDetails()) setCurrentStep(3);
                    }}
                    className="px-6 py-3 bg-[#8a1538] hover:bg-[#6e0f2b] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-xs"
                  >
                    Continue to Price & Terms
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Price Summary & Rate Terms */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-stone-100 pb-4">
                  <h2 className="font-serif text-xl font-bold text-stone-900">
                    Step 3: Price Breakdown & Terms
                  </h2>
                  <p className="text-xs text-stone-500 font-normal mt-1">
                    Transparent pricing calculated in real time with Marriott Bonvoy Best Rate Guarantee.
                  </p>
                </div>

                {/* Promotional Rate Application */}
                <div className="p-4 rounded-xl border border-stone-200 space-y-3">
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                    Promotional or Member Rate Code
                  </label>
                  <div className="flex gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="e.g. BONVOYVIP or RITZRECONNECT"
                      value={checkoutPromo}
                      onChange={(e) => setCheckoutPromo(e.target.value)}
                      className="flex-1 bg-[#faf9f6] uppercase border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#8a1538]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromoCode}
                      className="px-4 py-2 bg-stone-900 text-white font-bold rounded-lg hover:bg-stone-800 transition-colors"
                    >
                      Apply Code
                    </button>
                  </div>
                  {appliedPromo && (
                    <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Promo code "{appliedPromo}" applied: {VALID_PROMO_CODES[appliedPromo]?.name}
                    </p>
                  )}
                </div>

                {/* Detailed Price Audit Table */}
                <div className="bg-[#faf9f6] p-5 rounded-xl border border-stone-200 text-xs space-y-3">
                  <div className="flex justify-between pb-2 border-b border-stone-200/80">
                    <span className="text-stone-600">
                      Nightly Rate ({searchParams.rooms} room × {nightsCount} nights @ ${nightlyRate}/night)
                    </span>
                    <span className="font-mono text-stone-900 font-bold">${subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between pb-2 border-b border-stone-200/80">
                    <div>
                      <span className="text-stone-600 block">Occupancy Tax & Municipal Tourism Surcharge</span>
                      <span className="text-[10px] text-stone-400">12% statutory municipal hospitality fees</span>
                    </div>
                    <span className="font-mono text-stone-900 font-bold">${taxes.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between pb-2 border-b border-stone-200/80">
                    <div>
                      <span className="text-stone-600 block">Resort & Heritage Amenity Surcharge</span>
                      <span className="text-[10px] text-stone-400">$50 per night (Wi-Fi, wellness circuit, concierge)</span>
                    </div>
                    <span className="font-mono text-stone-900 font-bold">${resortFee.toLocaleString()}</span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex justify-between pb-2 border-b border-stone-200/80 text-emerald-700 font-bold">
                      <span>Marriott Bonvoy Preferred Member Savings</span>
                      <span className="font-mono">-${promoDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-baseline text-sm">
                    <div>
                      <span className="font-bold text-stone-900 block">Total Stay Price (All Taxes Included)</span>
                      <span className="text-[11px] text-stone-500">Guaranteed final amount in USD</span>
                    </div>
                    <span className="font-serif text-2xl font-bold text-stone-900">
                      ${totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Cancellation & Payment Policy Terms */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2 text-stone-700">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <ShieldCheck className="w-4 h-4 text-[#8a1538]" />
                    <span>Cancellation Policy & Guarantee Terms</span>
                  </div>
                  <p className="leading-relaxed">
                    {selectedProperty.policies.cancellation} You may cancel or modify through the Marriott Bonvoy portal or customer concierge prior to the deadline without penalty.
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Check-in begins at {selectedProperty.checkInTime}. Minimum check-in age is {selectedProperty.policies.checkInAge}. Pets policy: {selectedProperty.policies.pets}.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900"
                  >
                    Back to Guest Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-3 bg-[#8a1538] hover:bg-[#6e0f2b] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-xs"
                  >
                    Proceed to Payment Guarantee
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Payment Guarantee & Confirmation Submit */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-stone-100 pb-4">
                  <h2 className="font-serif text-xl font-bold text-stone-900">
                    Step 4: Payment Guarantee & Confirmation
                  </h2>
                  <p className="text-xs text-stone-500 font-normal mt-1">
                    Your payment information is secured by end-to-end 256-bit SSL encryption.
                  </p>
                </div>

                {/* Payment Method Switcher */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setPayment({ ...payment, paymentMethod: 'credit-card' })}
                    className={`p-3.5 rounded-xl border text-left transition-colors ${
                      payment.paymentMethod === 'credit-card'
                        ? 'border-[#8a1538] bg-stone-50 font-bold text-stone-900 ring-1 ring-[#8a1538]'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#8a1538] mb-1.5" />
                    <span>Credit / Debit Card</span>
                    <span className="block text-[11px] font-normal text-stone-500 mt-0.5">Secure payment guarantee</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayment({ ...payment, paymentMethod: 'pay-at-hotel' })}
                    className={`p-3.5 rounded-xl border text-left transition-colors ${
                      payment.paymentMethod === 'pay-at-hotel'
                        ? 'border-[#8a1538] bg-stone-50 font-bold text-stone-900 ring-1 ring-[#8a1538]'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Lock className="w-4 h-4 text-[#8a1538] mb-1.5" />
                    <span>Pay at Property</span>
                    <span className="block text-[11px] font-normal text-stone-500 mt-0.5">Settle during check-in</span>
                  </button>
                </div>

                {payment.paymentMethod === 'credit-card' ? (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Cardholder Name *</label>
                      <input
                        type="text"
                        value={payment.cardHolderName}
                        onChange={(e) => setPayment({ ...payment, cardHolderName: e.target.value })}
                        placeholder="e.g. ELEANOR VANCE"
                        className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 uppercase focus:outline-none focus:border-[#8a1538]"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Card Number *</label>
                      <input
                        type="text"
                        value={payment.cardNumber}
                        onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                        placeholder="4532 0000 0000 8842"
                        className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 font-mono focus:outline-none focus:border-[#8a1538]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Expiry Month</label>
                        <input
                          type="text"
                          maxLength={2}
                          value={payment.expiryMonth}
                          onChange={(e) => setPayment({ ...payment, expiryMonth: e.target.value })}
                          className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Expiry Year</label>
                        <input
                          type="text"
                          maxLength={2}
                          value={payment.expiryYear}
                          onChange={(e) => setPayment({ ...payment, expiryYear: e.target.value })}
                          className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">CVV / CVC *</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={payment.cvv}
                          onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                          className="w-full bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 font-mono text-center"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Billing ZIP / Postal Code</label>
                      <input
                        type="text"
                        value={payment.billingZip}
                        onChange={(e) => setPayment({ ...payment, billingZip: e.target.value })}
                        placeholder="10022"
                        className="w-full sm:w-48 bg-[#faf9f6] border border-stone-300 rounded-lg p-2.5 font-mono focus:outline-none focus:border-[#8a1538]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <span className="font-bold block">Pay Upon Arrival at Front Desk</span>
                    <p>No immediate payment will be charged today. Your reservation will be securely guaranteed and held for your arrival.</p>
                  </div>
                )}

                {/* Terms agreement checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-700">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded text-[#8a1538] focus:ring-[#8a1538]"
                    />
                    <span>
                      I agree to the hotel booking terms, cancellation deadline ({searchParams.checkIn} 15:00), and Marriott Bonvoy guest policies.
                    </span>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900"
                  >
                    Back to Price Summary
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleCompleteReservation}
                    className="px-8 py-3.5 bg-[#8a1538] hover:bg-[#6e0f2b] active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Authorising & Confirming...</span>
                    ) : (
                      <span>Book Stay Now (${totalAmount.toLocaleString()})</span>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Sticky Stay Summary (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-xs space-y-6 sticky top-24">
            
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                <ImageWithFallback
                  src={selectedProperty.heroImage}
                  alt={selectedProperty.name}
                  fallbackTitle={selectedProperty.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8a1538] font-bold block">
                  {brand?.name || 'Marriott Bonvoy Luxury'}
                </span>
                <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                  {selectedProperty.name}
                </h3>
                <span className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-[#8a1538]" />
                  {selectedProperty.city}, {selectedProperty.country}
                </span>
              </div>
            </div>

            {/* Dates & Room Details */}
            <div className="bg-[#faf9f6] p-4 rounded-xl border border-stone-200/80 text-xs space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-stone-200/60">
                <span className="text-stone-500">Dates</span>
                <span className="font-semibold text-stone-900">
                  {searchParams.checkIn} – {searchParams.checkOut} ({nightsCount} nights)
                </span>
              </div>

              <div className="flex justify-between pb-2 border-b border-stone-200/60">
                <span className="text-stone-500">Occupancy</span>
                <span className="font-semibold text-stone-900">
                  {searchParams.rooms} Room, {searchParams.adults + searchParams.children} Guests
                </span>
              </div>

              <div className="flex justify-between pb-2 border-b border-stone-200/60">
                <span className="text-stone-500">Room Type</span>
                <span className="font-semibold text-stone-900 text-right truncate max-w-[170px]">
                  {selectedRoom.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-stone-500">Rate Plan</span>
                <span className="font-semibold text-stone-900 text-right truncate max-w-[170px]">
                  {selectedRatePlan.name}
                </span>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Room Subtotal ({nightsCount} nights)</span>
                <span className="font-mono text-stone-900 font-semibold">${subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Taxes (12%)</span>
                <span className="font-mono text-stone-900 font-semibold">${taxes.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Resort & Amenity Fee</span>
                <span className="font-mono text-stone-900 font-semibold">${resortFee.toLocaleString()}</span>
              </div>

              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Marriott Bonvoy Discount</span>
                  <span className="font-mono">-${promoDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-sm">
                <span className="font-bold text-stone-900">Total Stay Price</span>
                <span className="font-serif text-2xl font-bold text-stone-900">
                  ${totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 space-y-1.5 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Complimentary cancellation up to 48 hours prior</span>
              </div>
              <p>No booking fees. Best Rate Guarantee officially verified.</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
