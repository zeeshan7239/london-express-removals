import Link from 'next/link';
import NextImage from 'next/image';
import { Phone, Star, Shield, Clock, MapPin } from 'lucide-react';
import { siteConfig } from '@/lib/utils/siteConfig';
import HeroBookingForm from './HeroBookingForm';

// To use your own van photo: put it in /public and change this path (e.g. '/hero-van.png').
const HERO_VAN_SRC = '/van.png';
const IS_SVG = HERO_VAN_SRC.endsWith('.svg');

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 text-white">
      <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-ember-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-ember-500/10 blur-3xl pointer-events-none" />

      {/* Hero background image — fills the whole section; everything else sits on top */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <NextImage src={HERO_VAN_SRC} alt="" fill priority unoptimized={IS_SVG} sizes="100vw"
          className="object-cover object-center" />
        {/* Dark overlay so text and form stay readable; lower the numbers to show more of the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/60 to-ink-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
      </div>

      <div className="container-wide relative z-10 pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: copy + van */}
          <div className="lg:col-span-6 xl:col-span-7 order-1">
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl xl:text-6xl leading-[1.1] tracking-tight mb-1 sm:mb-4">
              London moves,<br />
              <span className="bg-gradient-to-r from-ember-400 to-ember-500 bg-clip-text text-transparent">done right.</span>
            </h1>
            <p className="hidden sm:block text-base sm:text-lg text-ink-300 leading-relaxed mb-6 max-w-xl">
              Professional man &amp; van service across London and the UK. Experienced team,
              transparent pricing, and reliable movers who actually show up on time.
            </p>

            <div className="hidden sm:flex flex-wrap items-center gap-x-5 gap-y-2 text-sm mb-6">
              <span className="flex items-center gap-1.5 text-ink-200">
                <span className="flex">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-ember-400 text-ember-400" />)}</span>
                <span className="font-bold">5.0 on Google</span>
              </span>
              <span className="flex items-center gap-1.5 text-ink-300"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Professional team</span>
              <span className="flex items-center gap-1.5 text-ink-300"><Clock className="w-3.5 h-3.5 text-ember-400" /> Same-day service</span>
              <span className="flex items-center gap-1.5 text-ink-300"><MapPin className="w-3.5 h-3.5 text-ember-400" /> London &amp; Nationwide</span>
            </div>

            <a href={`tel:${siteConfig.phoneRaw}`}
              className="mt-6 hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-ink-200 hover:text-white transition">
              <Phone className="w-4 h-4 text-ember-400" /> Prefer to talk? Call {siteConfig.phone}
            </a>
          </div>

          {/* Right: booking form, visible on page load */}
          <div className="lg:col-span-6 xl:col-span-5 order-2 relative">
            <div className="absolute -top-6 -left-6 w-full h-full bg-ember-500/20 rounded-3xl blur-2xl pointer-events-none" />
            <HeroBookingForm />
          </div>

        </div>
      </div>
    </section>
  );
}
