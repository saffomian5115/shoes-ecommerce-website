"use client";

import Image from "next/image";
import { brands } from "@/lib/placeholder-data";
import { Star } from "lucide-react";

export function BrandShowcase() {
  return (
    <section className="py-16 lg:py-20 border-y border-border/40 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-muted-foreground">
              Trusted by 50,000+ Happy Customers
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Brands We Love
          </h2>
          <p className="text-muted-foreground mt-1">
            Premium footwear from the world&apos;s best brands
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling track */}
          <div className="flex overflow-hidden group">
            <div className="flex animate-scroll gap-12 md:gap-16 items-center py-4 group-hover:[animation-play-state:paused]">
              {/* Double the brands for seamless loop */}
              {[...brands, ...brands].map((brand, idx) => (
                <div
                  key={`${brand.name}-${idx}`}
                  className="flex-shrink-0 flex items-center justify-center h-16 w-28 md:w-32 grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
                >
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={brand.width}
                    height={brand.height}
                    className="object-contain max-h-12 opacity-50 hover:opacity-100 transition-all duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer count */}
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-6 text-sm text-muted-foreground">
            <span>🚚 Free Shipping Worldwide</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">🔄 30-Day Easy Returns</span>
            <span className="hidden sm:inline">•</span>
            <span>✅ 100% Authentic Products</span>
          </div>
        </div>
      </div>
    </section>
  );
}
