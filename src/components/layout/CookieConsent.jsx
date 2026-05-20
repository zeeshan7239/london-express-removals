'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

/**
 * Cookie consent banner.
 *
 * Stores the user's choice in localStorage under `cookieConsent` as either:
 *   'all'       — accepted everything (essential + analytics + future categories)
 *   'essential' — accepted essential cookies only (the privacy-safe minimum)
 *
 * Either choice prevents the banner from showing again. The X button now
 * counts as "essential only" rather than silently doing nothing — that's
 * the standard GDPR-friendly behaviour (no choice = no consent recorded =
 * default to minimal).
 */
const STORAGE_KEY = 'cookieConsent';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only check after mount to avoid SSR/hydration mismatch
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        // Slight delay so the banner doesn't pop in immediately on first paint
        const t = setTimeout(() => setShow(true), 800);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage unavailable (e.g. cookies disabled) — silently skip
    }
  }, []);

  const choose = (level) => {
    try {
      localStorage.setItem(STORAGE_KEY, level);
    } catch {
      // ignore write failures
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40"
        >
          <div className="bg-ink-900 text-white rounded-2xl shadow-pop p-5 border border-white/10">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-ember-500/20 flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5 text-ember-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm mb-1">We use cookies</h3>
                <p className="text-xs text-ink-300 mb-3 leading-relaxed">
                  We use essential cookies to make this site work and analytics cookies
                  to understand how you use it. See our <a href="/privacy" className="underline">privacy policy</a>.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => choose('all')}
                    className="px-4 py-2 rounded-full bg-ember-500 text-white text-xs font-semibold hover:bg-ember-600"
                  >
                    Accept all
                  </button>
                  <button
                    onClick={() => choose('essential')}
                    className="px-4 py-2 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20"
                  >
                    Essential only
                  </button>
                </div>
              </div>
              <button
                onClick={() => choose('essential')}
                className="text-ink-400 hover:text-white"
                aria-label="Close (essential cookies only)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
