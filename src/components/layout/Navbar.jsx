'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Truck, ChevronDown, MapPin } from 'lucide-react';
import UserMenu from './UserMenu';
import { siteConfig } from '@/lib/utils/siteConfig';

// ─────────────────────────────────────────────────────────────────────────────
// LOGO CONFIGURATION — change LOGO_SRC to activate your real logo.
//
// Option A — file in /public folder:
//   1. Put your logo at  public/logo.png  (or .svg, .webp)
//   2. Set:  const LOGO_SRC = '/logo.png';
//
// Option B — public Cloudinary / CDN URL:
//   1. In Cloudinary console, make the asset public
//   2. Copy the delivery URL (res.cloudinary.com/...)
//   3. Set:  const LOGO_SRC = 'https://res.cloudinary.com/dfq9zvwsq/image/upload/Logo_bxrrqj.png';
//   4. Also add the hostname to next.config.mjs:
//      images: { remotePatterns: [{ protocol:'https', hostname:'res.cloudinary.com' }] }
//
// While LOGO_SRC is null the truck icon + wordmark fallback is shown.
// ─────────────────────────────────────────────────────────────────────────────
const LOGO_SRC = '/logo.png'  // ← swap to '/logo.png' or your CDN URL
const LOGO_ALT = 'London Express Removals';
const LOGO_W   = 160;    // natural render width in px — adjust to your logo
const LOGO_H   = 44;     // natural render height in px — adjust to your logo

const boroughs = [
  { href: '/locations/camden',       label: 'Camden' },
  { href: '/locations/hackney',      label: 'Hackney' },
  { href: '/locations/islington',    label: 'Islington' },
  { href: '/locations/shoreditch',   label: 'Shoreditch' },
  { href: '/locations/canary-wharf', label: 'Canary Wharf' },
  { href: '/locations/westminster',  label: 'Westminster' },
  { href: '/locations/kensington',   label: 'Kensington' },
  { href: '/locations/hammersmith',  label: 'Hammersmith' },
  { href: '/locations/peckham',      label: 'Peckham' },
  { href: '/locations/lewisham',     label: 'Lewisham' },
  { href: '/locations/brixton',      label: 'Brixton' },
  { href: '/locations/clapham',      label: 'Clapham' },
  { href: '/locations/wandsworth',   label: 'Wandsworth' },
  { href: '/locations/wimbledon',    label: 'Wimbledon' },
  { href: '/locations/greenwich',    label: 'Greenwich' },
  { href: '/locations/croydon',      label: 'Croydon' },
  { href: '/locations/bromley',      label: 'Bromley' },
  { href: '/locations/sutton',       label: 'Sutton' },
  { href: '/locations/kingston',     label: 'Kingston' },
  { href: '/locations/bexley',       label: 'Bexley' },
  { href: '/locations/tottenham',    label: 'Tottenham' },
  { href: '/locations/barnet',       label: 'Barnet' },
  { href: '/locations/enfield',      label: 'Enfield' },
  { href: '/locations/harrow',       label: 'Harrow' },
  { href: '/locations/ealing',       label: 'Ealing' },
  { href: '/locations/hounslow',     label: 'Hounslow' },
  { href: '/locations/richmond',     label: 'Richmond' },
  { href: '/locations/uxbridge',     label: 'Uxbridge' },
  { href: '/locations/wembley',      label: 'Wembley' },
  { href: '/locations/stratford',    label: 'Stratford' },
  { href: '/locations/walthamstow',  label: 'Walthamstow' },
  { href: '/locations/ilford',       label: 'Ilford' },
  { href: '/locations/romford',      label: 'Romford' },
  { href: '/locations/barking',      label: 'Barking' },
];

