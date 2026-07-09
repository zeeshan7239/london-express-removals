import Link from 'next/link';
import { Phone, Mail, MapPin, Truck } from 'lucide-react';
import { siteConfig } from '@/lib/utils/siteConfig';

const sections = [
  { title: 'Services', links: [
    { href: '/services',      label: 'All Services' },
    { href: '/services#house',label: 'House Moves' },
    { href: '/services#flat', label: 'Flat Moves' },
    { href: '/services#office',label:'Office Moves' },
    { href: '/services#single-item', label: 'Single Items' },
  ]},
  { title: 'Company', links: [
    { href: '/about',        label: 'About Us' },
    { href: '/blog',         label: 'Blog' },
    { href: '/contact',      label: 'Contact' },
    { href: '/booking',      label: 'Book Now' },
    { href: '/custom-quote', label: 'Custom Quote' },
  ]},
  { title: 'Legal', links: [
    { href: '/terms',   label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
  ]},
];

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark opacity-40 pointer-events-none" />
      <div className="container-wide py-16 lg:py-20 relative">
        <div className="grid lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ember-500 to-ember-600 flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div className="font-display font-bold text-white text-lg">London Express Removals</div>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm mb-5">
              Professional removal service across London and the UK. Reliable team,
              transparent pricing, and hundreds of successful moves completed.
            </p>
            <div className="space-y-2 text-sm">
              <a href={`tel:${siteConfig.phoneRaw}`} className="flex items-center gap-2 hover:text-ember-400 transition">
                <Phone className="w-4 h-4 text-ember-500" /> {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-ember-400 transition">
                <Mail className="w-4 h-4 text-ember-500" /> {siteConfig.email}
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-ember-500" /> London &amp; Nationwide UK Removals
              </div>
            </div>
          </div>
          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">{s.title}</h4>
              <ul className="space-y-2.5 text-sm">
                {s.links.map((l) => (
                  <li key={l.href}><Link href={l.href} className="hover:text-ember-400 transition">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Built in Britain 🇬🇧</p>
        </div>
      </div>
    </footer>
  );
}
