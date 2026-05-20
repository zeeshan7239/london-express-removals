'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/common/PageHeader';
import { Mail, Phone, MessageCircle, MapPin, Loader2, Send, Clock } from 'lucide-react';
import { siteConfig } from '@/lib/utils/siteConfig';
import { isValidEmail, isValidUKPhone } from '@/lib/utils/validation';
import api from '@/lib/utils/api';

export default function ContactPage() {
  const [data, setData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!data.name.trim()) return toast.error('Please enter your name');
    if (!isValidEmail(data.email)) return toast.error('Please enter a valid email');
    if (!isValidUKPhone(data.phone)) return toast.error('Please enter a valid UK phone number');
    if (data.message.trim().length < 10) return toast.error('Please add a bit more detail to your message');

    setSubmitting(true);
    try {
      // Reuse the custom quote endpoint for general enquiries; admin sees them in the dashboard
      await api.post('/quotes/custom', {
        kind: 'quote',
        movingType: 'Other',
        pickup: { postcode: 'CONTACT', floor: 'Ground Floor' },
        delivery: { postcode: 'CONTACT', floor: 'Ground Floor' },
        movingDate: new Date(),
        moversNeeded: 'Not Sure',
        notes: `[General Enquiry] ${data.message}`,
        customer: { name: data.name, email: data.email, phone: data.phone },
      });
      setDone(true);
      toast.success('Message sent — we\'ll be in touch shortly');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact us"
        title="We're here to help"
        subtitle="Got a question, a special request, or just want to talk through your move? Reach us by phone, email, or WhatsApp — we usually reply within 15 minutes."
      />

      <section className="py-16 lg:py-20 bg-ink-50">
        <div className="container-wide grid lg:grid-cols-3 gap-8 items-start">
          {/* Contact methods */}
          <div className="space-y-3">
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="block p-5 bg-white rounded-2xl border border-ink-100 hover:border-ember-300 hover:shadow-soft transition"
            >
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-10 h-10 rounded-xl bg-ember-50 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-ember-600" />
                </div>
                <div className="font-display font-bold">Call us</div>
              </div>
              <div className="text-ember-600 font-bold text-lg">{siteConfig.phone}</div>
              <div className="text-xs text-ink-500 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Mon-Sat 7am-9pm
              </div>
            </a>

            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="block p-5 bg-white rounded-2xl border border-ink-100 hover:border-emerald-300 hover:shadow-soft transition"
            >
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-display font-bold">WhatsApp</div>
              </div>
              <div className="text-emerald-600 font-bold text-lg">Quick chat</div>
              <div className="text-xs text-ink-500 mt-1">Usually replies in minutes</div>
            </a>

            <a
              href={`mailto:${siteConfig.email}`}
              className="block p-5 bg-white rounded-2xl border border-ink-100 hover:border-ink-400 hover:shadow-soft transition"
            >
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-10 h-10 rounded-xl bg-ink-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-ink-700" />
                </div>
                <div className="font-display font-bold">Email</div>
              </div>
              <div className="text-ink-900 font-bold text-sm break-all">{siteConfig.email}</div>
            </a>

            <div className="p-5 bg-ink-900 text-white rounded-2xl">
              <div className="flex items-center gap-3 mb-1.5">
                <MapPin className="w-4 h-4 text-ember-400" />
                <div className="font-display font-bold">Service area</div>
              </div>
              <div className="text-sm text-ink-300">
                All of London inside the M25, plus longer-distance UK moves on request.
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {done ? (
              <div className="bg-white rounded-3xl shadow-soft border border-ink-100 p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="font-display font-bold text-2xl mb-2">Message sent!</h2>
                <p className="text-ink-600">
                  Thanks {data.name.split(' ')[0]}, we'll get back to you within 30 minutes during business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="bg-white rounded-3xl shadow-soft border border-ink-100 p-6 lg:p-8 space-y-4">
                <h2 className="font-display font-bold text-2xl mb-1">Send a message</h2>
                <p className="text-ink-500 text-sm mb-5">Fill in the form and we'll come back to you shortly.</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-ink-600 mb-2 block">Full name</label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-600 mb-2 block">Phone</label>
                    <input
                      type="tel"
                      value={data.phone}
                      onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
                      className={`input-field ${
                        data.phone && isValidUKPhone(data.phone) ? 'border-emerald-500' :
                        data.phone ? 'border-red-400' : ''
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-600 mb-2 block">Email</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
                    className={`input-field ${
                      data.email && isValidEmail(data.email) ? 'border-emerald-500' :
                      data.email ? 'border-red-400' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-600 mb-2 block">Message</label>
                  <textarea
                    rows="6"
                    value={data.message}
                    onChange={(e) => setData((d) => ({ ...d, message: e.target.value }))}
                    placeholder="Tell us what you need..."
                    className="input-field resize-none"
                  />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary w-full justify-center !py-4 disabled:opacity-50">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> :
                   <>Send message <Send className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
