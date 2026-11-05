/**
 * Pricing configuration — single source of truth for all pricing rules.
 * Edit values here; frontend pulls them via /api/pricing/config.
 */

const pricingConfig = {
  currency: 'GBP',
  currencySymbol: '£',

  // Service area (London + M25) is decided by src/lib/services/serviceArea.js
  // using the real location of each postcode, not by postcode prefix.

  teams: {
    driverHelp: { label: 'Driver Help',   sublabel: '1 Man + Van',      basePrice: 140, includedHours: 2, extraHourRate: 70},
    twoMen:     { label: '2 Men Team',    sublabel: 'Most popular',     basePrice: 180, includedHours: 2, extraHourRate: 90 },
    threeMen:   { label: '3 Men Team',    sublabel: 'For bigger moves', basePrice: 220, includedHours: 2, extraHourRate: 110 },
  },

  floorBands: {
    ground:  { label: 'Ground Floor',       band: 0 },
    first:   { label: '1st Floor',          band: 1 },
    second:  { label: '2nd Floor',          band: 1 },
    third:   { label: '3rd Floor',          band: 2 },
    fourth:  { label: '4th Floor',          band: 2 },
    fifth:   { label: '5th Floor',          band: 2 },
    sixth:   { label: '6th Floor',          band: 3 },
    higher:  { label: '6th Floor or Above', band: 3 },
  },

  floorSurcharge: {
    0: {
      withLift:    { driverHelp: 0,  twoMen: 0,  threeMen: 0  },
      withoutLift: { driverHelp: 0,  twoMen: 0,  threeMen: 0  },
    },
    1: {
      withLift:    { driverHelp: 0,  twoMen: 0,  threeMen: 0  },
      withoutLift: { driverHelp: 10, twoMen: 15, threeMen: 20 },
    },
    2: {
      withLift:    { driverHelp: 10, twoMen: 15, threeMen: 20 },
      withoutLift: { driverHelp: 15, twoMen: 20, threeMen: 30 },
    },
    3: {
      withLift:    { driverHelp: 15, twoMen: 20, threeMen: 30 },
      withoutLift: { driverHelp: 20, twoMen: 30, threeMen: 40 },
    },
  },

  // How the floor charge is worked out when pickup and delivery both have one:
  //   'highest' = charge the larger of the two (current behaviour)
  //   'sum'     = charge pickup + delivery together
  // The charge is added once to every booking, on top of the hourly price, so a
  // 3-hour booking pays: base + extra hours + floor charge (+ distance, extras).
  floorChargeMode: 'highest',

  // Optional extra services asked for BEFORE the customer picks team and hours.
  // Set a price (in pounds) to add it to the total and show it in the breakdown.
  // A price of 0 means "no charge set": the request is still saved and shown in
  // the summary, but nothing is added to the price.
  extraServices: {
    packingService: { label: 'Packing service',      price: 0 },
    dismantling:    { label: 'Furniture dismantling', price: 0 },
    reassembly:     { label: 'Furniture reassembly',  price: 0 },
  },

  shortTrip: {
    maxTravelMinutes: 60,
    maxFloorBand: 1,
    eligiblePropertyTypes: ['Single Item', 'Studio', 'Storage'],
    rates: {
      driverHelp: { basePrice: 120, includedHours: 2, extraHourRate: 60 },
      twoMen:     { basePrice: 160, includedHours: 2, extraHourRate: 80 },
      threeMen:   { basePrice: 200, includedHours: 2, extraHourRate: 100 },
    },
  },

  propertyTypes: {
    'Studio':       { label: 'Studio Move',      multiplier: 0.90, suggestedHours: 2 },
    'Flat':         { label: 'Flat Move',         multiplier: 1.00, suggestedHours: 2 },
    'House':        { label: 'House Move',        multiplier: 1.00, suggestedHours: 3 },
    'Office':       { label: 'Office Move',       multiplier: 1.10, suggestedHours: 3 },
    'Storage':      { label: 'Storage Move',      multiplier: 0.95, suggestedHours: 2 },
    'Single Item':  { label: 'Single Item Move',  multiplier: 0.80, suggestedHours: 1 },
  },

  distance: { freeMiles: 5, perMileRate: 2.5 },
  durations: { options: [2, 3, 4, 5, 6, 8], defaultHours: 2 },

  // ── Packing materials ──────────────────────────────────────────────────────
  // Boxes: £5 each (small/medium/large)
  // Bubble wrap: £15 per roll
  // Tape: £10 per roll — quantity selected by customer
  // Prices are internal — the form no longer shows unit prices; only the
  // final sidebar summary shows a single "Packing materials" total line.
  packingMaterials: {
    boxes: {
      small:  { label: 'Small Box',        price: 5  },
      medium: { label: 'Medium Box',       price: 5  },
      large:  { label: 'Large Box',        price: 5  },
    },
    bubbleWrap: { label: 'Bubble Wrap Roll', price: 15 },
    tape:       { label: 'Packing Tape Roll', price: 10 },
  },
};

export default pricingConfig;
