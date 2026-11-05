'use client';

import { Receipt } from 'lucide-react';

/**
 * Itemised price for the selected team. Lines come from the server-side
 * pricing engine (team.breakdown), so what is shown is exactly what is charged.
 * `services` lists extra services the customer asked for; ones without a
 * price set yet are shown as "to be confirmed" rather than hidden.
 */
export default function PriceBreakdown({ team, services = [], className = '' }) {
  if (!team) return null;
  const lines = team.breakdown || [];
  return (
    <div className={`rounded-2xl border border-ink-100 bg-ink-50/60 p-4 ${className}`}>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-600 mb-3">
        <Receipt className="w-3.5 h-3.5 text-ember-500" /> Price breakdown
      </div>
      <ul className="space-y-1.5 text-sm">
        {lines.map((l) => (
          <li key={l.key || l.label} className="flex items-start justify-between gap-3">
            <span className="text-ink-700 min-w-0 break-words">{l.label}</span>
            <span className="font-semibold text-ink-900 shrink-0">£{l.amount}</span>
          </li>
        ))}
        {services.map((l) => (
          <li key={l} className="flex items-start justify-between gap-3">
            <span className="text-ink-700 min-w-0 break-words">{l}</span>
            <span className="text-ink-500 shrink-0 text-xs">Included</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 pt-3 border-t border-ink-200 flex items-center justify-between">
        <span className="text-sm font-bold text-ink-900">Total</span>
        <span className="font-display font-extrabold text-xl text-ink-900">£{team.total}</span>
      </div>
    </div>
  );
}
