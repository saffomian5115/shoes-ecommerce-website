"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductItem {
  _id: string;
  slug: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  isNew?: boolean;
}

interface FloatingNewArrivalsProps {
  products: ProductItem[];
}

function getItemSize(width: number) {
  if (width < 640) return { w: 140, h: 190 };
  if (width < 1024) return { w: 200, h: 270 };
  return { w: 240, h: 320 };
}

export function FloatingNewArrivals({ products }: FloatingNewArrivalsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState(0);
  const offsetRef = useRef(0);
  const animationRef = useRef<number>(0);
  const itemElsRef = useRef<HTMLElement[]>([]);

  const itemSize = getItemSize(viewportW);
  const ITEM_W = itemSize.w;
  const ITEM_H = itemSize.h;
  const GAP = 16;
  const STEP = ITEM_W + GAP;

  // Speed: slower on mobile
  const SPEED = viewportW < 640 ? 0.4 : 0.7;

  const WAVE_AMP = viewportW < 640 ? 18 : 35;
  const WAVE_FREQ = 1.1;

  const totalWidth = products.length * STEP;
  const repeats = useMemo(
    () => Math.max(3, Math.ceil((viewportW * 2) / totalWidth) + 2),
    [viewportW, totalWidth]
  );

  const displayItems = useMemo(
    () => Array.from({ length: repeats }, () => products).flat(),
    [products, repeats]
  );

  // ─── Track container width ───
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setViewportW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ─── Store item refs ───
  const setItemRef = useCallback(
    (el: HTMLElement | null, idx: number) => {
      if (el) itemElsRef.current[idx] = el;
    },
    []
  );

  // ─── Animation loop ───
  useEffect(() => {
    if (viewportW === 0 || products.length === 0) return;

    let running = true;
    const items = itemElsRef.current;
    const cx = viewportW / 2;

    const tick = () => {
      if (!running) return;
      offsetRef.current -= SPEED;

      // Wrap offset for seamless loop
      if (Math.abs(offsetRef.current) >= totalWidth) {
        offsetRef.current += totalWidth;
      }

      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        if (!el) continue;

        const baseX = i * STEP;
        const x = baseX + offsetRef.current;

        // Normalised position: 0 = centre, -1/+1 = edges
        const nx = (x + ITEM_W / 2 - cx) / (viewportW / 2);

        // Sine wave for vertical undulation
        const waveY = Math.sin(nx * Math.PI * WAVE_FREQ) * WAVE_AMP;

        // Scale: bigger when near centre
        const scale = 0.82 + 0.18 * Math.max(0, 1 - Math.abs(nx) * 0.6);

        // Opacity: fade at edges
        const opacity = Math.max(0.08, 1 - Math.abs(nx) * 0.65);

        // Subtle rotateX for 3D depth
        const rotX = Math.sin(nx * Math.PI * WAVE_FREQ) * 6;

        el.style.transform = `translate3d(${x}px, ${waveY}px, 0) scale(${scale}) rotateX(${rotX}deg)`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(Math.round(scale * 100));
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(animationRef.current);
    };
  }, [viewportW, products.length, totalWidth, STEP, ITEM_W, ITEM_H, SPEED, WAVE_AMP, WAVE_FREQ]);

  if (products.length === 0) return null;

  const sectionH = ITEM_H + WAVE_AMP * 2 + 48;

  return (
    <section
      ref={sectionRef}
      className="py-16 lg:py-20 relative overflow-hidden"
    >
      {/* ─── Side fade masks ─── */}
      <div className="absolute inset-y-0 left-0 w-24 z-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 z-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      {/* ─── Header ─── */}
      <div className="container mx-auto px-4 relative z-10 mb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Fresh Drops
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              New Arrivals
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Fresh drops you haven&apos;t seen yet
            </p>
          </div>
          <Button variant="outline" asChild className="shrink-0">
            <Link href="/shop">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* ─── Floating cards track ─── */}
      <div
        ref={containerRef}
        className="relative w-full z-10"
        style={{ height: sectionH }}
      >
        <div
          className="absolute left-0"
          style={{
            top: `calc(50% + ${WAVE_AMP * 0.15}px)`,
            perspective: "1200px",
          }}
        >
          {displayItems.map((product, i) => (
            <Link
              key={`${product._id}-${i}`}
              ref={(el) => setItemRef(el, i)}
              href={`/product/${product.slug}`}
              className="absolute top-0 left-0 rounded-xl overflow-hidden border border-border/30 shadow-lg transition-shadow duration-300 will-change-[transform,opacity] group"
              style={{
                width: ITEM_W,
                height: ITEM_H,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes={`${ITEM_W}px`}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Badge */}
                {product.isNew && (
                  <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-lg">
                    New
                  </span>
                )}

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <p className="text-white font-medium text-xs md:text-sm leading-tight truncate drop-shadow-sm">
                    {product.name}
                  </p>
                  <p className="text-white/90 font-bold text-sm md:text-base drop-shadow-sm">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <svg
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-white/80 text-[10px] md:text-xs drop-shadow-sm">
                      {product.rating}
                    </span>
                  </div>
                </div>

                {/* Shimmer hover overlay */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
