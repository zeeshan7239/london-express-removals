/**
 * Live Google reviews via Places API (New).
 *
 * Env:
 *   GOOGLE_PLACES_API_KEY  (required)
 *   GOOGLE_PLACE_ID        (preferred, starts with ChIJ)
 *   GOOGLE_PLACE_QUERY     (fallback when no Place ID, e.g. "London Express Removals London")
 *
 * Returns null on any problem so the site falls back to the static reviews.
 * Errors are logged to the server log (Vercel → Logs) with the "[google-reviews]" prefix.
 * Cached for 6 hours to keep API cost near zero.
 */
const FIELDS = 'rating,userRatingCount,googleMapsUri,reviews';

async function fetchPlace(key, placeId, query) {
  if (placeId) {
    return fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': FIELDS },
      next: { revalidate: 21600 },
    });
  }
  return fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': FIELDS.split(',').map((f) => `places.${f}`).join(','),
    },
    body: JSON.stringify({ textQuery: query, regionCode: 'GB', maxResultCount: 1 }),
    next: { revalidate: 21600 },
  });
}

export async function getGoogleReviews() {
  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();
  const query = process.env.GOOGLE_PLACE_QUERY?.trim();
  if (!key || (!placeId && !query)) return null;

  try {
    const res = await fetchPlace(key, placeId, query);
    if (!res.ok) {
      console.error('[google-reviews] Google returned', res.status, (await res.text()).slice(0, 300));
      return null;
    }
    const json = await res.json();
    const j = placeId ? json : json.places?.[0];
    if (!j) {
      console.error('[google-reviews] No place found for query:', query);
      return null;
    }
    const reviews = (j.reviews || [])
      .filter((r) => (r.rating || 0) >= 4 && r.text?.text)
      .map((r) => ({
        name: r.authorAttribution?.displayName || 'Google user',
        photo: r.authorAttribution?.photoUri || null,
        area: r.relativePublishTimeDescription || '',
        text: r.text.text,
        rating: r.rating,
      }));
    if (!reviews.length) {
      console.error('[google-reviews] Place found but it has no 4-5 star reviews with text');
      return null;
    }
    return { rating: j.rating ?? null, count: j.userRatingCount ?? null, url: j.googleMapsUri || null, reviews };
  } catch (e) {
    console.error('[google-reviews] Request failed:', e.message);
    return null;
  }
}
