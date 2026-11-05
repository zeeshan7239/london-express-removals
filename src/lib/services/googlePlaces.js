/**
 * Server-side Google Places (New) check.
 *
 * The browser uses Google for suggestions only. When a booking is priced or
 * saved, the server asks Google for the selected place again with its OWN key
 * and uses that position — never the coordinates the browser sends.
 *
 * Env: GOOGLE_MAPS_SERVER_KEY (server only; restrict it to the Places API).
 * Without it, place ids are ignored and the postcode lookup is used instead.
 */
import { parsePlace, PLACE_ID_RE } from '../utils/placeParsing.js';

const BASE = (process.env.GOOGLE_PLACES_API_URL || 'https://places.googleapis.com/v1').replace(/\/$/, '');
const TIMEOUT_MS = 6000;
const FIELDS = 'id,formattedAddress,addressComponents,location';

export const googleServerKeyConfigured = () => !!process.env.GOOGLE_MAPS_SERVER_KEY;

/** Returns { status:'found', ...parsed } | { status:'not_found' } | { status:'unavailable' } */
export const fetchPlace = async (placeId, { fetchImpl = fetch } = {}) => {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key || !PLACE_ID_RE.test(String(placeId || ''))) return { status: 'unavailable' };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetchImpl(`${BASE}/places/${encodeURIComponent(placeId)}?languageCode=en-GB&regionCode=GB`, {
      signal: ctrl.signal,
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': FIELDS, Accept: 'application/json' },
    });
    if (res.status === 404 || res.status === 400) return { status: 'not_found' };
    if (!res.ok) return { status: 'unavailable' };
    const parsed = parsePlace(await res.json());
    if (!parsed || parsed.lat == null || parsed.lon == null) return { status: 'not_found' };
    return { status: 'found', ...parsed };
  } catch {
    return { status: 'unavailable' };
  } finally {
    clearTimeout(timer);
  }
};
