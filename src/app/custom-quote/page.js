'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, User, Mail, Phone, FileText,
  MessageCircle, Loader2, Check, Send, ShieldCheck,
  Home, Package, Plus, Minus, Trash2, Car, Bed, Sofa,
  Wrench, PackagePlus, AlertCircle, ArrowRight, Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import PostcodeAutocomplete from '@/components/quote/PostcodeAutocomplete';
import AddressPicker from '@/components/quote/AddressPicker';
import { isValidEmail, isValidUKPhone } from '@/lib/utils/validation';
import { siteConfig } from '@/lib/utils/siteConfig';
import api from '@/lib/utils/api';

const propertyTypeOptions = ['House', 'Flat', 'Office', 'Storage', 'Other'];
const floorOptions = ['Ground Floor','1st Floor','2nd Floor','3rd Floor','4th Floor','5th Floor','6th Floor or Above'];
const bedroomOptions = ['Studio','1 Bedroom','2 Bedrooms','3 Bedrooms','4 Bedrooms','5+ Bedrooms'];

// Internal — NEVER displayed in the form
const BOX_PRICE  = 5;
const WRAP_PRICE = 15;
const TAPE_PRICE = 10;

// Preferred move time slots — 07:00 to 21:00 in 30-minute increments
const TIME_SLOTS = (() => {
  const slots = [];
  for (let h = 7; h <= 21; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 21) slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
})();

const formatTime12h = (t24) => {
  if (!t24) return '';
  const [h, m] = t24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
};

const initSide = () => ({ propertyType: '', floor: '', lift: '', postcode: '', address: '', lat: null, lon: null });
const emptyStop = () => ({ postcode: '', address: '', floor: '', lat: null, lon: null });

// Suspense wrapper — required for useSearchParams in Next.js
export default function CustomQuotePageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-ember-500" />
      </div>
    }>
      <CustomQuotePage />
    </Suspense>
  );
}

