'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail, Loader2, Send, Check } from 'lucide-react';
import AuthShell from '@/components/common/AuthShell';
import { isValidEmail } from '@/lib/utils/validation';
import api from '@/lib/utils/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) return toast.error('Please enter a valid email');

    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthShell title="Check your inbox" subtitle="">
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-ink-600 mb-6">
            If that email is registered with us, we've sent a reset link. The link expires in 30 minutes.
          </p>
          <Link href="/sign-in" className="btn-ghost">Back to sign in</Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Reset your password" subtitle="Enter your email and we'll send you a reset link.">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-ember-500" /> Email
          </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="input-field" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-4 disabled:opacity-50">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <>Send reset link <Send className="w-4 h-4" /></>}
        </button>

        <p className="text-center text-sm text-ink-600 pt-2">
          Remembered? <Link href="/sign-in" className="text-ember-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
