'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
  { q: 'How quickly can you move me?',
    a: 'Same-day moves are possible in many cases. Book through our site and we\'ll confirm availability within 30 minutes during business hours.' },
  { q: 'How do you ensure my belongings are handled carefully?',
    a: 'Our experienced team uses professional moving equipment, blankets, and straps to protect your items throughout every move. We treat your belongings as if they were our own.' },
  { q: 'Do you charge extra for stairs or no lift?',
    a: 'There is a small surcharge for moves above the 2nd floor without lift access. The adjustment is already included in your final quoted price — you\'ll never see a surprise on the day.' },
  { q: 'What if my move takes longer than expected?',
    a: 'You only pay for the time you use. Additional hours are charged at a clear hourly rate which you\'ll see before booking. No rushing, no surprises.' },
  { q: 'Do you cover the whole UK, not just London?',
    a: 'Yes — we cover London and nationwide UK. For longer-distance moves, please request a custom quote and we\'ll come back within 30 minutes during business hours.' },
  { q: 'Do you provide packing materials?',
    a: 'Yes — we can supply boxes, bubble wrap, and tape. You can add packing materials directly in the booking form or request them with your custom quote.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section className="py-20 lg:py-28 bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="container-wide max-w-3xl">
        <div className="text-center mb-12">
          <div className="section-eyebrow mb-3 mx-auto">FAQ</div>
          <h2 className="heading-display text-3xl lg:text-4xl mb-3">Frequently asked questions</h2>
          <p className="text-ink-600">Can't find the answer? <a href="tel:+447459180023" className="text-ember-600 font-semibold hover:underline">Call us</a> or use WhatsApp.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className={`rounded-2xl border-2 transition ${openIdx === i ? 'border-ember-500 bg-ember-50' : 'border-ink-100 bg-white hover:border-ink-200'}`}>
              <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)} className="w-full px-5 py-4 flex items-center justify-between text-left">
                <span className="font-display font-bold text-base">{f.q}</span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition ${openIdx === i ? 'bg-ember-500 rotate-45' : 'bg-ink-100'}`}>
                  <Plus className={`w-3.5 h-3.5 ${openIdx === i ? 'text-white' : 'text-ink-600'}`} />
                </div>
              </button>
              <AnimatePresence initial={false}>
                {openIdx === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-5 pb-5 text-ink-700 leading-relaxed">{f.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
