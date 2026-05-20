import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ink-50 to-white px-4">
      <div className="text-center max-w-md">
        <div className="font-display font-extrabold text-8xl text-ember-500 mb-3">404</div>
        <h1 className="heading-display text-3xl mb-3">Page not found</h1>
        <p className="text-ink-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4" /> Back to home
          </Link>
          <Link href="/booking" className="btn-ghost">
            <Search className="w-4 h-4" /> Book a move
          </Link>
        </div>
      </div>
    </div>
  );
}
