/**
 * One place that turns "what the customer picked" into a VERIFIED location.
 * Used by price calculation, the coverage check and the booking guard, so all
 * three always agree.
 *
 * entry = { postcode, placeId? }
 *  - With a Google place id (and our server key): the place is fetched again from
 *    Google, its postcode must match the postcode on the form, and the exact
 *    coordinates are checked against London / the M25.
 *  - Otherwise (manual entry, or Google unavailable): the postcode lookup is used.
 */
import { checkServiceArea, lookupPostcode, isInServiceArea, MESSAGES } from './serviceArea.js';
import { fetchPlace, googleServerKeyConfigured } from './googlePlaces.js';
import { isValidPostcode, normalisePostcode } from '../utils/validation.js';

const squash = (p) => String(p || '').replace(/\s+/g, '').toUpperCase();

export const resolveLocation = async (entry, opts = {}) => {
  const postcode = String(entry?.postcode ?? '').trim();
  const placeId = entry?.placeId;

  if (placeId && googleServerKeyConfigured() && isValidPostcode(postcode)) {
    const place = await fetchPlace(placeId, opts.google || opts);
    if (place.status === 'found' && place.country === 'GB' && place.postcode && squash(place.postcode) === squash(postcode)) {
      // Region (London) comes from the postcode lookup; the position is Google's exact one.
      const pc = await lookupPostcode(normalisePostcode(postcode), opts);
      if (pc.status === 'unavailable') return { status: 'unavailable', postcode: place.postcode, message: MESSAGES.unavailable };
      const inside = isInServiceArea({
        lat: place.lat, lon: place.lon,
        region: pc.status === 'found' ? pc.region : null,
        country: 'England',
      }) && (pc.status !== 'found' || !pc.country || pc.country === 'England');
      return {
        status: inside ? 'inside' : 'outside',
        postcode: place.postcode,
        lat: place.lat, lon: place.lon,
        placeId,
        source: 'google',
        adminDistrict: pc.status === 'found' ? pc.adminDistrict : null,
        message: inside ? null : MESSAGES.outside,
      };
    }
    // mismatch / not found / Google down -> fall through to the postcode check
  }
  const r = await checkServiceArea(postcode, opts);
  return { ...r, source: 'postcode' };
};

export const resolveLocations = (entries, opts) => Promise.all(entries.map((e) => resolveLocation(e, opts)));
