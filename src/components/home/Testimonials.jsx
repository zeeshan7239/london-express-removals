import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Precious Benson', area: 'Dartford',
    text: 'Very reliable service, I recommend 100%',
    rating: 5,
  },
  {
    name: 'Csilla Vegh', area: 'Hounslow',
    text: '',
    rating: 5,
  },
  {
    name: 'Trang Nhung Vu', area: 'Gillingham',
    text: '',
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
           
            <span className="font-bold">Rated 5.0 </span>
            <span className="text-ink-500">by our customers</span>
             <div className="flex">
              {[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 fill-ember-500 text-ember-500" />)}
            </div>
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
