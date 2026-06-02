import Link from 'next/link';
import { Truck, ShieldCheck, Sparkles, Users } from 'lucide-react';

export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex">
      {/* Left - form */}
      <div className="flex-1 flex flex-col">
        <div className="px-6 py-5 lg:px-12 lg:py-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-ink-900 flex items-center justify-center">
              <Truck className="w-4 h-4 text-ember-400" />
            </div>
            <div className="font-display font-bold text-sm leading-tight">
              London Express<br />
              <span className="text-ember-500">Removals</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">
            <h1 className="heading-display text-3xl mb-2">{title}</h1>
            {subtitle && <p className="text-ink-600 mb-8">{subtitle}</p>}
            {children}
          </div>
        </div>
      </div>

      {/* Right - showcase */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark opacity-30" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-ember-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-ember-500/10 blur-3xl" />

        <div className="relative flex flex-col justify-center px-12 xl:px-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur text-xs font-semibold uppercase tracking-wider text-ember-400 mb-6 w-fit">
            <Sparkles className="w-3 h-3" /> Customer benefits
          </div>
          <h2 className="font-display font-extrabold text-3xl xl:text-4xl mb-4 leading-tight">
            Better, faster<br />
            <span className="bg-gradient-to-r from-ember-400 to-ember-500 bg-clip-text text-transparent">
              moving
            </span>
          </h2>
          <p className="text-ink-300 leading-relaxed mb-8 max-w-md">
            Join thousands of Londoners who book their moves with us every month.
          </p>
          <div className="space-y-4 max-w-md">
            {[
              { icon: ShieldCheck, title: 'Secured and Safe', desc: 'Standard on every move' },
              { icon: Users, title: 'Vetted movers', desc: 'Background-checked and trained' },
              { icon: Truck, title: 'Same-day available', desc: 'When you need to move fast' },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
                  <div className="w-10 h-10 rounded-xl bg-ember-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-ember-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{b.title}</div>
                    <div className="text-xs text-ink-400 mt-0.5">{b.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
