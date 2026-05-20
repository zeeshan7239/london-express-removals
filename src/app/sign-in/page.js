'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mail, Lock, Loader2, LogIn } from 'lucide-react';
import AuthShell from '@/components/common/AuthShell';
import { useAuth } from '@/components/common/AuthContext';
import { isValidEmail } from '@/lib/utils/validation';

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) return toast.error('Please enter a valid email');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}!`);
      const next = params.get('next');
      if (next && next.startsWith('/')) {
        router.push(next);
      } else {
        router.push(user.role === 'admin' ? '/admin' : '/my-bookings');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-ember-500" /> Email
        </label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
          className={`input-field ${email && isValidEmail(email) ? 'border-emerald-500' : ''}`}
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-ink-600 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-ember-500" /> Password
          </label>
          <Link href="/forgot-password" className="text-xs text-ember-600 hover:underline font-medium">Forgot?</Link>
        </div>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="input-field" />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-4 disabled:opacity-50">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : <>Sign in <LogIn className="w-4 h-4" /></>}
      </button>

      <p className="text-center text-sm text-ink-600 pt-2">
        New here? <Link href="/sign-up" className="text-ember-600 font-semibold hover:underline">Create an account</Link>
      </p>
    </form>
  );
}

export default function SignInPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage your bookings.">
      <Suspense fallback={<div className="h-64 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-ember-500" /></div>}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
