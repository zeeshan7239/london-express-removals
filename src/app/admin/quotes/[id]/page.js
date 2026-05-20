'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, Users, Clock, Package,
  Check, X, Loader2, MessageSquare, AlertCircle, FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/utils/api';

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const StatusBadge = ({ status }) => {
  const styles = {
    new: 'bg-blue-50 text-blue-700',
    accepted: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-700',
    completed: 'bg-purple-50 text-purple-700',
    cancelled: 'bg-ink-100 text-ink-600',
  };
  return (
    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${styles[status] || 'bg-ink-100 text-ink-600'}`}>
      {status}
    </span>
  );
};

export default function QuoteDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'accept' | 'reject' | null

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/quotes/${id}`);
      setQuote(data.quote);
    } catch (err) {
      toast.error('Could not load quote');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-ember-500" />
      </div>
    );
  }
  if (!quote) return <div className="p-10">Not found</div>;

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <Link href="/admin/quotes" className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-ember-600 mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> Back to quotes
      </Link>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="heading-display text-3xl">{quote.customer.name}</h1>
            <StatusBadge status={quote.status} />
          </div>
          <p className="text-ink-600">
            {quote.kind === 'booking' ? 'Online booking' : 'Custom quote request'} · {formatDate(quote.createdAt)}
          </p>
        </div>
        {quote.status === 'new' && (
          <div className="flex gap-2">
            <button onClick={() => setModal('reject')}
              className="px-5 py-2.5 rounded-full bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 inline-flex items-center gap-2">
              <X className="w-4 h-4" /> Reject
            </button>
            <button onClick={() => setModal('accept')}
              className="btn-primary !py-2.5 !px-5 text-sm">
              <Check className="w-4 h-4" /> Accept
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Customer + actions sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-ink-100 p-5">
            <h3 className="font-display font-bold text-sm mb-3">Customer</h3>
            <div className="space-y-2 text-sm">
              <a href={`tel:${quote.customer.phone}`} className="flex items-center gap-2 text-ember-600 hover:underline">
                <Phone className="w-3.5 h-3.5" /> {quote.customer.phone}
              </a>
              <a href={`mailto:${quote.customer.email}`} className="flex items-center gap-2 text-ember-600 hover:underline truncate">
                <Mail className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{quote.customer.email}</span>
              </a>
            </div>
          </div>

          {quote.estimatedPrice && (
            <div className="bg-gradient-to-br from-ember-500 to-ember-600 text-white rounded-3xl p-5">
              <div className="text-xs uppercase tracking-widest text-ember-100 font-semibold mb-1">Estimated price</div>
              <div className="font-display font-extrabold text-4xl">£{quote.estimatedPrice}</div>
              {quote.durationHours && <div className="text-xs text-ember-100 mt-1">{quote.durationHours}h booking</div>}
            </div>
          )}

          {quote.adminResponse?.message && (
            <div className="bg-ink-900 text-white rounded-3xl p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-ember-400 font-semibold mb-2">
                <MessageSquare className="w-3 h-3" /> Admin response
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{quote.adminResponse.message}</p>
              <p className="text-xs text-ink-400 mt-3">
                Sent {formatDate(quote.adminResponse.respondedAt)}
              </p>
            </div>
          )}
        </div>

        {/* Move details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-ink-100 p-5 lg:p-7">
            <h3 className="font-display font-bold text-sm mb-4 uppercase tracking-wider text-ink-500">Move details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Detail icon={Package} label="Type" value={quote.movingType} />
              <Detail icon={Calendar} label="Date" value={formatDate(quote.movingDate)} />
              <Detail icon={Users} label="Movers" value={quote.moversNeeded} />
              {quote.durationHours && <Detail icon={Clock} label="Duration" value={`${quote.durationHours} hours`} />}
              <Detail icon={MapPin} label="Pickup" value={
                <>
                  {quote.pickup?.address && <span className="block text-xs text-ink-500">{quote.pickup.address}</span>}
                  {quote.pickup?.postcode}
                  {quote.pickup?.floor && <span className="text-xs text-ink-500"> · {quote.pickup.floor}{quote.pickup.access ? ' (' + quote.pickup.access + ')' : ''}</span>}
                </>
              } />
              <Detail icon={MapPin} label="Delivery" value={
                <>
                  {quote.delivery?.address && <span className="block text-xs text-ink-500">{quote.delivery.address}</span>}
                  {quote.delivery?.postcode}
                  {quote.delivery?.floor && <span className="text-xs text-ink-500"> · {quote.delivery.floor}{quote.delivery.access ? ' (' + quote.delivery.access + ')' : ''}</span>}
                </>
              } />
              {quote.distanceMiles && <Detail icon={MapPin} label="Distance" value={`${quote.distanceMiles.toFixed(1)} miles`} />}
              {quote.isShortTrip && <Detail icon={Clock} label="Pricing" value={<span className="text-emerald-600 font-semibold">Short-trip rate</span>} />}
            </div>
          </div>

          {quote.notes && (
            <div className="bg-white rounded-3xl border border-ink-100 p-5 lg:p-7">
              <h3 className="font-display font-bold text-sm mb-3 uppercase tracking-wider text-ink-500 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Customer notes
              </h3>
              <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-wrap">{quote.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Accept / Reject modals */}
      <AnimatePresence>
        {modal && (
          <ResponseModal
            type={modal}
            quote={quote}
            onClose={() => setModal(null)}
            onDone={() => { setModal(null); load(); }}
          />
        )}
      </AnimatePresence>
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

function ResponseModal({ type, quote, onClose, onDone }) {
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState(quote.estimatedPrice || '');
  const [submitting, setSubmitting] = useState(false);

  const isAccept = type === 'accept';

  const useTemplate = () => {
    if (isAccept) {
      setMessage(
        `Hi ${quote.customer.name.split(' ')[0]},\n\n` +
        `Great news — we've reviewed your booking and we're confirmed for ${formatDate(quote.movingDate)}.\n\n` +
        `Our team will arrive on the day with everything needed. Please ensure parking is available near the pickup, and let us know if anything changes.\n\n` +
        `Looking forward to helping you move!`
      );
    } else {
      setMessage(
        `Hi ${quote.customer.name.split(' ')[0]},\n\n` +
        `Thanks so much for considering us for your move. Unfortunately, we're not able to take on this booking — usually because the date is fully booked or the move falls outside our typical service area.\n\n` +
        `Please don't hesitate to get in touch if your dates change.\n\n` +
        `Best wishes,\nThe London Express Removals Team`
      );
    }
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      await api.post(`/quotes/${quote._id}/${isAccept ? 'accept' : 'reject'}`,
        isAccept ? { message, estimatedPrice: price || undefined } : { message }
      );
      toast.success(`Quote ${isAccept ? 'accepted' : 'rejected'} · customer notified`);
      onDone();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-lg w-full p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isAccept ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {isAccept ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-display font-bold text-xl">{isAccept ? 'Accept' : 'Reject'} quote</h3>
            <p className="text-xs text-ink-500">An email will be sent to {quote.customer.email}</p>
          </div>
        </div>

        {isAccept && (
          <div className="mb-4">
            <label className="text-xs font-semibold text-ink-600 mb-2 block">Confirmed price (£)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 189" className="input-field" />
          </div>
        )}

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-ink-600">Message to customer</label>
            <button onClick={useTemplate} className="text-xs font-semibold text-ember-600 hover:underline">Use template</button>
          </div>
          <textarea rows="8" value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder={`Write a brief message to ${quote.customer.name.split(' ')[0]}...`}
            className="input-field resize-none text-sm" />
        </div>

        <div className="bg-ink-50 rounded-xl p-3 text-xs text-ink-600 flex items-start gap-2 mb-5">
          <AlertCircle className="w-3.5 h-3.5 text-ember-500 mt-0.5 shrink-0" />
          <span>The customer will receive an email with this message and any details above. {isAccept && 'A WhatsApp confirmation will also be sent if their phone is valid.'}</span>
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} disabled={submitting}
            className="flex-1 px-4 py-3 rounded-full bg-ink-100 text-ink-700 font-semibold hover:bg-ink-200 transition">
            Cancel
          </button>
          <button onClick={submit} disabled={submitting}
            className={`flex-1 px-4 py-3 rounded-full text-white font-semibold transition disabled:opacity-50 ${
              isAccept ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
            }`}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin inline" /> : (isAccept ? 'Send acceptance' : 'Send rejection')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
