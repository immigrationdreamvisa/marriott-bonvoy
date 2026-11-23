import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Reservation } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  reservations: Reservation[];
  signIn: (email: string, password?: string) => boolean;
  signUp: (firstName: string, lastName: string, email: string, password?: string) => boolean;
  signOut: () => void;
  addReservation: (reservation: Reservation) => void;
  cancelReservation: (id: string) => boolean;
  findReservationByCode: (code: string, lastName?: string) => Reservation | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-init-1',
    confirmationCode: 'MB-892401',
    createdAt: '2026-09-15',
    propertyId: 'ritz-carlton-kyoto',
    propertyName: 'The Ritz-Carlton, Kyoto',
    propertyCity: 'Kyoto',
    propertyCountry: 'Japan',
    propertyImage: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
    brandId: 'the-ritz-carlton',
    brandName: 'The Ritz-Carlton',
    roomId: 'rc-kyoto-deluxe-kamogawa',
    roomName: 'Grand Deluxe Kamogawa River View',
    ratePlanId: 'rc-kyoto-flex',
    ratePlanName: 'Marriott Bonvoy Flexible Luxury Rate',
    checkIn: '2026-11-12',
    checkOut: '2026-11-16',
    nights: 4,
    roomsCount: 1,
    adultsCount: 2,
    childrenCount: 0,
    guest: {
      firstName: 'Marriott',
      lastName: 'Member',
      email: 'member@marriott.com',
      phone: '+1 (555) 392-8819',
      country: 'United States',
      specialRequests: 'High floor Kamogawa view preferred, arriving approx 14:00.'
    },
    roomSubtotal: 5400,
    taxesAndFees: 648,
    resortFee: 200,
    discount: 0,
    totalAmount: 6248,
    currency: 'USD',
    status: 'confirmed',
    cancellationDeadline: '2026-11-10T15:00:00',
    cancellationPolicy: 'Complimentary cancellation until 48 hours prior to arrival.',
    paymentMethod: 'Visa ending in 8842'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      localStorage.removeItem('aurelia_user');
      const saved = localStorage.getItem('marriott_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          !parsed ||
          parsed.firstName?.toLowerCase().includes('elena') ||
          parsed.email?.toLowerCase().includes('elena') ||
          parsed.lastName?.toLowerCase().includes('rostova')
        ) {
          localStorage.removeItem('marriott_user');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem('marriott_reservations') || localStorage.getItem('aurelia_reservations');
      return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
    } catch {
      return INITIAL_RESERVATIONS;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('marriott_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('marriott_user');
      }
    } catch {
      // Ignore storage errors
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('marriott_reservations', JSON.stringify(reservations));
    } catch {
      // Ignore storage errors
    }
  }, [reservations]);

  const signIn = (email: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email,
      firstName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      lastName: 'Guest',
      tier: 'Silver Elite',
      points: 25000,
      memberSince: '2026',
      nightsThisYear: 14
    };
    setUser(newUser);
    return true;
  };

  const signUp = (firstName: string, lastName: string, email: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email,
      firstName,
      lastName,
      tier: 'Member',
      points: 5000,
      memberSince: '2026',
      nightsThisYear: 0
    };
    setUser(newUser);
    return true;
  };

  const signOut = () => {
    setUser(null);
  };

  const addReservation = (reservation: Reservation) => {
    setReservations(prev => [reservation, ...prev]);
  };

  const cancelReservation = (id: string) => {
    setReservations(prev =>
      prev.map(res => (res.id === id ? { ...res, status: 'cancelled' } : res))
    );
    return true;
  };

  const findReservationByCode = (code: string, lastName?: string) => {
    const cleanCode = code.trim().toUpperCase();
    return (
      reservations.find(res => {
        const codeMatch = res.confirmationCode.toUpperCase() === cleanCode;
        if (!lastName) return codeMatch;
        const nameMatch = res.guest.lastName.toLowerCase() === lastName.trim().toLowerCase();
        return codeMatch && nameMatch;
      }) || null
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        reservations,
        signIn,
        signUp,
        signOut,
        addReservation,
        cancelReservation,
        findReservationByCode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
