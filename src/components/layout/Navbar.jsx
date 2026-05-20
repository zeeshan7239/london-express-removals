'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Truck } from 'lucide-react';
import UserMenu from './UserMenu';
import { siteConfig } from '@/lib/utils/siteConfig';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/booking', label: 'Booking', highlight: true },
  { href: '/custom-quote', label: 'Custom Quote' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-soft' : 'bg-transparent'
      }`}>
        <div className="container-wide flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ink-900 to-ink-800 flex items-center justify-center shadow-pop group-hover:rotate-3 transition">
              <Truck className="w-5 h-5 text-ember-400" />
            </div>
            <div className="font-display font-bold text-base lg:text-lg leading-tight">
              London Express<br className="hidden sm:inline" />
              <span className="text-ember-500 sm:text-inherit"> Removals</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => {
              const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? 'bg-ink-900 text-white'
                      : l.highlight
                        ? 'text-ember-600 hover:bg-ember-50'
                        : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 lg:gap-3">
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-ember-500 transition"
            >
              <Phone className="w-3.5 h-3.5" /> {siteConfig.phone}
            </a>
            <UserMenu />
            <Link href="/booking" className="hidden sm:inline-flex btn-primary !py-2.5 !px-5 text-sm">
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
                <button onClick={() => setMobileOpen(false)} className="w-10 h-10 rounded-xl bg-ink-50 flex items-center justify-center">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {links.map((l) => (
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
