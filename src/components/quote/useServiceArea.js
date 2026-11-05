'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import api from '@/lib/utils/api';
import { isValidPostcode, normalisePostcode } from '@/lib/utils/validation';

/**
 * Live service-area check for a list of postcodes (pickup, stops, delivery).
 *
 * Asks OUR server (POST /api/pricing/check-coverage), which looks each postcode
 * up and decides inside / outside London + M25. It re-runs whenever any postcode
 * changes. The same rules run again on the server when the booking is submitted,
 * so this hook is only about giving the customer instant feedback.
 *
 * statusFor(postcode) returns one of:
 *   null            nothing typed
 *   'invalid'       not a correctly formatted UK postcode
 *   'checking'      format OK, waiting for the server
 *   'inside' | 'outside' | 'not_found' | 'unavailable'
 */
const cache = new Map(); // normalised postcode -> { status, message, postcode, adminDistrict }

export default function useServiceArea(entries) {
  const [version, setVersion] = useState(0);   // bumps when results arrive
  const [retry, setRetry] = useState(0);
  const [checking, setChecking] = useState(false);

  // entries: postcode strings, or { postcode, placeId } when a Google place was chosen
  const toItem = (e) => (typeof e === 'string' || e == null
    ? { postcode: normalisePostcode(String(e || '').trim()), placeId: '' }
    : { postcode: normalisePostcode(String(e.postcode || '').trim()), placeId: e.placeId || '' });
  const ck = (it) => (it.placeId ? `${it.postcode}#${it.placeId}` : it.postcode);
  const items = entries.map(toItem);
  const key = items.map(ck).join('|');

  useEffect(() => {
    const todoKeys = [...new Set(key.split('|').filter((k) => k && isValidPostcode(k.split('#')[0]) && !cache.has(k)))];
    const todo = todoKeys;
    if (!todo.length) { setChecking(false); return undefined; }

    let cancelled = false;
    setChecking(true);
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.post('/pricing/check-coverage', {
          items: todo.map((k) => { const [postcode, placeId] = k.split('#'); return { postcode, placeId: placeId || undefined }; }),
        });
        (data.results || []).forEach((r, i) => {
          // 'unavailable' is not remembered so it is tried again
          if (r && r.status !== 'unavailable') cache.set(todo[i], r);
          else cache.set(`~${todo[i]}`, r);
        });
      } catch {
        todo.forEach((p) => cache.set(`~${p}`, {
          status: 'unavailable',
          message: "We couldn't check this postcode just now. Please try again in a moment, or request a custom quote.",
        }));
      } finally {
        if (!cancelled) { setChecking(false); setVersion((v) => v + 1); }
      }
    }, 350);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [key, retry]);

  const statusFor = useCallback((entry) => {
    const it = toItem(entry);
    const raw = it.postcode;
    if (!raw) return null;
    if (!isValidPostcode(raw)) return { status: 'invalid', message: 'Please enter a valid UK postcode, for example SW1A 1AA.' };
    const n = ck(it);
    if (cache.has(n)) return cache.get(n);
    if (cache.has(`~${n}`)) return cache.get(`~${n}`);
    return { status: 'checking' };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, key]);

  const retryCheck = useCallback(() => {
    key.split('|').forEach((k) => cache.delete(`~${k}`));
    setRetry((n) => n + 1);
  }, [key]);

  return useMemo(() => ({ statusFor, checking, retryCheck }), [statusFor, checking, retryCheck]);
}
