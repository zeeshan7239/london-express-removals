'use client';

import { Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Share button — uses the Web Share API on supported devices (mostly mobile),
 * falls back to copying the URL to clipboard on desktop. Splitting this into
 * its own client component lets the rest of the blog post stay SSR for SEO.
 */
export default function ShareButton({ title }) {
  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled — silent
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      } catch {
        toast.error('Could not copy link');
      }
    }
  };

  return (
    <button onClick={share} className="btn-ghost !py-2.5 text-sm">
      <Share2 className="w-4 h-4" /> Share
    </button>
  );
}
