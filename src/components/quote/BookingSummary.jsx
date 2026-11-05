'use client';

import { motion } from 'framer-motion';
import { Truck, MapPin, Calendar, Users, Clock, Package, Receipt, ArrowRight } from 'lucide-react';

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

/**
 * Sidebar summary.
 * `stops` is the single array of intermediate stops between pickup and delivery.
 * Prices come from the server-side pricing engine (selectedTeam.breakdown).
 * the estimated total shown at the bottom of this card — the customer never
 * sees a per-item breakdown or unit prices in the form.
 */
export default function BookingSummary({
  data, selectedTeam, hours,
  stops = [], services = {},
}) {
  const hasMinimum = data.movingType && data.pickup?.postcode && data.delivery?.postcode;
  const displayTotal = selectedTeam ? selectedTeam.total : null;
  const requested = [
    services.packingService && 'Packing service',
    services.dismantling && 'Furniture dismantling',
    services.reassembly && 'Furniture reassembly',
  ].filter(Boolean);

  return (
    <div className="bg-white rounded-3xl border border-ink-100 overflow-hidden">
      <div className="px-5 py-4 bg-gradient-to-br from-ink-900 to-ink-800 text-white">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-ember-400 font-bold mb-1">
          <Receipt className="w-3.5 h-3.5" /> Booking summary
        </div>
        <h3 className="font-display font-bold text-lg">Your move</h3>
      </div>

      <div className="p-5 space-y-3 text-sm">
        {hasMinimum ? (
          <>
            <Row icon={Package} label="Move type" value={data.movingType} />

            {/* Pickup */}
            <Row icon={MapPin} label="Pickup" value={
              <>
                {data.pickup.address && <span className="block text-ink-500 text-[11px] truncate">{data.pickup.address}</span>}
                <span className="font-semibold">{data.pickup.postcode}</span>
                {data.pickup.floor && <span className="block text-ink-500 text-[11px]">{data.pickup.floor}</span>}
              </>
            } />

            {/* Intermediate stops — Stop 1, Stop 2, Stop 3... */}
            {stops.filter(s => s.postcode).map((s, i) => (
              <Row key={i} icon={ArrowRight} label={`Stop ${i + 1}`} value={
                <>
                  {s.address && <span className="block text-ink-500 text-[11px] truncate">{s.address}</span>}
                  <span className="font-semibold">{s.postcode}</span>
                  {s.floor && <span className="block text-ink-500 text-[11px]">{s.floor}</span>}
                </>
              } />
            ))}

            {/* Final delivery */}
            <Row icon={MapPin} label="Final delivery" value={
              <>
                {data.delivery.address && <span className="block text-ink-500 text-[11px] truncate">{data.delivery.address}</span>}
                <span className="font-semibold">{data.delivery.postcode}</span>
                {data.delivery.floor && <span className="block text-ink-500 text-[11px]">{data.delivery.floor}</span>}
              </>
            } />

            {data.movingDate    && <Row icon={Calendar} label="Date"     value={formatDate(data.movingDate)} />}
            {data.moversNeeded  && <Row icon={Users}    label="Movers"   value={data.moversNeeded} />}
            {hours              && <Row icon={Clock}    label="Duration" value={`${hours}h`} />}

            {services.flatPack && (
              <Row icon={Package} label="Flat-pack assembly" value={<span className="text-amber-700 font-semibold">Custom quote required</span>} />
            )}
            {requested.length > 0 && (
              <Row icon={Package} label="Extra services" value={requested.join(', ')} />
            )}
          </>
        ) : (
          <div className="text-center py-6 text-ink-400 text-xs">
            <Truck className="w-8 h-8 mx-auto mb-2 opacity-30" />
            Fill in your details to see your summary
          </div>
        )}
      </div>

      {displayTotal != null && (<>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-ember-500 to-ember-600 text-white p-5">
          <div className="text-[11px] uppercase tracking-widest font-semibold text-ember-100 mb-1">Estimated total</div>
          <div className="font-display font-extrabold text-4xl leading-none mb-1.5">£{displayTotal}</div>
          <div className="text-xs text-ember-100">{selectedTeam?.label} · {selectedTeam?.requestedHours}h booking</div>
        </motion.div>
        <div className="p-4 border-t border-ink-100">
          <ul className="space-y-1.5 text-xs">
            {(selectedTeam?.breakdown || []).map((l) => (
              <li key={l.key || l.label} className="flex justify-between gap-3">
                <span className="text-ink-600 min-w-0 break-words">{l.label}</span>
                <span className="font-semibold text-ink-900 shrink-0">£{l.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </>)}
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-3.5 h-3.5 text-ember-500 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold">{label}</div>
        <div className="text-ink-900">{value}</div>
      </div>
    </div>
  );
}
