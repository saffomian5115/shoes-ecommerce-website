"use client";

export function ProductSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="flex gap-1">
          <div className="h-3 w-12 rounded bg-muted" />
          <div className="h-3 w-8 rounded bg-muted" />
        </div>
        <div className="h-5 w-20 rounded bg-muted" />
        <div className="h-9 w-full rounded bg-muted" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] min-h-[500px] bg-muted animate-pulse">
      <div className="container mx-auto px-4 h-full flex items-center">
        <div className="space-y-6 max-w-lg">
          <div className="h-5 w-24 rounded bg-muted-foreground/20" />
          <div className="h-12 w-full rounded bg-muted-foreground/20" />
          <div className="h-12 w-3/4 rounded bg-muted-foreground/20" />
          <div className="h-4 w-full rounded bg-muted-foreground/20" />
          <div className="h-12 w-36 rounded bg-muted-foreground/20" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedSkeleton() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="h-8 w-48 rounded bg-muted mb-8 animate-pulse" />
        <ProductGridSkeleton count={4} />
      </div>
    </section>
  );
}