const desktopLinks = [
  { href: '/',         label: 'Home' },
  { href: '/about',    label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/blog',     label: 'Blog' },
  { href: '/contact',  label: 'Contact' },
];

const mobileLinks = [
  { href: '/',             label: 'Home' },
  { href: '/about',        label: 'About' },
  { href: '/services',     label: 'Services' },
  { href: '/booking',      label: 'Booking' },
  { href: '/custom-quote', label: 'Custom Quote' },
  { href: '/blog',         label: 'Blog' },
  { href: '/contact',      label: 'Contact' },
];

const areas = [
  { label: 'Inner London', slugs: ['camden','hackney','islington','shoreditch','canary-wharf','westminster','kensington','hammersmith','peckham','lewisham'] },
  { label: 'South London', slugs: ['brixton','clapham','wandsworth','wimbledon','greenwich','croydon','bromley','sutton','kingston','bexley'] },
  { label: 'North London', slugs: ['tottenham','barnet','enfield','harrow'] },
  { label: 'West London',  slugs: ['ealing','hounslow','richmond','uxbridge','wembley'] },
  { label: 'East London',  slugs: ['stratford','walthamstow','ilford','romford','barking'] },
];

// ─── Logo sub-component ───────────────────────────────────────────────────────
function NavLogo() {
  if (LOGO_SRC) {
    return (
      <Image
        src={LOGO_SRC}
        alt={LOGO_ALT}
        width={LOGO_W}
        height={LOGO_H}
        priority          // above-the-fold — skip lazy load
        className="object-contain h-9 lg:h-10 w-auto max-w-[160px]"
      />
    );
  }
  // Truck icon + wordmark fallback
  return (
    <>
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ink-900 to-ink-800 flex items-center justify-center shadow-pop group-hover:rotate-3 transition shrink-0">
        <Truck className="w-5 h-5 text-ember-400" aria-hidden />
      </div>
      <div className="font-display font-bold text-base lg:text-lg leading-tight">
        London Express<br className="hidden sm:inline" />
        <span className="text-ember-500"> Removals</span>
      </div>
    </>
  );
}

export default function Navbar() {
  const [scrolled,      setScrolled]      = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [locDropOpen,   setLocDropOpen]   = useState(false);
  const [mobileLocOpen, setMobileLocOpen] = useState(false);
  const pathname = usePathname();
  const dropRef  = useRef(null);

  // Passive scroll listener — adds glass background after 20 px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setLocDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Escape key closes mobile drawer
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isLocActive = pathname.startsWith('/locations');

  return (
    <>
      {/* ── Fixed header ─────────────────────────────────────────────────── */}
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-soft'
            : 'bg-white/0'
        }`}
      >
        <div className="container-wide flex items-center justify-between h-16 lg:h-20 gap-4">

          {/* Logo — click → home */}
          <Link
            href="/"
            aria-label="London Express Removals — go to homepage"
            className="flex items-center gap-2.5 group shrink-0"
          >
            <NavLogo />
          </Link>

          {/* ── Desktop nav links ───────────────────────────────────────── */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {desktopLinks.map((l) => {
              const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 xl:px-3.5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    active
                      ? 'bg-ink-900 text-white'
                      : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}

            {/* Locations mega-dropdown */}
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setLocDropOpen((v) => !v)}
                aria-expanded={locDropOpen}
                aria-haspopup="true"
                aria-controls="locations-dropdown"
                className={`flex items-center gap-1 px-3 xl:px-3.5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  isLocActive
                    ? 'bg-ink-900 text-white'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" aria-hidden />
                Locations
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${locDropOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>

              <AnimatePresence>
                {locDropOpen && (
                  <motion.div
                    id="locations-dropdown"
                    role="menu"
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-[540px] bg-white rounded-2xl shadow-pop border border-ink-100 z-50 p-5"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400 mb-3 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-ember-500" aria-hidden />
                      We cover all London boroughs
                    </p>
                    <div className="grid grid-cols-3 gap-x-5 gap-y-0">
                      {areas.map((area) => (
                        <div key={area.label} className="mb-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-ember-500 mb-1.5 pb-1 border-b border-ink-100">
                            {area.label}
                          </p>
                          {area.slugs.map((slug) => {
                            const b = boroughs.find((x) => x.href === `/locations/${slug}`);
                            if (!b) return null;
                            return (
                              <Link
                                key={b.href}
                                href={b.href}
                                role="menuitem"
                                onClick={() => setLocDropOpen(false)}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm font-medium transition ${
                                  pathname === b.href
                                    ? 'bg-ember-50 text-ember-600'
                                    : 'text-ink-700 hover:bg-ink-50 hover:text-ink-900'
                                }`}
                              >
                                <span className="w-1 h-1 rounded-full bg-ember-400 shrink-0" aria-hidden />
                                {b.label}
                              </Link>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-3 border-t border-ink-100">
                      <Link
                        href="/custom-quote"
                        onClick={() => setLocDropOpen(false)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-ember-600 hover:text-ember-700 transition"
                      >
                        Outside London? Request a custom quote →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* ── Right-side controls ─────────────────────────────────────── */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            {/* Phone — hidden below XL to avoid crowding */}
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="hidden xl:flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-ember-500 transition"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden />
              {siteConfig.phone}
            </a>

            {/* Account / auth dropdown */}
            <UserMenu />

            {/* Primary CTA */}
            <Link
              href="/booking"
              className="hidden sm:inline-flex btn-primary !py-2.5 !px-4 lg:!px-5 text-sm whitespace-nowrap"
            >
              Book now
            </Link>

            {/* Hamburger — lg and below */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden w-10 h-10 rounded-xl bg-ink-50 flex items-center justify-center hover:bg-ink-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-500 focus-visible:ring-offset-2"
            >
              {mobileOpen
                ? <X className="w-5 h-5" aria-hidden />
                : <Menu className="w-5 h-5" aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile / tablet nav drawer ──────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
              aria-hidden
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.nav
              id="mobile-nav"
              role="navigation"
              aria-label="Mobile navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute top-0 right-0 bottom-0 w-72 sm:w-80 bg-white shadow-pop flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 shrink-0">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Go to homepage"
                  className="flex items-center gap-2"
                >
                  {LOGO_SRC ? (
                    <Image
                      src={LOGO_SRC}
                      alt={LOGO_ALT}
                      width={110}
                      height={32}
                      className="object-contain h-8 w-auto"
                    />
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-lg bg-ink-900 flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4 text-ember-400" aria-hidden />
                      </div>
                      <span className="font-display font-bold text-sm leading-tight">
                        London Express<br />Removals
                      </span>
                    </>
                  )}
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 rounded-xl bg-ink-50 flex items-center justify-center hover:bg-ink-100 transition"
                >
                  <X className="w-5 h-5" aria-hidden />
                </button>
              </div>

              {/* Scrollable nav links */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 space-y-0.5">
                {mobileLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`flex items-center px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                      pathname === l.href
                        ? 'bg-ink-900 text-white'
                        : 'text-ink-700 hover:bg-ink-50'
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}

                {/* Locations accordion */}
                <button
                  onClick={() => setMobileLocOpen((v) => !v)}
                  aria-expanded={mobileLocOpen}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl font-medium text-sm transition mt-0.5 ${
                    isLocActive ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-ink-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" aria-hidden />
                    Locations
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${mobileLocOpen ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>

                <AnimatePresence initial={false}>
                  {mobileLocOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mx-1 my-1 px-2 pt-2 pb-3 bg-ink-50 rounded-xl space-y-3">
                        {areas.map((area) => (
                          <div key={area.label}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-ember-500 px-1 mb-1.5">
                              {area.label}
                            </p>
                            <div className="grid grid-cols-2 gap-0.5">
                              {area.slugs.map((slug) => {
                                const b = boroughs.find((x) => x.href === `/locations/${slug}`);
                                if (!b) return null;
                                return (
                                  <Link
                                    key={b.href}
                                    href={b.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition ${
                                      pathname === b.href
                                        ? 'bg-ember-100 text-ember-700'
                                        : 'text-ink-600 hover:bg-white hover:text-ink-900'
                                    }`}
                                  >
                                    <span className="w-1 h-1 rounded-full bg-ember-400 shrink-0" aria-hidden />
                                    {b.label}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sticky footer CTAs */}
              <div className="shrink-0 px-4 py-4 border-t border-ink-100 bg-white space-y-2">
                <Link
                  href="/booking"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  Book your move
                </Link>
                <a
                  href={`tel:${siteConfig.phoneRaw}`}
                  className="btn-ghost w-full justify-center"
                >
                  <Phone className="w-4 h-4" aria-hidden />
                  {siteConfig.phone}
                </a>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
