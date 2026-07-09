'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Phone, Star, Shield, Clock, ChevronRight, Truck, Check, MapPin } from 'lucide-react';
import { siteConfig } from '@/lib/utils/siteConfig';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 text-white">
      <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-ember-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-ember-500/10 blur-3xl pointer-events-none" />

      <div className="container-wide relative pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur text-xs font-semibold uppercase tracking-wider text-ember-400 mb-6">
              <Sparkles className="w-3 h-3" /> Trusted by thousands of customers
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-6">
              London moves,<br />
              <span className="bg-gradient-to-r from-ember-400 to-ember-500 bg-clip-text text-transparent">done right.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-ink-300 leading-relaxed mb-8 max-w-xl">
              Professional man &amp; van service across London and the UK. Experienced team,
              transparent pricing, and reliable movers who actually show up on time.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link href="/booking" className="btn-primary !px-8 !py-4 text-base group">
                Book your move <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Link>
              <a href={`tel:${siteConfig.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white font-semibold hover:bg-white/15 transition">
                <Phone className="w-4 h-4" /> Call {siteConfig.phone}
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5 text-ink-200">
                <div className="flex">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-ember-400 text-ember-400" />)}
                </div>
                <span className="font-bold">4.9</span>
                <span className="text-ink-400">(hundreds of reviews)</span>
              </span>
              <span className="flex items-center gap-1.5 text-ink-300"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Professional team</span>
              <span className="flex items-center gap-1.5 text-ink-300"><Clock className="w-3.5 h-3.5 text-ember-400" /> Same-day service</span>
              <span className="flex items-center gap-1.5 text-ink-300"><MapPin className="w-3.5 h-3.5 text-ember-400" /> London &amp; Nationwide</span>
            </motion.div>
          </div>

          {/* Right - mock booking card */}
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="relative">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-full h-full bg-ember-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white text-ink-900 rounded-3xl shadow-pop p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ember-500 to-ember-600 flex items-center justify-center shadow-glow-ember">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-ember-600 font-bold">Live Booking</div>
                    <div className="font-display font-bold text-lg">Just Now</div>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-ink-50">
                    <span className="text-xs text-ink-500 uppercase tracking-wider">Move type</span>
                    <span className="font-semibold text-sm">2-bed flat</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-ink-50">
                    <span className="text-xs text-ink-500 uppercase tracking-wider">Route</span>
                    <span className="font-semibold text-sm">Camden → Shoreditch</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-ember-50 border border-ember-200">
                    <span className="text-xs text-ember-700 uppercase tracking-wider font-semibold">Estimated total</span>
                    <span className="font-display font-extrabold text-2xl text-ember-700">£189</span>
                  </div>
                </div>
                <Link href="/booking" className="btn-primary w-full justify-center">Get your instant quote</Link>
                <div className="mt-4 flex items-center gap-2 text-xs text-ink-500 justify-center">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> No hidden fees · Transparent pricing
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
