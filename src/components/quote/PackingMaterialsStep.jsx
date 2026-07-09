'use client';

import { Package, Minus, Plus, Box, Layers } from 'lucide-react';

/**
 * Packing materials selector.
 * value = { smallBoxes, mediumBoxes, largeBoxes, bubbleWrapRolls }
 *
 * Pricing (mirrors pricingConfig — display only; server recomputes):
 *   Boxes £5 each (any size) · Bubble wrap £25/roll · Tape £20 auto-added once
 */
const BOX_PRICE = 5;
const WRAP_PRICE = 25;
const TAPE_PRICE = 20;

const ITEMS = [
  { key: 'smallBoxes',      label: 'Small Boxes',      sub: 'Books, kitchenware',     price: BOX_PRICE,  max: 200 },
  { key: 'mediumBoxes',     label: 'Medium Boxes',     sub: 'Clothes, general items', price: BOX_PRICE,  max: 200 },
  { key: 'largeBoxes',      label: 'Large Boxes',      sub: 'Bedding, bulky light',   price: BOX_PRICE,  max: 200 },
  { key: 'bubbleWrapRolls', label: 'Bubble Wrap',      sub: 'Per roll',               price: WRAP_PRICE, max: 50 },
];

export default function PackingMaterialsStep({ value = {}, onChange }) {
  const get = (k) => Math.max(0, parseInt(value[k], 10) || 0);
  const setQty = (k, qty, max) => {
    onChange({ ...value, [k]: Math.max(0, Math.min(max, qty)) });
  };

  const anySelected = ITEMS.some((i) => get(i.key) > 0);
  const materialsTotal = ITEMS.reduce((s, i) => s + get(i.key) * i.price, 0);
  const total = anySelected ? materialsTotal + TAPE_PRICE : 0;

  return (
    <>
      <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Packing materials</h2>
      <p className="text-ink-500 mb-6 text-sm">
        Optional — we deliver them with the van on moving day. Skip this step if you have your own.
      </p>

      <div className="space-y-3">
        {ITEMS.map((item) => {
          const qty = get(item.key);
          return (
            <div
              key={item.key}
              className={`flex items-center justify-between gap-4 p-4 rounded-2xl border-2 transition ${
                qty > 0 ? 'border-ember-500 bg-ember-50' : 'border-ink-100'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  qty > 0 ? 'bg-ember-500' : 'bg-ink-900'
                }`}>
                  {item.key === 'bubbleWrapRolls'
                    ? <Layers className="w-5 h-5 text-white" />
                    : <Box className="w-5 h-5 text-white" />}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-ink-900">{item.label}</div>
                  <div className="text-xs text-ink-500">{item.sub} · £{item.price} each</div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setQty(item.key, qty - 1, item.max)}
                  disabled={qty === 0}
                  aria-label={`Fewer ${item.label}`}
                  className="w-9 h-9 rounded-xl bg-white border border-ink-200 flex items-center justify-center hover:bg-ink-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max={item.max}
                  value={qty}
                  onChange={(e) => setQty(item.key, parseInt(e.target.value, 10) || 0, item.max)}
                  className="w-14 text-center font-display font-bold text-lg bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  aria-label={`${item.label} quantity`}
                />
                <button
                  type="button"
                  onClick={() => setQty(item.key, qty + 1, item.max)}
                  aria-label={`More ${item.label}`}
                  className="w-9 h-9 rounded-xl bg-ink-900 text-white flex items-center justify-center hover:bg-ink-800 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live subtotal */}
      {anySelected ? (
        <div className="mt-5 p-4 rounded-2xl bg-ink-900 text-white">
          <div className="space-y-1.5 text-sm">
            {ITEMS.filter((i) => get(i.key) > 0).map((i) => (
              <div key={i.key} className="flex justify-between">
                <span className="text-ink-300">{get(i.key)} × {i.label}</span>
                <span className="font-semibold">£{get(i.key) * i.price}</span>
              </div>
            ))}
            <div className="flex justify-between">
              <span className="text-ink-300">Packing tape <span className="text-[10px] uppercase tracking-wider text-ember-400">(auto-added)</span></span>
              <span className="font-semibold">£{TAPE_PRICE}</span>
            </div>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-white/10">
            <span className="font-display font-bold">Packing total</span>
            <span className="font-display font-extrabold text-xl text-ember-400">£{total}</span>
          </div>
        </div>
      ) : (
        <div className="mt-5 p-4 rounded-2xl bg-ink-50 text-center text-sm text-ink-500 flex items-center justify-center gap-2">
          <Package className="w-4 h-4" /> No materials selected — that's fine, you can skip this step.
        </div>
      )}
    </>
  );
}
