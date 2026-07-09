export default function BlogSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-ink-100 animate-pulse">
          {/* Cover placeholder */}
          <div className="aspect-[16/10] bg-ink-100" />
          <div className="p-6">
            {/* Meta line */}
            <div className="flex gap-3 mb-3">
              <div className="h-3 w-20 bg-ink-100 rounded-full" />
              <div className="h-3 w-16 bg-ink-100 rounded-full" />
            </div>
            {/* Title */}
            <div className="h-4 w-full bg-ink-100 rounded-full mb-2" />
            <div className="h-4 w-3/4 bg-ink-100 rounded-full mb-4" />
            {/* Excerpt */}
            <div className="h-3 w-full bg-ink-100 rounded-full mb-1.5" />
            <div className="h-3 w-full bg-ink-100 rounded-full mb-1.5" />
            <div className="h-3 w-2/3 bg-ink-100 rounded-full mb-4" />
            {/* Read more */}
            <div className="h-3 w-24 bg-ink-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
