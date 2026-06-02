import Link from 'next/link';
import PageHeader from '@/components/common/PageHeader';
import CTABanner from '@/components/home/CTABanner';
import {
  Home, Building2, Briefcase, Package, Warehouse, Building,
  Check, ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'Removal Services',
  description: 'Full range of professional moving services across London: house moves, flat moves, office relocations, single items, and storage runs. Fixed pricing, Fully secured.',
  alternates: { canonical: '/services' },
};

const services = [
  {
    id: 'studio',
    icon: Home,
    title: 'Studio & Single-Room Moves',
    desc: 'Quick, affordable moves for studio flats and bedsits. Ideal for students and young professionals.',
    features: ['1 mover + van', 'From £100', 'Same-day available', 'Secured and Safe'],
  },
  {
    id: 'flat',
    icon: Building2,
    title: 'Flat Moves',
    desc: 'The full range of London flats — from a 1-bed to a 3-bed mansion block.',
    features: ['2-3 movers + van', 'Lift/stairs assessment', 'Furniture disassembly', 'Secured and Safe'],
  },
  {
    id: 'house',
    icon: Building,
    title: 'House Moves',
    desc: 'Whole-home relocations done properly, from terraced houses to detached homes.',
    features: ['2-4 movers', 'Larger Luton vans', 'Packing service available', 'Secured and Safe'],
  },
  {
    id: 'office',
    icon: Briefcase,
    title: 'Office Relocations',
    desc: 'Minimal disruption office moves — weekends and out-of-hours available.',
    features: ['Tech-safe handling', 'Out-of-hours moves', 'Document confidentiality', 'Furniture rearrange'],
  },
  {
    id: 'storage',
    icon: Warehouse,
    title: 'Storage Runs',
    desc: 'To/from storage facilities, any time. Loading and unloading included.',
    features: ['Self-storage friendly', 'Loading service', 'Container packing', 'Round trips OK'],
  },
  {
    id: 'single-item',
    icon: Package,
    title: 'Single-Item Delivery',
    desc: 'Sofas, fridges, beds, anything you need moved across town.',
    features: ['From £100', 'Same-day delivery', '1 or 2 movers', 'eBay/Marketplace pickups'],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="What we move"
        title="Removal services for every London move"
        subtitle="From a single sofa to a 4-bedroom house — we've got you covered with transparent pricing and insured, professional service."
      />

      <section className="py-16 lg:py-20 bg-ink-50">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-5">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  id={s.id}
                  className="bg-white rounded-3xl p-7 lg:p-8 border border-ink-100 hover:shadow-soft transition"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ink-900 to-ink-800 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-ember-400" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-xl mb-1">{s.title}</h2>
                      <p className="text-ink-600 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5 mb-5">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-ink-700">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/booking" className="inline-flex items-center gap-1.5 text-sm font-bold text-ember-600 hover:text-ember-700">
                    Book this service <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
