'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Building2, Briefcase, Package, Warehouse, Building,
  Calendar, User, Users, UserPlus, HelpCircle,
  ChevronLeft, ChevronRight, Check, Mail, Phone,
  UserCircle, FileText, Loader2, Layers, ArrowUp, ArrowUpToLine,
  Clock, Sparkles, ShieldCheck, AlertCircle, Inbox, ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import PostcodeAutocomplete from '@/components/quote/PostcodeAutocomplete';
import AddressPicker from '@/components/quote/AddressPicker';
import BookingSummary from '@/components/quote/BookingSummary';
import { useAuth } from '@/components/common/AuthContext';
import { isValidEmail, isValidUKPhone } from '@/lib/utils/validation';
import api from '@/lib/utils/api';

const movingTypes = [
  { v: 'Studio',      icon: Home,      desc: 'Studio flat' },
  { v: 'Flat',        icon: Building2, desc: '1-3 bed flat' },
  { v: 'House',       icon: Building,  desc: '1-5+ bed house' },
  { v: 'Office',      icon: Briefcase, desc: 'Small to mid office' },
  { v: 'Storage',     icon: Warehouse, desc: 'To/from storage' },
  { v: 'Single Item', icon: Package,   desc: 'Sofa, fridge, etc.' },
];

const floorDropdown = [
  'Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor',
  '5th Floor', '6th Floor', '6th Floor or Above',
];

const accessOptions = [
  { v: 'Lift',   icon: Layers,        desc: 'Lift access' },
  { v: 'Stairs', icon: ArrowUp,       desc: 'Stairs only' },
  { v: 'Both',   icon: ArrowUpToLine, desc: 'Lift + stairs' },
];

const moversOptions = [
  { v: '1 Man',    icon: User,       desc: 'Driver help' },
  { v: '2 Men',    icon: Users,      desc: 'Most moves' },
  { v: '3 Men',    icon: UserPlus,   desc: 'Big homes' },
  { v: 'Not Sure', icon: HelpCircle, desc: 'We\'ll advise' },
];

const durationOptions = [2, 3, 4, 5, 6, 8];
const STEPS = 4;
const isGroundFloor = (f) => f === 'Ground Floor';

