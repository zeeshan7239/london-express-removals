'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Building2, Briefcase, Package, Warehouse, Building,
  Calendar, User, Users, UserPlus, HelpCircle,
  ChevronLeft, ChevronRight, Check, Mail, Phone,
  UserCircle, FileText, Loader2, Layers, ArrowUp, ArrowUpToLine,
  Clock, Sparkles, ShieldCheck, AlertCircle, Inbox, ArrowRight,
  MapPin, Plus, Trash2, Box, Minus, MessageCircle, Bed, Sofa,
  Wrench, Car, PackagePlus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import PostcodeAutocomplete from '@/components/quote/PostcodeAutocomplete';
import AddressPicker from '@/components/quote/AddressPicker';
import BookingSummary from '@/components/quote/BookingSummary';
import { useAuth } from '@/components/common/AuthContext';
import { isValidEmail, isValidUKPhone } from '@/lib/utils/validation';
import { siteConfig } from '@/lib/utils/siteConfig';
import { isInsideM25 } from '@/lib/services/pricingService';
import { getAvailableTimeSlots, formatTime12h } from '@/lib/utils/timeSlots';
import api from '@/lib/utils/api';

// Packing prices (internal only — never shown in form)
const BOX_PRICE  = 5;
const WRAP_PRICE = 15;
const TAPE_PRICE = 10;  // per roll

const movingTypes = [
  { v: 'Studio',      icon: Home,      desc: 'Studio flat' },
  { v: 'Flat',        icon: Building2, desc: '1-3 bed flat' },
  { v: 'House',       icon: Building,  desc: '1-5+ bed house' },
  { v: 'Office',      icon: Briefcase, desc: 'Small to mid office' },
  { v: 'Storage',     icon: Warehouse, desc: 'To/from storage' },
  { v: 'Single Item', icon: Package,   desc: 'Sofa, fridge, etc.' },
];

const floorDropdown = [
  'Ground Floor','1st Floor','2nd Floor','3rd Floor',
  '4th Floor','5th Floor','6th Floor','6th Floor or Above',
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
  { v: 'Not Sure', icon: HelpCircle, desc: "We'll advise" },
];

const bedroomOptions = ['Studio', '1 Bedroom', '2 Bedrooms', '3 Bedrooms', '4 Bedrooms', '5+ Bedrooms'];

const durationOptions = [2, 3, 4, 5, 6, 8];
const STEPS = 5;
const isGroundFloor = (f) => f === 'Ground Floor';
const emptyStop = () => ({ postcode: '', address: '', floor: '', access: '', lat: null, lon: null });

