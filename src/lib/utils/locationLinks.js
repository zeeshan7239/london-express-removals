/**
 * Links blog posts and location pages together.
 *
 * - Blog tags / slugs  ->  location slug (aliases below are checked against locations.js;
 *   any alias pointing at a slug that does not exist is dropped, never guessed).
 * - Nearby areas for each location page.
 *
 * Server-safe, no client code.
 */
import { locations, getLocationBySlug } from '../data/locations.js';

const SLUGS = new Set(locations.map((l) => l.slug));

/** "Hammersmith & Fulham" -> "hammersmith-and-fulham" */
export const normalizeKey = (v) =>
  String(v ?? '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Extra names that should point at an existing location page.
 * Only borough/area names where the location page is the hub for that name.
 * Left out on purpose (ambiguous): lambeth, southwark, tower-hamlets, haringey, brent.
 */
const ALIASES_RAW = {
  'newham': 'stratford',
  'waltham-forest': 'walthamstow',
  'fulham': 'hammersmith',
  'hammersmith-and-fulham': 'hammersmith',
  'merton': 'wimbledon',
  'hillingdon': 'uxbridge',
  'redbridge': 'ilford',
  'havering': 'romford',
  'barking-and-dagenham': 'barking',
  'dagenham': 'barking',
  'kingston-upon-thames': 'kingston',
  'richmond-upon-thames': 'richmond',
  'city-of-westminster': 'westminster',
  'kensington-and-chelsea': 'kensington',
  'royal-borough-of-greenwich': 'greenwich',
};

export const LOCATION_ALIASES = Object.fromEntries(
  Object.entries(ALIASES_RAW).filter(([, slug]) => SLUGS.has(slug))
);

/**
 * Nearby areas: real neighbouring boroughs / adjoining areas, only where confident.
 * Some pages have fewer than three because we only list neighbours that have a page.
 */
const NEARBY_RAW = {
  camden: ['islington', 'westminster', 'barnet'],
  islington: ['camden', 'hackney', 'shoreditch'],
  hackney: ['islington', 'shoreditch', 'stratford', 'walthamstow'],
  shoreditch: ['hackney', 'islington', 'canary-wharf'],
  walthamstow: ['hackney', 'stratford', 'tottenham', 'ilford'],
  stratford: ['hackney', 'walthamstow', 'canary-wharf', 'barking'],
  'canary-wharf': ['stratford', 'shoreditch', 'hackney', 'greenwich'],
  barking: ['stratford', 'ilford', 'romford'],
  ilford: ['barking', 'romford', 'stratford', 'walthamstow'],
  romford: ['barking', 'ilford'],
  tottenham: ['enfield', 'hackney', 'walthamstow', 'islington'],
  enfield: ['barnet', 'tottenham', 'walthamstow'],
  barnet: ['camden', 'harrow', 'enfield', 'wembley'],
  harrow: ['wembley', 'barnet', 'ealing', 'uxbridge'],
  wembley: ['harrow', 'ealing', 'barnet', 'camden'],
  ealing: ['hammersmith', 'hounslow', 'harrow', 'uxbridge'],
  uxbridge: ['ealing', 'hounslow', 'harrow'],
  hounslow: ['ealing', 'richmond', 'hammersmith', 'uxbridge'],
  richmond: ['kingston', 'hounslow', 'wandsworth'],
  kingston: ['richmond', 'sutton', 'wimbledon'],
  wimbledon: ['wandsworth', 'kingston', 'sutton', 'croydon'],
  sutton: ['croydon', 'kingston', 'wimbledon'],
  croydon: ['sutton', 'bromley', 'wimbledon'],
  bromley: ['croydon', 'lewisham', 'greenwich', 'bexley'],
  bexley: ['greenwich', 'bromley'],
  greenwich: ['lewisham', 'bexley', 'bromley', 'canary-wharf'],
  lewisham: ['greenwich', 'peckham', 'bromley'],
  peckham: ['lewisham', 'brixton'],
  brixton: ['clapham', 'wandsworth', 'peckham'],
  clapham: ['brixton', 'wandsworth'],
  wandsworth: ['clapham', 'brixton', 'wimbledon', 'hammersmith'],
  hammersmith: ['kensington', 'wandsworth', 'ealing', 'hounslow'],
  kensington: ['westminster', 'hammersmith'],
  westminster: ['camden', 'kensington'],
};

/** Real location objects for the "Nearby areas" block (unknown slugs are dropped). */
export function getNearbyLocations(slug) {
  return (NEARBY_RAW[slug] || [])
    .filter((s) => s !== slug && SLUGS.has(s))
    .map((s) => getLocationBySlug(s));
}

/** Every normalised name that points at one location: its slug, its name, and aliases. */
export function keysForLocation(slug) {
  const loc = getLocationBySlug(slug);
  if (!loc) return [];
  const keys = new Set([normalizeKey(loc.slug), normalizeKey(loc.name)]);
  for (const [alias, target] of Object.entries(LOCATION_ALIASES)) {
    if (target === slug) keys.add(alias);
  }
  return [...keys].filter(Boolean);
}

// key -> slug, plus a longest-first list so "hammersmith-and-fulham" wins over "hammersmith".
const KEY_TO_SLUG = new Map();
for (const l of locations) for (const k of keysForLocation(l.slug)) KEY_TO_SLUG.set(k, l.slug);
const KEYS_LONGEST_FIRST = [...KEY_TO_SLUG.keys()].sort((a, b) => b.length - a.length);

/** One tag -> location slug, or null. */
export function locationSlugForTag(tag) {
  return KEY_TO_SLUG.get(normalizeKey(tag)) || null;
}

/** Whole-word match of any known name inside a post slug, e.g. "moving-to-camden-guide". */
export function locationSlugForPostSlug(postSlug) {
  const s = `-${normalizeKey(postSlug)}-`;
  for (const k of KEYS_LONGEST_FIRST) if (s.includes(`-${k}-`)) return KEY_TO_SLUG.get(k);
  return null;
}

/** Best matching location for a blog post (tags first, then slug), or null. */
export function locationForPost(post) {
  if (!post) return null;
  for (const tag of post.tags || []) {
    const hit = locationSlugForTag(tag);
    if (hit) return getLocationBySlug(hit);
  }
  const hit = locationSlugForPostSlug(post.slug);
  return hit ? getLocationBySlug(hit) : null;
}

const escapeRe = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** "hammersmith-and-fulham" -> regex source matching "Hammersmith & Fulham", "hammersmith and fulham", ... */
const keyToTagPattern = (key) =>
  '^' + key.split('-').map((w) => (w === 'and' ? '(?:and|&)' : escapeRe(w))).join('[\\s-]+') + '$';

/**
 * MongoDB filter for published posts that belong to a location page:
 * tag equals a known name (case-insensitive) OR the post slug contains the name as whole words.
 */
export function blogMatchQuery(slug) {
  const keys = keysForLocation(slug);
  if (!keys.length) return null;
  const tagRegexes = keys.map((k) => new RegExp(keyToTagPattern(k), 'i'));
  const slugRegex = `(^|-)(${keys.map(escapeRe).join('|')})(-|$)`;
  return { $or: [{ tags: { $in: tagRegexes } }, { slug: { $regex: slugRegex, $options: 'i' } }] };
}
