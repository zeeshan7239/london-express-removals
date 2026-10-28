import NextImage from 'next/image';

export default function PageHeader({ eyebrow, title, subtitle, image = true }) {
  return (
    <section className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark opacity-25 pointer-events-none" />
      {image ? (
        <div className="absolute inset-y-0 right-0 w-full lg:w-3/5 pointer-events-none select-none [mask-image:linear-gradient(to_left,black_35%,transparent_100%)]" aria-hidden="true">
          <NextImage src="/hero-van.webp" alt="" fill sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover object-[60%_center] opacity-40 lg:opacity-60 " />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent" />
        </div>
      ) : (
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-ember-500/15 blur-3xl pointer-events-none" />
      )}
      <div className="container-wide relative py-16 lg:py-24">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur text-xs font-semibold uppercase tracking-wider text-ember-400 mb-4">
            {eyebrow}
          </div>
        )}
        <h1 className="heading-display !text-white text-3xl lg:text-5xl mb-3 max-w-3xl">{title}</h1>
        {subtitle && <p className="text-ink-200 text-lg max-w-2xl leading-relaxed">{subtitle}</p>}
      </div>
    </section>
  );
}
