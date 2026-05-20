'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';
import { siteConfig } from '@/lib/utils/siteConfig';

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2.5">
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="w-11 h-11 rounded-full bg-ink-900 text-white flex items-center justify-center shadow-pop hover:bg-ink-800 transition"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href={siteConfig.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-pop hover:scale-110 transition relative"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500" />
      </a>

      <a
        href={`tel:${siteConfig.phoneRaw}`}
        aria-label="Call us"
        className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-ember-500 text-white flex items-center justify-center shadow-glow-ember hover:scale-110 transition"
      >
        <Phone className="w-5 h-5" />
      </a>
    </div>
  );
}
