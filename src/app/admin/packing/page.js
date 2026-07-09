'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Box, Layers, Loader2, ArrowRight } from 'lucide-react';
import api from '@/lib/utils/api';

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function AdminPackingPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ small: 0, medium: 0, large: 0, wrap: 0, revenue: 0 });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/quotes', { params: { limit: 200 } });
        const withPacking = (data.quotes || []).filter(q =>
          q.packingMaterials && q.packingMaterials.total > 0
        );
        setQuotes(withPacking);
        setTotals({
          small:   withPacking.reduce((s, q) => s + (q.packingMaterials.smallBoxes  || 0), 0),
          medium:  withPacking.reduce((s, q) => s + (q.packingMaterials.mediumBoxes || 0), 0),
          large:   withPacking.reduce((s, q) => s + (q.packingMaterials.largeBoxes  || 0), 0),
          wrap:    withPacking.reduce((s, q) => s + (q.packingMaterials.bubbleWrapRolls || 0), 0),
          revenue: withPacking.reduce((s, q) => s + (q.packingMaterials.total || 0), 0),
        });
      } catch { }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-ember-500" /></div>;

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <div className="mb-6">
        <h1 className="heading-display text-3xl mb-1">Packing Material Orders</h1>
        <p className="text-ink-600">All bookings that include packing materials.</p>
      </div>

      {/* Summary totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Small Boxes',  value: totals.small,  icon: Box },
          { label: 'Medium Boxes', value: totals.medium, icon: Box },
          { label: 'Large Boxes',  value: totals.large,  icon: Box },
          { label: 'Bubble Wrap',  value: `${totals.wrap} rolls`, icon: Layers },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-2xl border border-ink-100 p-4">
              <div className="w-9 h-9 rounded-xl bg-ember-50 flex items-center justify-center mb-2">
                <Icon className="w-4 h-4 text-ember-600" />
              </div>
              <div className="font-display font-extrabold text-2xl">{c.value}</div>
              <div className="text-xs text-ink-500 font-semibold uppercase tracking-wider mt-0.5">{c.label}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-ember-500 to-ember-600 text-white rounded-2xl p-5 mb-6 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest font-bold text-ember-100 mb-1">Total packing revenue</div>
          <div className="font-display font-extrabold text-3xl">£{totals.revenue}</div>
        </div>
        <Package className="w-10 h-10 opacity-30" />
      </div>

      {/* Order list */}
      <div className="bg-white rounded-3xl border border-ink-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-ink-100">
          <h2 className="font-display font-bold">{quotes.length} bookings with packing materials</h2>
        </div>
        {quotes.length === 0 ? (
          <div className="p-12 text-center text-ink-500">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No packing material orders yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-ink-100">
            {quotes.map(q => (
              <Link key={q._id} href={`/admin/quotes/${q._id}`}
                className="flex items-start gap-4 px-5 py-4 hover:bg-ink-50 transition">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{q.customer.name}</span>
                    <span className="text-xs text-ink-500">{formatDate(q.movingDate)}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {q.packingMaterials.smallBoxes  > 0 && <span className="px-2 py-0.5 rounded-full bg-ink-100 text-ink-700">{q.packingMaterials.smallBoxes} small</span>}
                    {q.packingMaterials.mediumBoxes > 0 && <span className="px-2 py-0.5 rounded-full bg-ink-100 text-ink-700">{q.packingMaterials.mediumBoxes} medium</span>}
                    {q.packingMaterials.largeBoxes  > 0 && <span className="px-2 py-0.5 rounded-full bg-ink-100 text-ink-700">{q.packingMaterials.largeBoxes} large</span>}
                    {q.packingMaterials.bubbleWrapRolls > 0 && <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">{q.packingMaterials.bubbleWrapRolls} bubble wrap roll{q.packingMaterials.bubbleWrapRolls > 1 ? 's' : ''}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-display font-bold text-ember-600">£{q.packingMaterials.total}</div>
                  <div className="text-xs text-ink-500 mt-0.5">{q.pickup?.postcode} → {q.delivery?.postcode}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
