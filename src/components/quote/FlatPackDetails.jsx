import { PackageOpen } from 'lucide-react';

import { FLAT_PACK_FLAG as _F } from '@/lib/services/flatPack.js';
export const FLAT_PACK_FLAG = _F;

/** Read-only view of a quote's flat-pack items, used by admin and customer pages. */
export default function FlatPackDetails({ flatPack, removalPrice, audience = 'customer' }) {
  if (!flatPack?.required || !flatPack.items?.length) return null;
  const quoted = flatPack.assemblyCharge != null;
  return (
    <div className="bg-white rounded-3xl border border-amber-200 p-5 lg:p-7">
      <h3 className="font-display font-bold text-sm mb-3 uppercase tracking-wider text-ink-500 flex items-center gap-2">
        <PackageOpen className="w-3.5 h-3.5" /> Flat-pack furniture assembly
      </h3>
      <div className="inline-block px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-3">
        {quoted ? 'Assembly quoted' : FLAT_PACK_FLAG}
      </div>
      <div className="space-y-2">
        {flatPack.items.map((i, n) => (
          <div key={n} className="p-3 rounded-xl bg-ink-50 text-sm">
            <div className="font-semibold text-ink-900">{n + 1}. {i.name} × {i.quantity}{i.brand ? ` · ${i.brand}` : ''}</div>
            <div className="text-xs text-ink-600 mt-0.5">Collect from: {i.collectionLocation || '—'}</div>
            <div className="text-xs text-ink-600">Assembly at delivery: {i.assemblyRequired === false ? 'No' : 'Yes'}</div>
            {i.notes && <div className="text-xs text-ink-600">Notes: {i.notes}</div>}
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-ink-100 text-sm">
        {quoted ? (
          <>
            <div className="flex justify-between"><span className="text-ink-600">Assembly charge</span><span className="font-bold">£{flatPack.assemblyCharge}</span></div>
            {removalPrice != null && (
              <div className="flex justify-between mt-1"><span className="text-ink-600">Final price (removal + assembly)</span>
                <span className="font-bold text-ember-600">£{Number(removalPrice) + Number(flatPack.assemblyCharge)}</span></div>
            )}
            {flatPack.assemblyNote && <p className="text-xs text-ink-600 mt-2 whitespace-pre-wrap">{flatPack.assemblyNote}</p>}
          </>
        ) : (
          <p className="text-xs text-ink-600">
            {audience === 'admin'
              ? 'Review the items and enter the assembly charge below. It is added on top of the removal price.'
              : 'Our team will review your furniture and send a separate assembly quotation. It is added to your removal price and is not included in the total shown.'}
          </p>
        )}
      </div>
    </div>
  );
}
