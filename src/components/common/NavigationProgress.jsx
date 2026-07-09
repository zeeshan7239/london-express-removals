'use client';

import { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * NavigationProgressBar — shows a thin orange bar at the top of every page
 * while a route change is in progress. Gives users instant feedback that a
 * click was received, even before the destination page has rendered.
 *
 * How it works:
 * - We start the bar when the user clicks a `<Link>` (mousedown intercept)
 * - We finish the bar when `pathname` (or the search params) change,
 *   meaning Next.js has rendered the new page.
 *
 * Wrapped in Suspense because `useSearchParams` requires it at the app root.
 */
function ProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [visible,  setVisible]  = useState(false);
  const [progress, setProgress] = useState(0);

  // ── Start bar on any internal link click ─────────────────────────────────
  useEffect(() => {
    const onDocumentClick = (e) => {
      // Only fire for primary-button clicks, no modifiers (Cmd, Ctrl, Shift)
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      // Find the closest <a> the user clicked
      const anchor = e.target.closest?.('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Skip external, anchor-only, or protocol links
      if (href.startsWith('http://') || href.startsWith('https://')) {
        try {
          const url = new URL(href);
          if (url.origin !== window.location.origin) return; // external → skip
        } catch { return; }
      }
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')
       || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      // Same page? Skip.
      if (href === pathname || href === window.location.pathname) return;

      // Kick off progress — start at 40% so the bar visibly appears immediately
      setVisible(true);
      setProgress(40);
    };
    document.addEventListener('click', onDocumentClick);
    return () => document.removeEventListener('click', onDocumentClick);
  }, [pathname]);

  // ── While visible, keep bumping toward 90% until the route actually changes
  // Faster interval + bigger jumps so the bar feels lively, not laggy.
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setProgress(p => (p < 90 ? p + (90 - p) * 0.3 : p));
    }, 80);
    return () => clearInterval(interval);
  }, [visible]);

  // ── Finish + hide when the pathname (or query) changes ───────────────────
  // Shorter fade-out so the bar clears before the user notices.
  useEffect(() => {
    if (!visible) return;
    setProgress(100);
    const done = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 120);
    return () => clearTimeout(done);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-0.5 z-[100] pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-ember-500 to-ember-400 shadow-[0_0_10px_rgba(249,115,22,0.6)] transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <ProgressInner />
    </Suspense>
  );
}
