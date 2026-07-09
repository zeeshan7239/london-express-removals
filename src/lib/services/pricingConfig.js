/**
 * Pricing configuration — single source of truth for all pricing rules.
 * Edit values here; frontend pulls them via /api/pricing/config.
 */

const pricingConfig = {
  currency: 'GBP',
  currencySymbol: '£',

  m25Districts: [
    'EC1','EC2','EC3','EC4','WC1','WC2','W1','SW1','NW1','N1','SE1',
    'E1','E2','E3','E4','E5','E6','E7','E8','E9','E10','E11','E12','E13','E14','E15','E16','E17','E18','E20',
    'N2','N3','N4','N5','N6','N7','N8','N9','N10','N11','N12','N13','N14','N15','N16','N17','N18','N19','N20','N21','N22',
    'NW2','NW3','NW4','NW5','NW6','NW7','NW8','NW9','NW10','NW11',
    'SE2','SE3','SE4','SE5','SE6','SE7','SE8','SE9','SE10','SE11','SE12','SE13','SE14','SE15','SE16','SE17','SE18','SE19','SE20','SE21','SE22','SE23','SE24','SE25','SE26','SE27','SE28',
    'SW2','SW3','SW4','SW5','SW6','SW7','SW8','SW9','SW10','SW11','SW12','SW13','SW14','SW15','SW16','SW17','SW18','SW19','SW20',
    'W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12','W13','W14',
    'BR1','BR2','BR3','BR4','BR5','BR6','BR7','BR8',
    'CR0','CR2','CR3','CR4','CR5','CR6','CR7','CR8','CR9',
    'DA1','DA5','DA6','DA7','DA8','DA14','DA15','DA16','DA17','DA18',
    'EN1','EN2','EN3','EN4','EN5','EN8',
    'HA0','HA1','HA2','HA3','HA4','HA5','HA7','HA8','HA9',
    'IG1','IG2','IG3','IG4','IG5','IG6','IG7','IG8','IG11',
    'KT1','KT2','KT3','KT4','KT5','KT6','KT7','KT8','KT9',
    'RM1','RM2','RM3','RM6','RM7','RM8','RM9','RM10','RM11','RM12','RM13','RM14',
    'SM1','SM2','SM3','SM4','SM5','SM6',
    'TW1','TW2','TW3','TW4','TW5','TW7','TW8','TW9','TW10','TW11','TW12','TW13','TW14',
    'UB1','UB2','UB3','UB4','UB5','UB6','UB7','UB8','UB9','UB10',
    'WD3','WD6','WD23',
  ],

  teams: {
    driverHelp: { label: 'Driver Help',   sublabel: '1 Man + Van',      basePrice: 130, includedHours: 2, extraHourRate: 60 },
    twoMen:     { label: '2 Men Team',    sublabel: 'Most popular',     basePrice: 160, includedHours: 2, extraHourRate: 70 },
    threeMen:   { label: '3 Men Team',    sublabel: 'For bigger moves', basePrice: 220, includedHours: 2, extraHourRate: 90 },
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
      withoutLift: { driverHelp: 10, twoMen: 10, threeMen: 15 },
    },
    2: {
      withLift:    { driverHelp: 10, twoMen: 20, threeMen: 25 },
      withoutLift: { driverHelp: 30, twoMen: 40, threeMen: 50 },
    },
    3: {
      withLift:    { driverHelp: 20, twoMen: 30, threeMen: 40 },
      withoutLift: { driverHelp: 50, twoMen: 60, threeMen: 80 },
    },
  },

  shortTrip: {
    maxTravelMinutes: 60,
    maxFloorBand: 1,
    eligiblePropertyTypes: ['Single Item', 'Studio', 'Storage'],
    rates: {
      driverHelp: { basePrice: 100, includedHours: 2, extraHourRate: 50 },
      twoMen:     { basePrice: 140, includedHours: 2, extraHourRate: 65 },
      threeMen:   { basePrice: 180, includedHours: 2, extraHourRate: 80 },
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
