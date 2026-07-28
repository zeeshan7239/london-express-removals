'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Phone, Loader2, UserPlus, ShieldCheck, Check } from 'lucide-react';
import AuthShell from '@/components/common/AuthShell';
import { useAuth } from '@/components/common/AuthContext';
import { isValidEmail, isValidUKPhone } from '@/lib/utils/validation';
import api from '@/lib/utils/api';

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [data, setData] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  // ── Email verification state ────────────────────────────────────────
  // User must verify their email BEFORE we let them create an account.
  // If they change the email after verifying, we reset the whole flow.
  const [otpSent, setOtpSent]           = useState(false);
  const [otpCode, setOtpCode]           = useState('');
  const [otpVerified, setOtpVerified]   = useState(false);
  const [otpSending, setOtpSending]     = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpCooldown, setOtpCooldown]   = useState(0);

  // Reset verification if email changes
  useEffect(() => {
    if (otpVerified || otpSent) {
      setOtpVerified(false);
      setOtpSent(false);
      setOtpCode('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.email]);

  // Countdown for resend cooldown
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = setTimeout(() => setOtpCooldown(s => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [otpCooldown]);

  const handleSendOTP = async () => {
    if (!isValidEmail(data.email)) {
      return toast.error('Please enter a valid email first');
    }
    setOtpSending(true);
    try {
      await api.post('/verify-email/send', { email: data.email });
      setOtpSent(true);
      setOtpCooldown(60);
      toast.success('Code sent — check your inbox (and spam folder)');
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not send code';
      if (err.response?.data?.secondsLeft) {
        setOtpCooldown(err.response.data.secondsLeft);
      }
      toast.error(msg);
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!/^\d{6}$/.test(otpCode.trim())) {
      return toast.error('Enter the 6-digit code');
    }
    setOtpVerifying(true);
    try {
      await api.post('/verify-email/verify', {
        email: data.email,
        code: otpCode.trim(),
      });
      setOtpVerified(true);
      toast.success('Email verified ✓');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Wrong code');
    } finally {
      setOtpVerifying(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!data.fullName.trim()) return toast.error('Please enter your full name');
    if (!isValidEmail(data.email)) return toast.error('Please enter a valid email');
    if (!isValidUKPhone(data.phone)) return toast.error('Please enter a valid UK phone number');
    if (data.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (!otpVerified) return toast.error('Please verify your email before creating an account');

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

        {/* Email verification block */}
        <div className="pt-2">
          {!otpVerified ? (
            <div className="rounded-2xl border-2 border-ember-200 bg-ember-50/50 p-4">
              <div className="flex items-start gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-ember-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-ink-900">Verify your email</div>
                  <div className="text-xs text-ink-600 leading-relaxed mt-0.5">
                    We'll send a 6-digit code to confirm your email before creating your account.
                  </div>
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={otpSending || !isValidEmail(data.email)}
                  className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {otpSending
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    : <><Mail className="w-4 h-4" /> Send verification code</>}
                </button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="otp-code" className="text-xs font-semibold text-ink-600 mb-2 block">
                      Enter the 6-digit code we sent to {data.email}
                    </label>
                    <input
                      id="otp-code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="\d{6}"
                      maxLength={6}
                      placeholder="000000"
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="input-field text-center tracking-[0.4em] font-mono font-bold text-lg"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={otpVerifying || otpCode.length !== 6}
                      className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {otpVerifying
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
                        : <><Check className="w-4 h-4" /> Verify code</>}
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={otpCooldown > 0 || otpSending}
                      className="px-4 py-2.5 rounded-full border-2 border-ink-200 text-sm font-bold text-ink-600 hover:border-ink-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : 'Resend code'}
                    </button>
                  </div>
                  <p className="text-[11px] text-ink-500">
                    Didn't get the email? Check your spam folder or try resending after the cooldown.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <div>
                <div className="text-sm font-bold text-emerald-800">Email verified</div>
                <div className="text-xs text-emerald-700">{data.email}</div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !otpVerified}
          className="btn-primary w-full justify-center !py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
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
