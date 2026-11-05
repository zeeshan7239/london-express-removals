/**
 * Turn a Google Places (New) place object into plain address fields.
 * Used by the browser (to fill the form) and by the server (to verify it again).
 */
import { normalisePostcode } from './validation.js';

const pick = (components, type, short = false) => {
  const c = (components || []).find((x) => (x.types || []).includes(type));
  return c ? (short ? c.shortText : c.longText) || '' : '';
};

export const parsePlace = (place) => {
  if (!place) return null;
  const c = place.addressComponents || [];
  const number = pick(c, 'street_number');
  const premise = pick(c, 'premise');
  const sub = pick(c, 'subpremise');
  const street = pick(c, 'route');
  const town = pick(c, 'postal_town') || pick(c, 'locality') || pick(c, 'administrative_area_level_2');
  const rawPostcode = pick(c, 'postal_code');
  const country = pick(c, 'country', true);
  const line1 = [sub && `Flat ${sub}`, premise, [number, street].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  return {
    placeId: place.id || null,
    formattedAddress: place.formattedAddress || '',
    houseNumber: number || premise || '',
    street,
    line1,
    town,
    postcode: rawPostcode ? normalisePostcode(rawPostcode) : '',
    country,
    lat: place.location?.latitude ?? null,
    lon: place.location?.longitude ?? null,
  };
};

export const PLACE_ID_RE = /^[A-Za-z0-9_-]{10,300}$/;
