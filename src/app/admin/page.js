'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Inbox, Check, X, TrendingUp, Calendar, Loader2, ArrowRight } from 'lucide-react';
import api from '@/lib/utils/api';

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const StatusBadge = ({ status }) => {
  const styles = {
    new: 'bg-blue-50 text-blue-700',
    accepted: 'bg-emerald-50 text-emerald-700',
    rejected: 'bg-red-50 text-red-700',
    completed: 'bg-purple-50 text-purple-700',
    cancelled: 'bg-ink-100 text-ink-600',
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles[status] || 'bg-ink-100 text-ink-600'}`}>
      {status}
    </span>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/quotes/stats');
        setStats(data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-ember-500" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 lg:p-10">
        <p className="text-red-600">Could not load dashboard. Please refresh.</p>
      </div>
    );
  }

  const cards = [
    { label: 'Total', value: stats.total, icon: Inbox, color: 'from-blue-500 to-blue-600' },
    { label: 'New', value: stats.new, icon: TrendingUp, color: 'from-amber-500 to-amber-600' },
    { label: 'Accepted', value: stats.accepted, icon: Check, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Last 30 days', value: stats.last30Days, icon: Calendar, color: 'from-ember-500 to-ember-600' },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="heading-display text-3xl mb-2">Dashboard</h1>
        <p className="text-ink-600">Welcome back — here's what's happening today.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-2xl border border-ink-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="font-display font-extrabold text-3xl">{c.value}</div>
              <div className="text-xs text-ink-500 mt-1 uppercase tracking-wider font-semibold">{c.label}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-ink-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-ink-100 flex items-center justify-between">
          <h2 className="font-display font-bold">Recent quotes</h2>
          <Link href="/admin/quotes" className="text-sm font-semibold text-ember-600 hover:underline inline-flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <div className="p-8 text-center text-ink-500 text-sm">
            <Inbox className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No quotes yet.
          </div>
        ) : (
          <div className="divide-y divide-ink-100">
            {stats.recent.map((q) => (
              <Link
                key={q._id}
                href={`/admin/quotes/${q._id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-ink-50 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{q.customer.name}</span>
                    <StatusBadge status={q.status} />
                  </div>
                  <div className="text-xs text-ink-500 truncate">
                    {q.movingType} · {q.pickup?.postcode} → {q.delivery?.postcode}
                  </div>
                </div>
                <div className="text-xs text-ink-500 shrink-0">{formatDate(q.createdAt)}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
