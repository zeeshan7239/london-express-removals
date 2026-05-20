'use client';

import { motion } from 'framer-motion';
import { Truck, MapPin, Calendar, Users, Clock, Package, Receipt } from 'lucide-react';

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function BookingSummary({ data, selectedTeam, hours }) {
  const hasMinimum = data.movingType && data.pickup?.postcode && data.delivery?.postcode;

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
            <Row icon={MapPin} label="From" value={
              <>
                {data.pickup.address && <span className="block text-ink-500 text-[11px] truncate">{data.pickup.address}</span>}
                {data.pickup.postcode}
              </>
            } />
            <Row icon={MapPin} label="To" value={
              <>
                {data.delivery.address && <span className="block text-ink-500 text-[11px] truncate">{data.delivery.address}</span>}
                {data.delivery.postcode}
              </>
            } />
            {data.movingDate && <Row icon={Calendar} label="Date" value={formatDate(data.movingDate)} />}
            {data.moversNeeded && <Row icon={Users} label="Movers" value={data.moversNeeded} />}
            {hours && <Row icon={Clock} label="Duration" value={`${hours} ${hours === 1 ? 'hour' : 'hours'}`} />}
          </>
        ) : (
          <div className="text-center py-6 text-ink-400 text-xs">
            <Truck className="w-8 h-8 mx-auto mb-2 opacity-30" />
            Fill in your details to see your booking summary
          </div>
        )}
      </div>

      {selectedTeam && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-ember-500 to-ember-600 text-white p-5"
        >
          <div className="text-[11px] uppercase tracking-widest font-semibold text-ember-100 mb-1">Estimated total</div>
          <div className="font-display font-extrabold text-4xl leading-none mb-1.5">£{selectedTeam.total}</div>
          <div className="text-xs text-ember-100">{selectedTeam.label} · {selectedTeam.requestedHours}h included</div>
        </motion.div>
      )}
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-3.5 h-3.5 text-ember-500 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold">{label}</div>
        <div className="text-ink-900 font-semibold truncate">{value}</div>
      </div>
    </div>
  );
}
