'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Inbox, Calendar, MapPin, Package, ArrowRight, Loader2,
  Plus, Truck, Clock, Check, AlertCircle, X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/common/AuthContext';
import api from '@/lib/utils/api';

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric',
});

const statusMeta = {
  new:        { label: 'Awaiting confirmation', color: 'bg-blue-50 text-blue-700',     icon: Clock },
  contacted:  { label: 'Contacted',              color: 'bg-blue-50 text-blue-700',     icon: Clock },
  quoted:     { label: 'Quoted',                 color: 'bg-amber-50 text-amber-700',   icon: Clock },
  accepted:   { label: 'Confirmed',              color: 'bg-emerald-50 text-emerald-700', icon: Check },
  booked:     { label: 'Booked',                 color: 'bg-emerald-50 text-emerald-700', icon: Check },
  rejected:   { label: 'Declined',               color: 'bg-red-50 text-red-700',       icon: X },
  completed:  { label: 'Completed',              color: 'bg-purple-50 text-purple-700', icon: Check },
  cancelled:  { label: 'Cancelled',              color: 'bg-ink-100 text-ink-600',      icon: X },
};

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please sign in to view your bookings');
      router.replace('/sign-in?next=/my-bookings');
    }
  }, [user, authLoading, router]);

  // Load bookings
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await api.get('/quotes/mine');
        setBookings(data.quotes || []);
      } catch (err) {
        toast.error('Could not load your bookings');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-ember-500" />
      </div>
    );
  }

  return (
    <div className="container-wide py-10 lg:py-14 max-w-5xl">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="heading-display text-3xl lg:text-4xl mb-2">My bookings</h1>
          <p className="text-ink-600">Welcome back, {user.fullName.split(' ')[0]} — here's everything you've booked with us.</p>
        </div>
        <Link href="/booking" className="btn-primary">
          <Plus className="w-4 h-4" /> New booking
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-ink-100 p-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-ember-500 mx-auto" />
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4">
          {bookings.map((b, i) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <BookingCard booking={b} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking: b }) {
  const meta = statusMeta[b.status] || statusMeta.new;
  const StatusIcon = meta.icon;

  return (
    <Link
      href={`/my-bookings/${b._id}`}
      className="block bg-white rounded-3xl border border-ink-100 overflow-hidden hover:shadow-soft hover:-translate-y-0.5 transition-all"
    >
      <div className="p-5 lg:p-6">
        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-ember-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight">{b.movingType}</h3>
              <p className="text-xs text-ink-500">
                Reference: <span className="font-mono">{b._id.slice(-8).toUpperCase()}</span>
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${meta.color}`}>
            <StatusIcon className="w-3 h-3" /> {meta.label}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex items-start gap-2">
            <Calendar className="w-3.5 h-3.5 text-ember-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold">Date</div>
              <div className="font-semibold">{formatDate(b.movingDate)}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-ember-500 mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold">Route</div>
              <div className="font-semibold">{b.pickup?.postcode} → {b.delivery?.postcode}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-ink-100">
          {b.estimatedPrice ? (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold">Price</div>
              <div className="font-display font-extrabold text-2xl text-ember-600">£{b.estimatedPrice}</div>
            </div>
          ) : (
            <div className="text-xs text-ink-500">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              Quote pending
            </div>
          )}
          <span className="text-sm font-bold text-ember-600 inline-flex items-center gap-1">
            View details <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-3xl border border-ink-100 p-12 lg:p-16 text-center">
      <div className="w-16 h-16 rounded-full bg-ember-50 flex items-center justify-center mx-auto mb-4">
        <Inbox className="w-7 h-7 text-ember-500" />
      </div>
      <h2 className="font-display font-bold text-xl mb-2">No bookings yet</h2>
      <p className="text-ink-600 mb-6 max-w-md mx-auto">
        Once you book a move with us, you'll see it here with the status, price, and full details.
      </p>
      <Link href="/booking" className="btn-primary">
        <Plus className="w-4 h-4" /> Book your first move
      </Link>
    </div>
  );
}
