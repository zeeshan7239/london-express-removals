/**
 * Distance service.
 *
 * Uses Google Distance Matrix API for REAL road distance + driving time
 * when GOOGLE_MAPS_API_KEY is set. Falls back to straight-line haversine
 * (× 1.4 road-winding factor) + 15mph London average when it isn't.
 *
 * To enable real distances:
 *   1. Google Cloud Console → enable "Distance Matrix API"
 *   2. Create an API key, restrict it to Distance Matrix
 *   3. Add to .env:  GOOGLE_MAPS_API_KEY=your-key
 *
 * Cost: ~$5 per 1,000 lookups (first $200/month free = ~40k lookups free).
 */

const toRad = (d) => (d * Math.PI) / 180;

export const haversineKm = (a, b) => {
  if (!a || !b || a.lat == null || b.lat == null) return null;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

export const kmToMiles = (km) => (km == null ? null : km * 0.621371);

/**
 * Estimate one leg using haversine + corrections.
 * Road-winding factor 1.4 converts straight-line to realistic road miles.
 */
const estimateLeg = (from, to) => {
  const straightKm = haversineKm(from, to);
  if (straightKm == null) return null;
  const roadMiles = kmToMiles(straightKm) * 1.4;
  const minutes = Math.round((roadMiles / 15) * 60 + 10); // 15mph avg + 10min buffer
  return { miles: roadMiles, minutes, source: 'estimate' };
};

/**
 * Real driving distance via Google Distance Matrix.
 * Returns null on any failure so callers can fall back.
 */
const googleLeg = async (from, to) => {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return null;

  try {
    const params = new URLSearchParams({
      origins: `${from.lat},${from.lon}`,
      destinations: `${to.lat},${to.lon}`,
      mode: 'driving',
      units: 'imperial',
      key,
    });
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?${params}`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return null;

    const json = await res.json();
    const element = json.rows?.[0]?.elements?.[0];
    if (element?.status !== 'OK') return null;

    return {
      miles: element.distance.value / 1609.344,    // metres → miles
      minutes: Math.round(element.duration.value / 60),
      source: 'google',
    };
  } catch (err) {
    console.error('Distance Matrix error:', err.message);
    return null;
  }
};

/**
 * Get distance + driving time for one leg. Tries Google, falls back to estimate.
 * @param {{lat, lon}} from
 * @param {{lat, lon}} to
 * @returns {{miles: number, minutes: number, source: 'google'|'estimate'} | null}
 */
export const getLeg = async (from, to) => {
  if (!from || !to || from.lat == null || to.lat == null) return null;
  return (await googleLeg(from, to)) || estimateLeg(from, to);
};

/**
 * Get total distance through a sequence of points (multi-stop support).
 * points = [pickup, stop1, stop2, ..., delivery]
 * Returns { totalMiles, totalMinutes, legs: [...] } or null if any point lacks coords.
 */
export const getRoute = async (points) => {
  const valid = (points || []).filter((p) => p && p.lat != null && p.lon != null);
  if (valid.length < 2) return null;

  const legs = [];
  for (let i = 0; i < valid.length - 1; i++) {
    const leg = await getLeg(valid[i], valid[i + 1]);
    if (!leg) return null;
    legs.push(leg);
  }

  return {
    totalMiles: legs.reduce((s, l) => s + l.miles, 0),
    totalMinutes: legs.reduce((s, l) => s + l.minutes, 0),
    legs,
    source: legs.every((l) => l.source === 'google') ? 'google' : 'estimate',
  };
};
