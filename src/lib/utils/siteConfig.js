/**
 * Site-wide metadata constants.
 * Imported by app/layout.js and individual page metadata exports.
 */
export const siteConfig = {
  name: 'London Express Removals',
  tagline: 'Reliable Man & Van Service Across London',
  description: 'Premium man & van removals across London and the UK. House moves, flat moves, office relocation, single item delivery. Fast, insured, transparent pricing.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://londonexpressremovals.co.uk',
  ogImage: '/og-image.jpg',
  phone: '+44 7459 180 023',
  phoneRaw: '+447459180023',
  whatsapp: `https://wa.me/447459180023?text=${encodeURIComponent(
    'Hi, I need a quote for house removal. Please help me with pricing and availability.'
  )}`,
  email: 'bookings@londonexpressremovals.co.uk',
   googleVerification: "o8kTFpDhxvkD4lnRgFFlsfK90G1cyEb_b86jBJib8D8",  
};
