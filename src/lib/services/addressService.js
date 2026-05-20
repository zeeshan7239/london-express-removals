/**
 * Address lookup via getAddress.io.
 * Returns empty list (gracefully) if no API key is configured —
 * frontend will fall back to manual entry.
 */
export const getAddressesForPostcode = async (rawPostcode) => {
  const key = process.env.GETADDRESS_API_KEY;
  if (!key) return { addresses: [], provider: null };

  const postcode = rawPostcode.toUpperCase().replace(/\s+/g, '');

  try {
    const url = `https://api.getAddress.io/find/${encodeURIComponent(postcode)}?api-key=${encodeURIComponent(key)}&expand=true`;
    const res = await fetch(url);

    if (res.status === 401) {
      console.error('❌ getAddress.io: invalid API key');
      return { addresses: [], provider: null, error: 'invalid_key' };
    }
    if (res.status === 404) return { addresses: [], provider: 'getAddress.io' };
    if (!res.ok) {
      console.error('❌ getAddress.io error:', res.status);
      return { addresses: [], provider: null };
    }

    const json = await res.json();
    const addresses = (json.addresses || []).map((a) => {
      const parts = [a.line_1, a.line_2, a.line_3, a.line_4, a.town_or_city]
        .map((p) => (p || '').trim())
        .filter(Boolean);
      return parts.join(', ');
    }).filter(Boolean);

    return { addresses, provider: 'getAddress.io' };
  } catch (err) {
    console.error('❌ Address lookup error:', err.message);
    return { addresses: [], provider: null };
  }
};
