import Link from 'next/link';
import { MapPin } from 'lucide-react';

const areas = [
  'Camden', 'Islington', 'Hackney', 'Tower Hamlets', 'Shoreditch', 'Westminster',
  'Kensington', 'Chelsea', 'Wandsworth', 'Lambeth', 'Southwark', 'Lewisham',
  'Greenwich', 'Newham', 'Waltham Forest', 'Haringey', 'Enfield', 'Barnet',
  'Brent', 'Ealing', 'Hounslow', 'Hammersmith', 'Fulham', 'Richmond',
];

export default function CoverageAreas() {
  return (
    <section className="py-20 lg:py-28 bg-ink-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark opacity-30" />
      <div className="container-wide relative">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur text-xs font-semibold uppercase tracking-wider text-ember-400 mb-4">
              <MapPin className="w-3 h-3" /> Coverage
            </div>
            <h2 className="heading-display !text-white text-3xl lg:text-4xl mb-3">
              All of London,<br />all the time
            </h2>
            <p className="text-ink-300 leading-relaxed mb-5">
              We cover every borough inside the M25 — and many places beyond.
              Need a longer-distance move? <Link href="/custom-quote" className="text-ember-400 hover:underline">Request a custom quote</Link>.
            </p>
            <Link href="/booking" className="btn-primary">
              Book your move
            </Link>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
            {areas.map((a) => (
              <div key={a} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <span className="text-ember-400 mr-1">·</span>
                {a}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
