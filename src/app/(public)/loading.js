import { Loader2 } from 'lucide-react';

/**
 * Fallback loading state for pages in the (public) group:
 * home, about, services, contact, locations. Rendered instantly
 * during route change until the destination page streams in.
 */
export default function PublicLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <Loader2 className="w-8 h-8 text-ember-500 animate-spin mb-3" />
      <p className="text-sm text-ink-500">Loading...</p>
    </div>
  );
}
