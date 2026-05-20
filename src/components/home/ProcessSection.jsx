import { Calculator, Calendar, Truck, Smile } from 'lucide-react';

const steps = [
  { n: 1, icon: Calculator, title: 'Get a quote', desc: 'Use our instant calculator or request a custom quote.' },
  { n: 2, icon: Calendar, title: 'Pick a date', desc: 'Choose a date and time that works for you.' },
  { n: 3, icon: Truck, title: 'We move it', desc: 'Our team arrives on time and gets to work.' },
  { n: 4, icon: Smile, title: 'You\'re home', desc: 'Sit back — we\'ll set everything down where you want it.' },
];

export default function ProcessSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="section-eyebrow mb-3 mx-auto">How it works</div>
          <h2 className="heading-display text-3xl lg:text-4xl mb-3">Four steps to a stress-free move</h2>
          <p className="text-ink-600 leading-relaxed">No paperwork. No waiting. No hidden charges.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="relative">
                <div className="bg-white rounded-3xl border-2 border-ink-100 p-6 hover:border-ember-500 hover:-translate-y-1 transition-all relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-ember-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-ember-600" />
                    </div>
                    <div className="font-display font-extrabold text-3xl text-ink-100">0{s.n}</div>
                  </div>
                  <h3 className="font-display font-bold text-base mb-1.5">{s.title}</h3>
                  <p className="text-ink-600 text-sm leading-relaxed">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-ember-300 to-transparent z-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
