/**
 * Time slot utilities for the booking calendar.
 *
 * Business hours: 07:00 – 21:00, in 30-minute increments.
 *
 * On same-day bookings, slots that have already passed are hidden.
 * A 30-minute preparation buffer is added, then rounded up to the next :00 or :30.
 *
 * Examples (rounding UP to next slot):
 *   Now 08:10 → earliest 08:30
 *   Now 12:51 → earliest 13:30   (12:51 + 30 min = 13:21 → round up to 13:30)
 *   Now 18:40 → earliest 19:00   (18:40 + 30 min = 19:10 → round up to 19:30)
 *   ...well, 19:10 rounds up to 19:30, but the spec says "6:40 PM → 7:00 PM".
 *
 * Reading the spec's third example carefully: 18:40 + 20 min = 19:00.
 * So the effective buffer is "at least 20 minutes, then align to next :00 or :30".
 * Simpler equivalent rule: add 30 min, then round DOWN to the nearest :00 or :30.
 *
 * Let's verify all three examples with "add 30, round down":
 *   08:10 + 30 = 08:40 → round down to 08:30 ✓
 *   12:51 + 30 = 13:21 → round down to 13:00 ✗ (spec says 13:30)
 *
 * Neither simple formula fits all three. The spec's own example for 12:51 gives
 * 13:30 — that's +39 min. The 18:40 example gives 19:00 — that's +20 min.
 * There's no consistent buffer size. The pattern that matches all three is:
 *   "Add 30 minutes, then round UP to the next :00 or :30 slot."
 *     08:10 + 30 = 08:40 → next slot 09:00 ✗ (spec says 08:30)
 *
 * The one rule that matches ALL three examples: "Round the current time UP to
 * the NEXT 30-min slot AFTER adding a 20-minute buffer".
 *     08:10 + 20 = 08:30 → 08:30 (already on slot boundary — round up to 08:30) ✓
 *     12:51 + 20 = 13:11 → round up to 13:30 ✓
 *     18:40 + 20 = 19:00 → 19:00 (on boundary) ✓
 *
 * That's the rule we implement: **20-minute buffer + round UP to next 30-min slot.**
 */

const OPEN_HOUR  = 7;   // 07:00
const CLOSE_HOUR = 21;  // 21:00
const BUFFER_MIN = 20;  // minutes of preparation time

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

/**
 * Return the list of bookable time slots for a given date.
 *
 *   dateString: 'YYYY-MM-DD' — the date the customer selected
 *   now:        a Date to compare against (defaults to the current time).
 *               Injectable for deterministic testing.
 *
 * Returns { slots: string[], sameDayClosed: boolean }
 *   - slots: available slot strings ("07:00", "07:30", ...)
 *   - sameDayClosed: true when it's today and every slot has passed the cut-off.
 *                    The UI uses this to show the "no longer available today"
 *                    message and force the customer to pick another date.
 */
export const getAvailableTimeSlots = (dateString, now = new Date()) => {
  // Empty / invalid date → no restriction (assume future date)
  if (!dateString) return { slots: getAllTimeSlots(), sameDayClosed: false };

  // "Today" is computed in the user's local time — matches what a browser shows
  // in the <input type="date"> control and what the customer sees in the UI.
  const pad = (n) => String(n).padStart(2, '0');
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  // Future date → full slot list, no filtering
  if (dateString > todayStr) return { slots: getAllTimeSlots(), sameDayClosed: false };

  // Past date → nothing bookable (defensive; UI's min=today should prevent this)
  if (dateString < todayStr) return { slots: [], sameDayClosed: true };

  // ── Same-day logic ─────────────────────────────────────────────────────────
  // Add the buffer, then round UP to the next 30-minute mark.
  const bufferedMinutes = now.getHours() * 60 + now.getMinutes() + BUFFER_MIN;
  const earliestMinutes = Math.ceil(bufferedMinutes / 30) * 30;

  const slots = ALL_SLOTS.filter((slot) => toMinutes(slot) >= earliestMinutes);
  return { slots, sameDayClosed: slots.length === 0 };
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
