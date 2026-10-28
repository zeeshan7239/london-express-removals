import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Diagnostic: open /api/google-reviews-check in the browser.
 * Shows whether the env vars exist and what Google answers. Never prints the API key.
 * Protect/remove once reviews work.
 */
export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();
  const query = process.env.GOOGLE_PLACE_QUERY?.trim();
  const cid = process.env.GOOGLE_PLACE_CID?.trim();

  const out = {
    env: {
      GOOGLE_PLACES_API_KEY: key ? `set (${key.length} chars)` : 'MISSING',
      GOOGLE_PLACE_ID: placeId ? `set (${placeId.slice(0, 6)}…)` : 'not set',
      GOOGLE_PLACE_QUERY: query || 'not set',
      GOOGLE_PLACE_CID: cid || 'not set',
    },
  };
  if (!key || (!placeId && !query)) {
    out.result = 'Add GOOGLE_PLACES_API_KEY and either GOOGLE_PLACE_ID or GOOGLE_PLACE_QUERY in Vercel, then redeploy.';
    return NextResponse.json(out);
  }

  try {
    const res = placeId
      ? await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
          headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'displayName,rating,userRatingCount,googleMapsUri' },
          cache: 'no-store',
        })
      : await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': key,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri',
          },
          body: JSON.stringify({ textQuery: query, regionCode: 'GB', maxResultCount: 20 }),
          cache: 'no-store',
        });
    out.googleStatus = res.status;
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      out.googleError = json.error?.message || json;
      out.result = 'Google rejected the request. See googleError.';
      return NextResponse.json(out);
    }
    if (placeId) {
      out.place = json;
      out.result = 'OK: Place ID works.';
    } else {
      const places = json.places || [];
      out.found = places.map((p) => ({
        name: p.displayName?.text, address: p.formattedAddress, rating: p.rating, reviews: p.userRatingCount,
        matchesYourCid: cid ? (p.googleMapsUri || '').includes(`cid=${cid}`) : null,
        cid: (p.googleMapsUri || '').split('cid=')[1] || null,
      }));
      out.result = places.length
        ? (cid && !out.found.some((f) => f.matchesYourCid)
            ? 'Google returned results, but none match your CID. Your listing is not in name-search results.'
            : 'OK: listing found.')
        : 'Google returned no places for this query.';
    }
  } catch (e) {
    out.result = `Request failed: ${e.message}`;
  }
  return NextResponse.json(out);
}
