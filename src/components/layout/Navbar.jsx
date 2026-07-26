'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronDown, MapPin } from 'lucide-react';
import Image from 'next/image';
import UserMenu from './UserMenu';
import { siteConfig } from '@/lib/utils/siteConfig';

const boroughs = [
  // Inner London
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
  // South London
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
  // North London
  { href: '/locations/tottenham',    label: 'Tottenham' },
  { href: '/locations/barnet',       label: 'Barnet' },
  { href: '/locations/enfield',      label: 'Enfield' },
  { href: '/locations/harrow',       label: 'Harrow' },
  // West London
  { href: '/locations/ealing',       label: 'Ealing' },
  { href: '/locations/hounslow',     label: 'Hounslow' },
  { href: '/locations/richmond',     label: 'Richmond' },
  { href: '/locations/uxbridge',     label: 'Uxbridge' },
  { href: '/locations/wembley',      label: 'Wembley' },
  // East London
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
  { label: 'Inner London',  slugs: ['camden','hackney','islington','shoreditch','canary-wharf','westminster','kensington','hammersmith','peckham','lewisham'] },
  { label: 'South London',  slugs: ['brixton','clapham','wandsworth','wimbledon','greenwich','croydon','bromley','sutton','kingston','bexley'] },
  { label: 'North London',  slugs: ['tottenham','barnet','enfield','harrow'] },
  { label: 'West London',   slugs: ['ealing','hounslow','richmond','uxbridge','wembley'] },
  { label: 'East London',   slugs: ['stratford','walthamstow','ilford','romford','barking'] },
];

export default function Navbar() {
  const [scrolled, setScrolled]           = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [locDropOpen, setLocDropOpen]     = useState(false);
  const [mobileLocOpen, setMobileLocOpen] = useState(false);
  const pathname = usePathname();
  const dropRef  = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setLocDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isLocActive = pathname.startsWith('/locations');

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-soft' : 'bg-transparent'
      }`}>
        <div className="container-wide flex items-center justify-between h-16 lg:h-20">

          {/* Logo — the image already contains the "London Express Removals"
              wordmark, so no duplicate text next to it. Height scales from
              40px on mobile → 44px on tablet → 48px on desktop; width is
              auto so the aspect ratio stays intact. */}
          <Link href="/" className="flex items-center group shrink-0" aria-label="London Express Removals — home">
            <Image
              src="/logo.png"
              alt="London Express Removals"
              width={805}
              height={805}
              priority
             className="h-12 sm:h-20 md:h-28 lg:h-36 lg:mt-4 w-auto object-contain select-none transition-transform duration-200 group-hover:rotate-3"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {desktopLinks.map((l) => {
              const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
              return (
                <Link key={l.href} href={l.href}
                  className={`px-3 xl:px-3.5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    active ? 'bg-ink-900 text-white' : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
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
                className={`flex items-center gap-1 px-3 xl:px-3.5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  isLocActive ? 'bg-ink-900 text-white' : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
                }`}
              >
                Locations
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${locDropOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {locDropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-[520px] bg-white rounded-2xl shadow-pop border border-ink-100 overflow-hidden z-50 p-4"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 mb-3">
                      London Boroughs
                    </p>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-0">
                      {areas.map((area) => (
                        <div key={area.label}>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-ember-500 mb-1">{area.label}</p>
                          {area.slugs.map((slug) => {
                            const b = boroughs.find((b) => b.href === `/locations/${slug}`);
                            if (!b) return null;
                            return (
                              <Link
                                key={b.href}
                                href={b.href}
                                onClick={() => setLocDropOpen(false)}
                                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium transition ${
                                  pathname === b.href ? 'bg-ember-50 text-ember-600' : 'text-ink-700 hover:bg-ink-50 hover:text-ink-900'
                                }`}
                              >
                                <MapPin className="w-3 h-3 text-ember-400 shrink-0" />
                                {b.label}
                              </Link>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            <a href={`tel:${siteConfig.phoneRaw}`}
              className="hidden xl:flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-ember-500 transition"
            >
              <Phone className="w-3.5 h-3.5" /> {siteConfig.phone}
            </a>
            <UserMenu />
            <Link href="/booking" className="hidden sm:inline-flex btn-primary !py-2.5 !px-4 lg:!px-5 text-sm">
              Book now
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden w-10 h-10 rounded-xl bg-ink-50 flex items-center justify-center hover:bg-ink-100 transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute top-0 right-0 bottom-0 w-72 bg-white shadow-pop p-6 overflow-y-auto"
            >
              <div className="flex justify-end mb-4">
                <button onClick={() => setMobileOpen(false)} className="w-10 h-10 rounded-xl bg-ink-50 flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {mobileLinks.map((l) => (
                  <Link key={l.href} href={l.href}
                    className={`px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                      pathname === l.href ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-ink-50'
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}

                {/* Locations accordion */}
                <button
                  onClick={() => setMobileLocOpen((v) => !v)}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                    isLocActive ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-ink-50'
                  }`}
                >
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Locations</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileLocOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {mobileLocOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-2 pt-1 pb-2 bg-ink-50 rounded-xl space-y-2">
                        {areas.map((area) => (
                          <div key={area.label}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-ember-500 px-2 pt-1 mb-0.5">{area.label}</p>
                            <div className="grid grid-cols-2 gap-0.5">
                              {area.slugs.map((slug) => {
                                const b = boroughs.find((b) => b.href === `/locations/${slug}`);
                                if (!b) return null;
                                return (
                                  <Link key={b.href} href={b.href}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition ${
                                      pathname === b.href ? 'bg-ember-100 text-ember-700' : 'text-ink-600 hover:bg-white hover:text-ink-900'
                                    }`}
                                  >
                                    <MapPin className="w-3 h-3 text-ember-400 shrink-0" />
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

                <Link href="/booking" className="btn-primary mt-3 justify-center">Book your move</Link>
                <a href={`tel:${siteConfig.phoneRaw}`} className="btn-ghost mt-2 justify-center">
                  <Phone className="w-4 h-4" /> Call us
                </a>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
