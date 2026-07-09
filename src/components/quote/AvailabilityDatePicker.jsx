'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';

/**
 * Date picker backed by /api/availability.
 * - Past dates, blocked dates, and fully-booked dates are disabled
 * - Available dates show remaining capacity on hover (title attr)
 * - Falls back to allowing all future dates if the API is unreachable
 *
 * Props:
 *   value     — 'YYYY-MM-DD' or ''
 *   onChange  — (dateString) => void
 *   id        — input id for focus-on-error
 */
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS = ['Mo','Tu','We','Th','Fr','Sa','Su'];

const pad = (n) => String(n).padStart(2, '0');
const todayKey = () => new Date().toISOString().slice(0, 10);

export default function AvailabilityDatePicker({ value = '', onChange, id }) {
  const now = new Date();
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed
  const [days, setDays] = useState(null);              // availability map or null
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Fetch availability whenever the visible month changes (and when opened)
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    const monthKey = `${year}-${pad(month + 1)}`;
    fetch(`/api/availability?month=${monthKey}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => { if (!cancelled) setDays(json?.days || null); })
      .catch(() => { if (!cancelled) setDays(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [open, year, month]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  // Don't allow navigating to past months
  const atCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // getDay(): 0=Sun..6=Sat → convert so Monday=0
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isDisabled = (d) => {
    const key = `${year}-${pad(month + 1)}-${pad(d)}`;
    if (key <= todayKey()) return true;                       // past or today (need notice)
    if (days && days[key] && !days[key].available) return true; // blocked or full
    return false;
  };

  const display = value
    ? new Date(value + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <div ref={ref} className="relative max-w-xs">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((v) => !v)}
        className={`input-field flex items-center justify-between text-left cursor-pointer ${
          value ? 'border-emerald-500' : ''
        }`}
      >
        <span className={`flex items-center gap-2 ${value ? 'text-ink-900' : 'text-ink-400'}`}>
          <Calendar className="w-4 h-4 text-ember-500" />
          {display || 'Pick a date'}
        </span>
        {value && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onChange(''); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onChange(''); } }}
            className="text-ink-400 hover:text-ink-700"
            aria-label="Clear date"
          >
            <X className="w-4 h-4" />
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            className="absolute z-30 left-0 mt-2 w-80 bg-white rounded-2xl shadow-pop border border-ink-100 p-4"
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={prevMonth}
                disabled={atCurrentMonth}
                className="w-8 h-8 rounded-lg bg-ink-50 flex items-center justify-center hover:bg-ink-100 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="font-display font-bold text-sm flex items-center gap-2">
                {MONTHS[month]} {year}
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-ink-400" />}
              </div>
              <button
                type="button"
                onClick={nextMonth}
                className="w-8 h-8 rounded-lg bg-ink-50 flex items-center justify-center hover:bg-ink-100"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map((w) => (
                <div key={w} className="text-center text-[10px] font-bold uppercase tracking-wider text-ink-400 py-1">{w}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((d, i) => {
                if (d === null) return <div key={`empty-${i}`} />;
                const key = `${year}-${pad(month + 1)}-${pad(d)}`;
                const disabled = isDisabled(d);
                const selected = value === key;
                const info = days?.[key];
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={disabled}
                    title={disabled
                      ? (info?.blocked ? 'Unavailable' : info && !info.available ? 'Fully booked' : 'Unavailable')
                      : info ? `${info.remaining} slot${info.remaining === 1 ? '' : 's'} left` : 'Available'}
                    onClick={() => { onChange(key); setOpen(false); }}
                    className={`aspect-square rounded-lg text-sm font-semibold transition ${
                      selected
                        ? 'bg-ember-500 text-white shadow-glow-ember'
                        : disabled
                          ? 'text-ink-300 cursor-not-allowed line-through decoration-ink-200'
                          : 'text-ink-700 hover:bg-ember-50 hover:text-ember-700'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-ink-100 flex items-center gap-3 text-[10px] text-ink-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-ember-500 inline-block" /> Selected
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-ink-100 inline-block" /> <span className="line-through">Full / unavailable</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
