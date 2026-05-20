'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Loader2, Check, ChevronDown, MapPin, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { UK_POSTCODE_REGEX } from '@/lib/utils/validation';

export default function AddressPicker({ postcode, value = '', onChange, label = 'Full address', disabled = false }) {
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    if (!postcode || !UK_POSTCODE_REGEX.test(postcode.trim())) {
      setAddresses([]); setManualMode(false); return;
    }

    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/addresses/${encodeURIComponent(postcode)}`).catch(() => null);
        if (res?.ok) {
          const json = await res.json();
          if (json.addresses?.length) {
            setAddresses(json.addresses);
            setManualMode(false);
            return;
          }
        }
        setManualMode(true);
        setAddresses([]);
      } catch {
        setManualMode(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [postcode]);

  if (!postcode) return null;

  return (
    <div ref={ref} className="relative">
      <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
        <Home className="w-3.5 h-3.5 text-ember-500" /> {label}
      </label>

      {manualMode ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="House name/number and street"
          disabled={disabled}
          className="input-field"
        />
      ) : (
        <>
          <button
            type="button"
            disabled={disabled || loading}
            onClick={() => setOpen((v) => !v)}
            className={`input-field flex items-center justify-between text-left ${
              value ? 'border-emerald-500' : ''
            } ${loading ? 'opacity-60' : ''}`}
          >
            <span className={`flex items-center gap-2 truncate ${value ? 'text-ink-900' : 'text-ink-400'}`}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> :
               value ? <Check className="w-4 h-4 text-emerald-500" /> :
               <MapPin className="w-4 h-4" />}
              <span className="truncate">{value || 'Select your address'}</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-ink-400 transition ${open ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {open && addresses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute z-30 left-0 right-0 mt-1.5 bg-white rounded-xl shadow-pop border border-ink-100 overflow-hidden max-h-72 overflow-y-auto"
              >
                {addresses.map((a, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { onChange(a); setOpen(false); toast.success('Address selected', { duration: 1800 }); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ember-50 hover:text-ember-700 transition flex items-center gap-2.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-ink-400 shrink-0" />
                    <span className="truncate">{a}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
