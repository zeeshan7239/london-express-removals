'use client';

import { useEffect, useState, useCallback } from 'react';
import { Calendar, Loader2, Lock, Unlock, ChevronLeft, ChevronRight, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/utils/api';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS = ['Mo','Tu','We','Th','Fr','Sa','Su'];
const pad = (n) => String(n).padStart(2,'0');

export default function AdminAvailabilityPage() {
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [availability, setAvailability] = useState({});
  const [rules, setRules] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(null);
  const [selected, setSelected] = useState(null);
  const [editBlocked, setEditBlocked] = useState(false);
  const [editLimit, setEditLimit] = useState('');
  const [editNote, setEditNote] = useState('');

  const monthKey = `${year}-${pad(month+1)}`;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pubRes, adminRes] = await Promise.all([
        api.get(`/availability?month=${monthKey}`),
        api.get(`/availability/admin?month=${monthKey}`),
      ]);
      setAvailability(pubRes.data.days || {});
      const ruleMap = {};
      for (const r of (adminRes.data.rules || [])) ruleMap[r.date] = r;
      setRules(ruleMap);
    } catch { toast.error('Could not load availability'); }
    finally { setLoading(false); }
  }, [monthKey]);

  useEffect(() => { load(); }, [load]);

  const prevMonth = () => { if (month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); };
  const nextMonth = () => { if (month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); };

  const selectDay = (key) => {
    setSelected(key);
    const r = rules[key];
    setEditBlocked(r?.blocked || false);
    setEditLimit(r?.maxBookings != null ? String(r.maxBookings) : '');
    setEditNote(r?.note || '');
  };

  const save = async () => {
    if (!selected) return;
    setSaving(selected);
    try {
      await api.post('/availability/admin', {
        date: selected, blocked: editBlocked,
        ...(editLimit !== '' ? { maxBookings: Number(editLimit) } : {}),
        note: editNote || undefined,
      });
      toast.success('Saved');
      await load();
    } catch { toast.error('Could not save'); }
    finally { setSaving(null); }
  };

  const remove = async () => {
    if (!selected) return;
    setSaving(selected);
    try {
      await api.delete('/availability/admin', { data: { date: selected } });
      toast.success('Rule removed — reverts to default limit');
      setSelected(null);
      await load();
    } catch { toast.error('Could not remove rule'); }
    finally { setSaving(null); }
  };

  const daysInMonth = new Date(year, month+1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const today = new Date().toISOString().slice(0,10);

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <div className="mb-6">
        <h1 className="heading-display text-3xl mb-1">Availability Manager</h1>
        <p className="text-ink-600">Block dates or limit daily bookings. Default limit: 4 per day.</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-ink-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-ink-50 flex items-center justify-center hover:bg-ink-100"><ChevronLeft className="w-4 h-4" /></button>
            <div className="font-display font-bold flex items-center gap-2">
              {MONTHS[month]} {year}
              {loading && <Loader2 className="w-4 h-4 animate-spin text-ink-400" />}
            </div>
            <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-ink-50 flex items-center justify-center hover:bg-ink-100"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map(w => <div key={w} className="text-center text-[10px] font-bold uppercase tracking-wider text-ink-400 py-1">{w}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <div key={`e${i}`} />;
              const key = `${year}-${pad(month+1)}-${pad(d)}`;
              const info = availability[key];
              const rule = rules[key];
              const isSelected = selected === key;
              const isPast = key <= today;
              const isBlocked = rule?.blocked;
              const isFull = !isBlocked && info && !info.available && !isPast;
              return (
                <button key={key} onClick={() => selectDay(key)}
                  className={`aspect-square rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 ${
                    isSelected ? 'ring-2 ring-ember-500 bg-ember-50' :
                    isPast ? 'opacity-30 cursor-default' :
                    isBlocked ? 'bg-red-50 text-red-600' :
                    isFull ? 'bg-amber-50 text-amber-700' :
                    'hover:bg-ink-50 text-ink-700'}`}>
                  {d}
                  {!isPast && info && (
                    <span className={`text-[9px] leading-none font-normal ${isBlocked?'text-red-400':isFull?'text-amber-500':'text-ink-400'}`}>
                      {isBlocked ? 'blocked' : isFull ? 'full' : `${info.remaining}`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 text-[10px] text-ink-500 pt-3 border-t border-ink-100">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-100 inline-block" /> Blocked</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-100 inline-block" /> Full</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-ink-100 inline-block" /> Open (slots left)</span>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-ink-100 overflow-hidden">
          {selected ? (
            <>
              <div className="px-5 py-4 border-b border-ink-100 bg-ink-50">
                <div className="text-[10px] uppercase tracking-wider font-bold text-ink-500 mb-1">Edit date</div>
                <div className="font-display font-bold">{new Date(selected+'T12:00:00').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</div>
              </div>
              <div className="p-5 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setEditBlocked(v => !v)}>
                  <div className={`w-10 h-6 rounded-full transition-colors relative ${editBlocked ? 'bg-red-500' : 'bg-ink-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${editBlocked ? 'left-5' : 'left-1'}`} />
                  </div>
                  <span className="font-semibold text-sm flex items-center gap-1.5">
                    {editBlocked ? <><Lock className="w-3.5 h-3.5 text-red-500" /> Blocked</> : <><Unlock className="w-3.5 h-3.5 text-ink-400" /> Open</>}
                  </span>
                </label>
                {!editBlocked && (
                  <div>
                    <label className="text-xs font-semibold text-ink-600 mb-2 block">Max bookings</label>
                    <input type="number" min="0" max="20" placeholder="Default (4)"
                      className="input-field" value={editLimit} onChange={e => setEditLimit(e.target.value)} />
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-ink-600 mb-2 block">Internal note</label>
                  <input type="text" placeholder="e.g. Bank holiday"
                    className="input-field" value={editNote} onChange={e => setEditNote(e.target.value)} />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={save} disabled={!!saving} className="flex-1 btn-primary !py-2.5 text-sm justify-center disabled:opacity-50">
                    {saving === selected ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
                  </button>
                  {rules[selected] && (
                    <button onClick={remove} disabled={!!saving} className="px-3 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-ink-500 text-sm">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" /> Click a date to edit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
