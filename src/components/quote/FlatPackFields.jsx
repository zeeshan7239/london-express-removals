'use client';

import { Plus, Trash2, PackageOpen } from 'lucide-react';

export const emptyFlatPackItem = () => ({
  name: '', brand: '', quantity: 1, collectionLocation: '', assemblyRequired: true, notes: '',
});
export const MAX_FLAT_PACK_ITEMS = 10;

/**
 * Brand-new flat-pack furniture to collect and assemble.
 * value = { answer: '' | 'yes' | 'no', items: [...] }
 * It never affects the removal price — the team quotes assembly separately.
 */
export default function FlatPackFields({ value, onChange }) {
  const { answer, items } = value;
  const setAnswer = (a) => onChange({
    answer: a,
    items: a === 'yes' && !items.length ? [emptyFlatPackItem()] : items,
  });
  const setItem = (i, patch) => onChange({ ...value, items: items.map((it, n) => (n === i ? { ...it, ...patch } : it)) });
  const addItem = () => items.length < MAX_FLAT_PACK_ITEMS && onChange({ ...value, items: [...items, emptyFlatPackItem()] });
  const removeItem = (i) => {
    const next = items.filter((_, n) => n !== i);
    onChange({ answer: next.length ? 'yes' : 'no', items: next });
  };

  return (
    <div>
      <div className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
        <PackageOpen className="w-3.5 h-3.5 text-ember-500" />
        Do you have any brand-new flat-pack furniture that needs assembling at the delivery address?
      </div>
      <div className="grid grid-cols-2 gap-2 max-w-xs">
        {[['yes', 'Yes'], ['no', 'No']].map(([v, l]) => (
          <button key={v} type="button" onClick={() => setAnswer(v)} aria-pressed={answer === v}
            className={`p-3 rounded-xl border-2 text-sm font-semibold transition ${answer === v ? 'border-ember-500 bg-ember-50 text-ember-700' : 'border-ink-100 text-ink-600 hover:border-ink-300'}`}>
            {l}
          </button>
        ))}
      </div>

      {answer === 'yes' && (
        <div className="mt-4 space-y-4">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-ink-700 leading-relaxed">
            Need us to assemble brand-new IKEA or flat-pack furniture? No problem! Add your furniture details below.
            We will review your requirements and provide a separate assembly quotation alongside your removal booking.
            Your removal price stays the same and you can still complete your booking.
          </div>

          {items.map((it, i) => (
            <div key={i} className="rounded-2xl border border-ink-100 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-ink-900">Furniture item {i + 1}</div>
                <button type="button" onClick={() => removeItem(i)}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`fp-name-${i}`} className="text-xs font-semibold text-ink-600 mb-1.5 block">Furniture item name</label>
                  <input id={`fp-name-${i}`} className="input-field" maxLength={120} value={it.name}
                    placeholder="e.g. IKEA wardrobe, bed frame, desk"
                    onChange={(e) => setItem(i, { name: e.target.value })} />
                </div>
                <div>
                  <label htmlFor={`fp-brand-${i}`} className="text-xs font-semibold text-ink-600 mb-1.5 block">Brand or retailer</label>
                  <input id={`fp-brand-${i}`} className="input-field" maxLength={80} value={it.brand}
                    placeholder="e.g. IKEA, Argos, Wayfair"
                    onChange={(e) => setItem(i, { brand: e.target.value })} />
                </div>
                <div>
                  <label htmlFor={`fp-qty-${i}`} className="text-xs font-semibold text-ink-600 mb-1.5 block">Number of items</label>
                  <input id={`fp-qty-${i}`} type="number" min={1} max={50} inputMode="numeric" className="input-field" value={it.quantity}
                    onChange={(e) => setItem(i, { quantity: e.target.value === '' ? '' : Math.min(50, Math.max(1, Number(e.target.value) || 1)) })} />
                </div>
                <div>
                  <label htmlFor={`fp-asm-${i}`} className="text-xs font-semibold text-ink-600 mb-1.5 block">Assembly required at delivery?</label>
                  <select id={`fp-asm-${i}`} className="input-field" value={it.assemblyRequired ? 'yes' : 'no'}
                    onChange={(e) => setItem(i, { assemblyRequired: e.target.value === 'yes' })}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor={`fp-loc-${i}`} className="text-xs font-semibold text-ink-600 mb-1.5 block">Collection location</label>
                <input id={`fp-loc-${i}`} className="input-field" maxLength={250} value={it.collectionLocation}
                  placeholder="e.g. IKEA Tottenham, N17 9LL, or another address"
                  onChange={(e) => setItem(i, { collectionLocation: e.target.value })} />
              </div>
              <div>
                <label htmlFor={`fp-notes-${i}`} className="text-xs font-semibold text-ink-600 mb-1.5 block">
                  Additional information <span className="text-ink-400 font-normal">(optional)</span>
                </label>
                <textarea id={`fp-notes-${i}`} rows={2} maxLength={500} className="input-field resize-none" value={it.notes}
                  placeholder="Order number, size, number of boxes…"
                  onChange={(e) => setItem(i, { notes: e.target.value })} />
              </div>
            </div>
          ))}

          {items.length < MAX_FLAT_PACK_ITEMS && (
            <button type="button" onClick={addItem}
              className="flex items-center gap-2 text-sm font-semibold text-ink-600 hover:text-ember-600 transition border-2 border-dashed border-ink-200 hover:border-ember-300 rounded-xl px-4 py-2.5 w-full justify-center">
              <Plus className="w-4 h-4" /> Add another furniture item
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** Convert form state to the API shape. */
export const flatPackPayload = (value) => (
  value.answer === 'yes'
    ? { required: true, items: value.items.map((i) => ({ ...i, quantity: Number(i.quantity) || 1 })) }
    : { required: false, items: [] }
);

/** Returns an error string if the form is incomplete, else null. */
export const flatPackFormError = (value) => {
  if (value.answer === 'yes') {
    for (let i = 0; i < value.items.length; i += 1) {
      const it = value.items[i];
      if (!it.name.trim()) return { message: `Flat-pack item ${i + 1}: please enter the item name.`, fieldId: `fp-name-${i}` };
      if (!it.collectionLocation.trim()) return { message: `Flat-pack item ${i + 1}: please say where we collect it from.`, fieldId: `fp-loc-${i}` };
    }
  }
  return null;
};
