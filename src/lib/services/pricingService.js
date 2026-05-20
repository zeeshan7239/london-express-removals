import config from './pricingConfig.js';

export const extractDistrict = (postcode) => {
  if (!postcode) return null;
  const cleaned = postcode.toUpperCase().replace(/\s+/g, '');
  if (cleaned.length < 5) return null;
  const outward = cleaned.slice(0, cleaned.length - 3);
  return outward.replace(/[A-Z]$/, '') || outward;
};

const M25_CENTRE = { lat: 51.5074, lon: -0.1278 };
const M25_RADIUS_KM = 25;

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

export const isInsideM25 = (postcode, latlng) => {
  if (latlng && latlng.lat != null && latlng.lon != null) {
    const d = haversineKm(M25_CENTRE, latlng);
    return d != null && d <= M25_RADIUS_KM;
  }
  const district = extractDistrict(postcode);
  if (!district) return false;
  return config.m25Districts.includes(district);
};

export const coverageCheck = (pickupPostcode, deliveryPostcode, pickupLatLng, deliveryLatLng) => {
  const pickupInside = isInsideM25(pickupPostcode, pickupLatLng);
  const deliveryInside = isInsideM25(deliveryPostcode, deliveryLatLng);
  const distanceKm = haversineKm(pickupLatLng, deliveryLatLng);
  return {
    pickupInside, deliveryInside, bothInside: pickupInside && deliveryInside,
    pickupDistrict: extractDistrict(pickupPostcode),
    deliveryDistrict: extractDistrict(deliveryPostcode),
    distanceKm, distanceMiles: kmToMiles(distanceKm),
  };
};

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

const priceForTeam = (teamKey, params) => {
  const {
    pickupFloor, pickupHasLift, deliveryFloor, deliveryHasLift,
    propertyType, distanceMiles = 0, travelMinutes, hours,
  } = params;

  const pickupBand = floorToBand(pickupFloor);
  const deliveryBand = floorToBand(deliveryFloor);
  const shortTrip = isShortTripEligible({ travelMinutes, pickupBand, deliveryBand, propertyType });
  const teamCfg = shortTrip
    ? { ...config.teams[teamKey], ...config.shortTrip.rates[teamKey], label: config.teams[teamKey]?.label, sublabel: config.teams[teamKey]?.sublabel }
    : config.teams[teamKey];
  if (!teamCfg) return null;

  const surchargeFor = (band, hasLift) => {
    if (band === 0) return 0;
    const tier = config.floorSurcharge[band];
    if (!tier) return 0;
    return tier[hasLift ? 'withLift' : 'withoutLift']?.[teamKey] ?? 0;
  };

  const pickupSurcharge = surchargeFor(pickupBand, pickupHasLift);
  const deliverySurcharge = surchargeFor(deliveryBand, deliveryHasLift);
  const floorSurcharge = Math.max(pickupSurcharge, deliverySurcharge);

  const billableMiles = shortTrip ? 0 : Math.max(0, distanceMiles - config.distance.freeMiles);
  const distanceFee = Math.round(billableMiles * config.distance.perMileRate);

  const property = config.propertyTypes[propertyType];
  const multiplier = shortTrip ? 1 : (property?.multiplier ?? 1);
  const adjustedBase = Math.round(teamCfg.basePrice * multiplier);

  const requestedHours = Number(hours) || teamCfg.includedHours;
  const extraHours = Math.max(0, requestedHours - teamCfg.includedHours);
  const extraHoursFee = extraHours * teamCfg.extraHourRate;

  const total = adjustedBase + floorSurcharge + distanceFee + extraHoursFee;

  return {
    teamKey,
    label: teamCfg.label,
    sublabel: shortTrip ? 'Short-trip rate' : teamCfg.sublabel,
    isShortTrip: shortTrip,
    basePrice: teamCfg.basePrice,
    adjustedBase, floorSurcharge, distanceFee,
    extraHours, extraHoursFee,
    extraHourRate: teamCfg.extraHourRate,
    includedHours: teamCfg.includedHours,
    requestedHours, total,
    breakdown: [
      { label: `${teamCfg.label} — ${requestedHours}h booking`, amount: adjustedBase + extraHoursFee },
      ...(floorSurcharge > 0 ? [{ label: 'Floor surcharge', amount: floorSurcharge }] : []),
      ...(distanceFee > 0 ? [{ label: `Distance (${Math.ceil(billableMiles)} mi over ${config.distance.freeMiles})`, amount: distanceFee }] : []),
    ],
  };
};

export const calculatePrice = (params = {}) => {
  const {
    pickupPostcode, deliveryPostcode, pickupLatLng, deliveryLatLng,
    pickupFloor, pickupHasLift, deliveryFloor, deliveryHasLift,
    propertyType, moversNeeded, distanceMiles, travelMinutes, hours,
  } = params;

  const coverage = coverageCheck(pickupPostcode, deliveryPostcode, pickupLatLng, deliveryLatLng);
  if (!coverage.bothInside) {
    return {
      ok: false, reason: 'outside_m25',
      message: 'For locations outside the M25, please request a custom quote.',
      coverage,
    };
  }

  const finalDistanceMiles = coverage.distanceMiles != null ? coverage.distanceMiles : Number(distanceMiles) || 0;
  const finalTravelMinutes = travelMinutes != null
    ? Number(travelMinutes)
    : Math.round((finalDistanceMiles / 15) * 60 + 10);

  const teamKeys = moversToTeams(moversNeeded);
  const teams = teamKeys.map((k) => priceForTeam(k, {
    pickupFloor, pickupHasLift, deliveryFloor, deliveryHasLift,
    propertyType, distanceMiles: finalDistanceMiles,
    travelMinutes: finalTravelMinutes, hours,
  })).filter(Boolean);

  return {
    ok: true,
    coverage: { ...coverage, travelMinutes: finalTravelMinutes },
    propertyType,
    suggestedHours: config.propertyTypes[propertyType]?.suggestedHours || config.durations.defaultHours,
    teams,
  };
};