function CustomQuotePage() {
  const searchParams = useSearchParams();
  const today = new Date().toISOString().split('T')[0];

  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);

  // Pre-fill from URL params when redirected from the M25 check
  const [customer, setCustomer] = useState({
    name:  searchParams.get('name')  || '',
    email: searchParams.get('email') || '',
    phone: searchParams.get('phone') || '',
  });
  const [pickup,   setPickup]   = useState({
    ...initSide(),
    postcode: searchParams.get('pickup') || '',
  });
  const [delivery, setDelivery] = useState({
    ...initSide(),
    postcode: searchParams.get('delivery') || '',
  });

  // Any prefilled stops from URL (stop1, stop2, stop3...)
  const initialStops = ['stop1', 'stop2', 'stop3']
    .map(k => searchParams.get(k))
    .filter(Boolean)
    .map(pc => ({ ...emptyStop(), postcode: pc }));
  const [stops, setStops] = useState(initialStops);

  const [movingDate,   setMovingDate]   = useState(searchParams.get('date') || '');
  const [preferredTime, setPreferredTime] = useState(searchParams.get('time') || '');
  const [bedrooms,     setBedrooms]     = useState(searchParams.get('type') && bedroomOptions.includes(searchParams.get('type')) ? searchParams.get('type') : '');

  // Furniture inventory
  const [numBeds,      setNumBeds]      = useState(0);
  const [numSofas,     setNumSofas]     = useState(0);
  const [numLargeItems,setNumLargeItems]= useState(0);

  // Furniture services
  const [dismantling,  setDismantling]  = useState(false);
  const [reassembly,   setReassembly]   = useState(false);

  // Packing — gated behind checkbox, no prices shown
  const [wantsPacking, setWantsPacking] = useState(false);
  const [packing, setPacking] = useState({
    smallBoxes: 0, mediumBoxes: 0, largeBoxes: 0, bubbleWrapRolls: 0, tapeRolls: 0,
  });

  // Parking
  const [parking, setParking] = useState('');

  // Notes
  const [notes, setNotes] = useState('');

  // Stop helpers
  const addStop    = () => setStops(s => [...s, emptyStop()]);
  const removeStop = (i) => setStops(s => s.filter((_, idx) => idx !== i));
  const setStop    = (i, patch) => setStops(s => s.map((st, idx) => idx === i ? { ...st, ...patch } : st));

  const setPickupField   = (k, v) => setPickup(prev => ({ ...prev, [k]: v }));
  const setDeliveryField = (k, v) => setDelivery(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    if (!customer.name?.trim())          return { message: 'Please enter your full name.',        id: 'cq-name' };
    if (!isValidEmail(customer.email))   return { message: 'Please enter a valid email address.', id: 'cq-email' };
    if (!isValidUKPhone(customer.phone)) return { message: 'Please enter a valid UK phone.',      id: 'cq-phone' };
    if (!pickup.postcode?.trim())        return { message: 'Please enter a pickup postcode.',      id: 'cq-pickup' };
    if (!delivery.postcode?.trim())      return { message: 'Please enter a delivery postcode.',    id: 'cq-delivery' };
    if (!movingDate)                     return { message: 'Please choose your preferred date.',   id: 'cq-date' };
    return null;
  };

  const focusField = (id) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus({ preventScroll: true }); }
    }, 50);
  };

  const buildNotes = () => {
    const parts = [];
    if (notes.trim()) parts.push(notes.trim());
    if (bedrooms) parts.push(`Property size: ${bedrooms}`);

    const furniture = [];
    if (numBeds)       furniture.push(`${numBeds}x Beds`);
    if (numSofas)      furniture.push(`${numSofas}x Sofas`);
    if (numLargeItems) furniture.push(`${numLargeItems}x Large items`);
    if (furniture.length) parts.push(`Furniture: ${furniture.join(', ')}`);

    const services = [];
    if (dismantling) services.push('Dismantling required');
    if (reassembly)  services.push('Reassembly required');
    if (wantsPacking) services.push('Packing service required');
    if (services.length) parts.push(`Services: ${services.join(', ')}`);

    if (wantsPacking) {
      const packingList = [];
      if (packing.smallBoxes      > 0) packingList.push(`${packing.smallBoxes} small boxes`);
      if (packing.mediumBoxes     > 0) packingList.push(`${packing.mediumBoxes} medium boxes`);
      if (packing.largeBoxes      > 0) packingList.push(`${packing.largeBoxes} large boxes`);
      if (packing.bubbleWrapRolls > 0) packingList.push(`${packing.bubbleWrapRolls} bubble wrap rolls`);
      if (packing.tapeRolls > 0)       packingList.push(`${packing.tapeRolls} packing tape rolls`);
      if (packingList.length) parts.push(`Packing materials: ${packingList.join(', ')}`);
    }

    if (parking) parts.push(`Parking available: ${parking === 'yes' ? 'Yes' : 'No'}`);

    const validStops = stops.filter(s => s.postcode);
    if (validStops.length) {
      const stopsText = validStops.map((s, i) => `Stop ${i + 1}: ${s.postcode}${s.floor ? ` (${s.floor})` : ''}`).join(' → ');
      parts.push(stopsText);
    }

    if (pickup.propertyType)   parts.push(`Pickup: ${pickup.propertyType}${pickup.floor ? `, ${pickup.floor}` : ''}${pickup.lift ? `, ${pickup.lift}` : ''}`);
    if (delivery.propertyType) parts.push(`Delivery: ${delivery.propertyType}${delivery.floor ? `, ${delivery.floor}` : ''}${delivery.lift ? `, ${delivery.lift}` : ''}`);

    return parts.join('\n\n');
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { toast.error(err.message); focusField(err.id); return; }
    setSubmitting(true);
    try {
      const cleanStops = stops.filter(s => s.postcode).map(s => ({
        postcode: s.postcode,
        address:  s.address || undefined,
        floor:    s.floor || 'Ground Floor',
        lat: s.lat || undefined, lon: s.lon || undefined,
      }));

      await api.post('/quotes/custom', {
        movingType: bedrooms || 'Other',
        pickup: {
          postcode: pickup.postcode,
          address: pickup.address || undefined,
          floor:   pickup.floor || 'Ground Floor',
          lat: pickup.lat || undefined, lon: pickup.lon || undefined,
        },
        delivery: {
          postcode: delivery.postcode,
          address: delivery.address || undefined,
          floor:   delivery.floor || 'Ground Floor',
          lat: delivery.lat || undefined, lon: delivery.lon || undefined,
        },
        stops: cleanStops,
        movingDate,
        preferredTime: preferredTime || undefined,
        moversNeeded: 'Not Sure',
        notes: buildNotes() || 'Custom quote request',
        customer,
        packingMaterials: wantsPacking
          ? {
              smallBoxes:      packing.smallBoxes,
              mediumBoxes:     packing.mediumBoxes,
              largeBoxes:      packing.largeBoxes,
              bubbleWrapRolls: packing.bubbleWrapRolls,
              tapeRolls:       packing.tapeRolls,
              total: (packing.smallBoxes + packing.mediumBoxes + packing.largeBoxes) * BOX_PRICE
                   + packing.bubbleWrapRolls * WRAP_PRICE
                   + packing.tapeRolls * TAPE_PRICE,
              requested: true,
            }
          : { smallBoxes: 0, mediumBoxes: 0, largeBoxes: 0, bubbleWrapRolls: 0, tapeRolls: 0, total: 0, requested: false },
        propertyDetails: {
          bedrooms:         bedrooms || undefined,
          numBeds, numSofas, numLargeItems,
          dismantling, reassembly,
          parkingAvailable: parking || undefined,
        },
      });
      setDone(true);
      toast.success('Custom quote request received!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit request');
    } finally { setSubmitting(false); }
  };

  if (done) {
    return (
      <section className="min-h-[70vh] flex items-center bg-gradient-to-br from-ink-50 to-white px-4 py-16">
        <div className="container-wide max-w-2xl text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mx-auto flex items-center justify-center mb-6 shadow-pop">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </motion.div>
          <h1 className="heading-display text-3xl mb-3">Request received!</h1>
          <p className="text-ink-600 text-lg mb-8">
            Thanks {customer.name.split(' ')[0]}, we'll review your move details and come back with a tailored quote within 30 minutes.
          </p>
          <a href="/" className="btn-ghost">Back to homepage</a>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Custom Quote"
        title="Tell us about your move"
        subtitle="For moves outside the M25, large jobs, or complex routes. We respond within 30 minutes during business hours."
      />

      <section className="py-16 lg:py-20 bg-ink-50">
        <div className="container-wide grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <form onSubmit={submit} className="bg-white rounded-3xl shadow-soft border border-ink-100 p-6 lg:p-10 space-y-8">

              {/* ── 1. Contact ── */}
              <Section title="Your details" n="1">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="cq-name" icon={User}>Full name</Label>
                    <input id="cq-name" type="text" autoComplete="name"
                      className={`input-field ${customer.name?.trim() ? 'border-emerald-500' : ''}`}
                      value={customer.name} onChange={e => setCustomer(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="cq-email" icon={Mail}>Email address</Label>
                    <input id="cq-email" type="email" autoComplete="email"
                      className={`input-field ${customer.email && isValidEmail(customer.email) ? 'border-emerald-500' : customer.email ? 'border-red-400' : ''}`}
                      value={customer.email} onChange={e => setCustomer(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="cq-phone" icon={Phone}>Phone number</Label>
                    <input id="cq-phone" type="tel" autoComplete="tel"
                      className={`input-field ${customer.phone && isValidUKPhone(customer.phone) ? 'border-emerald-500' : customer.phone ? 'border-red-400' : ''}`}
                      value={customer.phone} onChange={e => setCustomer(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                </div>
              </Section>

              {/* ── 2. Pickup ── */}
              <Section title="Pickup address" n="2">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <PostcodeAutocomplete id="cq-pickup" label="Postcode"
                    value={pickup.postcode}
                    onChange={v => setPickupField('postcode', v.toUpperCase())}
                    onSelect={d => setPickup(p => ({ ...p, postcode: d?.postcode || p.postcode, lat: d?.latitude || null, lon: d?.longitude || null }))} />
                  <AddressPicker postcode={pickup.postcode} value={pickup.address}
                    onChange={v => setPickupField('address', v)} />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-ink-600 mb-2 block">Property type</label>
                    <select className="input-field" value={pickup.propertyType}
                      onChange={e => setPickupField('propertyType', e.target.value)}>
                      <option value="">Select...</option>
                      {propertyTypeOptions.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-600 mb-2 block">Floor number</label>
                    <select className="input-field" value={pickup.floor}
                      onChange={e => setPickupField('floor', e.target.value)}>
                      <option value="">Select...</option>
                      {floorOptions.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-600 mb-2 block">Access</label>
                    <select className="input-field" value={pickup.lift}
                      onChange={e => setPickupField('lift', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="Lift available">Lift available</option>
                      <option value="Stairs only">Stairs only</option>
                    </select>
                  </div>
                </div>
              </Section>

              {/* ── 3. Additional stops (between pickup and final delivery) ── */}
              <Section title="Additional stops" n="3" subtitle="Optional — add stops between pickup and delivery if the job needs them.">
                {stops.map((s, i) => (
                  <div key={i} className="mb-3 p-4 rounded-xl border-2 border-ink-100 bg-ink-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-ink-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" /> Stop {i + 1}
                      </span>
                      <button type="button" onClick={() => removeStop(i)}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 transition">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 mb-3">
                      <PostcodeAutocomplete label="Postcode" value={s.postcode}
                        onChange={v => setStop(i, { postcode: v.toUpperCase() })}
                        onSelect={d => setStop(i, d ? { postcode: d.postcode, lat: d.latitude, lon: d.longitude } : { lat: null, lon: null })} />
                      <AddressPicker postcode={s.postcode} value={s.address}
                        onChange={v => setStop(i, { address: v })} />
                    </div>
                    <select className="input-field" value={s.floor}
                      onChange={e => setStop(i, { floor: e.target.value })}>
                      <option value="">Floor at this stop...</option>
                      {floorOptions.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                {stops.length < 5 && (
                  <button type="button" onClick={addStop}
                    className="flex items-center gap-2 text-sm font-semibold text-ink-600 hover:text-ember-600 transition border-2 border-dashed border-ink-200 hover:border-ember-300 rounded-xl px-4 py-2.5 w-full justify-center">
                    <Plus className="w-4 h-4" /> Add a stop
                  </button>
                )}
              </Section>

              {/* ── 4. Delivery ── */}
              <Section title="Final delivery address" n="4">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <PostcodeAutocomplete id="cq-delivery" label="Postcode"
                    value={delivery.postcode}
                    onChange={v => setDeliveryField('postcode', v.toUpperCase())}
                    onSelect={d => setDelivery(p => ({ ...p, postcode: d?.postcode || p.postcode, lat: d?.latitude || null, lon: d?.longitude || null }))} />
                  <AddressPicker postcode={delivery.postcode} value={delivery.address}
                    onChange={v => setDeliveryField('address', v)} />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-ink-600 mb-2 block">Property type</label>
                    <select className="input-field" value={delivery.propertyType}
                      onChange={e => setDeliveryField('propertyType', e.target.value)}>
                      <option value="">Select...</option>
                      {propertyTypeOptions.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-600 mb-2 block">Floor number</label>
                    <select className="input-field" value={delivery.floor}
                      onChange={e => setDeliveryField('floor', e.target.value)}>
                      <option value="">Select...</option>
                      {floorOptions.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-600 mb-2 block">Access</label>
                    <select className="input-field" value={delivery.lift}
                      onChange={e => setDeliveryField('lift', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="Lift available">Lift available</option>
                      <option value="Stairs only">Stairs only</option>
                    </select>
                  </div>
                </div>
              </Section>

              {/* ── 5. Move details ── */}
              <Section title="Move details" n="5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cq-date" icon={Calendar}>Preferred date</Label>
                    <input id="cq-date" type="date" min={today} className="input-field"
                      value={movingDate} onChange={e => setMovingDate(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="cq-time" icon={Clock}>Preferred start time <span className="text-ink-400 font-normal">(optional)</span></Label>
                    <select id="cq-time" className="input-field"
                      value={preferredTime} onChange={e => setPreferredTime(e.target.value)}>
                      <option value="">Any time (07:00 – 21:00)</option>
                      {TIME_SLOTS.map(t => (
                        <option key={t} value={t}>{formatTime12h(t)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <Label icon={Home}>Number of bedrooms</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {bedroomOptions.map(b => (
                      <button key={b} type="button" onClick={() => setBedrooms(b === bedrooms ? '' : b)}
                        className={`py-2.5 rounded-xl text-xs font-semibold transition ${bedrooms === b ? 'bg-ember-500 text-white shadow-glow-ember' : 'bg-ink-50 text-ink-600 hover:bg-ink-100'}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </Section>

              {/* ── 6. Furniture inventory ── */}
              <Section title="Furniture inventory" n="6" subtitle="Approximate quantities — helps us send the right team and van.">
                <div className="grid sm:grid-cols-3 gap-3">
                  <QtyCard label="Beds" icon={Bed} value={numBeds} onChange={setNumBeds} />
                  <QtyCard label="Sofas" icon={Sofa} value={numSofas} onChange={setNumSofas} />
                  <QtyCard label="Large items" icon={Package} value={numLargeItems} onChange={setNumLargeItems}
                    sub="Wardrobes, appliances" />
                </div>
              </Section>

              {/* ── 7. Furniture services ── */}
              <Section title="Furniture services" n="7">
                <div className="grid sm:grid-cols-2 gap-3">
                  <ToggleCheckbox checked={dismantling} onChange={setDismantling}
                    label="Dismantling required" desc="At pickup" />
                  <ToggleCheckbox checked={reassembly} onChange={setReassembly}
                    label="Reassembly required" desc="At delivery" />
                </div>
              </Section>

              {/* ── 8. Packing services — gated, no prices ── */}
              <Section title="Packing services" n="8">
                <ToggleCheckbox checked={wantsPacking} onChange={setWantsPacking}
                  label="Packing services required"
                  desc="Boxes and bubble wrap supplied on moving day" />

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
              </Section>

              {/* ── 9. Parking ── */}
              <Section title="Parking availability" n="9">
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
              </Section>

              {/* ── 10. Notes ── */}
              <Section title="Additional notes" n="10" subtitle="Special items, access restrictions, anything else we should know.">
                <textarea rows="5" placeholder="e.g. Piano on 2nd floor, no parking on the street, help with a grandfather clock..."
                  className="input-field resize-none" value={notes} onChange={e => setNotes(e.target.value)} />
              </Section>

              <button type="submit" disabled={submitting}
                className="btn-primary w-full justify-center !py-4 disabled:opacity-50">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send custom quote request</>}
              </button>

              <p className="text-xs text-ink-500 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> We respond within 30 minutes during business hours
              </p>
            </form>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="bg-ink-900 text-white rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-ember-500/20 rounded-full blur-2xl" />
              <h3 className="font-display font-bold text-base mb-3 relative">Need to talk now?</h3>
              <div className="space-y-2 relative">
                <a href={`tel:${siteConfig.phoneRaw}`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm transition">
                  <Phone className="w-4 h-4 text-ember-400" /> Call us now
                </a>
                <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm transition">
                  <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp us
                </a>
                <a href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm transition">
                  <Mail className="w-4 h-4 text-ember-400" /> Email us
                </a>
              </div>
            </div>
            <div className="bg-white rounded-3xl border border-ink-100 p-6">
              <h3 className="font-display font-bold text-sm mb-3">Ideal for</h3>
              <ul className="space-y-2 text-sm text-ink-700">
                {['Moves outside the M25','Long-distance UK moves','Large office relocations','Multi-stop or complex routes','Specialist items (piano, antiques)','Packing service required','Bespoke schedules'].map(x => (
                  <li key={x} className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />{x}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function Section({ title, n, subtitle, children }) {
  return (
    <div className="border-t border-ink-100 pt-6 first:border-0 first:pt-0">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-7 h-7 rounded-full bg-ember-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{n}</div>
        <h3 className="font-display font-bold text-lg">{title}</h3>
      </div>
      {subtitle && <p className="text-ink-500 text-sm mb-4 ml-10">{subtitle}</p>}
      <div className="ml-10">{children}</div>
    </div>
  );
}

function Label({ htmlFor, icon: Icon, children }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
      {Icon && <Icon className="w-3.5 h-3.5 text-ember-500" />} {children}
    </label>
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
