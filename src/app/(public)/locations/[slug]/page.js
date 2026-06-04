import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Check, ArrowRight, Phone, ChevronDown } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import CTABanner from '@/components/home/CTABanner';
import { siteConfig } from '@/lib/utils/siteConfig';
import { locations, getLocationBySlug } from '@/lib/data/locations';

// Generate all borough pages at build time
export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

// Generate unique metadata per borough
export function generateMetadata({ params }) {
  const location = getLocationBySlug(params.slug);
  if (!location) return {};
  return {
    title: location.title,
    description: location.description,
    alternates: { canonical: `/locations/${location.slug}` },
    openGraph: {
      title: location.title,
      description: location.description,
      url: `/locations/${location.slug}`,
    },
  };
}

const services = [
  { title: 'Studio & Single-Room Moves', desc: 'Quick, affordable moves for studio flats and bedsits.', from: '£100' },
  { title: 'Flat Moves', desc: `1–3 bed flat moves across ${''}.`, from: '£150' },
  { title: 'House Moves', desc: 'Whole-home relocations done properly.', from: '£250' },
  { title: 'Office Relocations', desc: 'Minimal-disruption office moves, weekends available.', from: 'Custom' },
  { title: 'Storage Runs', desc: 'To/from storage facilities. Loading included.', from: '£120' },
  { title: 'Single-Item Delivery', desc: 'Sofas, fridges, anything moved across town.', from: '£100' },
];

const whyUs = [
  { title: 'Transparent pricing', desc: 'See your final price before booking — no surprises.' },
  { title: 'Same-day available', desc: 'Book before noon, move today in most cases.' },
  { title: 'Friendly movers', desc: 'Vetted, polite professionals who show up on time.' },
  { title: '4.9★ rated', desc: 'Trusted by 2,400+ Londoners with a 4.9/5 average.' },
];

export default function LocationPage({ params }) {
  const location = getLocationBySlug(params.slug);
  if (!location) notFound();

  // Structured data for this location page
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'MovingCompany',
    name: siteConfig.name,
    url: `${siteConfig.url}/locations/${location.slug}`,
    telephone: siteConfig.phoneRaw,
    email: siteConfig.email,
    areaServed: {
      '@type': 'City',
      name: location.name,
    },
    priceRange: '££',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '2400',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: location.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <PageHeader
        eyebrow={location.hero.eyebrow}
        title={location.hero.title}
        subtitle={location.hero.subtitle}
      />

      {/* Stats bar */}
      <section className="bg-ember-500 text-white py-4">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-6 lg:gap-12 text-sm font-semibold">
            <span>⭐ 4.9/5 from 2,400+ reviews</span>
            <span>🚐 Same-day moves available</span>
            <span>💷 Transparent fixed pricing</span>
            <span>📍 Covering all of {location.name}</span>
          </div>
        </div>
      </section>

      {/* About this area */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ember-50 border border-ember-200 text-xs font-semibold uppercase tracking-wider text-ember-600 mb-4">
                <MapPin className="w-3.5 h-3.5" /> {location.name}, {location.postcode}
              </div>
              <h2 className="font-display font-extrabold text-2xl lg:text-3xl text-ink-900 mb-4">
                Removals in {location.name} — We Know the Area
              </h2>
              <p className="text-ink-600 leading-relaxed mb-6">{location.about}</p>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-ember-500 text-white font-bold shadow-glow-ember hover:-translate-y-0.5 transition"
              >
                Get instant quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Areas covered */}
            <div className="bg-ink-50 rounded-3xl p-7 border border-ink-100">
              <h3 className="font-display font-bold text-lg text-ink-900 mb-4">
                Areas we cover in {location.name}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {location.areas.map((area) => (
                  <div key={area} className="flex items-center gap-2 text-sm text-ink-700">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {area}
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-ink-200">
                <p className="text-sm text-ink-500">
                  Not sure if we cover your street?{' '}
                  <a href={`tel:${siteConfig.phoneRaw}`} className="text-ember-600 font-semibold hover:underline">
                    Call us
                  </a>{' '}
                  and we'll confirm in seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-20 bg-ink-50">
        <div className="container-wide">
          <div className="text-center mb-10">
            <div className="section-eyebrow mb-3 mx-auto">What we move</div>
            <h2 className="font-display font-extrabold text-2xl lg:text-4xl text-ink-900 mb-3">
              Removal Services in {location.name}
            </h2>
            <p className="text-ink-600 max-w-xl mx-auto">
              From a single item to a full house — we handle every type of move in {location.name} and surrounding areas.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-3xl p-6 border border-ink-100 hover:shadow-soft transition"
              >
                <h3 className="font-display font-bold text-base mb-1.5">{s.title}</h3>
                <p className="text-ink-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ember-600 bg-ember-50 px-2.5 py-1 rounded-full">
                    From {s.from}
                  </span>
                  <Link
                    href="/booking"
                    className="inline-flex items-center gap-1 text-sm font-bold text-ink-700 hover:text-ember-600 transition"
                  >
                    Book <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-wide">
          <div className="text-center mb-10">
            <div className="section-eyebrow mb-3 mx-auto">Why choose us</div>
            <h2 className="font-display font-extrabold text-2xl lg:text-4xl text-ink-900">
              Why {location.name} residents choose us
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyUs.map((w) => (
              <div key={w.title} className="bg-ink-50 rounded-3xl p-6 border border-ink-100">
                <h3 className="font-display font-bold text-base mb-1.5">{w.title}</h3>
                <p className="text-ink-600 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-ink-50">
        <div className="container-wide max-w-3xl">
          <div className="text-center mb-10">
            <div className="section-eyebrow mb-3 mx-auto">FAQ</div>
            <h2 className="font-display font-extrabold text-2xl lg:text-4xl text-ink-900 mb-3">
              {location.name} removals — common questions
            </h2>
            <p className="text-ink-600">
              Can't find the answer?{' '}
              <a href={`tel:${siteConfig.phoneRaw}`} className="text-ember-600 font-semibold hover:underline">
                Call us
              </a>{' '}
              or use WhatsApp.
            </p>
          </div>
          <div className="space-y-3">
            {location.faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-2xl border-2 border-ink-100 bg-white open:border-ember-500 open:bg-ember-50 transition"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
                  <span className="font-display font-bold text-base">{f.q}</span>
                  <div className="w-7 h-7 rounded-full bg-ink-100 group-open:bg-ember-500 flex items-center justify-center transition shrink-0 ml-3">
                    <ChevronDown className="w-3.5 h-3.5 text-ink-600 group-open:text-white group-open:rotate-180 transition-transform" />
                  </div>
                </summary>
                <div className="px-5 pb-5 text-ink-700 leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="py-10 bg-white border-t border-ink-100">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-display font-bold text-lg text-ink-900">
                Need a removal in {location.name}?
              </p>
              <p className="text-ink-600 text-sm">Call us or get an instant quote online — no deposit, no commitment.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <a
                href={`tel:${siteConfig.phoneRaw}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 border-ink-200 text-ink-800 font-bold text-sm hover:border-ink-400 transition"
              >
                <Phone className="w-4 h-4" /> {siteConfig.phone}
              </a>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ember-500 text-white font-bold text-sm shadow-glow-ember hover:-translate-y-0.5 transition"
              >
                Get quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
