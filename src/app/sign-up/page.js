'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Phone, Loader2, UserPlus } from 'lucide-react';
import AuthShell from '@/components/common/AuthShell';
import { useAuth } from '@/components/common/AuthContext';
import { isValidEmail, isValidUKPhone } from '@/lib/utils/validation';

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [data, setData] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!data.fullName.trim()) return toast.error('Please enter your full name');
    if (!isValidEmail(data.email)) return toast.error('Please enter a valid email');
    if (!isValidUKPhone(data.phone)) return toast.error('Please enter a valid UK phone number');
    if (data.password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      const user = await register(data);
      toast.success(`Welcome, ${user.fullName.split(' ')[0]}!`);
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Track your moves and book in one click.">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-ember-500" /> Full name
          </label>
          <input type="text" value={data.fullName} onChange={(e) => setData((d) => ({ ...d, fullName: e.target.value }))} autoComplete="name" className="input-field" />
        </div>
        <div>
          <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-ember-500" /> Email
          </label>
          <input type="email" value={data.email} onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))} autoComplete="email"
            className={`input-field ${data.email && isValidEmail(data.email) ? 'border-emerald-500' : data.email ? 'border-red-400' : ''}`}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-ember-500" /> Phone
          </label>
          <input type="tel" value={data.phone} onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))} autoComplete="tel"
            className={`input-field ${data.phone && isValidUKPhone(data.phone) ? 'border-emerald-500' : data.phone ? 'border-red-400' : ''}`}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-ember-500" /> Password
          </label>
          <input type="password" value={data.password} onChange={(e) => setData((d) => ({ ...d, password: e.target.value }))} autoComplete="new-password" minLength="6" className="input-field" />
          <p className="text-[11px] text-ink-500 mt-1">At least 6 characters</p>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-4 disabled:opacity-50">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> :
           <>Create account <UserPlus className="w-4 h-4" /></>}
        </button>

        <p className="text-center text-sm text-ink-600 pt-2">
          Already have an account? <Link href="/sign-in" className="text-ember-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