/** Internal packing total (never shown until final summary). */
const calcPackingTotal = (pm) => {
  const boxes = (pm.smallBoxes || 0) + (pm.mediumBoxes || 0) + (pm.largeBoxes || 0);
  return boxes * BOX_PRICE
       + (pm.bubbleWrapRolls || 0) * WRAP_PRICE
       + (pm.tapeRolls || 0) * TAPE_PRICE;
};

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

  // Multi-stop: single pickup → optional stops → single delivery
  const [stops, setStops] = useState([]);

  // Packing
  const [wantsPacking, setWantsPacking] = useState(false);
  const [packing, setPacking] = useState({
    smallBoxes: 0, mediumBoxes: 0, largeBoxes: 0, bubbleWrapRolls: 0, tapeRolls: 0,
  });

  // Additional details
  const [bedrooms,     setBedrooms]     = useState('');
  const [numBeds,      setNumBeds]      = useState(0);
  const [numSofas,     setNumSofas]     = useState(0);
  const [numLargeItems,setNumLargeItems]= useState(0);
  const [dismantling,  setDismantling]  = useState(false);
  const [reassembly,   setReassembly]   = useState(false);
  const [parking,      setParking]      = useState(''); // '', 'yes', 'no'

  


  const prevPriceRef = useRef(null);

  const [data, setData] = useState({
    movingType: '',
    pickup:   { postcode: '', address: '', floor: '', access: '', lat: null, lon: null },
    delivery: { postcode: '', address: '', floor: '', access: '', lat: null, lon: null },
    movingDate: '', preferredTime: '', moversNeeded: '', notes: '',
    customer: { name: '', email: '', phone: '' },
  });

  useEffect(() => {
    if (!user) return;
    setData((prev) => ({
      ...prev,
      customer: {
        name:  prev.customer.name  || user.fullName || '',
        email: prev.customer.email || user.email    || '',
        phone: prev.customer.phone || user.phone    || '',
      },
    }));
  }, [user]);

  // ── Dynamic time slots (spec #5) ────────────────────────────────────────────
  // Same-day bookings hide slots that have already passed (with a buffer).
  // We tick a `nowTick` value every 60 s so if the customer sits on the form
  // for a while, the earliest slot rolls forward automatically.
  const [nowTick, setNowTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setNowTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const { slots: availableTimeSlots, sameDayClosed } = useMemo(
    () => getAvailableTimeSlots(data.movingDate, new Date()),
    // nowTick is intentionally included so slots refresh over time
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.movingDate, nowTick]
  );

  // If the customer's chosen time is no longer valid (e.g. they picked a slot,
  // then time passed, or they switched to a same-day booking), clear it.
  useEffect(() => {
    if (!data.preferredTime) return;
    if (!availableTimeSlots.includes(data.preferredTime)) {
      setData((prev) => ({ ...prev, preferredTime: '' }));
    }
  }, [availableTimeSlots, data.preferredTime]);

   // ── Email verification state ────────────────────────────────────────
  // Logged-in users skip verification entirely (their email is already trusted).
  // Guests must send + enter a 6-digit code before they can submit.
  const [otpSent, setOtpSent]           = useState(false);
  const [otpCode, setOtpCode]           = useState('');
  const [otpVerified, setOtpVerified]   = useState(false);
  const [otpSending, setOtpSending]     = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpCooldown, setOtpCooldown]   = useState(0); // seconds

  // If the user changes their email after verifying, invalidate the verification
  useEffect(() => {
    if (otpVerified) {
      setOtpVerified(false);
      setOtpSent(false);
      setOtpCode('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.customer.email]);

  // Countdown timer for the resend cooldown
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = setTimeout(() => setOtpCooldown(s => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [otpCooldown]);

  // Handlers
  const handleSendOTP = async () => {
    if (!isValidEmail(data.customer.email)) {
      return toast.error('Please enter a valid email first');
    }
    setOtpSending(true);
    try {
      await api.post('/verify-email/send', { email: data.customer.email });
      setOtpSent(true);
      setOtpCooldown(60);
      toast.success('Code sent — check your inbox (and spam folder)');
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not send code';
      if (err.response?.data?.secondsLeft) {
        setOtpCooldown(err.response.data.secondsLeft);
      }
      toast.error(msg);
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!/^\d{6}$/.test(otpCode.trim())) {
      return toast.error('Enter the 6-digit code');
    }
    setOtpVerifying(true);
    try {
      await api.post('/verify-email/verify', {
        email: data.customer.email,
        code: otpCode.trim(),
      });
      setOtpVerified(true);
      toast.success('Email verified ✓');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Wrong code');
    } finally {
      setOtpVerifying(false);
    }
  };


  const set = (path, value) => {
    setData((prev) => {
      const [a, b] = path.split('.');
      if (!b) return { ...prev, [a]: value };
      const next = { ...prev, [a]: { ...prev[a], [b]: value } };
      if (b === 'floor' && isGroundFloor(value)) next[a].access = '';
      return next;
    });
  };

  const mergeSide = (side, patch) => setData((prev) => ({ ...prev, [side]: { ...prev[side], ...patch } }));

  // Stop management (single "stops" array between pickup and delivery)
  const addStop = () => setStops(s => [...s, emptyStop()]);
  const removeStop = (i) => setStops(s => s.filter((_, idx) => idx !== i));
  const setStop = (i, patch) => setStops(s => s.map((st, idx) => idx === i ? { ...st, ...patch } : st));

  // Packing total (only meaningful when wantsPacking)
  const packingTotal = wantsPacking ? calcPackingTotal(packing) : 0;

  // ── M25 detection (fast, synchronous — no API call needed) ────────────────
  // Runs on every postcode change. This is the FIX for the "please wait" bug:
  // if either postcode is outside M25, we short-circuit BEFORE calling the API.
  const pickupHasLocation   = !!(data.pickup.postcode);
  const deliveryHasLocation = !!(data.delivery.postcode);

  // Check each location. isInsideM25 handles both postcode-only and postcode+latlng.
  const pickupInside   = pickupHasLocation
    ? isInsideM25(data.pickup.postcode, data.pickup.lat != null ? { lat: data.pickup.lat, lon: data.pickup.lon } : null)
    : null;
  const deliveryInside = deliveryHasLocation
    ? isInsideM25(data.delivery.postcode, data.delivery.lat != null ? { lat: data.delivery.lat, lon: data.delivery.lon } : null)
    : null;

  // Also check any intermediate stops
  const anyStopOutside = stops.some(s => {
    if (!s.postcode) return false;
    return !isInsideM25(s.postcode, s.lat != null ? { lat: s.lat, lon: s.lon } : null);
  });

  // Show the outside-M25 banner as soon as we know ANY postcode is out of area.
  // We don't wait for both — one is enough to disqualify from instant booking.
  const anyOutside =
       (pickupInside   === false)
    || (deliveryInside === false)
    || anyStopOutside;

  // ── Live pricing ──
  // Guarded so we NEVER call the API when we already know it's outside M25.
  // That's what fixes the "please wait while we calculate" hang.
  useEffect(() => {
    const ready = data.movingType && data.pickup.postcode && data.delivery.postcode
      && data.pickup.floor && data.delivery.floor && data.moversNeeded;

    // If any location is outside M25, skip the API entirely
    if (!ready || anyOutside) {
      setPricing(null);
      setPricingLoading(false);
      return;
    }

    let cancelled = false;
    setPricingLoading(true);
    const t = setTimeout(async () => {
      try {
        const { data: result } = await api.post('/pricing/calculate', {
          pickupPostcode:   data.pickup.postcode,
          deliveryPostcode: data.delivery.postcode,
          pickupLatLng:    data.pickup.lat   != null ? { lat: data.pickup.lat,   lon: data.pickup.lon   } : undefined,
          deliveryLatLng:  data.delivery.lat != null ? { lat: data.delivery.lat, lon: data.delivery.lon } : undefined,
          pickupFloor:     data.pickup.floor,
          pickupHasLift:   data.pickup.access === 'Lift' || data.pickup.access === 'Both',
          deliveryFloor:   data.delivery.floor,
          deliveryHasLift: data.delivery.access === 'Lift' || data.delivery.access === 'Both',
          propertyType:    data.movingType,
          moversNeeded:    data.moversNeeded,
          hours,
        });
        if (!cancelled) setPricing(result);
      } catch { if (!cancelled) setPricing({ ok: false, reason: 'error' }); }
      finally  { if (!cancelled) setPricingLoading(false); }
    }, 350);
    return () => { cancelled = true; clearTimeout(t); };
  }, [
    data.movingType, data.moversNeeded, hours,
    data.pickup.postcode,   data.pickup.lat,   data.pickup.floor,   data.pickup.access,
    data.delivery.postcode, data.delivery.lat, data.delivery.floor, data.delivery.access,
    anyOutside,
  ]);

  useEffect(() => {
    if (!pricing?.ok || !pricing.teams?.length) return;
    if (!selectedTeamKey) {
      const rec = pricing.teams.find(t => t.teamKey === 'twoMen') || pricing.teams[0];
      setSelectedTeamKey(rec.teamKey);
    }
    const team = pricing.teams.find(t => t.teamKey === (selectedTeamKey || 'twoMen')) || pricing.teams[0];
    if (!team) return;
    const total = team.total + packingTotal;
    if (prevPriceRef.current == null) {
      toast.success('Price calculated', { duration: 1800, id: 'price-toast' });
      prevPriceRef.current = total;
    } else if (Math.abs(total - prevPriceRef.current) >= 5) {
      toast.success(`Price updated: £${total}`, { duration: 1800, id: 'price-toast' });
      prevPriceRef.current = total;
    }
  }, [pricing, selectedTeamKey, packingTotal]);

  const selectedTeam  = pricing?.teams?.find(t => t.teamKey === selectedTeamKey);
  const selectedTotal = selectedTeam ? selectedTeam.total + packingTotal : null;

  const validateStep = () => {
    switch (step) {
      case 1: return data.movingType ? null : { message: "Please choose what you're moving." };
      case 2: {
        if (!data.pickup.postcode)   return { message: 'Please enter your pickup postcode.',   fieldId: 'pickup-postcode' };
        if (!data.delivery.postcode) return { message: 'Please enter your delivery postcode.', fieldId: 'delivery-postcode' };
        if (anyOutside)              return { message: 'Please request a custom quote for moves outside the M25.', block: true };
        if (!data.pickup.floor)      return { message: 'Please select the pickup floor.',      fieldId: 'pickup-floor' };
        if (!isGroundFloor(data.pickup.floor) && !data.pickup.access)
          return { message: 'Please select pickup lift or stairs.', fieldId: 'pickup-access' };
        if (!data.delivery.floor)    return { message: 'Please select the delivery floor.',    fieldId: 'delivery-floor' };
        if (!isGroundFloor(data.delivery.floor) && !data.delivery.access)
          return { message: 'Please select delivery lift or stairs.', fieldId: 'delivery-access' };
        if (!data.movingDate)        return { message: 'Please choose your moving date.',      fieldId: 'moving-date' };
        if (sameDayClosed)           return { message: 'Online booking for today is no longer available. Please select another date or contact us directly.', fieldId: 'moving-date' };
        return null;
      }
      case 3: {
        if (!data.moversNeeded) return { message: 'Please choose how many movers you need.' };
        if (!pricingLoading && !selectedTeam) return { message: 'Please wait while we calculate your price.' };
        return null;
      }
      case 4: return null; // property/packing details all optional
       case 5: {
        if (!data.customer.name?.trim())          return { message: 'Please enter your full name.',          fieldId: 'customer-name' };
        if (!isValidEmail(data.customer.email))   return { message: 'Please enter a valid email address.',   fieldId: 'customer-email' };
        if (!isValidUKPhone(data.customer.phone)) return { message: 'Please enter a valid UK phone number.', fieldId: 'customer-phone' };
        // Guests must verify email; logged-in users skip
        if (!user && !otpVerified)                return { message: 'Please verify your email address before booking.', fieldId: 'otp-code' };
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
    // Step 2 hard block if outside M25 — no continue at all
    if (step === 2 && anyOutside) {
      toast.error('This move is outside the M25. Please use the custom quote form.');
      return;
    }
    const err = validateStep();
    if (err) { toast.error(err.message); focusField(err.fieldId); return; }
    setStep(s => Math.min(STEPS, s + 1));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const cleanSide = (s) => ({
        postcode: s.postcode, address: s.address || undefined,
        floor: s.floor, lat: s.lat || undefined, lon: s.lon || undefined,
        ...(s.access ? { access: s.access } : {}),
      });
      const cleanStops = stops.filter(s => s.postcode).map(cleanSide);
      const res = await api.post('/quotes', {
        kind: 'booking',
        movingType:    data.movingType,
        pickup:        cleanSide(data.pickup),
        delivery:      cleanSide(data.delivery),
        stops:         cleanStops,
        movingDate:    data.movingDate,
        preferredTime: data.preferredTime || undefined,
        moversNeeded:  data.moversNeeded,
        durationHours: hours,
        distanceMiles: pricing?.coverage?.distanceMiles,
        travelMinutes: pricing?.coverage?.travelMinutes,
        isShortTrip:   !!selectedTeam?.isShortTrip,
        estimatedPrice: selectedTotal,
        packingMaterials: wantsPacking
          ? { ...packing, total: packingTotal, requested: true }
          : { smallBoxes: 0, mediumBoxes: 0, largeBoxes: 0, bubbleWrapRolls: 0, tapeRolls: 0, total: 0, requested: false },
        propertyDetails: {
          bedrooms:       bedrooms || undefined,
          numBeds,
          numSofas,
          numLargeItems,
          dismantling,
          reassembly,
          parkingAvailable: parking || undefined,
        },
        notes:    data.notes || undefined,
        customer: data.customer,
      });
      setNewBookingId(res.data?.quote?._id || null);
      setDone(true);
      toast.success("Booking submitted! We'll confirm shortly.");
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit booking');
    } finally { setSubmitting(false); }
  };

  // ── Build pre-filled custom-quote URL when redirected from M25 check ──
  const buildCustomQuoteUrl = () => {
    const params = new URLSearchParams();
    if (data.pickup.postcode)   params.set('pickup',   data.pickup.postcode);
    if (data.delivery.postcode) params.set('delivery', data.delivery.postcode);
    if (data.movingType)        params.set('type',     data.movingType);
    if (data.movingDate)        params.set('date',     data.movingDate);
    if (data.preferredTime)     params.set('time',     data.preferredTime);
    if (data.customer.name)     params.set('name',     data.customer.name);
    if (data.customer.email)    params.set('email',    data.customer.email);
    if (data.customer.phone)    params.set('phone',    data.customer.phone);
    stops.filter(s => s.postcode).forEach((s, i) => params.append(`stop${i + 1}`, s.postcode));
    return `/custom-quote?${params.toString()}`;
  };

  // ── Success screen ──
  if (done) {
    return (
      <section className="min-h-[80vh] flex items-center bg-gradient-to-br from-ink-50 to-white px-4 py-16">
        <div className="container-wide max-w-2xl text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mx-auto flex items-center justify-center mb-6 shadow-pop">
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </motion.div>
          <h1 className="heading-display text-4xl mb-4">Booking received! 🎉</h1>
          <p className="text-ink-600 text-lg leading-relaxed mb-6">
            Thanks {data.customer.name.split(' ')[0]}, we've got your booking and will confirm by email within 30 minutes.
          </p>
          <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6 mb-6 max-w-md mx-auto">
            <div className="text-xs uppercase tracking-widest text-ink-500 font-semibold mb-2">Estimated total</div>
            <div className="font-display font-extrabold text-4xl text-ember-600">£{selectedTotal}</div>
            <div className="text-sm text-ink-500 mt-1">{selectedTeam?.label} · {hours}h booking</div>
            {newBookingId && (
              <div className="mt-4 pt-4 border-t border-ink-100">
                <div className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold">Reference</div>
                <div className="font-mono font-bold text-ink-900 mt-1">{newBookingId.slice(-8).toUpperCase()}</div>
              </div>
            )}
          </div>
          {user ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={newBookingId ? `/my-bookings/${newBookingId}` : '/my-bookings'} className="btn-primary">
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
                      Create a free account with the same email ({data.customer.email}) to view this booking in one click.
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

  const stepLabels = ['Move type', 'Where & when', 'Team & duration', 'Property & packing', 'Your details'];

  return (
    <>
      <section className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark opacity-20 pointer-events-none" />
        <div className="container-wide relative py-12 lg:py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur text-xs font-semibold uppercase tracking-wider text-ember-400 mb-4">
            <Sparkles className="w-3 h-3" /> Live Booking
          </div>
          <h1 className="heading-display text-3xl lg:text-5xl !text-white mb-2">Book your move</h1>
          <p className="text-ink-300">Instant transparent pricing · London &amp; Nationwide UK</p>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-ink-50">
        <div className="container-wide grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-soft border border-ink-100 p-6 lg:p-10">
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-1.5 text-xs font-semibold">
                  <span className="text-ember-600 uppercase tracking-wider">
                    Step {step} of {STEPS} — {stepLabels[step - 1]}
                  </span>
                  <span className="text-ink-500">{Math.round((step / STEPS) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-ember-500 to-ember-400 rounded-full"
                    initial={false} animate={{ width: `${(step / STEPS) * 100}%` }} transition={{ duration: 0.4 }} />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>

                  {/* ── Step 1: Move type ── */}
                  {step === 1 && (
                    <>
                      <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">What are you moving?</h2>
                      <p className="text-ink-500 mb-6 text-sm">Pick the option that best fits.</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {movingTypes.map(t => {
                          const active = data.movingType === t.v;
                          const Icon = t.icon;
                          return (
                            <button key={t.v} onClick={() => set('movingType', t.v)}
                              className={`p-4 rounded-2xl border-2 text-left transition-all ${active ? 'border-ember-500 bg-ember-50 shadow-glow-ember' : 'border-ink-100 hover:border-ink-300 hover:-translate-y-0.5'}`}>
                              <Icon className={`w-7 h-7 mb-3 ${active ? 'text-ember-600' : 'text-ink-700'}`} />
                              <div className="font-semibold text-sm text-ink-900">{t.v}</div>
                              <div className="text-xs text-ink-500 mt-0.5">{t.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* ── Step 2: Where & when — with Stop 1/2/3 between pickup & delivery ── */}
                  {step === 2 && (
                    <>
                      <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Where &amp; when?</h2>
                      <p className="text-ink-500 mb-6 text-sm">Add extra stops between pickup and delivery if needed.</p>
                      <div className="space-y-6">

                        {/* PICKUP */}
                        <LocationBlock
                          label="Pickup address" dotColor="bg-ember-500" side="pickup"
                          sideData={data.pickup}
                          setSide={(k, v) => set(`pickup.${k}`, v)}
                          onPostcodeSelect={d => mergeSide('pickup', d
                            ? { postcode: d.postcode, lat: d.latitude, lon: d.longitude }
                            : { lat: null, lon: null })} />

                        {/* STOPS — between pickup and delivery */}
                        {stops.map((s, i) => (
                          <div key={i} className="border-t border-ink-100 pt-6">
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-sm font-bold text-ink-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                Stop {i + 1}
                              </div>
                              <button onClick={() => removeStop(i)}
                                className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 transition">
                                <Trash2 className="w-3 h-3" /> Remove
                              </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <PostcodeAutocomplete label="Postcode" value={s.postcode}
                                onChange={v => setStop(i, { postcode: v.toUpperCase() })}
                                onSelect={d => setStop(i, d
                                  ? { postcode: d.postcode, lat: d.latitude, lon: d.longitude }
                                  : { lat: null, lon: null })} />
                              <AddressPicker postcode={s.postcode} value={s.address}
                                onChange={v => setStop(i, { address: v })} />
                            </div>
                            <FloorAndAccess side={`stop-${i}`} data={s}
                              set={(k, v) => setStop(i, { [k]: v })} />
                          </div>
                        ))}

                        {stops.length < 3 && (
                          <button onClick={addStop}
                            className="flex items-center gap-2 text-sm font-semibold text-ink-600 hover:text-ember-600 transition border-2 border-dashed border-ink-200 hover:border-ember-300 rounded-xl px-4 py-2.5 w-full justify-center">
                            <Plus className="w-4 h-4" /> Add another stop
                          </button>
                        )}

                        {/* FINAL DELIVERY */}
                        <div className="border-t border-ink-100 pt-6">
                          <LocationBlock
                            label="Final delivery address" dotColor="bg-ink-900" side="delivery"
                            sideData={data.delivery}
                            setSide={(k, v) => set(`delivery.${k}`, v)}
                            onPostcodeSelect={d => mergeSide('delivery', d
                              ? { postcode: d.postcode, lat: d.latitude, lon: d.longitude }
                              : { lat: null, lon: null })} />
                        </div>

                        {/* DATE + TIME */}
                        <div className="border-t border-ink-100 pt-6 grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-ember-500" /> Preferred moving date
                            </label>
                            <input id="moving-date" type="date" min={today}
                              className="input-field"
                              value={data.movingDate} onChange={e => set('movingDate', e.target.value)} />
                          </div>
                          <div>
                            <label htmlFor="preferred-time" className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-ember-500" /> Preferred start time
                              <span className="text-ink-400 font-normal">(optional)</span>
                            </label>
                            <div className="relative">
                              <select
                                id="preferred-time"
                                value={data.preferredTime}
                                onChange={e => set('preferredTime', e.target.value)}
                                disabled={sameDayClosed}
                                className={`input-field appearance-none pr-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${data.preferredTime ? 'border-emerald-500' : ''}`}>
                                <option value="">
                                  {sameDayClosed ? 'No slots available today' : 'Any available time'}
                                </option>
                                {availableTimeSlots.map(t => (
                                  <option key={t} value={t}>{formatTime12h(t)}</option>
                                ))}
                              </select>
                              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 rotate-90 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* Same-day cutoff message */}
                        {sameDayClosed && (
                          <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-sm text-ink-700">
                              <strong className="text-ink-900">Online booking for today is no longer available.</strong>{' '}
                              Please select another date or contact us directly.
                            </div>
                          </div>
                        )}

                        {/* ── OUTSIDE M25 BANNER — replaces everything, blocks progression ── */}
                        {anyOutside && (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-5">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-display font-bold text-base text-ink-900 mb-1">
                                  Outside our M25 instant booking area
                                </h3>
                                <p className="text-sm text-ink-700 leading-relaxed mb-4">
                                  This move falls outside our M25 instant booking area. Please request a custom quote
                                  and our team will provide a tailored price within 30 minutes.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Link href={buildCustomQuoteUrl()}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-ember-500 text-white text-sm font-bold hover:bg-ember-600 transition">
                                    <FileText className="w-4 h-4" /> Request Custom Quote
                                  </Link>
                                  <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold hover:opacity-90 transition">
                                    <MessageCircle className="w-4 h-4" /> WhatsApp Us
                                  </a>
                                  <a href={`tel:${siteConfig.phoneRaw}`}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-ink-900 text-white text-sm font-bold hover:bg-ink-800 transition">
                                    <Phone className="w-4 h-4" /> Call Us
                                  </a>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </>
                  )}

                  {/* ── Step 3: Team & duration ── */}
                  {step === 3 && (
                    <>
                      <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Team &amp; duration</h2>
                      <p className="text-ink-500 mb-6 text-sm">Pick your team size and how long you need them.</p>
                      <div className="mb-6">
                        <label className="text-xs font-semibold text-ink-600 mb-2 block">Movers needed</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {moversOptions.map(m => {
                            const active = data.moversNeeded === m.v;
                            const Icon = m.icon;
                            return (
                              <button key={m.v} onClick={() => set('moversNeeded', m.v)}
                                className={`p-3.5 rounded-2xl border-2 text-left transition-all ${active ? 'border-ember-500 bg-ember-50 shadow-glow-ember' : 'border-ink-100 hover:border-ink-300 hover:-translate-y-0.5'}`}>
                                <Icon className={`w-5 h-5 mb-2 ${active ? 'text-ember-600' : 'text-ink-700'}`} />
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
                        <div className="flex gap-2 flex-wrap">
                          {durationOptions.map(h => (
                            <button key={h} onClick={() => setHours(h)}
                              className={`flex-1 min-w-[48px] py-2.5 rounded-xl text-sm font-semibold transition ${hours === h ? 'bg-ink-900 text-white' : 'bg-ink-50 text-ink-600 hover:bg-ink-100'}`}>
                              {h}h
                            </button>
                          ))}
                        </div>
                        <p className="text-[11px] text-ink-500 mt-2">Pay only for the time you use — we won't rush you.</p>
                      </div>
                      {pricingLoading && !pricing && (
                        <div className="text-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-ember-500 mx-auto mb-2" />
                          <p className="text-sm text-ink-500">Calculating prices...</p>
                        </div>
                      )}
                      {pricing?.ok && (
                        <div className="grid sm:grid-cols-2 gap-3 mt-4">
                          {pricing.teams.map(t => (
                            <TeamCard key={t.teamKey} team={t} packingTotal={packingTotal}
                              active={selectedTeamKey === t.teamKey}
                              onSelect={() => {
                                setSelectedTeamKey(t.teamKey);
                                const map = { driverHelp: '1 Man', twoMen: '2 Men', threeMen: '3 Men' };
                                if (map[t.teamKey]) set('moversNeeded', map[t.teamKey]);
                              }} />
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* ── Step 4: Property & Packing — bedrooms, furniture qty, dismantling, packing, parking ── */}
                  {step === 4 && (
                    <>
                      <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">A few more details</h2>
                      <p className="text-ink-500 mb-6 text-sm">Helps us send the right team and van. All optional except parking.</p>

                      <div className="space-y-6">
                        {/* Bedrooms */}
                        <div>
                          <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                            <Home className="w-3.5 h-3.5 text-ember-500" /> Number of bedrooms
                          </label>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {bedroomOptions.map(b => (
                              <button key={b} onClick={() => setBedrooms(b === bedrooms ? '' : b)}
                                className={`py-2.5 rounded-xl text-xs font-semibold transition text-center ${bedrooms === b ? 'bg-ember-500 text-white shadow-glow-ember' : 'bg-ink-50 text-ink-600 hover:bg-ink-100'}`}>
                                {b}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Furniture quantities */}
                        <div>
                          <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                            <Sofa className="w-3.5 h-3.5 text-ember-500" /> Furniture inventory <span className="text-ink-400 font-normal">(approximate)</span>
                          </label>
                          <div className="grid sm:grid-cols-3 gap-3">
                            <QtyCard label="Beds" icon={Bed} value={numBeds} onChange={setNumBeds} />
                            <QtyCard label="Sofas" icon={Sofa} value={numSofas} onChange={setNumSofas} />
                            <QtyCard label="Large items" icon={Package} value={numLargeItems} onChange={setNumLargeItems} sub="Wardrobes, appliances" />
                          </div>
                        </div>

                        {/* Furniture services */}
                        <div>
                          <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                            <Wrench className="w-3.5 h-3.5 text-ember-500" /> Furniture services
                          </label>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <ToggleCheckbox checked={dismantling} onChange={setDismantling}
                              label="Dismantling required" desc="At pickup" />
                            <ToggleCheckbox checked={reassembly} onChange={setReassembly}
                              label="Reassembly required" desc="At delivery" />
                          </div>
                        </div>

                        {/* Packing services — gated behind checkbox, NO prices shown */}
                        <div>
                          <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                            <PackagePlus className="w-3.5 h-3.5 text-ember-500" /> Packing services
                          </label>
                          <ToggleCheckbox checked={wantsPacking} onChange={setWantsPacking}
                            label="I require packing materials"
                            desc="Boxes and bubble wrap delivered on moving day" />

                          <AnimatePresence initial={false}>
                            {wantsPacking && (
                              <motion.div initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden">
                                <div className="pt-4 space-y-3">
                                  <PackingRow label="Small Boxes" sub="Books, small items"
                                    value={packing.smallBoxes}
                                    onChange={v => setPacking(p => ({ ...p, smallBoxes: Math.max(0, v) }))} />
                                  <PackingRow label="Medium Boxes" sub="Clothes, kitchenware"
                                    value={packing.mediumBoxes}
                                    onChange={v => setPacking(p => ({ ...p, mediumBoxes: Math.max(0, v) }))} />
                                  <PackingRow label="Large Boxes" sub="Bedding, bulky items"
                                    value={packing.largeBoxes}
                                    onChange={v => setPacking(p => ({ ...p, largeBoxes: Math.max(0, v) }))} />
                                  <PackingRow label="Bubble Wrap" sub="Number of rolls"
                                    value={packing.bubbleWrapRolls}
                                    onChange={v => setPacking(p => ({ ...p, bubbleWrapRolls: Math.max(0, v) }))} max={20} />
                                  <PackingRow label="Packing Tape" sub="Number of rolls"
                                    value={packing.tapeRolls}
                                    onChange={v => setPacking(p => ({ ...p, tapeRolls: Math.max(0, v) }))} max={20} />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Parking — required Y/N */}
                        <div>
                          <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                            <Car className="w-3.5 h-3.5 text-ember-500" /> Parking available at both addresses?
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => setParking('yes')}
                              className={`py-3 rounded-xl text-sm font-bold border-2 transition flex items-center justify-center gap-2 ${parking === 'yes' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-ink-200 text-ink-600 hover:border-ink-400'}`}>
                              {parking === 'yes' && <Check className="w-4 h-4" />} Yes
                            </button>
                            <button type="button" onClick={() => setParking('no')}
                              className={`py-3 rounded-xl text-sm font-bold border-2 transition flex items-center justify-center gap-2 ${parking === 'no' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-ink-200 text-ink-600 hover:border-ink-400'}`}>
                              {parking === 'no' && <Check className="w-4 h-4" />} No
                            </button>
                          </div>

                          <AnimatePresence>
                            {parking === 'no' && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-ink-700 flex items-start gap-2 overflow-hidden">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <span>
                                  Please note that customers are responsible for arranging suitable parking access where required.
                                  Additional waiting charges may apply if parking is unavailable on the day of the move.
                                </span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ── Step 5: Contact details ── */}
                  {step === 5 && (
                    <>
                      <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">Your details</h2>
                      <p className="text-ink-500 mb-6 text-sm">Last step — we'll confirm your booking shortly after.</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label htmlFor="customer-name" className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                            <UserCircle className="w-3.5 h-3.5 text-ember-500" /> Full name
                          </label>
                          <input id="customer-name" type="text" autoComplete="name" placeholder="Jane Smith"
                            className={`input-field ${data.customer.name?.trim() ? 'border-emerald-500' : ''}`}
                            value={data.customer.name} onChange={e => set('customer.name', e.target.value)} />
                        </div>
                        <div>
                          <label htmlFor="customer-email" className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-ember-500" /> Email
                          </label>
                          <input id="customer-email" type="email" autoComplete="email" placeholder="you@example.com"
                            className={`input-field ${data.customer.email && isValidEmail(data.customer.email) ? 'border-emerald-500' : data.customer.email ? 'border-red-400' : ''}`}
                            value={data.customer.email} onChange={e => set('customer.email', e.target.value)} />
                        </div>
                        <div>
                          <label htmlFor="customer-phone" className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-ember-500" /> Phone
                          </label>
                          <input id="customer-phone" type="tel" autoComplete="tel" placeholder="07000 000 000"
                            className={`input-field ${data.customer.phone && isValidUKPhone(data.customer.phone) ? 'border-emerald-500' : data.customer.phone ? 'border-red-400' : ''}`}
                            value={data.customer.phone} onChange={e => set('customer.phone', e.target.value)} />
                        </div>

                           {/* Email verification — guests only */}
                        {!user && (
                          <div className="md:col-span-2">
                            {!otpVerified ? (
                              <div className="rounded-2xl border-2 border-ember-200 bg-ember-50/50 p-4">
                                <div className="flex items-start gap-3 mb-3">
                                  <ShieldCheck className="w-5 h-5 text-ember-600 shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-sm font-bold text-ink-900">Verify your email</div>
                                    <div className="text-xs text-ink-600 leading-relaxed mt-0.5">
                                      We'll send a 6-digit code to confirm your email address before we can accept your booking.
                                    </div>
                                  </div>
                                </div>

                                {!otpSent ? (
                                  <button
                                    type="button"
                                    onClick={handleSendOTP}
                                    disabled={otpSending || !isValidEmail(data.customer.email)}
                                    className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    {otpSending
                                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                                      : <><Mail className="w-4 h-4" /> Send verification code</>}
                                  </button>
                                ) : (
                                  <div className="space-y-3">
                                    <div>
                                      <label htmlFor="otp-code" className="text-xs font-semibold text-ink-600 mb-2 block">
                                        Enter the 6-digit code we sent to {data.customer.email}
                                      </label>
                                      <input
                                        id="otp-code"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        pattern="\d{6}"
                                        maxLength={6}
                                        placeholder="000000"
                                        value={otpCode}
                                        onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="input-field text-center tracking-[0.4em] font-mono font-bold text-lg"
                                      />
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                      <button
                                        type="button"
                                        onClick={handleVerifyOTP}
                                        disabled={otpVerifying || otpCode.length !== 6}
                                        className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                                      >
                                        {otpVerifying
                                          ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
                                          : <><Check className="w-4 h-4" /> Verify code</>}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleSendOTP}
                                        disabled={otpCooldown > 0 || otpSending}
                                        className="px-4 py-2.5 rounded-full border-2 border-ink-200 text-sm font-bold text-ink-600 hover:border-ink-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                      >
                                        {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : 'Resend code'}
                                      </button>
                                    </div>
                                    <p className="text-[11px] text-ink-500">
                                      Didn't get the email? Check your spam folder or try resending after the cooldown.
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-4 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-emerald-800">Email verified</div>
                                  <div className="text-xs text-emerald-700">{data.customer.email}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-ember-500" /> Notes <span className="text-ink-400 font-normal">(optional)</span>
                          </label>
                          <textarea rows="3" placeholder="Special items, access restrictions, anything else we should know?"
                            className="input-field resize-none" value={data.notes}
                            onChange={e => set('notes', e.target.value)} />
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

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-ink-100">
                <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
                  className="flex items-center gap-1 text-sm font-semibold text-ink-600 hover:text-ink-900 disabled:opacity-30 disabled:cursor-not-allowed transition">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                {step < STEPS ? (
                  <button onClick={handleContinue}
                    disabled={step === 2 && (anyOutside || sameDayClosed)}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                 ) : (
                  <button onClick={() => {
                    const err = validateStep();
                    if (err) { toast.error(err.message); focusField(err.fieldId); return; }
                    submit();
                  }} disabled={submitting || (!user && !otpVerified)}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                    {submitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                      : <><Check className="w-4 h-4" /> Confirm booking</>}
                  </button>
                )}

              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <BookingSummary data={data} selectedTeam={selectedTeam} hours={hours}
                packingTotal={packingTotal} stops={stops} />
            </div>
          </aside>
        </div>
      </section>

      {/* Mobile sticky total */}
      {selectedTotal != null && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-ink-100 px-4 py-3 shadow-pop">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-ink-500 font-semibold">Total</div>
              <div className="font-display font-extrabold text-2xl text-ink-900">£{selectedTotal}</div>
            </div>
            <div className="text-xs text-ink-500 text-right">{selectedTeam?.label}<br />{hours}h booking</div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function LocationBlock({ label, dotColor, side, sideData, setSide, onPostcodeSelect }) {
  return (
    <div>
      <div className="text-sm font-bold text-ink-900 mb-3 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} /> {label}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <PostcodeAutocomplete id={`${side}-postcode`} label="Postcode"
          value={sideData.postcode}
          onChange={v => setSide('postcode', v)}
          onSelect={onPostcodeSelect} />
        <AddressPicker postcode={sideData.postcode} value={sideData.address}
          onChange={v => setSide('address', v)} />
      </div>
      <FloorAndAccess side={side} data={sideData} set={setSide} />
    </div>
  );
}

function FloorAndAccess({ side, data, set }) {
  const ground = isGroundFloor(data.floor);
  return (
    <div className="mt-4 space-y-3">
      <div>
        <label htmlFor={`${side}-floor`} className="text-xs font-semibold text-ink-600 mb-2 block">Floor</label>
        <div className="relative">
          <select id={`${side}-floor`} value={data.floor} onChange={e => set('floor', e.target.value)}
            className={`input-field appearance-none pr-10 cursor-pointer ${data.floor ? 'border-emerald-500' : ''}`}>
            <option value="">Select floor...</option>
            {floorDropdown.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 rotate-90 pointer-events-none" />
        </div>
      </div>
      <AnimatePresence initial={false}>
        {data.floor && !ground && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <label className="text-xs font-semibold text-ink-600 mb-2 block">Access</label>
            <div id={`${side}-access`} className="grid grid-cols-3 gap-2">
              {accessOptions.map(a => {
                const active = data.access === a.v;
                const Icon = a.icon;
                return (
                  <button key={a.v} type="button" onClick={() => set('access', a.v)}
                    className={`p-2.5 rounded-xl border-2 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${active ? 'border-ember-500 bg-ember-50 text-ember-700' : 'border-ink-100 text-ink-600 hover:border-ink-300'}`}>
                    <Icon className="w-3.5 h-3.5" /> {a.v}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
        {ground && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
            <Check className="w-3.5 h-3.5" /> Ground floor — no surcharge.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TeamCard({ team, active, onSelect, packingTotal }) {
  const displayTotal = team.total + (packingTotal || 0);
  return (
    <button onClick={onSelect}
      className={`relative p-5 rounded-2xl border-2 text-left transition-all ${active ? 'border-ember-500 bg-ember-50 shadow-glow-ember' : 'border-ink-100 hover:border-ink-300 hover:-translate-y-0.5 bg-white'}`}>
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
        <span className="font-display font-extrabold text-3xl text-ink-900">{displayTotal}</span>
      </div>
      <div className="text-xs text-ink-500">{team.requestedHours}h included · +£{team.extraHourRate}/hr after</div>
    </button>
  );
}

function QtyCard({ label, icon: Icon, value, onChange, sub }) {
  return (
    <div className={`p-3 rounded-xl border-2 transition ${value > 0 ? 'border-ember-500 bg-ember-50' : 'border-ink-100'}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-ink-600" />
        <div>
          <div className="text-xs font-semibold text-ink-700 leading-tight">{label}</div>
          {sub && <div className="text-[10px] text-ink-400">{sub}</div>}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
          className="w-7 h-7 rounded-lg border border-ink-200 flex items-center justify-center hover:bg-ink-50 disabled:opacity-30 transition"
          disabled={value <= 0}>
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-8 text-center font-bold text-sm">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)}
          className="w-7 h-7 rounded-lg bg-ink-900 text-white flex items-center justify-center hover:bg-ink-800 transition">
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function ToggleCheckbox({ checked, onChange, label, desc }) {
  return (
    <label className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${checked ? 'border-ember-500 bg-ember-50' : 'border-ink-100 hover:border-ink-300'}`}>
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition ${checked ? 'border-ember-500 bg-ember-500' : 'border-ink-300'}`}>
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
      <input type="checkbox" className="sr-only" checked={checked} onChange={() => onChange(!checked)} />
      <div>
        <div className="text-sm font-semibold text-ink-800">{label}</div>
        {desc && <div className="text-[11px] text-ink-500">{desc}</div>}
      </div>
    </label>
  );
}

function PackingRow({ label, sub, value, onChange, max = 200 }) {
  return (
    <div className={`flex items-center justify-between gap-3 p-3 rounded-xl border-2 transition ${value > 0 ? 'border-ember-500 bg-ember-50' : 'border-ink-100'}`}>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-ink-800">{label}</div>
        <div className="text-xs text-ink-500">{sub}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
          className="w-8 h-8 rounded-lg border border-ink-200 flex items-center justify-center hover:bg-ink-50 disabled:opacity-30 transition"
          disabled={value <= 0}>
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-10 text-center font-display font-bold">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-lg bg-ink-900 text-white flex items-center justify-center hover:bg-ink-800 transition">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
