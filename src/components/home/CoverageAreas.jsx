import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

const areas = [
  { name: 'Camden',           slug: 'camden' },
  { name: 'Islington',        slug: 'islington' },
  { name: 'Hackney',          slug: 'hackney' },
  { name: 'Shoreditch',       slug: 'shoreditch' },
  { name: 'Canary Wharf',     slug: 'canary-wharf' },
  { name: 'Westminster',      slug: 'westminster' },
  { name: 'Kensington',       slug: 'kensington' },
  { name: 'Hammersmith',      slug: 'hammersmith' },
  { name: 'Wandsworth',       slug: 'wandsworth' },
  { name: 'Brixton',          slug: 'brixton' },
  { name: 'Clapham',          slug: 'clapham' },
  { name: 'Peckham',          slug: 'peckham' },
  { name: 'Lewisham',         slug: 'lewisham' },
  { name: 'Greenwich',        slug: 'greenwich' },
  { name: 'Stratford',        slug: 'stratford' },
  { name: 'Walthamstow',      slug: 'walthamstow' },
  { name: 'Tottenham',        slug: 'tottenham' },
  { name: 'Enfield',          slug: 'enfield' },
  { name: 'Barnet',           slug: 'barnet' },
  { name: 'Wembley',          slug: 'wembley' },
  { name: 'Ealing',           slug: 'ealing' },
  { name: 'Hounslow',         slug: 'hounslow' },
  { name: 'Richmond',         slug: 'richmond' },
  { name: 'Romford',          slug: 'romford' },
  { name: 'Ilford',           slug: 'ilford' },
  { name: 'Barking',          slug: 'barking' },
  { name: 'Croydon',          slug: 'croydon' },
  { name: 'Bromley',          slug: 'bromley' },
  { name: 'Wimbledon',        slug: 'wimbledon' },
  { name: 'Sutton',           slug: 'sutton' },
  { name: 'Kingston',         slug: 'kingston' },
  { name: 'Bexley',           slug: 'bexley' },
  { name: 'Harrow',           slug: 'harrow' },
  { name: 'Uxbridge',         slug: 'uxbridge' },
];

export default function CoverageAreas() {
  return (
    <section className="py-20 lg:py-28 bg-ink-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark opacity-30" />
      <div className="container-wide relative">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur text-xs font-semibold uppercase tracking-wider text-ember-400 mb-4">
              <MapPin className="w-3 h-3" /> Coverage
            </div>
            <h2 className="heading-display !text-white text-3xl lg:text-4xl mb-3">
              All of London,<br />all the time
            </h2>
            <p className="text-ink-300 leading-relaxed mb-5">
              We cover every borough inside the M25 — and many places beyond.
              Need a longer-distance move?{' '}
              <Link href="/custom-quote" className="text-ember-400 hover:underline">
                Request a custom quote
              </Link>.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/booking" className="btn-primary">
                Book your move
              </Link>
              <Link
                href="/locations/camden"
                className="inline-flex items-center gap-1.5 text-sm text-ember-400 hover:text-ember-300 transition"
              >
                View all location pages <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
            {areas.map((a) => (
              <Link
                key={a.slug}
                href={`/locations/${a.slug}`}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-ember-500/40 transition group"
              >
                <span className="text-ember-400 mr-1">·</span>
                <span className="group-hover:text-white transition">{a.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
