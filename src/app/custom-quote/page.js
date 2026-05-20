'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, User, Mail, Phone, FileText,
  MessageCircle, Loader2, Check, Send, ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import { isValidEmail, isValidUKPhone } from '@/lib/utils/validation';
import { siteConfig } from '@/lib/utils/siteConfig';
import api from '@/lib/utils/api';

const moveTypes = ['Studio', 'Flat', 'House', 'Office', 'Storage', 'Single Item', 'Other'];

export default function CustomQuotePage() {
  const today = new Date().toISOString().split('T')[0];
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [data, setData] = useState({
    customer: { name: '', email: '', phone: '' },
    movingType: '',
    pickup: { postcode: '', address: '' },
    delivery: { postcode: '', address: '' },
    movingDate: '', notes: '',
  });

  const set = (path, value) => {
    setData((prev) => {
      const [a, b] = path.split('.');
      if (!b) return { ...prev, [a]: value };
      return { ...prev, [a]: { ...prev[a], [b]: value } };
    });
  };

  const focusField = (id) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus({ preventScroll: true }); }
    }, 50);
  };

  const validate = () => {
    if (!data.customer.name?.trim()) return { message: 'Please enter your full name.', id: 'cq-name' };
    if (!isValidEmail(data.customer.email)) return { message: 'Please enter a valid email address.', id: 'cq-email' };
    if (!isValidUKPhone(data.customer.phone)) return { message: 'Please enter a valid UK phone number.', id: 'cq-phone' };
    if (!data.pickup.postcode?.trim()) return { message: 'Please enter a pickup postcode or area.', id: 'cq-pickup' };
    if (!data.delivery.postcode?.trim()) return { message: 'Please enter a delivery postcode or area.', id: 'cq-delivery' };
    if (!data.movingDate) return { message: 'Please choose your preferred moving date.', id: 'cq-date' };
    if (!data.notes?.trim() || data.notes.trim().length < 5) return { message: 'Please tell us a bit more about your move.', id: 'cq-notes' };
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { toast.error(err.message); focusField(err.id); return; }

    setSubmitting(true);
    try {
      await api.post('/quotes/custom', {
        movingType: data.movingType || 'Other',
        pickup: {
          postcode: data.pickup.postcode,
          ...(data.pickup.address ? { address: data.pickup.address } : {}),
          floor: 'Ground Floor',
        },
        delivery: {
          postcode: data.delivery.postcode,
          ...(data.delivery.address ? { address: data.delivery.address } : {}),
          floor: 'Ground Floor',
        },
        movingDate: data.movingDate,
        moversNeeded: 'Not Sure',
        notes: data.notes,
        customer: data.customer,
      });
      setDone(true);
      toast.success('Custom quote request received!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit request');
    } finally {
      setSubmitting(false);
    }
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
            Thanks {data.customer.name.split(' ')[0]}, we'll review your move details and come back with a tailored quote within 30 minutes.
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
        title="Need something tailored?"
        subtitle="For moves outside the M25, large office relocations, complex logistics or special requirements."
      />

      <section className="py-16 lg:py-20 bg-ink-50">
        <div className="container-wide grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <form onSubmit={submit} className="bg-white rounded-3xl shadow-soft border border-ink-100 p-6 lg:p-10 space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl mb-1">Tell us about your move</h2>
                <p className="text-ink-500 text-sm">We'll come back within 30 minutes with a tailored quote.</p>
              </div>

              <div>
                <div className="text-sm font-bold text-ink-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-ember-500" /> Your details
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="cq-name" className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-ember-500" /> Full name
                    </label>
                    <input id="cq-name" type="text" autoComplete="name" value={data.customer.name}
                      onChange={(e) => set('customer.name', e.target.value)}
                      className={`input-field ${data.customer.name?.trim() ? 'border-emerald-500' : ''}`}
                    />
                  </div>
                  <div>
                    <label htmlFor="cq-email" className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-ember-500" /> Email
                    </label>
                    <input id="cq-email" type="email" autoComplete="email" value={data.customer.email}
                      onChange={(e) => set('customer.email', e.target.value)}
                      className={`input-field ${
                        data.customer.email && isValidEmail(data.customer.email) ? 'border-emerald-500' :
                        data.customer.email ? 'border-red-400' : ''
                      }`}
                    />
                  </div>
                  <div>
                    <label htmlFor="cq-phone" className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-ember-500" /> Phone
                    </label>
                    <input id="cq-phone" type="tel" autoComplete="tel" value={data.customer.phone}
                      onChange={(e) => set('customer.phone', e.target.value)}
                      className={`input-field ${
                        data.customer.phone && isValidUKPhone(data.customer.phone) ? 'border-emerald-500' :
                        data.customer.phone ? 'border-red-400' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-ink-100 pt-6">
                <div className="text-sm font-bold text-ink-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-ember-500" /> Move details
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-ink-600 mb-2 block">Move type</label>
                    <select value={data.movingType} onChange={(e) => set('movingType', e.target.value)} className="input-field">
                      <option value="">Select...</option>
                      {moveTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cq-pickup" className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-ember-500" /> Pickup postcode/area
                    </label>
                    <input id="cq-pickup" type="text" placeholder="SW1A 1AA or area name"
                      value={data.pickup.postcode}
                      onChange={(e) => set('pickup.postcode', e.target.value.toUpperCase())}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="cq-delivery" className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-ember-500" /> Delivery postcode/area
                    </label>
                    <input id="cq-delivery" type="text" placeholder="EH1 1AA or area name"
                      value={data.delivery.postcode}
                      onChange={(e) => set('delivery.postcode', e.target.value.toUpperCase())}
                      className="input-field"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="cq-date" className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-ember-500" /> Preferred date
                    </label>
                    <input id="cq-date" type="date" min={today} value={data.movingDate}
                      onChange={(e) => set('movingDate', e.target.value)}
                      className="input-field max-w-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-ink-100 pt-6">
                <label htmlFor="cq-notes" className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-ember-500" /> Tell us about your move
                </label>
                <textarea id="cq-notes" rows="6"
                  placeholder="Number of rooms, special items, parking restrictions, anything that affects the move..."
                  value={data.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  className="input-field resize-none"
                />
                <p className="text-xs text-ink-500 mt-1.5">The more detail, the more accurate our quote.</p>
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full justify-center !py-4 disabled:opacity-50">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> :
                 <>Send custom quote request <Send className="w-4 h-4" /></>}
              </button>

              <p className="text-xs text-ink-500 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> We respond within 30 minutes during business hours
              </p>
            </form>
          </div>

          <aside className="space-y-4">
            <div className="bg-ink-900 text-white rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-ember-500/20 rounded-full blur-2xl" />
              <h3 className="font-display font-bold text-lg mb-2 relative">Need to talk now?</h3>
              <p className="text-sm text-ink-300 mb-4 relative">Faster to chat? Our team is here.</p>
              <div className="space-y-2 relative">
                <a href={`tel:${siteConfig.phoneRaw}`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition">
                  <Phone className="w-4 h-4 text-ember-400" /> Call us
                </a>
                <a href={siteConfig.whatsapp} target="_blank" rel="noreferrer"
                   className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition">
                  <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp
                </a>
                <a href={`mailto:${siteConfig.email}`}
                   className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition">
                  <Mail className="w-4 h-4 text-ember-400" /> Email
                </a>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-ink-100 p-6">
              <h3 className="font-display font-bold text-sm mb-3">Ideal for</h3>
              <ul className="space-y-2 text-sm text-ink-700">
                {[
                  'Moves outside the M25',
                  'Large office relocations',
                  'Multi-stop or complex routes',
                  'Specialist items (piano, antiques)',
                  'Long-distance UK moves',
                  'Bespoke schedules',
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
