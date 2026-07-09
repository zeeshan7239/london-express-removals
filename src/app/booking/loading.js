import { Loader2 } from 'lucide-react';

export default function BookingLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-ink-50">
      <Loader2 className="w-8 h-8 text-ember-500 animate-spin mb-3" />
      <p className="text-sm text-ink-500">Loading booking form...</p>
    </div>
  );
}
