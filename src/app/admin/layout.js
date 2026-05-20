'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Inbox, Truck, LogOut, ChevronRight, Loader2,
} from 'lucide-react';
import { useAuth } from '@/components/common/AuthContext';
import toast from 'react-hot-toast';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/quotes', label: 'Quotes & Bookings', icon: Inbox },
];

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      toast.error('Admin access required');
      router.replace('/sign-in');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-ember-500" />
      </div>
    );
  }
  if (!user || user.role !== 'admin') return null;

  const doLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-ink-100">
        <div className="px-6 py-5 border-b border-ink-100">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-ink-900 flex items-center justify-center">
              <Truck className="w-4 h-4 text-ember-400" />
            </div>
            <div>
              <div className="font-display font-bold text-sm leading-tight">Admin</div>
              <div className="text-[10px] text-ink-500 uppercase tracking-wider">Dashboard</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active ? 'bg-ember-50 text-ember-700' : 'text-ink-600 hover:bg-ink-50'
                }`}
              >
                <Icon className="w-4 h-4" /> {item.label}
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-ink-100 space-y-3">
          <div className="px-3 py-2 rounded-xl bg-ink-50">
            <div className="font-semibold text-sm text-ink-900 truncate">{user.fullName}</div>
            <div className="text-xs text-ink-500 truncate">{user.email}</div>
          </div>
          <button
            onClick={doLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-ink-600 hover:bg-red-50 hover:text-red-600 transition w-full"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <div className="lg:hidden bg-white border-b border-ink-100 px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="font-display font-bold">Admin</Link>
          <button onClick={doLogout} className="text-sm text-ink-600">Sign out</button>
        </div>
        {children}
      </div>
    </div>
  );
}
