'use client';

import { useEffect, useRef, useState, useId } from 'react';
import { Search, Loader2, MapPin } from 'lucide-react';
import { parsePlace } from '@/lib/utils/placeParsing';

/**
 * Google Places (New) address search — UK only.
 * Suggestions come straight from Google with the browser key
 * (NEXT_PUBLIC_GOOGLE_MAPS_KEY, restricted to our website addresses). When a
 * suggestion is chosen we fetch its details and hand the parts to onSelect.
 * The server checks the place again with its own key, so what the browser
 * says about location is never trusted.
 *
 * If there is no key, or Google fails, the box says so and the normal postcode
 * + address fields below keep working, so nobody is ever stuck.
 */
const API = 'https://places.googleapis.com/v1';
const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

const newToken = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2));

export default function AddressAutocomplete({ id, label = 'Search your address', onSelect }) {
  const uid = useId();
  const inputId = id || `addr-${uid}`;
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const token = useRef(newToken());
  const abort = useRef(null);
  const box = useRef(null);

  useEffect(() => {
    const close = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    if (!KEY || text.trim().length < 3) { setItems([]); return undefined; }
    const t = setTimeout(async () => {
      abort.current?.abort();
      const ctrl = new AbortController();
      abort.current = ctrl;
      setLoading(true);
      try {
        const res = await fetch(`${API}/places:autocomplete`, {
          method: 'POST',
          signal: ctrl.signal,
          headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY },
          body: JSON.stringify({
            input: text,
            includedRegionCodes: ['gb'],
            languageCode: 'en-GB',
            sessionToken: token.current,
          }),
        });
        if (!res.ok) throw new Error('autocomplete');
        const json = await res.json();
        setItems((json.suggestions || []).filter((s) => s.placePrediction).slice(0, 6).map((s) => ({
          placeId: s.placePrediction.placeId,
          main: s.placePrediction.structuredFormat?.mainText?.text || s.placePrediction.text?.text || '',
          secondary: s.placePrediction.structuredFormat?.secondaryText?.text || '',
        })));
        setFailed(false);
        setOpen(true);
        setActive(-1);
      } catch (e) {
        if (e.name !== 'AbortError') { setFailed(true); setItems([]); }
      } finally { setLoading(false); }
    }, 250);
    return () => clearTimeout(t);
  }, [text]);

  const choose = async (item) => {
    setOpen(false);
    setLoading(true);
    try {
      const res = await fetch(`${API}/places/${encodeURIComponent(item.placeId)}?sessionToken=${token.current}&languageCode=en-GB&regionCode=GB`, {
        headers: { 'X-Goog-Api-Key': KEY, 'X-Goog-FieldMask': 'id,formattedAddress,addressComponents,location' },
      });
      if (!res.ok) throw new Error('details');
      const parsed = parsePlace(await res.json());
      token.current = newToken(); // a session ends when details are fetched
      setText(parsed.formattedAddress || `${item.main}, ${item.secondary}`);
      setFailed(false);
      onSelect?.(parsed);
    } catch {
      setFailed(true);
    } finally { setLoading(false); }
  };

  const onKey = (e) => {
    if (!open || !items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % items.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a <= 0 ? items.length - 1 : a - 1)); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); choose(items[active]); }
    else if (e.key === 'Escape') setOpen(false);
  };

  if (!KEY) return null; // no key set: the postcode fields below are used as normal

  return (
    <div ref={box} className="relative">
      <label htmlFor={inputId} className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
        <Search className="w-3.5 h-3.5 text-ember-500" /> {label}
      </label>
      <div className="relative">
        <input id={inputId} type="text" role="combobox" aria-expanded={open} aria-controls={`${inputId}-list`}
          aria-autocomplete="list" autoComplete="off" className="input-field pr-10"
          placeholder="Start typing, e.g. 10 High Street"
          value={text} onChange={(e) => setText(e.target.value)} onFocus={() => items.length && setOpen(true)} onKeyDown={onKey} />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-ink-400" />}
      </div>
      {open && items.length > 0 && (
        <ul id={`${inputId}-list`} role="listbox"
          className="absolute z-30 mt-1 w-full bg-white rounded-xl border border-ink-100 shadow-pop overflow-hidden max-h-72 overflow-y-auto">
          {items.map((it, i) => (
            <li key={it.placeId} role="option" aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); choose(it); }}
              onMouseEnter={() => setActive(i)}
              className={`flex items-start gap-2 px-3 py-2.5 cursor-pointer text-sm ${i === active ? 'bg-ember-50' : 'hover:bg-ink-50'}`}>
              <MapPin className="w-4 h-4 text-ember-500 mt-0.5 shrink-0" />
              <span className="min-w-0"><span className="font-semibold text-ink-900">{it.main}</span>{' '}
                <span className="text-ink-500 break-words">{it.secondary}</span></span>
            </li>
          ))}
          <li className="px-3 py-1.5 text-[10px] text-ink-400 text-right border-t border-ink-100 select-none">Powered by Google</li>
        </ul>
      )}
      <p className="text-[11px] text-ink-500 mt-1.5">
        {failed
          ? "Address search isn't available right now — please enter your postcode below."
          : "Can't find it? Enter your postcode and address manually below."}
      </p>
    </div>
  );
}
