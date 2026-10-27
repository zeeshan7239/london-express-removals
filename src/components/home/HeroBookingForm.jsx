'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Flag, Calendar, Clock, Home, ChevronRight, AlertTriangle, Phone, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import PostcodeAutocomplete from '@/components/quote/PostcodeAutocomplete';
import { isInsideM25 } from '@/lib/services/pricingService';
import { getAvailableTimeSlots, formatTime12h } from '@/lib/utils/timeSlots';
import { UK_POSTCODE_REGEX } from '@/lib/utils/validation';
import { siteConfig } from '@/lib/utils/siteConfig';

const MOVE_TYPES = ['Studio', 'Flat', 'House', 'Office', 'Storage', 'Single Item'];
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function HeroBookingForm() {
  const router = useRouter();
  const [movingType, setMovingType] = useState('Flat');
  const [pickup, setPickup] = useState({ postcode: '', lat: null, lon: null });
  const [delivery, setDelivery] = useState({ postcode: '', lat: null, lon: null });
  const [movingDate, setMovingDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [today, setToday] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setToday(todayStr());
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const { slots, sameDayClosed } = useMemo(
    () => getAvailableTimeSlots(movingDate, new Date()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [movingDate, tick]
  );

  useEffect(() => {
    if (preferredTime && !slots.includes(preferredTime)) setPreferredTime('');
  }, [slots, preferredTime]);

  const inside = (s) =>
    s.postcode ? isInsideM25(s.postcode, s.lat != null ? { lat: s.lat, lon: s.lon } : null) : null;
  const outside = inside(pickup) === false || inside(delivery) === false;

  const buildParams = () => {
    const p = new URLSearchParams();
    if (movingType) p.set('type', movingType);
    if (pickup.postcode) p.set('pickup', pickup.postcode);
    if (delivery.postcode) p.set('delivery', delivery.postcode);
    if (movingDate) p.set('date', movingDate);
    if (preferredTime) p.set('time', preferredTime);
    if (pickup.lat != null) { p.set('plat', pickup.lat); p.set('plon', pickup.lon); }
    if (delivery.lat != null) { p.set('dlat', delivery.lat); p.set('dlon', delivery.lon); }
    return p.toString();
  };

  const submit = (e) => {
    e.preventDefault();
    if (!UK_POSTCODE_REGEX.test(pickup.postcode.trim())) return toast.error('Enter a valid pick-up postcode.');
    if (!UK_POSTCODE_REGEX.test(delivery.postcode.trim())) return toast.error('Enter a valid delivery postcode.');
    if (outside) return router.push(`/custom-quote?${buildParams()}`);
    if (!movingDate) return toast.error('Please choose your moving date.');
    if (sameDayClosed) return toast.error('Online booking for today is no longer available. Please select another date or contact us directly.');
    if (!preferredTime) return toast.error('Please choose a preferred time.');
    router.push(`/booking?${buildParams()}`);
  };

  const label = 'text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2';

  return (
    <form onSubmit={submit} className="relative bg-white text-ink-900 rounded-3xl shadow-pop p-5 sm:p-6 lg:p-7 w-full" noValidate>
      <div className="mb-4">
        <div className="text-xs uppercase tracking-widest text-ember-600 font-bold">Instant quote</div>
        <h2 className="font-display font-extrabold text-xl sm:text-2xl leading-tight">Book your move in 60 seconds</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="hero-type" className={label}><Home className="w-3.5 h-3.5 text-ember-500" /> What are you moving?</label>
          <select id="hero-type" value={movingType} onChange={(e) => setMovingType(e.target.value)} className="input-field">
            {MOVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <PostcodeAutocomplete id="hero-pickup" label="Pick-up postcode" icon={MapPin} value={pickup.postcode}
            onChange={(v) => setPickup({ postcode: v, lat: null, lon: null })}
            onSelect={(d) => d && setPickup((p) => ({ ...p, lat: d.latitude, lon: d.longitude }))} />
          <PostcodeAutocomplete id="hero-delivery" label="Delivery postcode" icon={Flag} value={delivery.postcode}
            onChange={(v) => setDelivery({ postcode: v, lat: null, lon: null })}
            onSelect={(d) => d && setDelivery((p) => ({ ...p, lat: d.latitude, lon: d.longitude }))} />
        </div>

        {outside ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <div className="flex items-start gap-2 font-semibold text-amber-900">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              This move is outside the M25, so we quote it individually.
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href={`/custom-quote?${buildParams()}`} className="btn-primary !py-2 !px-4 text-sm">Request custom quote</Link>
              <a href={`https://wa.me/${siteConfig.phoneRaw.replace(/\D/g, '')}`} className="btn-ghost !py-2 !px-4 text-sm"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
              <a href={`tel:${siteConfig.phoneRaw}`} className="btn-ghost !py-2 !px-4 text-sm"><Phone className="w-4 h-4" /> Call</a>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hero-date" className={label}><Calendar className="w-3.5 h-3.5 text-ember-500" /> Moving date</label>
              <input id="hero-date" type="date" min={today || undefined} value={movingDate}
                onChange={(e) => setMovingDate(e.target.value)} className="input-field" />
            </div>
            <div>
              <label htmlFor="hero-time" className={label}><Clock className="w-3.5 h-3.5 text-ember-500" /> Preferred time</label>
              <select id="hero-time" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)}
                disabled={!movingDate || sameDayClosed} className="input-field disabled:bg-ink-50 disabled:text-ink-400">
                <option value="">{movingDate ? 'Select a time' : 'Pick a date first'}</option>
                {slots.map((s) => <option key={s} value={s}>{formatTime12h(s)}</option>)}
              </select>
            </div>
            {sameDayClosed && (
              <p className="sm:col-span-2 text-xs text-red-600 -mt-2">
                Online booking for today is no longer available. Please select another date or contact us directly.
              </p>
            )}
          </div>
        )}

        {!outside && (
          <button type="submit" className="btn-primary w-full !py-4 text-base group">
            Get my instant price <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </button>
        )}
        <p className="text-xs text-ink-500 text-center">No hidden fees · Transparent pricing · Takes about a minute</p>
      </div>
    </form>
  );
}