export default function BookingPage() {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [newBookingId, setNewBookingId] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [hours, setHours] = useState(2);
  const [selectedTeamKey, setSelectedTeamKey] = useState(null);
  const prevPriceRef = useRef(null);

  const [data, setData] = useState({
    movingType: '',
    pickup: { postcode: '', address: '', floor: '', access: '', lat: null, lon: null },
    delivery: { postcode: '', address: '', floor: '', access: '', lat: null, lon: null },
    movingDate: '', moversNeeded: '', notes: '',
    customer: { name: '', email: '', phone: '' },
  });

  // Pre-fill customer details when a logged-in user starts a booking.
  // Only fills empty fields so it never overwrites typed-in data.
  useEffect(() => {
    if (!user) return;
    setData((prev) => ({
      ...prev,
      customer: {
        name: prev.customer.name || user.fullName || '',
        email: prev.customer.email || user.email || '',
        phone: prev.customer.phone || user.phone || '',
      },
    }));
  }, [user]);

  const set = (path, value) => {
    setData((prev) => {
      const [a, b] = path.split('.');
      if (!b) return { ...prev, [a]: value };
      const next = { ...prev, [a]: { ...prev[a], [b]: value } };
      if (b === 'floor' && isGroundFloor(value)) next[a].access = '';
      return next;
    });
  };

  const mergeSide = (side, patch) => {
    setData((prev) => ({ ...prev, [side]: { ...prev[side], ...patch } }));
  };

  // Live pricing recalculation
  useEffect(() => {
    const ready = data.movingType &&
      data.pickup.postcode && data.delivery.postcode &&
      data.pickup.floor && data.delivery.floor &&
      data.moversNeeded;

    if (!ready) { setPricing(null); return; }

    let cancelled = false;
    setPricingLoading(true);

    const t = setTimeout(async () => {
      try {
        const { data: result } = await api.post('/pricing/calculate', {
          pickupPostcode: data.pickup.postcode,
          deliveryPostcode: data.delivery.postcode,
          pickupLatLng: data.pickup.lat != null ? { lat: data.pickup.lat, lon: data.pickup.lon } : undefined,
          deliveryLatLng: data.delivery.lat != null ? { lat: data.delivery.lat, lon: data.delivery.lon } : undefined,
          pickupFloor: data.pickup.floor,
          pickupHasLift: data.pickup.access === 'Lift' || data.pickup.access === 'Both',
          deliveryFloor: data.delivery.floor,
          deliveryHasLift: data.delivery.access === 'Lift' || data.delivery.access === 'Both',
          propertyType: data.movingType,
          moversNeeded: data.moversNeeded,
          hours,
        });
        if (!cancelled) setPricing(result);
      } catch {
        if (!cancelled) setPricing({ ok: false, reason: 'error' });
      } finally {
        if (!cancelled) setPricingLoading(false);
      }
    }, 350);

    return () => { cancelled = true; clearTimeout(t); };
  }, [
    data.movingType, data.moversNeeded, hours,
    data.pickup.postcode, data.pickup.lat, data.pickup.floor, data.pickup.access,
    data.delivery.postcode, data.delivery.lat, data.delivery.floor, data.delivery.access,
  ]);

  // Auto-select + toast on price changes
  useEffect(() => {
    if (!pricing?.ok || !pricing.teams?.length) return;
    if (!selectedTeamKey) {
      const rec = pricing.teams.find((t) => t.teamKey === 'twoMen') || pricing.teams[0];
      setSelectedTeamKey(rec.teamKey);
    }
    const team = pricing.teams.find((t) => t.teamKey === (selectedTeamKey || 'twoMen')) || pricing.teams[0];
    if (team && prevPriceRef.current == null) {
      toast.success('Estimated booking price updated', { duration: 2000, id: 'price-toast' });
      prevPriceRef.current = team.total;
    } else if (team && Math.abs(team.total - prevPriceRef.current) >= 5) {
      toast.success(`Price updated: £${team.total}`, { duration: 1800, id: 'price-toast' });
      prevPriceRef.current = team.total;
    }
  }, [pricing, selectedTeamKey]);

  const selectedTeam = pricing?.teams?.find((t) => t.teamKey === selectedTeamKey);

  const validateStep = () => {
    switch (step) {
      case 1: return data.movingType ? null : { message: 'Please choose what you\'re moving.' };
      case 2: {
        if (!data.pickup.postcode) return { message: 'Please enter your pickup postcode.', fieldId: 'pickup-postcode' };
        if (!data.delivery.postcode) return { message: 'Please enter your delivery postcode.', fieldId: 'delivery-postcode' };
        if (!data.pickup.floor) return { message: 'Please select your pickup floor.', fieldId: 'pickup-floor' };
        if (!isGroundFloor(data.pickup.floor) && !data.pickup.access)
          return { message: 'Please select whether the pickup has lift or stairs access.', fieldId: 'pickup-access' };
        if (!data.delivery.floor) return { message: 'Please select your delivery floor.', fieldId: 'delivery-floor' };
        if (!isGroundFloor(data.delivery.floor) && !data.delivery.access)
          return { message: 'Please select whether the delivery has lift or stairs access.', fieldId: 'delivery-access' };
        if (!data.movingDate) return { message: 'Please choose your preferred moving date.', fieldId: 'moving-date' };
        return null;
      }
      case 3:
        if (!data.moversNeeded) return { message: 'Please choose how many movers you need.' };
        if (!selectedTeam) return { message: 'Please wait while we calculate your price, or select a team option.' };
        return null;
      case 4: {
        if (!data.customer.name?.trim()) return { message: 'Please enter your full name.', fieldId: 'customer-name' };
        if (!isValidEmail(data.customer.email)) return { message: 'Please enter a valid email address.', fieldId: 'customer-email' };
        if (!isValidUKPhone(data.customer.phone)) return { message: 'Please enter a valid UK phone number.', fieldId: 'customer-phone' };
        return null;
      }
      default: return null;
    }
  };

  const focusField = (id) => {
    if (!id) return;
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus({ preventScroll: true }); }
    }, 50);
  };

  const handleContinue = () => {
    const err = validateStep();
    if (err) { toast.error(err.message); focusField(err.fieldId); return; }
    setStep((s) => Math.min(STEPS, s + 1));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const cleanSide = (side) => ({
        postcode: side.postcode,
        address: side.address || undefined,
        floor: side.floor,
        lat: side.lat || undefined,
        lon: side.lon || undefined,
        ...(side.access ? { access: side.access } : {}),
      });

      const res = await api.post('/quotes', {
        kind: 'booking',
        movingType: data.movingType,
        pickup: cleanSide(data.pickup),
        delivery: cleanSide(data.delivery),
        movingDate: data.movingDate,
        moversNeeded: data.moversNeeded,
        durationHours: hours,
        distanceMiles: pricing?.coverage?.distanceMiles,
        travelMinutes: pricing?.coverage?.travelMinutes,
        isShortTrip: !!selectedTeam?.isShortTrip,
        estimatedPrice: selectedTeam?.total,
        notes: data.notes || undefined,
        customer: data.customer,
      });
      setNewBookingId(res.data?.quote?._id || null);
      setDone(true);
      toast.success('Booking submitted! We\'ll confirm shortly.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <section className="min-h-[80vh] flex items-center bg-gradient-to-br from-ink-50 to-white px-4 py-16">
        <div className="container-wide max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mx-auto flex items-center justify-center mb-6 shadow-pop"
          >
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </motion.div>
          <h1 className="heading-display text-4xl mb-4">Booking received! 🎉</h1>
          <p className="text-ink-600 text-lg leading-relaxed mb-6">
            Thanks {data.customer.name.split(' ')[0]}, we've got your booking details and will send you a confirmation
            email shortly. Our team will be in touch within 30 minutes to finalise everything.
          </p>

          <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6 mb-6 max-w-md mx-auto">
            <div className="text-xs uppercase tracking-widest text-ink-500 font-semibold mb-2">Estimated price</div>
            <div className="font-display font-extrabold text-4xl text-ember-600">£{selectedTeam?.total}</div>
            <div className="text-sm text-ink-500 mt-1">{selectedTeam?.label} · {hours}h booking</div>
            {newBookingId && (
              <div className="mt-4 pt-4 border-t border-ink-100">
                <div className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold">Reference</div>
                <div className="font-mono font-bold text-ink-900 mt-1">{newBookingId.slice(-8).toUpperCase()}</div>
              </div>
            )}
          </div>

          {/* Different CTAs depending on whether the user is signed in */}
          {user ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/my-bookings/${newBookingId || ''}`} className="btn-primary">
                <Inbox className="w-4 h-4" /> View my booking
              </Link>
              <Link href="/" className="btn-ghost">Back to homepage</Link>
            </div>
          ) : (
            <>
              <div className="bg-ember-50 border border-ember-200 rounded-2xl p-5 mb-4 max-w-md mx-auto text-left">
                <div className="flex items-start gap-3">
                  <Inbox className="w-5 h-5 text-ember-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm mb-1">Want to track your booking?</h3>
                    <p className="text-xs text-ink-700 leading-relaxed mb-3">
                      Create a free account with the same email ({data.customer.email}) and
                      you'll be able to view this booking, see its status, and book future moves with one click.
                    </p>
                    <Link href="/sign-up" className="inline-flex items-center gap-1 text-xs font-bold text-ember-600 hover:text-ember-700">
                      Create my account <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/" className="btn-ghost">Back to homepage</Link>
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark opacity-20 pointer-events-none" />
        <div className="container-wide relative py-12 lg:py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur text-xs font-semibold uppercase tracking-wider text-ember-400 mb-4">
            <Sparkles className="w-3 h-3" /> Live Booking
          </div>
          <h1 className="heading-display text-3xl lg:text-5xl !text-white mb-2">Book your move</h1>
          <p className="text-ink-300">Instant transparent pricing · M25 area · Secured and Safe</p>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-ink-50">
        <div className="container-wide grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-soft border border-ink-100 p-6 lg:p-10">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3 text-xs font-semibold">
                  <span className="text-ember-600 uppercase tracking-wider">Step {step} of {STEPS}</span>
                  <span className="text-ink-500">{Math.round((step / STEPS) * 100)}% complete</span>
                </div>
                <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-ember-500 to-ember-400 rounded-full"
                    initial={false}
                    animate={{ width: `${(step / STEPS) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {step === 1 && (
                    <>
                      <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">What are you moving?</h2>
                      <p className="text-ink-500 mb-6 text-sm">Pick the option that best fits.</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {movingTypes.map((t) => {
                          const Active = data.movingType === t.v;
                          const Icon = t.icon;
                          return (
                            <button
                              key={t.v}
                              onClick={() => set('movingType', t.v)}
                              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                                Active ? 'border-ember-500 bg-ember-50 shadow-glow-ember' :
                                'border-ink-100 hover:border-ink-300 hover:-translate-y-0.5'
                              }`}
                            >
                              <Icon className={`w-7 h-7 mb-3 ${Active ? 'text-ember-600' : 'text-ink-700'}`} />
                              <div className="font-semibold text-sm text-ink-900">{t.v}</div>
                              <div className="text-xs text-ink-500 mt-0.5">{t.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Where & when?</h2>
                      <p className="text-ink-500 mb-6 text-sm">Type your postcodes — we'll suggest matches as you go.</p>
                      <div className="space-y-6">
                        <div>
                          <div className="text-sm font-bold text-ink-900 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-ember-500" /> Pickup location
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <PostcodeAutocomplete
                              id="pickup-postcode"
                              label="Postcode"
                              value={data.pickup.postcode}
                              onChange={(v) => set('pickup.postcode', v)}
                              onSelect={(d) => mergeSide('pickup', d
                                ? { postcode: d.postcode, lat: d.latitude, lon: d.longitude }
                                : { lat: null, lon: null }
                              )}
                            />
                            <AddressPicker
                              postcode={data.pickup.postcode}
                              value={data.pickup.address}
                              onChange={(v) => set('pickup.address', v)}
                            />
                          </div>
                          <FloorAndAccess side="pickup" data={data.pickup} set={(k, v) => set(`pickup.${k}`, v)} />
                        </div>

                        <div className="border-t border-ink-100 pt-6">
                          <div className="text-sm font-bold text-ink-900 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-ink-900" /> Delivery location
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <PostcodeAutocomplete
                              id="delivery-postcode"
                              label="Postcode"
                              value={data.delivery.postcode}
                              onChange={(v) => set('delivery.postcode', v)}
                              onSelect={(d) => mergeSide('delivery', d
                                ? { postcode: d.postcode, lat: d.latitude, lon: d.longitude }
                                : { lat: null, lon: null }
                              )}
                            />
                            <AddressPicker
                              postcode={data.delivery.postcode}
                              value={data.delivery.address}
                              onChange={(v) => set('delivery.address', v)}
                            />
                          </div>
                          <FloorAndAccess side="delivery" data={data.delivery} set={(k, v) => set(`delivery.${k}`, v)} />
                        </div>

                        <div className="border-t border-ink-100 pt-6">
                          <label htmlFor="moving-date" className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-ember-500" /> Preferred moving date
                          </label>
                          <input
                            id="moving-date" type="date" min={today}
                            className="input-field max-w-xs"
                            value={data.movingDate}
                            onChange={(e) => set('movingDate', e.target.value)}
                          />
                        </div>
                      </div>

                      {pricing && !pricing.ok && pricing.reason === 'outside_m25' && (
                        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div className="flex-1 text-sm">
                            <div className="font-bold text-ink-900">Outside M25 coverage</div>
                            <p className="text-ink-700 mt-1">For locations outside the M25, please request a custom quote.</p>
                            <a href="/custom-quote" className="text-ember-600 font-semibold hover:underline text-xs mt-2 inline-block">
                              → Request custom quote
                            </a>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {step === 3 && (
                    <TeamSelectionStep
                      data={data} set={set} hours={hours} setHours={setHours}
                      pricing={pricing} pricingLoading={pricingLoading}
                      selectedTeamKey={selectedTeamKey} setSelectedTeamKey={setSelectedTeamKey}
                    />
                  )}

                  {step === 4 && (
                    <>
                      <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Your details</h2>
                      <p className="text-ink-500 mb-6 text-sm">Last step — we'll confirm your booking shortly after.</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label htmlFor="customer-name" className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                            <UserCircle className="w-3.5 h-3.5 text-ember-500" /> Full name
                          </label>
                          <input
                            id="customer-name" type="text" placeholder="Jane Smith" autoComplete="name"
                            className={`input-field ${data.customer.name?.trim() ? 'border-emerald-500' : ''}`}
                            value={data.customer.name}
                            onChange={(e) => set('customer.name', e.target.value)}
                          />
                        </div>
                        <div>
                          <label htmlFor="customer-email" className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-ember-500" /> Email
                          </label>
                          <input
                            id="customer-email" type="email" placeholder="you@example.com" autoComplete="email"
                            className={`input-field ${
                              data.customer.email && isValidEmail(data.customer.email) ? 'border-emerald-500' :
                              data.customer.email ? 'border-red-400' : ''
                            }`}
                            value={data.customer.email}
                            onChange={(e) => set('customer.email', e.target.value)}
                          />
                          {data.customer.email && !isValidEmail(data.customer.email) && (
                            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Please enter a valid email address
                            </p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="customer-phone" className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-ember-500" /> Phone
                          </label>
                          <input
                            id="customer-phone" type="tel" placeholder="07000 000 000" autoComplete="tel"
                            className={`input-field ${
                              data.customer.phone && isValidUKPhone(data.customer.phone) ? 'border-emerald-500' :
                              data.customer.phone ? 'border-red-400' : ''
                            }`}
                            value={data.customer.phone}
                            onChange={(e) => set('customer.phone', e.target.value)}
                          />
                          {data.customer.phone && !isValidUKPhone(data.customer.phone) && (
                            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Please enter a valid UK phone number
                            </p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-ember-500" /> Notes <span className="text-ink-400 font-normal">(optional)</span>
                          </label>
                          <textarea
                            rows="3"
                            placeholder="Parking, fragile items, anything we should know?"
                            className="input-field resize-none"
                            value={data.notes}
                            onChange={(e) => set('notes', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-ink-50 rounded-xl text-xs text-ink-600 flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Your data is secure. By submitting you agree to our <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a>.</span>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-ink-100">
                <button
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="flex items-center gap-1 text-sm font-semibold text-ink-600 hover:text-ink-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                {step < STEPS ? (
                  <button onClick={handleContinue} className="btn-primary">
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const err = validateStep();
                      if (err) { toast.error(err.message); focusField(err.fieldId); return; }
                      submit();
                    }}
                    disabled={submitting}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> :
                     <>Confirm booking <Check className="w-4 h-4" /></>}
                  </button>
                )}
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <BookingSummary data={data} selectedTeam={selectedTeam} hours={hours} />
            </div>
          </aside>
        </div>
      </section>

      {selectedTeam && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-ink-100 px-4 py-3 shadow-pop">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold">Estimated total</div>
              <div className="font-display font-extrabold text-2xl text-ink-900">£{selectedTeam.total}</div>
            </div>
            <div className="text-xs text-ink-500 text-right">{selectedTeam.label}<br />{hours}h booking</div>
          </div>
        </div>
      )}
    </>
  );
}

function FloorAndAccess({ side, data, set }) {
  const ground = isGroundFloor(data.floor);
  return (
    <div className="mt-4 space-y-3">
      <div>
        <label htmlFor={`${side}-floor`} className="text-xs font-semibold text-ink-600 mb-2 block">Floor</label>
        <div className="relative">
          <select
            id={`${side}-floor`}
            value={data.floor}
            onChange={(e) => set('floor', e.target.value)}
            className={`input-field appearance-none pr-10 cursor-pointer ${data.floor ? 'border-emerald-500' : ''}`}
          >
            <option value="">Select floor...</option>
            {floorDropdown.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 rotate-90 pointer-events-none" />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {data.floor && !ground && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <label className="text-xs font-semibold text-ink-600 mb-2 block">Access</label>
            <div id={`${side}-access`} className="grid grid-cols-3 gap-2">
              {accessOptions.map((a) => {
                const Active = data.access === a.v;
                const Icon = a.icon;
                return (
                  <button
                    key={a.v}
                    onClick={() => set('access', a.v)}
                    className={`p-2.5 rounded-xl border-2 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      Active ? 'border-ember-500 bg-ember-50 text-ember-700' : 'border-ink-100 text-ink-600 hover:border-ink-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {a.v}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
        {ground && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
            <Check className="w-3.5 h-3.5" /> No stairs — ground floor.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TeamSelectionStep({ data, set, hours, setHours, pricing, pricingLoading, selectedTeamKey, setSelectedTeamKey }) {
  return (
    <>
      <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Team & duration</h2>
      <p className="text-ink-500 mb-6 text-sm">Pick your team size and how long you'll need them.</p>

      <div className="mb-6">
        <label className="text-xs font-semibold text-ink-600 mb-2 block">Movers needed</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {moversOptions.map((m) => {
            const Active = data.moversNeeded === m.v;
            const Icon = m.icon;
            return (
              <button
                key={m.v}
                onClick={() => set('moversNeeded', m.v)}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                  Active ? 'border-ember-500 bg-ember-50 shadow-glow-ember' :
                  'border-ink-100 hover:border-ink-300 hover:-translate-y-0.5'
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${Active ? 'text-ember-600' : 'text-ink-700'}`} />
                <div className="font-semibold text-xs">{m.v}</div>
                <div className="text-[10px] text-ink-500 mt-0.5">{m.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-ember-500" /> Booking duration
        </label>
        <div className="flex gap-2">
          {durationOptions.map((h) => (
            <button
              key={h}
              onClick={() => setHours(h)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
                hours === h ? 'bg-ink-900 text-white' : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
              }`}
            >
              {h}h
            </button>
          ))}
        </div>
        <p className="text-[11px] text-ink-500 mt-2">Pay only for the time you use. We won't rush you.</p>
      </div>

      {pricingLoading && !pricing && (
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-ember-500 mx-auto mb-2" />
          <p className="text-sm text-ink-500">Calculating prices...</p>
        </div>
      )}

      {pricing?.ok && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-ink-700 font-semibold">Pricing available</span>
            {pricing.coverage?.distanceMiles != null && (
              <span className="text-ink-500">· {pricing.coverage.distanceMiles.toFixed(1)} mi · {pricing.coverage.travelMinutes} min</span>
            )}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {pricing.teams.map((t) => (
              <TeamCard
                key={t.teamKey}
                team={t}
                active={selectedTeamKey === t.teamKey}
                onSelect={() => {
                  setSelectedTeamKey(t.teamKey);
                  const map = { driverHelp: '1 Man', twoMen: '2 Men', threeMen: '3 Men' };
                  if (map[t.teamKey]) set('moversNeeded', map[t.teamKey]);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {pricing && !pricing.ok && pricing.reason === 'outside_m25' && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-bold text-ink-900 mb-1">Outside M25 — request a custom quote</div>
            <p className="text-ink-700">We still cover the whole UK. Our team can give you a tailored quote within 30 minutes.</p>
            <a href="/custom-quote" className="inline-block mt-2 text-ember-600 font-semibold hover:underline">
              Request a custom quote →
            </a>
          </div>
        </div>
      )}
    </>
  );
}

function TeamCard({ team, active, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`relative p-5 rounded-2xl border-2 text-left transition-all ${
        active ? 'border-ember-500 bg-ember-50 shadow-glow-ember' :
        'border-ink-100 hover:border-ink-300 hover:-translate-y-0.5 bg-white'
      }`}
    >
      {team.isShortTrip && (
        <span className="absolute -top-2 left-3 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider">
          Short-trip rate
        </span>
      )}
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${active ? 'bg-ember-500' : 'bg-ink-900'}`}>
          <Users className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="font-display font-bold text-sm text-ink-900">{team.label}</div>
          <div className="text-[11px] text-ink-500">{team.sublabel}</div>
        </div>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-xl font-bold text-ink-500">£</span>
        <span className="font-display font-extrabold text-3xl text-ink-900">{team.total}</span>
      </div>
      <div className="text-xs text-ink-500 mb-3">
        Includes {team.requestedHours}h · +£{team.extraHourRate}/extra hour
      </div>
      <div className="text-xs space-y-1 pt-3 border-t border-ink-100">
        {team.breakdown.map((b, i) => (
          <div key={i} className="flex items-center justify-between text-ink-600">
            <span className="truncate pr-2">{b.label}</span>
            <span className="font-semibold text-ink-900 shrink-0">£{b.amount}</span>
          </div>
        ))}
      </div>
    </button>
  );
}
