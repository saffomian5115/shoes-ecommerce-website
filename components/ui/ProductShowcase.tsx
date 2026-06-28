"use client";

import { useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState(Math.min(2, Math.floor(items.length / 2)));

  const toPrev = () => setActiveIndex((prev) => Math.max(0, prev - 1));
  const toNext = () => setActiveIndex((prev) => Math.min(items.length - 1, prev + 1));
  const toSlide = (index: number) => setActiveIndex(index);

  const totalItems = items.length;
  // percentage each slide takes in the flex container
  const slideWidthPct = 100 / totalItems;

  return (
    <div className="select-none w-full max-w-5xl mx-auto">
      {/* ─── Carousel wrapper ─── */}
      <div className="overflow-hidden py-8">
        {/* Slides container */}
        <motion.div
          className="flex w-fit"
          animate={{ x: `${-activeIndex * slideWidthPct}%` }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
        >
          {items.map((item, i) => {
            const isActive = activeIndex === i;
            // rotation angle based on distance from active
            const rotateY = (activeIndex - i) * 55;

            return (
              <div key={i} className="w-[140px] md:w-[260px] shrink-0 px-2 md:px-3" style={{ perspective: "1200px" }}>
                <motion.div
                  className="w-full aspect-[3/4] flex flex-col items-center gap-2 md:gap-3 will-change-[transform,scale]"
                  animate={{
                    rotateY,
                    scale: isActive ? 1 : 0.82,
                  }}
                  transition={{ type: "spring", bounce: 0.1, duration: 1 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Card image — clickable */}
                  <Link
                    href={`/shop/${item.slug}`}
                    className="relative block w-full h-full rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                    onClick={() => toSlide(i)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Badge */}
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

                    {/* Gradient overlay + product info on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4">
                      <p className="text-white font-bold text-xs md:text-sm leading-tight">{item.name}</p>
                      <p className="text-white/90 font-semibold text-sm md:text-base">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-white/80 text-[10px] md:text-xs">
                          {item.rating} ({item.reviewCount})
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Title below card */}
                  <motion.p
                    className="text-[10px] md:text-sm font-medium text-center whitespace-nowrap will-change-[opacity,filter] px-1"
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
        {/* Prev button */}
        <button
          onClick={toPrev}
          disabled={activeIndex === 0}
          className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => toSlide(i)}
              className={`rounded-full cursor-pointer h-2 transition-all duration-300 ${
                activeIndex === i
                  ? "w-7 bg-primary"
                  : "w-2 bg-primary/30 hover:bg-primary/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={toNext}
          disabled={activeIndex === items.length - 1}
          className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
}
