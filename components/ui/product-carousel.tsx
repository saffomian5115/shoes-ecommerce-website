"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  children: React.ReactNode[];
  autoSlideInterval?: number;
  className?: string;
  itemsPerView?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  showArrows?: boolean;
  showDots?: boolean;
}

function getSafeNumber(val: number | undefined, fallback: number): number {
  return typeof val === "number" && val > 0 ? val : fallback;
}

export function ProductCarousel({
  children,
  autoSlideInterval = 3000,
  className,
  itemsPerView = { mobile: 1.2, tablet: 2.2, desktop: 4 },
  showArrows = true,
  showDots = true,
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Responsive items per view
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 640) setItemsToShow(getSafeNumber(itemsPerView.mobile, 1.2));
      else if (width < 1024) setItemsToShow(getSafeNumber(itemsPerView.tablet, 2.2));
      else setItemsToShow(getSafeNumber(itemsPerView.desktop, 4));
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [itemsPerView]);

  const itemsCeil = Math.ceil(itemsToShow);
  const maxIndex = Math.max(0, children.length - itemsCeil);

  // Clamp index when items change or resize
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const next = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => {
      return prev >= maxIndex ? 0 : prev + 1;
    });
    setTimeout(() => setIsAnimating(false), 400);
  }, [maxIndex, isAnimating]);

  const prev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIdx) => {
      return prevIdx <= 0 ? maxIndex : prevIdx - 1;
    });
    setTimeout(() => setIsAnimating(false), 400);
  }, [maxIndex, isAnimating]);

  // Auto-slide
  useEffect(() => {
    if (autoSlideInterval <= 0 || isPaused || children.length <= itemsCeil) return;
    const interval = setInterval(next, autoSlideInterval);
    return () => clearInterval(interval);
  }, [autoSlideInterval, isPaused, next, children.length, itemsCeil]);

  const totalDots = Math.max(1, maxIndex + 1);
  const activeDot = Math.min(currentIndex, totalDots - 1);

  if (!children.length) return null;

  return (
    <div
      className={cn("relative group", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={containerRef}
    >
      {/* Track */}
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
            gap: "1rem",
          }}
        >
          {children.map((child, idx) => (
            <div
              key={idx}
              className="shrink-0"
              style={{ width: `calc(${100 / itemsToShow}% - ${0.75 / itemsToShow}rem)` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {showArrows && children.length > itemsCeil && (
        <>
          <button
            onClick={prev}
            disabled={isAnimating}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 shadow-lg border border-border/50 text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background hover:shadow-xl disabled:opacity-30"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            disabled={isAnimating}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 shadow-lg border border-border/50 text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background hover:shadow-xl disabled:opacity-30"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && totalDots > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {Array.from({ length: totalDots }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentIndex(idx);
                  setTimeout(() => setIsAnimating(false), 400);
                }
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                idx === activeDot
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
