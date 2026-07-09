export default function BlogPostSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero placeholder */}
      <div className="bg-gradient-to-br from-ink-800 to-ink-700 py-20 lg:py-28">
        <div className="container-wide max-w-4xl">
          <div className="h-5 w-32 bg-white/20 rounded-full mb-4" />
          <div className="h-5 w-24 bg-white/20 rounded-full mb-6" />
          <div className="h-8 w-3/4 bg-white/20 rounded-full mb-3" />
          <div className="h-8 w-1/2 bg-white/20 rounded-full mb-6" />
          <div className="flex gap-4">
            <div className="h-4 w-28 bg-white/20 rounded-full" />
            <div className="h-4 w-20 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>
      {/* Article body placeholder */}
      <div className="py-20">
        <div className="container-wide max-w-3xl space-y-4">
          {[100, 90, 95, 75, 60, 100, 85, 70, 55, 90, 80].map((w, i) => (
            <div key={i} className={`h-4 bg-ink-100 rounded-full`} style={{ width: `${w}%` }} />
          ))}
          <div className="h-6 w-1/3 bg-ink-200 rounded-full mt-8" />
          {[100, 88, 95, 70].map((w, i) => (
            <div key={`b-${i}`} className="h-4 bg-ink-100 rounded-full" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
