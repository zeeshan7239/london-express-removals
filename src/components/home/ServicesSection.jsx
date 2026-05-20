import Link from 'next/link';
import {
  Home, Building2, Briefcase, Package, Warehouse, Building, ArrowRight,
} from 'lucide-react';

const services = [
  { icon: Home,      title: 'Studio Moves',  desc: 'Quick, affordable studio relocations.', accent: 'from-blue-500/10 to-cyan-500/10' },
  { icon: Building2, title: 'Flat Moves',    desc: '1-3 bed flat moves across London.',     accent: 'from-violet-500/10 to-purple-500/10' },
  { icon: Building,  title: 'House Moves',   desc: 'Whole-home relocations done right.',     accent: 'from-ember-500/10 to-orange-500/10' },
  { icon: Briefcase, title: 'Office Moves',  desc: 'Minimal disruption office relocations.', accent: 'from-emerald-500/10 to-teal-500/10' },
  { icon: Warehouse, title: 'Storage Moves', desc: 'To/from storage facilities, anytime.',   accent: 'from-amber-500/10 to-yellow-500/10' },
  { icon: Package,   title: 'Single Items',  desc: 'Sofas, fridges, single deliveries.',     accent: 'from-pink-500/10 to-rose-500/10' },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 lg:py-28 bg-gradient-to-b from-white to-ink-50 relative overflow-hidden">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="section-eyebrow mb-3">What we move</div>
            <h2 className="heading-display text-3xl lg:text-5xl">
              From single items to<br className="hidden md:inline" /> entire offices
            </h2>
          </div>
          <Link href="/booking" className="btn-primary !py-2.5 !px-5 text-sm">
            Get a quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.title}
                href="/services"
                className="group relative p-6 rounded-3xl bg-white border border-ink-100 hover:border-ember-300 hover:-translate-y-1 transition-all"
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${s.accent} opacity-0 group-hover:opacity-100 transition`} />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-ink-900 flex items-center justify-center mb-4 group-hover:bg-ember-500 transition shadow-pop">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-1.5">{s.title}</h3>
                  <p className="text-ink-600 text-sm leading-relaxed">{s.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-ember-600 opacity-0 group-hover:opacity-100 transition">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
