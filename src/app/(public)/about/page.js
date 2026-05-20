import PageHeader from '@/components/common/PageHeader';
import CTABanner from '@/components/home/CTABanner';
import { Truck, Award, Users, Heart } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description: 'Learn about London Express Removals — your trusted moving partner across London and the UK. Family-run, fully insured, customer-obsessed.',
  alternates: { canonical: '/about' },
};

const stats = [
  { value: '10K+', label: 'Moves completed' },
  { value: '4.9/5', label: 'Average rating' },
  { value: '8 yrs', label: 'In business' },
  { value: '24/7', label: 'Customer support' },
];

const values = [
  { icon: Truck, title: 'Reliability', desc: 'When we say we\'ll be there, we\'re there. On time, every time.' },
  { icon: Award, title: 'Quality', desc: 'Vetted, trained, polite movers who treat your stuff with care.' },
  { icon: Users, title: 'Community', desc: 'We\'re proudly London-based and we hire from the community.' },
  { icon: Heart, title: 'Honesty', desc: 'No hidden fees, no surprises. The price you see is what you pay.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="A friendlier kind of removal company"
        subtitle="We started in 2017 with one van and a simple idea — make moving day genuinely less stressful for Londoners. We're still doing that today."
      />

      <section className="py-16 lg:py-20">
        <div className="container-wide">
          <div className="grid lg:grid-cols-4 gap-6 mb-16">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-6 rounded-2xl bg-ink-50 border border-ink-100">
                <div className="font-display font-extrabold text-3xl lg:text-4xl text-ember-600 mb-1">{s.value}</div>
                <div className="text-sm text-ink-600 font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="section-eyebrow mb-3 mx-auto">Our values</div>
            <h2 className="heading-display text-3xl lg:text-4xl mb-4">What we believe</h2>
            <p className="text-ink-600 leading-relaxed">
              Moving is one of the most stressful events in life. Our job is to make
              that day feel like a relief, not a chore.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white rounded-3xl p-6 border border-ink-100 hover:shadow-soft transition">
                  <div className="w-12 h-12 rounded-2xl bg-ember-50 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-ember-600" />
                  </div>
                  <h3 className="font-display font-bold text-base mb-1.5">{v.title}</h3>
                  <p className="text-ink-600 text-sm leading-relaxed">{v.desc}</p>
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
