import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Sarah M.', area: 'Camden',
    text: 'Brilliant service from start to finish. The team arrived on time, were incredibly careful with our furniture, and the price was exactly what we agreed.',
    rating: 5,
  },
  {
    name: 'James K.', area: 'Hackney',
    text: 'Used these guys for a 2-bed flat move. Fast, professional, and the price was unbeatable. Will definitely use again.',
    rating: 5,
  },
  {
    name: 'Priya S.', area: 'Wandsworth',
    text: 'Moved my mum from her house of 30 years. The team were so patient and kind with her. Cannot recommend enough.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-ink-50 to-white">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="section-eyebrow mb-3 mx-auto">Real reviews</div>
          <h2 className="heading-display text-3xl lg:text-4xl mb-3">Loved by Londoners</h2>
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="flex">
              {[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 fill-ember-500 text-ember-500" />)}
            </div>
            <span className="font-bold">4.9/5</span>
            <span className="text-ink-500">from 2,400+ verified reviews</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <div key={r.name} className="bg-white rounded-3xl p-6 border border-ink-100 hover:shadow-soft transition">
              <Quote className="w-7 h-7 text-ember-500 mb-3" />
              <div className="flex mb-3">
                {Array(r.rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-ember-500 text-ember-500" />
                ))}
              </div>
              <p className="text-ink-700 text-sm leading-relaxed mb-4">{r.text}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-ink-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ember-500 to-ember-600 flex items-center justify-center text-white text-xs font-bold">
                  {r.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm">{r.name}</div>
                  <div className="text-xs text-ink-500">{r.area}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
