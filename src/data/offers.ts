import { Offer } from '../types';

export const OFFERS: Offer[] = [
  {
    id: 'offer-ritz-carlton-reconnect',
    title: 'The Ritz-Carlton Reconnect',
    subtitle: 'The Ritz-Carlton, Kyoto & Tokyo',
    description: 'Immerse in unforgettable journeys with daily champagne breakfast for two, private sommelier tasting, and a $150 nightly resort & spa credit.',
    code: 'RITZRECONNECT',
    creditAmount: 150,
    brandId: 'the-ritz-carlton',
    validUntil: 'December 31, 2027',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Daily $150 Resort & Spa Credit',
      'Daily Gourmet Breakfast for Two',
      'The Ritz-Carlton Club Concierge Welcome',
      'Guaranteed Late 14:00 Check-Out'
    ],
    terms: 'Requires minimum 2-night stay. Resort credit applied at checkout toward participating dining and spa venues.'
  },
  {
    id: 'offer-jw-mindful-escape',
    title: 'JW Marriott Mindful Living Package',
    subtitle: 'JW Marriott Venice & Marco Island',
    description: 'Restore your equilibrium with complimentary thermal spa access, a curated JW Garden culinary masterclass, and bonus Marriott Bonvoy points.',
    code: 'JWMINDFUL',
    discountPercentage: 15,
    brandId: 'jw-marriott',
    validUntil: 'November 30, 2027',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      '15% Preferred Stay Savings',
      'Daily Spa by JW Thermal Suite Pass',
      'Nourishing Farm-to-Table Breakfast',
      '5,000 Bonus Marriott Bonvoy Points'
    ],
    terms: 'Offer valid for Marriott Bonvoy members booking direct. Subject to blackout dates.'
  },
  {
    id: 'offer-st-regis-exquisite',
    title: 'The St. Regis Live Exquisite Journey',
    subtitle: 'The St. Regis Bora Bora Resort',
    description: 'Reserve 4 nights or more and enjoy outrigger canoe breakfast delivery, private coral reef excursion, and signature evening sabrage.',
    code: 'STREGISVVIP',
    discountPercentage: 20,
    brandId: 'st-regis',
    validUntil: 'October 31, 2027',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      '20% Extended Stay Courtesy',
      'Canoe Breakfast Delivered to Villa Deck',
      'Dedicated 24/7 St. Regis Butler',
      'Private Coral Reef Marine Tour'
    ],
    terms: 'Requires 4-night minimum stay in eligible villa categories. Advance booking of 14 days required.'
  },
  {
    id: 'offer-st-regis-astor-heritage',
    title: 'The St. Regis Astor Heritage Experience',
    subtitle: 'The St. Regis New York & Aspen',
    description: 'Step into timeless Gilded Age grandeur with signature Astor High Tea in Astor Court, evening champagne sabrage at King Cole Bar, and a $200 dining & spa credit.',
    code: 'ASTORHERITAGE',
    creditAmount: 200,
    brandId: 'st-regis',
    validUntil: 'December 31, 2027',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
    inclusions: [
      'Daily $200 Luxury Dining & Spa Credit',
      'Signature Astor Court Afternoon Tea for Two',
      'Reserved Evening Sabrage at King Cole Bar',
      'Manhattan Luxury House Car Chauffeur Service'
    ],
    terms: 'Requires minimum 2-night stay in Suite categories. Credit applied at checkout toward participating dining and spa venues.'
  }
];

export const VALID_PROMO_CODES: Record<string, { discountPercent?: number; credit?: number; name: string }> = {
  BONVOYVIP: { discountPercent: 15, name: 'Marriott Bonvoy VIP Privilege (15% Off)' },
  RITZRECONNECT: { credit: 150, name: 'The Ritz-Carlton Reconnect ($150 Credit)' },
  JWMINDFUL: { discountPercent: 15, name: 'JW Marriott Mindful Escape (15% Off)' },
  STREGISVVIP: { discountPercent: 20, name: 'St. Regis Live Exquisite (20% Off)' },
  ASTORHERITAGE: { credit: 200, name: 'The St. Regis Astor Heritage ($200 Credit)' },
  EDITIONVIBE: { credit: 200, name: 'EDITION Cultural Residency ($200 Credit)' },
  AUTUMN26: { credit: 100, name: 'Seasonal Luxury Credit ($100 Off)' }
};
