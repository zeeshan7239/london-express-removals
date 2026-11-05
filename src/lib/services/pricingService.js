import config from './pricingConfig.js';

/**
 * Pricing engine. Pure functions: no network, no database.
 *
 * Whether a postcode is inside the London / M25 service area is NOT decided
 * here any more. That check lives in serviceArea.js, runs on the server and
 * uses the real position of the postcode. Callers pass in positions that the
 * server has already verified (pickupLatLng / deliveryLatLng).
 */

const haversineKm = (a, b) => {
  if (!a || !b || a.lat == null || b.lat == null) return null;
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

const kmToMiles = (km) => (km == null ? null : km * 0.621371);

export const floorToBand = (floor) => {
  if (!floor) return 0;
  const f = String(floor).toLowerCase().trim();
  if (f.includes('ground') || f === '0') return 0;
  if (f.includes('1st') || f.includes('2nd') || f === '1' || f === '2') return 1;
  if (f.includes('3rd') || f.includes('4th') || f.includes('5th') ||
      f === '3' || f === '4' || f === '5') return 2;
  if (f.includes('6th') || f.includes('above') || f.includes('higher') ||
      (/\d+/.test(f) && parseInt(f, 10) >= 6)) return 3;
  return 1;
};

export const MOVERS_TO_TEAM = { '1 Man': 'driverHelp', '2 Men': 'twoMen', '3 Men': 'threeMen' };

const moversToTeams = (moversNeeded) => {
  if (!moversNeeded) return ['driverHelp', 'twoMen'];
  const m = String(moversNeeded).toLowerCase();
  if (m.includes('1 man')) return ['driverHelp'];
  if (m.includes('2 men')) return ['twoMen'];
  if (m.includes('3 men')) return ['threeMen'];
  return ['driverHelp', 'twoMen', 'threeMen'];
};

const isShortTripEligible = ({ travelMinutes, pickupBand, deliveryBand, propertyType }) => {
  const cfg = config.shortTrip;
  if (!cfg) return false;
  if (travelMinutes == null) return false;
  if (travelMinutes > cfg.maxTravelMinutes) return false;
  if (pickupBand > cfg.maxFloorBand || deliveryBand > cfg.maxFloorBand) return false;
  if (cfg.eligiblePropertyTypes.length && !cfg.eligiblePropertyTypes.includes(propertyType)) return false;
  return true;
};

// ── Packing materials (boxes, wrap, tape) ───────────────────────────────────

const cleanQty = (v, max = 500) => Math.min(max, Math.max(0, Math.floor(Number(v) || 0)));

export const normalisePacking = (packing = {}) => ({
  smallBoxes: cleanQty(packing.smallBoxes),
  mediumBoxes: cleanQty(packing.mediumBoxes),
  largeBoxes: cleanQty(packing.largeBoxes),
  bubbleWrapRolls: cleanQty(packing.bubbleWrapRolls, 100),
  tapeRolls: cleanQty(packing.tapeRolls, 100),
});

export const packingMaterialsTotal = (packing = {}, wanted = true) => {
  if (!wanted) return 0;
  const p = normalisePacking(packing);
  const m = config.packingMaterials;
  return p.smallBoxes * m.boxes.small.price
    + p.mediumBoxes * m.boxes.medium.price
    + p.largeBoxes * m.boxes.large.price
    + p.bubbleWrapRolls * m.bubbleWrap.price
    + p.tapeRolls * m.tape.price;
};

// ── Extra services (packing service, dismantling, reassembly) ───────────────

export const normaliseServices = (services = {}) => ({
  packingService: !!services.packingService,
  dismantling: !!services.dismantling,
  reassembly: !!services.reassembly,
});

const extraServiceLines = (services) => {
  const s = normaliseServices(services);
  return Object.keys(config.extraServices)
    .filter((k) => s[k])
    .map((k) => ({ key: k, label: config.extraServices[k].label, amount: Number(config.extraServices[k].price) || 0 }));
};

// ── One team ────────────────────────────────────────────────────────────────

const priceForTeam = (teamKey, params) => {
  const {
    pickupFloor, pickupHasLift, deliveryFloor, deliveryHasLift,
    propertyType, distanceMiles = 0, travelMinutes, hours,
    services, packing, wantsPacking,
  } = params;

  const pickupBand = floorToBand(pickupFloor);
  const deliveryBand = floorToBand(deliveryFloor);
  const shortTrip = isShortTripEligible({ travelMinutes, pickupBand, deliveryBand, propertyType });
  const teamCfg = shortTrip
    ? { ...config.teams[teamKey], ...config.shortTrip.rates[teamKey], label: config.teams[teamKey]?.label, sublabel: config.teams[teamKey]?.sublabel }
    : config.teams[teamKey];
  if (!teamCfg) return null;

  // Floor charge — added once, at ANY booking length (2h and beyond).
  const chargeFor = (band, hasLift) => {
    if (band === 0) return 0;
    const tier = config.floorSurcharge[band];
    if (!tier) return 0;
    return tier[hasLift ? 'withLift' : 'withoutLift']?.[teamKey] ?? 0;
  };
  const pickupCharge = chargeFor(pickupBand, pickupHasLift);
  const deliveryCharge = chargeFor(deliveryBand, deliveryHasLift);
  const mode = config.floorChargeMode === 'sum' ? 'sum' : 'highest';
  const floorCharge = mode === 'sum' ? pickupCharge + deliveryCharge : Math.max(pickupCharge, deliveryCharge);
  const floorDetail = [
    pickupCharge > 0 ? `pickup ${pickupFloor}, ${pickupHasLift ? 'lift' : 'no lift'}` : null,
    deliveryCharge > 0 ? `delivery ${deliveryFloor}, ${deliveryHasLift ? 'lift' : 'no lift'}` : null,
  ].filter(Boolean).join(' / ');

  const billableMiles = shortTrip ? 0 : Math.max(0, distanceMiles - config.distance.freeMiles);
  const distanceFee = Math.round(billableMiles * config.distance.perMileRate);

  const property = config.propertyTypes[propertyType];
  const multiplier = shortTrip ? 1 : (property?.multiplier ?? 1);
  const adjustedBase = Math.round(teamCfg.basePrice * multiplier);

  const requestedHours = Math.min(12, Math.max(teamCfg.includedHours, Number(hours) || teamCfg.includedHours));
  const extraHours = Math.max(0, requestedHours - teamCfg.includedHours);
  const extraHoursFee = extraHours * teamCfg.extraHourRate;

  const serviceLines = extraServiceLines(services);
  const servicesTotal = serviceLines.reduce((n, l) => n + l.amount, 0);
  const materialsTotal = packingMaterialsTotal(packing, wantsPacking);

  const total = adjustedBase + extraHoursFee + floorCharge + distanceFee + servicesTotal + materialsTotal;

  const breakdown = [
    { key: 'base', label: `${teamCfg.label} — first ${teamCfg.includedHours} hours`, amount: adjustedBase },
    ...(extraHours > 0
      ? [{ key: 'extraHours', label: `Extra time — ${extraHours} hour${extraHours > 1 ? 's' : ''} × £${teamCfg.extraHourRate}`, amount: extraHoursFee }]
      : []),
    ...(floorCharge > 0
      ? [{ key: 'floor', label: `Floor charge (${floorDetail})`, amount: floorCharge }]
      : []),
    ...(distanceFee > 0
      ? [{ key: 'distance', label: `Distance (${Math.ceil(billableMiles)} mi over ${config.distance.freeMiles})`, amount: distanceFee }]
      : []),
    ...serviceLines.filter((l) => l.amount > 0).map((l) => ({ key: l.key, label: l.label, amount: l.amount })),
    ...(materialsTotal > 0 ? [{ key: 'materials', label: 'Packing materials', amount: materialsTotal }] : []),
  ];

  return {
    teamKey,
    label: teamCfg.label,
    sublabel: shortTrip ? 'Short-trip rate' : teamCfg.sublabel,
    isShortTrip: shortTrip,
    basePrice: teamCfg.basePrice,
    adjustedBase,
    floorSurcharge: floorCharge, // kept under the old name for existing readers
    floorCharge,
    distanceFee,
    extraHours, extraHoursFee,
    extraServicesTotal: servicesTotal,
    packingMaterialsTotal: materialsTotal,
    extraHourRate: teamCfg.extraHourRate,
    includedHours: teamCfg.includedHours,
    requestedHours,
    total,
    breakdown,
  };
};

/**
 * Price a move.
 * pickupLatLng / deliveryLatLng must be positions verified by the server.
 */
export const calculatePrice = (params = {}) => {
  const {
    pickupLatLng, deliveryLatLng,
    pickupFloor, pickupHasLift, deliveryFloor, deliveryHasLift,
    propertyType, moversNeeded, hours, services, packing, wantsPacking,
  } = params;

  if (!pickupLatLng || !deliveryLatLng || pickupLatLng.lat == null || deliveryLatLng.lat == null) {
    return { ok: false, reason: 'location_unverified', message: 'Both postcodes must be verified before a price can be shown.' };
  }

  const distanceKm = haversineKm(pickupLatLng, deliveryLatLng);
  const distanceMiles = kmToMiles(distanceKm);
  const travelMinutes = Math.round((distanceMiles / 15) * 60 + 10);

  const teams = moversToTeams(moversNeeded).map((k) => priceForTeam(k, {
    pickupFloor, pickupHasLift, deliveryFloor, deliveryHasLift,
    propertyType, distanceMiles, travelMinutes, hours,
    services, packing, wantsPacking,
  })).filter(Boolean);

  return {
    ok: true,
    coverage: { bothInside: true, distanceKm, distanceMiles, travelMinutes },
    propertyType,
    suggestedHours: config.propertyTypes[propertyType]?.suggestedHours || config.durations.defaultHours,
    teams,
  };
};
