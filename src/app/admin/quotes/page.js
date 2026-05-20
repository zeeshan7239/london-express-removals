'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronLeft, ChevronRight, Loader2, Inbox } from 'lucide-react';
import api from '@/lib/utils/api';

const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

const statusFilters = ['all', 'new', 'accepted', 'rejected', 'completed', 'cancelled'];

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

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = { limit, page };
        if (filter !== 'all') params.status = filter;
        const { data } = await api.get('/quotes', { params });
        setQuotes(data.quotes);
        setTotal(data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [filter, page]);

  const filtered = search
    ? quotes.filter((q) =>
        q.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        q.customer.email.toLowerCase().includes(search.toLowerCase()) ||
        q.pickup?.postcode?.includes(search.toUpperCase()) ||
        q.delivery?.postcode?.includes(search.toUpperCase())
      )
    : quotes;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <div className="mb-6">
        <h1 className="heading-display text-3xl mb-2">Quotes &amp; Bookings</h1>
        <p className="text-ink-600">{total} total · page {page} of {Math.max(1, totalPages)}</p>
      </div>

      <div className="bg-white rounded-3xl border border-ink-100 overflow-hidden">
        {/* Filters */}
        <div className="px-5 py-4 border-b border-ink-100 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search name, email, or postcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 !py-2.5"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-ink-400 shrink-0" />
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => { setFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  filter === s ? 'bg-ember-500 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-ember-500 mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-ink-500">
            <Inbox className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No quotes match this filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-ink-100">
            {filtered.map((q) => (
              <Link
                key={q._id}
                href={`/admin/quotes/${q._id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-ink-50 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm">{q.customer.name}</span>
                    <StatusBadge status={q.status} />
                    {q.kind === 'quote' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                        Custom
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-ink-500 truncate">
                    {q.movingType} · {q.pickup?.postcode} → {q.delivery?.postcode}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {q.estimatedPrice && (
                    <div className="font-display font-bold text-sm text-ember-600 mb-0.5">£{q.estimatedPrice}</div>
                  )}
                  <div className="text-xs text-ink-500">{formatDate(q.createdAt)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-ink-100 flex items-center justify-between">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-1 text-sm font-semibold text-ink-600 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <span className="text-sm text-ink-500">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 text-sm font-semibold text-ink-600 disabled:opacity-30"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
