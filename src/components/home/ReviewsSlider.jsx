'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReviewsSlider({ reviews = [] }) {
  const track = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    if (!el) return;
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { el.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [update, reviews.length]);

  const scrollBy = (dir) => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild?.getBoundingClientRect().width || el.clientWidth;
    el.scrollBy({ left: dir * (card + 20), behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div ref={track}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region" aria-label="Customer reviews" tabIndex={0}>
        {reviews.map((r, idx) => (
          <article key={`${r.name}-${idx}`}
            className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] bg-white rounded-3xl p-6 border border-ink-100 hover:shadow-soft transition flex flex-col">
            <Quote className="w-7 h-7 text-ember-500 mb-3" />
            <div className="flex mb-3" aria-label={`${r.rating} out of 5 stars`}>
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-ember-500 text-ember-500' : 'text-ink-200'}`} />
              ))}
            </div>
            <p className="text-ink-700 text-sm leading-relaxed mb-4 flex-1 line-clamp-6">{r.text}</p>
            <div className="flex items-center gap-3 pt-4 border-t border-ink-100">
              {r.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.photo} alt="" referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ember-500 to-ember-600 flex items-center justify-center text-white text-xs font-bold">
                  {r.name[0]}
                </div>
              )}
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">{r.name}</div>
                {r.area && <div className="text-xs text-ink-500">{r.area}</div>}
              </div>
            </div>
          </article>
        ))}
      </div>

      {(canPrev || canNext) && (
        <div className="flex justify-center gap-3 mt-4">
          <button type="button" onClick={() => scrollBy(-1)} disabled={!canPrev} aria-label="Previous reviews"
            className="w-11 h-11 rounded-full bg-white border border-ink-200 flex items-center justify-center hover:border-ink-900 disabled:opacity-40 disabled:hover:border-ink-200 transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button type="button" onClick={() => scrollBy(1)} disabled={!canNext} aria-label="Next reviews"
            className="w-11 h-11 rounded-full bg-white border border-ink-200 flex items-center justify-center hover:border-ink-900 disabled:opacity-40 disabled:hover:border-ink-200 transition">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
