/**
 * Addresses for a postcode, using Google Places (New) Text Search with the
 * server key (GOOGLE_MAPS_SERVER_KEY). getAddress.io used to be used here, but
 * it now covers Australia only, so it was removed.
 *
 * Google is not an address database, so this returns the addresses it finds for
 * the postcode (usually up to ~20), keeping only results that have a street and
 * the SAME postcode. If it finds none, the form falls back to manual entry.
 */
import { parsePlace } from '../utils/placeParsing.js';
import { isValidPostcode, normalisePostcode } from '../utils/validation.js';

const BASE = (process.env.GOOGLE_PLACES_API_URL || 'https://places.googleapis.com/v1').replace(/\/$/, '');
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const cache = globalThis.__addressCache || (globalThis.__addressCache = new Map());
const squash = (p) => String(p || '').replace(/\s+/g, '').toUpperCase();

export const getAddressesForPostcode = async (rawPostcode, { fetchImpl = fetch } = {}) => {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) return { addresses: [], places: [], provider: null };
  if (!isValidPostcode(String(rawPostcode || '').trim())) return { addresses: [], places: [], provider: 'google' };

  const postcode = normalisePostcode(String(rawPostcode).trim());
  const ck = squash(postcode);
  const hit = cache.get(ck);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetchImpl(`${BASE}/places:searchText`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'places.id,places.formattedAddress,places.addressComponents,places.location',
      },
      body: JSON.stringify({ textQuery: postcode, regionCode: 'GB', languageCode: 'en-GB', pageSize: 20 }),
    });
    if (!res.ok) {
      console.error('❌ Google address lookup error:', res.status);
      return { addresses: [], places: [], provider: null };
    }
    const json = await res.json();
    const seen = new Set();
    const places = (json.places || [])
      .map(parsePlace)
      .filter((p) => p && p.country === 'GB' && p.street && p.houseNumber && squash(p.postcode) === ck && p.lat != null)
      .map((p) => ({
        label: [p.line1 || `${p.houseNumber} ${p.street}`, p.town].filter(Boolean).join(', '),
        placeId: p.placeId, postcode: p.postcode, lat: p.lat, lon: p.lon,
      }))
      .filter((p) => (seen.has(p.label) ? false : seen.add(p.label)))
      .sort((a, b) => a.label.localeCompare(b.label, 'en', { numeric: true }));
    const value = { addresses: places.map((p) => p.label), places, provider: 'google' };
    cache.set(ck, { value, at: Date.now() });
    if (cache.size > 2000) cache.delete(cache.keys().next().value);
    return value;
  } catch (err) {
    console.error('❌ Address lookup error:', err.message);
    return { addresses: [], places: [], provider: null };
  } finally {
    clearTimeout(timer);
  }
};
