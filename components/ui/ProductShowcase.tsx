"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface ShowcaseItem {
  slug: string;
  image: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  badge?: { label: string; variant: string } | null;
}

interface ProductShowcaseProps {
  items: ShowcaseItem[];
}

export function ProductShowcase({ items }: ProductShowcaseProps) {
  // ─── Pad items to at least 8 for a full visual ───
  const MIN_ITEMS = 8;
  const paddedItems =
    items.length >= MIN_ITEMS
      ? items
      : (() => {
          const result = [...items];
          while (result.length < MIN_ITEMS) {
            result.push(...items.slice(0, MIN_ITEMS - result.length));
          }
          return result;
        })();

  const ITEM_COUNT = paddedItems.length;

  // ─── Infinite loop setup - repeat items 3x ───
  const extendedItems = [...paddedItems, ...paddedItems, ...paddedItems];
  const MIDDLE_START = ITEM_COUNT;

  const [activeIndex, setActiveIndex] = useState(MIDDLE_START);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const dragStartX = useRef(0);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef(0);

  // ─── Card width (5 visible) ───
  const CARD_GAP = 12;
  const CARD_WIDTH =
    containerWidth > 640
      ? Math.min(200, (containerWidth - CARD_GAP * 4) / 5)
      : Math.min(120, (containerWidth - CARD_GAP * 4) / 5);

  // ─── Container resize ───
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateWidth = () => setContainerWidth(el.clientWidth);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ─── X offset: center the active card ───
  const getX = useCallback(
    (index: number, drag: number = 0) => {
      if (containerWidth === 0) return 0;
      return (
        -index * (CARD_WIDTH + CARD_GAP) +
        containerWidth / 2 -
        CARD_WIDTH / 2 +
        drag
      );
    },
    [containerWidth, CARD_WIDTH, CARD_GAP]
  );

  // ─── Navigation (seamless infinite loop) ───
  const navigateTo = useCallback((target: number) => {
    setActiveIndex(target);
  }, []);

  const handlePrev = useCallback(() => {
    const next = activeIndex - 1;
    if (next < ITEM_COUNT) {
      // Teleport instantly (no animation) to the middle copy
      setSkipAnimation(true);
      setActiveIndex(next + ITEM_COUNT);
    } else {
      navigateTo(next);
    }
  }, [activeIndex, ITEM_COUNT, navigateTo]);

  const handleNext = useCallback(() => {
    const next = activeIndex + 1;
    if (next >= ITEM_COUNT * 2) {
      // Teleport instantly (no animation) to the middle copy
      setSkipAnimation(true);
      setActiveIndex(next - ITEM_COUNT);
    } else {
      navigateTo(next);
    }
  }, [activeIndex, ITEM_COUNT, navigateTo]);

  // Restore spring animation after teleport
  useEffect(() => {
    if (skipAnimation) {
      requestAnimationFrame(() => setSkipAnimation(false));
    }
  }, [skipAnimation]);

  const goToSlide = useCallback(
    (index: number) => {
      const base = index % ITEM_COUNT;
      const currentCopy = Math.floor(activeIndex / ITEM_COUNT);
      navigateTo(currentCopy * ITEM_COUNT + base);
    },
    [activeIndex, ITEM_COUNT, navigateTo]
  );

  // ─── Swipe / Drag ───
  const handleDragStart = useCallback(
    (clientX: number) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      dragStartX.current = clientX;
      setDragOffset(0);
    },
    []
  );

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current) return;
    const offset = clientX - dragStartX.current;
    dragOffsetRef.current = offset;
    setDragOffset(offset);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const currentDrag = dragOffsetRef.current;
    dragOffsetRef.current = 0;
    setDragOffset(0);

    if (Math.abs(currentDrag) > 50) {
      if (currentDrag < 0) handleNext();
      else handlePrev();
    }
  }, [handleNext, handlePrev]);

  // ─── Mouse events ───
  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      handleDragMove(e.clientX);
    }
  };
  const onMouseUp = () => handleDragEnd();
  const onMouseLeave = () => {
    if (isDraggingRef.current) handleDragEnd();
  };

  // ─── Touch events ───
  const onTouchStart = (e: React.TouchEvent) =>
    handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };
  const onTouchEnd = () => handleDragEnd();

  // ─── Guard ───
  if (paddedItems.length === 0) return null;
  if (containerWidth === 0) {
    return (
      <div
        ref={containerRef}
        className="w-full max-w-5xl mx-auto h-[320px] md:h-[420px]"
      />
    );
  }

  return (
    <div className="select-none w-full max-w-5xl mx-auto">
      {/* ─── Carousel ─── */}
      <div
        ref={containerRef}
        className="overflow-hidden py-8 relative cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <motion.div
          className="flex"
          animate={{ x: getX(activeIndex, isDragging ? dragOffset : 0) }}
          transition={
            isDragging || skipAnimation
              ? { type: "tween", duration: 0 } // instant follow while dragging or teleporting
              : { type: "spring", bounce: 0.15, duration: 0.7 }
          }
          style={{ gap: CARD_GAP }}
        >
          {extendedItems.map((item, i) => {
            const dist = Math.abs(i - activeIndex);
            const isActive = i === activeIndex;
            const rotateY = dist * 55;
            const scale = isActive ? 1 : Math.max(0.75, 1 - dist * 0.07);
            const zIndex = extendedItems.length - dist;

            return (
              <div
                key={`${item.slug}-${i}`}
                className="shrink-0"
                style={{
                  width: CARD_WIDTH,
                  perspective: "1200px",
                  zIndex,
                  position: "relative",
                }}
              >
                <motion.div
                  className="w-full aspect-[3/4] flex flex-col items-center gap-2 md:gap-3 will-change-[transform,scale]"
                  animate={{ rotateY, scale }}
                  transition={{ type: "spring", bounce: 0.1, duration: 1 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Link
                    href={`/shop/${item.slug}`}
                    className="relative block w-full h-full rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      draggable={false}
                    />

                    {item.badge && (
                      <span
                        className={`absolute top-2 left-2 text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-lg ${
                          item.badge.variant === "default"
                            ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white"
                            : item.badge.variant === "secondary"
                            ? "bg-purple-600 text-white"
                            : item.badge.variant === "destructive"
                            ? "bg-red-500 text-white"
                            : "bg-white/20 backdrop-blur-sm text-white border border-white/30"
                        }`}
                      >
                        {item.badge.label}
                      </span>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4">
                      <p className="text-white font-bold text-xs md:text-sm leading-tight">
                        {item.name}
                      </p>
                      <p className="text-white/90 font-semibold text-sm md:text-base">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-white/80 text-[10px] md:text-xs">
                          {item.rating} ({item.reviewCount})
                        </span>
                      </div>
                    </div>
                  </Link>

                  <motion.p
                    className="text-[10px] md:text-sm font-medium text-center whitespace-nowrap will-change-[opacity,filter] px-1 leading-tight"
                    animate={{
                      filter: isActive ? "blur(0px)" : "blur(3px)",
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    {item.name}
                  </motion.p>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ─── Controls ─── */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <button
          onClick={handlePrev}
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-md text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <div className="flex items-center gap-2 max-w-[200px] overflow-hidden">
          {paddedItems.map((_, i) => {
            const currentBase = activeIndex % ITEM_COUNT;
            return (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`shrink-0 rounded-full cursor-pointer h-2 transition-all duration-300 ${
                  currentBase === i
                    ? "w-7 bg-primary"
                    : "w-2 bg-primary/30 hover:bg-primary/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-md text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
}
