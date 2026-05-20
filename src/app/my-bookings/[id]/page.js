'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Calendar, MapPin, Package, Users, Clock,
  Phone, Mail, Truck, Loader2, Check, X, AlertCircle, MessageSquare, FileText, Receipt,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/common/AuthContext';
import { siteConfig } from '@/lib/utils/siteConfig';
import api from '@/lib/utils/api';

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

const statusMeta = {
  new:        { label: 'Awaiting confirmation', desc: 'We\'ve received your booking and will confirm shortly.', color: 'from-blue-500 to-blue-600', icon: Clock },
  contacted:  { label: 'Contacted',              desc: 'We\'ve been in touch about your move.',                  color: 'from-blue-500 to-blue-600', icon: Clock },
  quoted:     { label: 'Quote sent',             desc: 'Check your email for the latest details.',              color: 'from-amber-500 to-amber-600', icon: Clock },
  accepted:   { label: 'Confirmed',              desc: 'Your move is confirmed and scheduled.',                 color: 'from-emerald-500 to-emerald-600', icon: Check },
  booked:     { label: 'Booked',                 desc: 'You\'re all set — see you on moving day!',              color: 'from-emerald-500 to-emerald-600', icon: Check },
  rejected:   { label: 'Declined',               desc: 'We weren\'t able to take this booking — see message below.', color: 'from-red-500 to-red-600', icon: X },
  completed:  { label: 'Completed',              desc: 'Your move is complete. Thanks for choosing us!',        color: 'from-purple-500 to-purple-600', icon: Check },
  cancelled:  { label: 'Cancelled',              desc: 'This booking was cancelled.',                            color: 'from-ink-400 to-ink-500', icon: X },
};

export default function MyBookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please sign in to view this booking');
      router.replace('/sign-in');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await api.get(`/quotes/mine/${id}`);
        setBooking(data.quote);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not load booking');
        if (err.response?.status === 403 || err.response?.status === 404) {
          router.replace('/my-bookings');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user, id, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-ember-500" />
      </div>
    );
  }
  if (!booking) return null;

  const meta = statusMeta[booking.status] || statusMeta.new;
  const StatusIcon = meta.icon;

  return (
    <div className="container-wide py-10 lg:py-14 max-w-4xl">
      <Link href="/my-bookings" className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-ember-600 mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> Back to my bookings
      </Link>

      {/* Status hero */}
      <div className={`bg-gradient-to-br ${meta.color} text-white rounded-3xl p-6 lg:p-8 mb-6 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-grid-dark opacity-20" />
        <div className="relative flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
            <StatusIcon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest font-bold opacity-80 mb-1">Status</div>
            <h1 className="font-display font-bold text-2xl lg:text-3xl mb-1">{meta.label}</h1>
            <p className="text-white/90 text-sm leading-relaxed">{meta.desc}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Admin message — only if accepted/rejected */}
          {booking.adminResponse?.message && (
            <div className="bg-white rounded-3xl border border-ink-100 p-5 lg:p-6">
              <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2 text-ink-500 uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5" /> Message from our team
              </h3>
              <p className="text-ink-700 leading-relaxed whitespace-pre-wrap">{booking.adminResponse.message}</p>
              <p className="text-xs text-ink-400 mt-3">
                Sent {formatDate(booking.adminResponse.respondedAt)}
              </p>
            </div>
          )}

          {/* Move details */}
          <div className="bg-white rounded-3xl border border-ink-100 p-5 lg:p-6">
            <h3 className="font-display font-bold text-sm mb-4 text-ink-500 uppercase tracking-wider">Move details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Detail icon={Package} label="Type" value={booking.movingType} />
              <Detail icon={Calendar} label="Date" value={formatDate(booking.movingDate)} />
              <Detail icon={Users} label="Movers" value={booking.moversNeeded} />
              {booking.durationHours && <Detail icon={Clock} label="Duration" value={`${booking.durationHours} hours`} />}
              <Detail icon={MapPin} label="Pickup" value={
                <>
                  {booking.pickup?.address && <span className="block text-xs text-ink-500">{booking.pickup.address}</span>}
                  {booking.pickup?.postcode}
                  {booking.pickup?.floor && <span className="block text-xs text-ink-500">{booking.pickup.floor}{booking.pickup.access ? ' · ' + booking.pickup.access : ''}</span>}
                </>
              } />
              <Detail icon={MapPin} label="Delivery" value={
                <>
                  {booking.delivery?.address && <span className="block text-xs text-ink-500">{booking.delivery.address}</span>}
                  {booking.delivery?.postcode}
                  {booking.delivery?.floor && <span className="block text-xs text-ink-500">{booking.delivery.floor}{booking.delivery.access ? ' · ' + booking.delivery.access : ''}</span>}
                </>
              } />
              {booking.distanceMiles && <Detail icon={MapPin} label="Distance" value={`${booking.distanceMiles.toFixed(1)} miles`} />}
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="bg-white rounded-3xl border border-ink-100 p-5 lg:p-6">
              <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2 text-ink-500 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" /> Your notes
              </h3>
              <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-wrap">{booking.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Reference */}
          <div className="bg-white rounded-3xl border border-ink-100 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-500 font-semibold mb-2">
              <Receipt className="w-3.5 h-3.5" /> Booking reference
            </div>
            <div className="font-mono font-bold text-ink-900 text-lg break-all">{booking._id.slice(-8).toUpperCase()}</div>
            <p className="text-[11px] text-ink-500 mt-1">Quote this if you contact us</p>
          </div>

          {/* Price */}
          {booking.estimatedPrice ? (
            <div className="bg-gradient-to-br from-ember-500 to-ember-600 text-white rounded-3xl p-5">
              <div className="text-[11px] uppercase tracking-widest font-semibold text-ember-100 mb-1">
                {booking.status === 'accepted' || booking.status === 'completed' ? 'Confirmed price' : 'Estimated price'}
              </div>
              <div className="font-display font-extrabold text-4xl">£{booking.estimatedPrice}</div>
              {booking.durationHours && <div className="text-xs text-ember-100 mt-1">{booking.durationHours}h booking</div>}
              {booking.isShortTrip && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
                  Short-trip rate
                </div>
              )}
            </div>
          ) : (
            <div className="bg-ink-50 rounded-3xl p-5 text-center">
              <AlertCircle className="w-6 h-6 text-ember-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-ink-900">Quote pending</p>
              <p className="text-xs text-ink-600 mt-1">We'll confirm shortly</p>
            </div>
          )}

          {/* Help */}
          <div className="bg-ink-900 text-white rounded-3xl p-5 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-ember-500/20 rounded-full blur-2xl" />
            <h3 className="font-display font-bold text-base mb-3 relative">Need help?</h3>
            <div className="space-y-2 relative">
              <a href={`tel:${siteConfig.phoneRaw}`} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm transition">
                <Phone className="w-3.5 h-3.5 text-ember-400" /> Call us
              </a>
              <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer"
                 className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm transition">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp
              </a>
              <a href={`mailto:${siteConfig.email}`}
                 className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm transition">
                <Mail className="w-3.5 h-3.5 text-ember-400" /> Email
              </a>
            </div>
          </div>

          {/* Booked timeline */}
          <div className="bg-white rounded-3xl border border-ink-100 p-5">
            <div className="text-[11px] uppercase tracking-widest font-semibold text-ink-500 mb-2">Booked on</div>
            <div className="text-sm font-semibold">{formatDate(booking.createdAt)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-4 h-4 text-ember-500 mt-1 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold">{label}</div>
        <div className="text-sm font-semibold text-ink-900">{value}</div>
      </div>
    </div>
  );
}
