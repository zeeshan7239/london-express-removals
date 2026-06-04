'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Truck, ChevronDown, MapPin } from 'lucide-react';
import UserMenu from './UserMenu';
import { siteConfig } from '@/lib/utils/siteConfig';

const boroughs = [
  { href: '/locations/camden',     label: 'Camden' },
  { href: '/locations/hackney',    label: 'Hackney' },
  { href: '/locations/islington',  label: 'Islington' },
  { href: '/locations/wandsworth', label: 'Wandsworth' },
  { href: '/locations/brixton',    label: 'Brixton' },
  { href: '/locations/clapham',    label: 'Clapham' },
  { href: '/locations/greenwich',  label: 'Greenwich' },
  { href: '/locations/croydon',    label: 'Croydon' },
  { href: '/locations/stratford',  label: 'Stratford' },
  { href: '/locations/shoreditch', label: 'Shoreditch' },
];

// Desktop nav — lean so it never overflows at lg breakpoint
const desktopLinks = [
  { href: '/',         label: 'Home' },
  { href: '/about',    label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/blog',     label: 'Blog' },
  { href: '/contact',  label: 'Contact' },
];

// Mobile menu — full list
const mobileLinks = [
  { href: '/',             label: 'Home' },
  { href: '/about',        label: 'About' },
  { href: '/services',     label: 'Services' },
  { href: '/booking',      label: 'Booking' },
  { href: '/custom-quote', label: 'Custom Quote' },
  { href: '/blog',         label: 'Blog' },
  { href: '/contact',      label: 'Contact' },
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
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-soft' : 'bg-transparent'
        }`}
      >
        <div className="container-wide flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ink-900 to-ink-800 flex items-center justify-center shadow-pop group-hover:rotate-3 transition">
              <Truck className="w-5 h-5 text-ember-400" />
            </div>
            <div className="font-display font-bold text-base lg:text-lg leading-tight">
              London Express<br className="hidden sm:inline" />
              <span className="text-ember-500 sm:text-inherit"> Removals</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
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

            {/* Locations dropdown */}
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setLocDropOpen((v) => !v)}
                className={`flex items-center gap-1 px-3 xl:px-3.5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  isLocActive
                    ? 'bg-ink-900 text-white'
                    : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
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
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-white rounded-2xl shadow-pop border border-ink-100 overflow-hidden z-50"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 px-4 pt-3 pb-1">
                      London Boroughs
                    </p>
                    <div className="grid grid-cols-2 gap-0.5 px-2 pb-2">
                      {boroughs.map((b) => (
                        <Link
                          key={b.href}
                          href={b.href}
                          onClick={() => setLocDropOpen(false)}
                          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-sm font-medium transition ${
                            pathname === b.href
                              ? 'bg-ember-50 text-ember-600'
                              : 'text-ink-700 hover:bg-ink-50 hover:text-ink-900'
                          }`}
                        >
                          <MapPin className="w-3 h-3 text-ember-400 shrink-0" />
                          {b.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            <a
              href={`tel:${siteConfig.phoneRaw}`}
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

      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute top-0 right-0 bottom-0 w-72 bg-white shadow-pop p-6 overflow-y-auto"
            >
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 rounded-xl bg-ink-50 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1">
                {mobileLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
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
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Locations
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileLocOpen ? 'rotate-180' : ''}`} />
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
                      <div className="grid grid-cols-2 gap-1 px-2 pt-1 pb-2 bg-ink-50 rounded-xl">
                        {boroughs.map((b) => (
                          <Link
                            key={b.href}
                            href={b.href}
                            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition ${
                              pathname === b.href
                                ? 'bg-ember-100 text-ember-700'
                                : 'text-ink-600 hover:bg-white hover:text-ink-900'
                            }`}
                          >
                            <MapPin className="w-3 h-3 text-ember-400 shrink-0" />
                            {b.label}
                          </Link>
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
