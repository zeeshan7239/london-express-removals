/**
 * Brand-new flat-pack furniture (IKEA etc.) that must be collected and assembled.
 *
 * This is deliberately separate from the standard dismantling / reassembly
 * options: it never changes the calculator price. The team reviews the items
 * and the admin adds an assembly charge later (flatPack.assemblyCharge), so the
 * final price = removal price + assembly charge.
 */
export const FLAT_PACK_FLAG = 'Flat-Pack Assembly – Custom Quote Required';
export const FLAT_PACK_MAX_ITEMS = 10;

const text = (v, max) => String(v ?? '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);

/**
 * Clean whatever the browser sent. Only known fields are kept, so a customer
 * can never set the assembly charge or its status.
 * Returns { required, items } — or { required:false, items:[] } when not used.
 */
export const sanitiseFlatPack = (raw) => {
  if (!raw || !raw.required || !Array.isArray(raw.items)) return { required: false, items: [] };
  const items = raw.items.slice(0, FLAT_PACK_MAX_ITEMS).map((i) => ({
    name: text(i?.name, 120),
    brand: text(i?.brand, 80),
    quantity: Math.min(50, Math.max(1, Math.floor(Number(i?.quantity) || 1))),
    collectionLocation: text(i?.collectionLocation, 250),
    assemblyRequired: i?.assemblyRequired === false ? false : true,
    notes: text(i?.notes, 500),
  })).filter((i) => i.name);
  return { required: items.length > 0, items };
};

/** Returns an error message if the items are incomplete, else null. */
export const flatPackError = (fp) => {
  if (!fp?.required) return null;
  const bad = fp.items.findIndex((i) => !i.collectionLocation);
  return bad >= 0 ? `Flat-pack item ${bad + 1}: please say where we collect it from.` : null;
};
