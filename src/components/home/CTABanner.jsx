import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/lib/utils/siteConfig';

export default function CTABanner() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="container-wide">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-ember-500 to-ember-600 p-8 lg:p-16 text-center text-white">
          <div className="absolute inset-0 bg-grid-dark opacity-10" />
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <h2 className="font-display font-extrabold text-3xl lg:text-5xl mb-4">
              Ready to move?
            </h2>
            <p className="text-ember-50 text-base lg:text-lg max-w-xl mx-auto mb-8">
              Get an instant quote in under 60 seconds. No deposit. No commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-ink-900 font-bold shadow-pop hover:-translate-y-0.5 transition"
              >
                Get your free quote <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`tel:${siteConfig.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-ink-900/30 backdrop-blur border border-white/30 text-white font-bold hover:bg-ink-900/40 transition"
              >
                <Phone className="w-4 h-4" /> Call us now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
