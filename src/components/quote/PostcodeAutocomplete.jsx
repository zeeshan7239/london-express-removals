'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Check, Loader2, AlertCircle, X } from 'lucide-react';
import { UK_POSTCODE_REGEX } from '@/lib/utils/validation';

export default function PostcodeAutocomplete({
  value = '', onChange, onSelect,
  placeholder = 'e.g. SW1A 1AA', label, icon: Icon = MapPin, id,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(null);
  const [error, setError] = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  const debounceRef = useRef(null);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const skipNextFetch = useRef(false);

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    if (skipNextFetch.current) { skipNextFetch.current = false; return; }

    clearTimeout(debounceRef.current);
    setError(null);

    const q = value.trim().replace(/\s+/g, '');
    if (q.length < 2) { setSuggestions([]); setLoading(false); return; }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(q)}/autocomplete`);
        const json = await res.json();
        const results = json.result || [];
        setSuggestions(results);
        setShowDropdown(results.length > 0);
        setActiveIdx(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [value]);

  const pick = async (postcode) => {
    skipNextFetch.current = true;
    onChange(postcode);
    setShowDropdown(false);
    setSuggestions([]);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.replace(/\s+/g, ''))}`);
      const json = await res.json();
      if (json.status !== 200 || !json.result) {
        setError('Postcode not found');
        setValidated(null);
        onSelect?.(null);
      } else {
        const r = json.result;
        const details = {
          postcode: r.postcode,
          longitude: r.longitude,
          latitude: r.latitude,
          district: r.outcode,
          region: r.region,
          adminDistrict: r.admin_district,
        };
        setValidated(details);
        onSelect?.(details);
      }
    } catch {
      setError('Could not validate postcode');
      setValidated(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || !suggestions.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(suggestions.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(-1, i - 1)); }
    else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); pick(suggestions[activeIdx]); }
    else if (e.key === 'Escape') setShowDropdown(false);
  };

  const clear = () => {
    onChange(''); setSuggestions([]); setValidated(null); setError(null);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapRef} className="relative">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-ember-500" /> {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={(e) => { onChange(e.target.value.toUpperCase()); setValidated(null); setError(null); }}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          onBlur={() => {
            setTimeout(() => {
              if (!value || validated) return;
              if (!UK_POSTCODE_REGEX.test(value.trim())) {
                setError('Please enter a valid UK postcode (e.g. SW1A 1AA).');
              }
            }, 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          aria-invalid={!!error}
          className={`input-field uppercase pr-12 ${
            validated ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-100' : ''
          } ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && <Loader2 className="w-4 h-4 animate-spin text-ink-400" />}
          {!loading && validated && <Check className="w-4 h-4 text-emerald-500" strokeWidth={3} />}
          {!loading && !validated && value && (
            <button type="button" onClick={clear} className="text-ink-400 hover:text-ink-700" aria-label="Clear">
              <X className="w-4 h-4" />
            </button>
          )}
          {!loading && !value && <Search className="w-4 h-4 text-ink-400" />}
        </div>
      </div>

      {validated && (
        <div className="mt-1.5 text-xs text-emerald-700 flex items-center gap-1.5">
          <Check className="w-3 h-3" strokeWidth={3} />
          {validated.adminDistrict || validated.region}
        </div>
      )}
      {error && (
        <div className="mt-1.5 text-xs text-red-600 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3" /> {error}
        </div>
      )}

      <AnimatePresence>
        {showDropdown && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-20 left-0 right-0 mt-1.5 bg-white rounded-xl shadow-pop border border-ink-100 overflow-hidden max-h-72 overflow-y-auto"
          >
            {suggestions.map((s, i) => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); pick(s); }}
                onMouseEnter={() => setActiveIdx(i)}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2.5 transition ${
                  i === activeIdx ? 'bg-ember-50 text-ember-700' : 'text-ink-700 hover:bg-ink-50'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 shrink-0 ${i === activeIdx ? 'text-ember-500' : 'text-ink-400'}`} />
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
