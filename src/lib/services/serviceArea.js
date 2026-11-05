/**
 * Service-area validation (server-side source of truth).
 *
 * A postcode is accepted for the standard online booking only if:
 *   1. it is a correctly formatted UK postcode, and
 *   2. it exists (looked up on postcodes.io, so we get its real position), and
 *   3. its position is inside London (postcodes.io region "London") OR
 *      inside the M25 boundary polygon (src/lib/data/m25Polygon.js).
 *
 * The decision is NEVER taken from the postcode prefix alone and NEVER from
 * coordinates sent by the browser: the position always comes from our own
 * lookup. If the lookup service cannot be reached we fail CLOSED ("unavailable")
 * so nothing outside the area can slip through.
 */
import { M25_POLYGON } from '../data/m25Polygon.js';
import { isValidPostcode, normalisePostcode } from '../utils/validation.js';
import { siteConfig } from '../utils/siteConfig.js';

const API_BASE = (process.env.POSTCODES_API_URL || 'https://api.postcodes.io').replace(/\/$/, '');
const LOOKUP_TIMEOUT_MS = 6000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_MAX = 2000;

export const OUTSIDE_AREA_MESSAGE =
  'Your collection or delivery location is outside our standard London & M25 service area. ' +
  'We may still be able to help! Please contact us at ' + siteConfig.email +
  ' to receive a personalised quotation.';

export const MESSAGES = {
  invalid: 'Please enter a valid UK postcode, for example SW1A 1AA.',
  not_found: "We couldn't find that postcode. Please check it and try again.",
  unavailable: "We couldn't check this postcode just now. Please try again in a moment, or request a custom quote.",
  outside: OUTSIDE_AREA_MESSAGE,
};

// ── Geometry ────────────────────────────────────────────────────────────────

/** Ray-casting point-in-polygon. polygon = [[lat, lon], ...] */
export const pointInPolygon = (lat, lon, polygon = M25_POLYGON) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [latI, lonI] = polygon[i];
    const [latJ, lonJ] = polygon[j];
    const crosses = (latI > lat) !== (latJ > lat)
      && lon < ((lonJ - lonI) * (lat - latI)) / (latJ - latI) + lonI;
    if (crosses) inside = !inside;
  }
  return inside;
};

/** Decide inside/outside from a real location. */
export const isInServiceArea = ({ lat, lon, region, country }) => {
  if (lat == null || lon == null || Number.isNaN(Number(lat)) || Number.isNaN(Number(lon))) return false;
  if (country && country !== 'England') return false;
  if (region === 'London') return true;
  return pointInPolygon(Number(lat), Number(lon));
};

// ── Lookup (postcodes.io) with a small in-memory cache ──────────────────────

const cache = globalThis.__postcodeCache || (globalThis.__postcodeCache = new Map());

const remember = (key, value) => {
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
  cache.set(key, { value, at: Date.now() });
};

/**
 * Look one postcode up. Returns
 *   { status: 'found', postcode, lat, lon, region, country, adminDistrict }
 *   { status: 'not_found' } | { status: 'unavailable' }
 */
export const lookupPostcode = async (normalised, { fetchImpl = fetch } = {}) => {
  const key = normalised.replace(/\s+/g, '');
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), LOOKUP_TIMEOUT_MS);
  try {
    const res = await fetchImpl(`${API_BASE}/postcodes/${encodeURIComponent(key)}`, {
      signal: ctrl.signal,
      headers: { Accept: 'application/json' },
    });
    if (res.status === 404) {
      const value = { status: 'not_found' };
      remember(key, value);
      return value;
    }
    if (!res.ok) return { status: 'unavailable' };
    const json = await res.json();
    const r = json?.result;
    if (!r || r.latitude == null || r.longitude == null) {
      const value = { status: 'not_found' };
      remember(key, value);
      return value;
    }
    const value = {
      status: 'found',
      postcode: r.postcode,
      lat: r.latitude,
      lon: r.longitude,
      region: r.region || null,
      country: r.country || null,
      adminDistrict: r.admin_district || null,
    };
    remember(key, value);
    return value;
  } catch {
    return { status: 'unavailable' };
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Full check for one postcode.
 * status: 'inside' | 'outside' | 'invalid' | 'not_found' | 'unavailable'
 */
export const checkServiceArea = async (raw, opts = {}) => {
  const input = String(raw ?? '').trim();
  if (!isValidPostcode(input)) {
    return { status: 'invalid', postcode: normalisePostcode(input), message: MESSAGES.invalid };
  }
  const postcode = normalisePostcode(input);
  const found = await lookupPostcode(postcode, opts);
  if (found.status !== 'found') {
    return { status: found.status, postcode, message: MESSAGES[found.status] };
  }
  const inside = isInServiceArea(found);
  return {
    status: inside ? 'inside' : 'outside',
    postcode: found.postcode || postcode,
    lat: found.lat,
    lon: found.lon,
    region: found.region,
    adminDistrict: found.adminDistrict,
    message: inside ? null : MESSAGES.outside,
  };
};

/** Check several postcodes independently (duplicates are looked up once). */
export const checkManyServiceArea = async (list, opts = {}) => {
  const unique = [...new Set(list.map((p) => normalisePostcode(String(p ?? '').trim())))];
  const results = await Promise.all(unique.map((p) => checkServiceArea(p, opts)));
  const byPostcode = new Map(unique.map((p, i) => [p, results[i]]));
  return list.map((p) => byPostcode.get(normalisePostcode(String(p ?? '').trim())));
};

export const __clearPostcodeCache = () => cache.clear();
