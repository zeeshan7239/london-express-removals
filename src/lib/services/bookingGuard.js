/**
 * Server-side guard for standard (instant) bookings.
 *
 * Runs inside POST /api/quotes BEFORE anything is saved, so the London / M25
 * restriction and the price cannot be bypassed by editing the page, refreshing
 * it, or posting straight to the API:
 *
 *   - every postcode (pickup, each stop, delivery) must be valid, exist and be
 *     inside the service area, checked independently with our own lookup;
 *   - coordinates sent by the browser are thrown away and replaced by ours;
 *   - the price is recalculated here and must match what the customer saw;
 *   - fields a customer must never set (status, admin reply, owner) are removed.
 */
import { OUTSIDE_AREA_MESSAGE } from './serviceArea.js';
import { resolveLocations } from './locationService.js';
import { calculatePrice, MOVERS_TO_TEAM, normalisePacking } from './pricingService.js';
import { normalisePostcode } from '../utils/validation.js';
import { sanitiseFlatPack, flatPackError } from './flatPack.js';

export class GuardError extends Error {
  constructor(status, code, message, extra = {}) {
    super(message);
    this.name = 'GuardError';
    this.status = status;
    this.code = code;
    this.extra = extra;
  }
}

const FORBIDDEN_FIELDS = ['status', 'adminResponse', 'user', '_id', 'createdAt', 'updatedAt'];

const hasLift = (access) => access === 'Lift' || access === 'Both';

export const stripForbiddenFields = (payload) => {
  const clean = { ...payload };
  for (const k of FORBIDDEN_FIELDS) delete clean[k];
  return clean;
};

/** Check pickup, stops and delivery independently. Throws GuardError if any fails. */
export const verifyLocations = async (payload, opts) => {
  const stops = Array.isArray(payload.stops) ? payload.stops.filter((s) => s && s.postcode) : [];
  const entries = [
    { label: 'Pickup', postcode: payload.pickup?.postcode, placeId: payload.pickup?.placeId },
    ...stops.map((s, i) => ({ label: `Stop ${i + 1}`, postcode: s.postcode, placeId: s.placeId })),
    { label: 'Delivery', postcode: payload.delivery?.postcode, placeId: payload.delivery?.placeId },
  ];

  const results = await resolveLocations(entries.map((e) => ({ postcode: e.postcode, placeId: e.placeId })), opts);

  const bad = (status) => results.map((r, i) => ({ r, e: entries[i] })).filter((x) => x.r.status === status);

  const invalid = [...bad('invalid'), ...bad('not_found')];
  if (invalid.length) {
    throw new GuardError(400, 'INVALID_POSTCODE',
      `${invalid[0].e.label} postcode: ${invalid[0].r.message}`);
  }
  if (bad('unavailable').length) {
    throw new GuardError(503, 'LOOKUP_UNAVAILABLE', bad('unavailable')[0].r.message);
  }
  if (bad('outside').length) {
    throw new GuardError(422, 'OUTSIDE_SERVICE_AREA', OUTSIDE_AREA_MESSAGE, {
      customQuoteUrl: '/custom-quote',
      outside: bad('outside').map((x) => x.e.label),
    });
  }

  const [pickup, ...rest] = results;
  const delivery = rest.pop();
  return { pickup, stops: rest, delivery };
};

/**
 * Validate + sanitise a standard booking. Returns the payload that is safe to save.
 */
export const guardBooking = async (rawPayload, opts) => {
  const payload = stripForbiddenFields(rawPayload || {});
  payload.kind = 'booking';

  if (!payload.pickup || !payload.delivery) {
    throw new GuardError(400, 'INVALID_POSTCODE', 'Pickup and delivery postcodes are required.');
  }

  // Flat-pack details: cleaned here; never affects the removal price.
  payload.flatPack = sanitiseFlatPack(payload.flatPack);
  const fpError = flatPackError(payload.flatPack);
  if (fpError) throw new GuardError(400, 'INVALID_FLAT_PACK', fpError);

  const verified = await verifyLocations(payload, opts);

  // Replace anything the browser sent with what we verified ourselves.
  const applyVerified = (side, v) => ({
    ...side,
    postcode: normalisePostcode(v.postcode),
    lat: v.lat,
    lon: v.lon,
    placeId: v.source === 'google' ? v.placeId : undefined, // only kept when Google confirmed it
  });
  payload.pickup = applyVerified(payload.pickup, verified.pickup);
  payload.delivery = applyVerified(payload.delivery, verified.delivery);
  const givenStops = (Array.isArray(payload.stops) ? payload.stops : []).filter((s) => s && s.postcode);
  payload.stops = givenStops.map((s, i) => applyVerified(s, verified.stops[i]));

  // Recalculate the price from verified positions.
  const teamKey = payload.teamKey && Object.values(MOVERS_TO_TEAM).includes(payload.teamKey)
    ? payload.teamKey
    : (MOVERS_TO_TEAM[payload.moversNeeded] || 'twoMen');
  delete payload.teamKey;

  const teamLabel = { driverHelp: '1 Man', twoMen: '2 Men', threeMen: '3 Men' }[teamKey];
  const details = payload.propertyDetails || {};
  const packing = normalisePacking(payload.packingMaterials);
  const wantsPacking = !!payload.packingMaterials?.requested;

  const priced = calculatePrice({
    pickupLatLng: { lat: payload.pickup.lat, lon: payload.pickup.lon },
    deliveryLatLng: { lat: payload.delivery.lat, lon: payload.delivery.lon },
    pickupFloor: payload.pickup.floor,
    pickupHasLift: hasLift(payload.pickup.access),
    deliveryFloor: payload.delivery.floor,
    deliveryHasLift: hasLift(payload.delivery.access),
    propertyType: payload.movingType,
    moversNeeded: teamLabel,
    hours: payload.durationHours,
    services: {
      packingService: !!details.packingService,
      dismantling: !!details.dismantling,
      reassembly: !!details.reassembly,
    },
    packing,
    wantsPacking,
  });
  const team = priced.ok && priced.teams[0];
  if (!team) throw new GuardError(400, 'PRICE_UNAVAILABLE', 'We could not calculate a price for this booking.');

  const sent = Number(payload.estimatedPrice);
  if (!Number.isFinite(sent) || Math.abs(sent - team.total) > 0.5) {
    throw new GuardError(409, 'PRICE_MISMATCH',
      `The price has been updated to £${team.total}. Please review it and confirm again.`,
      { expectedPrice: team.total });
  }

  payload.estimatedPrice = team.total;
  payload.durationHours = team.requestedHours;
  payload.isShortTrip = team.isShortTrip;
  payload.distanceMiles = priced.coverage.distanceMiles;
  payload.travelMinutes = priced.coverage.travelMinutes;
  payload.priceBreakdown = team.breakdown.map(({ label, amount }) => ({ label, amount }));
  payload.packingMaterials = {
    ...packing,
    requested: wantsPacking,
    total: team.packingMaterialsTotal,
  };
  return payload;
};
