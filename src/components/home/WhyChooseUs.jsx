import Link from 'next/link';
import { Shield, Clock, Banknote, HeartHandshake, ArrowRight } from 'lucide-react';

const features = [
  { icon: Shield, title: 'Fully Professionals', desc: 'Trusted professionals with 10,000+ successful moves completed.' },
  { icon: Clock, title: 'On time, every time', desc: 'Same-day quotes, punctual arrivals, no waiting.' },
  { icon: Banknote, title: 'Transparent pricing', desc: 'See your final price before booking — no surprises.' },
  { icon: HeartHandshake, title: 'Friendly movers', desc: 'Vetted, polite professionals who treat your stuff like their own.' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 bg-ink-50">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="section-eyebrow mb-3">Why choose us</div>
            <h2 className="heading-display text-3xl lg:text-4xl mb-4">
              Moving day is stressful.<br />
              <span className="text-ember-600">We make it less so.</span>
            </h2>
            <p className="text-ink-600 leading-relaxed mb-6">
              Thousands of Londoners trust us with their belongings every year.
              Here's why we're different.
            </p>
            <Link href="/booking" className="btn-primary">
              Book your move <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-white rounded-2xl p-5 border border-ink-100 hover:shadow-soft transition">
                  <div className="w-11 h-11 rounded-xl bg-ember-50 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-ember-600" />
                  </div>
                  <h3 className="font-display font-bold text-base mb-1">{f.title}</h3>
                  <p className="text-ink-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
