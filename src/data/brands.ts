import { Brand } from '../types';

export const BRANDS: Brand[] = [
  {
    id: 'the-ritz-carlton',
    name: 'The Ritz-Carlton',
    slug: 'the-ritz-carlton',
    tagline: 'Ladies and Gentlemen Serving Ladies and Gentlemen',
    category: 'Classic Luxury',
    description: 'Inspiring life’s most meaningful journeys through legendary service, timeless craftsmanship, and unforgettable moments in the world’s most coveted destinations.',
    philosophy: 'The Gold Standard of genuine hospitality. Every guest is welcomed by dedicated ladies and gentlemen, surrounded by classical architecture, world-renowned club lounges, and signature Ritz-Carlton Spa sanctuaries.',
    propertyCount: 118,
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85',
    logoText: 'THE RITZ-CARLTON',
    signaturePerks: [
      'The Ritz-Carlton Club Level Experience',
      'Dedicated Concierge & Sommelier Service',
      'Michelin-Starred Fine Dining Establishments',
      'Signature ESPA Holistic Spa Treatments'
    ],
    accentColor: '#002B49',
    isFeatured: true,
    isActive: true,
    displayOrder: 1
  },
  {
    id: 'jw-marriott',
    name: 'JW Marriott',
    slug: 'jw-marriott',
    tagline: 'Mindfully Crafted Luxury to Nourish Body and Spirit',
    category: 'Classic Luxury',
    description: 'Enriching experiences thoughtfully created for travelers seeking holistic balance, mindful well-being, architectural splendor, and restorative natural surroundings.',
    philosophy: 'Founded on the principle that true luxury allows you to be fully present. JW Marriott blends intuitive service with serene JW Gardens, award-winning Spa by JW sanctuaries, and nourishing culinary craft.',
    propertyCount: 124,
    coverImage: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    logoText: 'JW MARRIOTT',
    signaturePerks: [
      'Spa by JW Restorative Thermal Suites',
      'JW Garden Farm-to-Table Gastronomy',
      'Family by JW Mindful Experiences',
      'Architectural Executive Lounges'
    ],
    accentColor: '#4A3B32',
    isFeatured: true,
    isActive: true,
    displayOrder: 2
  },
  {
    id: 'st-regis',
    name: 'The St. Regis',
    slug: 'st-regis',
    tagline: 'Live Exquisite at the Best Addresses Worldwide',
    category: 'Distinctive Luxury',
    description: 'A tradition of bespoke luxury and timeless glamor rooted in the Gilded Age of Fifth Avenue, celebrated for signature St. Regis Butler Service and the ritual of champagne sabrage.',
    philosophy: 'Since John Jacob Astor IV opened the original St. Regis New York in 1904, the brand has defined the pinnacle of grand hospitality, evening sabrage ceremonies, and bespoke Bloody Mary cocktails.',
    propertyCount: 62,
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85',
    logoText: 'ST. REGIS',
    signaturePerks: [
      'Signature 24-Hour St. Regis Butler Service',
      'Evening Champagne Sabrage Ritual',
      'Destination King Cole Bars',
      'Bespoke Chauffeur Fleet'
    ],
    accentColor: '#1B263B',
    isFeatured: true,
    isActive: true,
    displayOrder: 3
  },

];
