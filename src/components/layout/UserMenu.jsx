'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, LayoutDashboard, ChevronDown, UserPlus, LogIn, Inbox } from 'lucide-react';
import { useAuth } from '@/components/common/AuthContext';

export default function UserMenu({ inverted = false }) {
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (loading) {
    return <div className="w-9 h-9 rounded-full bg-ink-100 animate-pulse" />;
  }

  // Logged out
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/sign-in"
          className={`text-sm font-semibold hidden sm:flex items-center gap-1.5 transition ${
            inverted ? 'text-white/80 hover:text-white' : 'text-ink-600 hover:text-ink-900'
          }`}
        >
          <LogIn className="w-4 h-4" /> Sign in
        </Link>
      </div>
    );
  }

  // Logged in
  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const doLogout = async () => {
    await logout();
    setOpen(false);
    router.push('/');
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 group"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ember-500 to-ember-600 flex items-center justify-center text-white text-xs font-bold shadow-glow-ember">
          {initials}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 transition ${open ? 'rotate-180' : ''} ${
          inverted ? 'text-white/60' : 'text-ink-500'
        }`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-pop border border-ink-100 overflow-hidden z-50"
          >
            <div className="px-4 py-3 bg-ink-50 border-b border-ink-100">
              <div className="font-semibold text-ink-900 text-sm truncate">{user.fullName}</div>
              <div className="text-xs text-ink-500 truncate">{user.email}</div>
            </div>
            <Link
              href="/my-bookings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ember-50 hover:text-ember-700 transition"
            >
              <Inbox className="w-4 h-4" /> My bookings
            </Link>
            {user.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ember-50 hover:text-ember-700 transition"
              >
                <LayoutDashboard className="w-4 h-4" /> Admin dashboard
              </Link>
            )}
            <button
              onClick={doLogout}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-red-50 hover:text-red-600 transition w-full text-left"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
