/**
 * Validation utilities shared by client + server.
 */

export const UK_POSTCODE_REGEX =
  /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;

export const UK_PHONE_REGEX =
  /^(?:(?:\+44)|(?:0044)|(?:0))\s?(?:\d\s?){9,10}$/;

export const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isValidPostcode = (s) => !!s && UK_POSTCODE_REGEX.test(s.trim());
export const isValidEmail = (s) => !!s && EMAIL_REGEX.test(s.trim());

export const isValidUKPhone = (s) => {
  if (!s) return false;
  const cleaned = s.trim().replace(/[\s\-()]/g, '');
  return UK_PHONE_REGEX.test(cleaned);
};

export const normalisePostcode = (s) => {
  if (!s) return '';
  const cleaned = s.toUpperCase().replace(/\s+/g, '');
  if (cleaned.length < 5) return cleaned;
  return cleaned.slice(0, -3) + ' ' + cleaned.slice(-3);
};
