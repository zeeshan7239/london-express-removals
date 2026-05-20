'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Lock, Loader2, Check } from 'lucide-react';
import AuthShell from '@/components/common/AuthShell';
import api from '@/lib/utils/api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    if (password !== confirm) return toast.error('Passwords don\'t match');

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset!');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Set a new password" subtitle="Pick something strong you'll remember.">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-ember-500" /> New password
          </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength="6" className="input-field" />
        </div>
        <div>
          <label className="text-xs font-semibold text-ink-600 mb-2 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-ember-500" /> Confirm password
          </label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" minLength="6" className="input-field" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center !py-4 disabled:opacity-50">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</> : <>Reset password <Check className="w-4 h-4" /></>}
        </button>
      </form>
    </AuthShell>
  );
}
