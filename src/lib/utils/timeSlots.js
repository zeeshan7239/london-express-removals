/**
 * Time slot utilities for the booking calendar.
 *
 * Business hours: 07:00 – 21:00, in 30-minute increments.
 *
 * Rules (all in UK time, Europe/London, on both the browser and the server):
 *   1. Today: only slots at least 5 hours after the current UK time.
 *   2. Tomorrow or later: every slot is available (the 5-hour rule only ever
 *      reaches into tomorrow before 05:00, and the first slot is 07:00).
 *   3. Midnight: the 5-hour window rolls into the next day, e.g. at 22:00 the
 *      earliest booking is 03:00 tomorrow. Today then has no slots and the date
 *      moves on to tomorrow by itself. Because the first slot of the day is
 *      07:00, that booking shows as 07:00 tomorrow.
 *   4. A slot that has passed is never offered.
 *
 * The cut-off is "now + 5 hours" measured on one continuous timeline, so the
 * date changes automatically at midnight and across daylight-saving changes.
 */

const OPEN_HOUR  = 7;   // 07:00
const CLOSE_HOUR = 21;  // 21:00
const LEAD_MIN   = 5 * 60; // minimum notice: 5 hours

/** Every 30-minute slot from 07:00 to 21:00 inclusive, as "HH:MM" strings. */
const ALL_SLOTS = (() => {
  const slots = [];
  for (let h = OPEN_HOUR; h <= CLOSE_HOUR; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < CLOSE_HOUR) slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
})();

/** Return the raw ALL_SLOTS list (used for future dates). */
export const getAllTimeSlots = () => [...ALL_SLOTS];

/** "HH:MM" → minutes since midnight. */
const toMinutes = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const DAY = 1440;

/** Current UK date ('YYYY-MM-DD') and minutes since UK midnight. */
export const getUkNow = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now).reduce((o, p) => { o[p.type] = p.value; return o; }, {});
  return {
    dateStr: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
};

/** Whole days from one 'YYYY-MM-DD' to another (no time-zone issues). */
const dayDiff = (from, to) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000);

const addDays = (dateStr, n) => new Date(Date.parse(`${dateStr}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10);

/**
 * Return the list of bookable time slots for a given date.
 *
 *   dateString: 'YYYY-MM-DD' — the date the customer selected
 *   now:        a Date to compare against (defaults to the current time).
 *               Injectable for deterministic testing.
 *
 * Returns { slots: string[], sameDayClosed: boolean }
 *   - sameDayClosed: true when the date is today (or past) and no slot is left.
 */
export const getAvailableTimeSlots = (dateString, now = new Date()) => {
  if (!dateString) return { slots: getAllTimeSlots(), sameDayClosed: false };

  const uk = getUkNow(now);
  const days = dayDiff(uk.dateStr, dateString);
  if (Number.isNaN(days) || days < 0) return { slots: [], sameDayClosed: true };

  // Slots must start at or after (now + 5h), measured from UK midnight today.
  const cutoff = uk.minutes + LEAD_MIN;
  const slots = ALL_SLOTS.filter((slot) => days * DAY + toMinutes(slot) >= cutoff);
  return { slots, sameDayClosed: days === 0 && slots.length === 0 };
};

/**
 * Earliest date the customer can pick: today (UK) if any slot is left,
 * otherwise tomorrow. Used as the date input's minimum so the date rolls over
 * by itself after the last slot.
 */
export const getBookingMinDate = (now = new Date()) => {
  const uk = getUkNow(now);
  return getAvailableTimeSlots(uk.dateStr, now).slots.length ? uk.dateStr : addDays(uk.dateStr, 1);
};

/** Convert "14:30" → "02:30 PM" for display. */
export const formatTime12h = (t24) => {
  if (!t24) return '';
  const [h, m] = String(t24).split(':').map(Number);
  if (isNaN(h)) return t24;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(h12).padStart(2, '0')}:${String(m || 0).padStart(2, '0')} ${period}`;
};
