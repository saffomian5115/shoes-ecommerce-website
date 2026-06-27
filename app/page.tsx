"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, Truck, ShieldCheck, RotateCcw, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { testimonials } from "@/lib/placeholder-data";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/types";

const features = [
  { icon: Truck, title: "Free Shipping", description: "On orders over $100" },
  { icon: ShieldCheck, title: "Secure Checkout", description: "100% secure payments" },
  { icon: RotateCcw, title: "Easy Returns", description: "30-day return policy" },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const featuredProducts = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <>
      {/* ─── SALE BANNER ─── */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground">
        <div className="container mx-auto flex items-center justify-center px-4 py-2 text-xs sm:text-sm gap-2">
          <Flame className="h-4 w-4 animate-pulse" />
          <span className="font-semibold">Summer Sale — Up to 40% Off</span>
          <span className="opacity-90 hidden xs:inline">
            | Use code:{" "}
            <span className="font-semibold underline underline-offset-2">SUM40</span>
          </span>
          <Zap className="h-3.5 w-3.5 hidden xs:inline" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center min-h-[80vh] py-16 lg:py-0">
            <div className="flex-1 space-y-6 lg:pr-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                New Collection 2026
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Step Into <span className="text-primary">Comfort</span>
                <br />
                Walk With <span className="text-primary">Style</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Discover premium footwear crafted for every journey. From running tracks to city streets — find your perfect fit.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button size="lg" asChild className="group">
                  <Link href="/shop">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/shop?category=running">View Running</Link>
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.8</span>
                    <span className="text-muted-foreground">(1,200+ reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 mt-12 lg:mt-0 relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl" />
                <div className="relative h-full w-full flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
                    alt="Featured shoe"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-y border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Best Sellers</h2>
              <p className="text-muted-foreground mt-1">Most popular choices this season</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/shop">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
              : error
              ? <p className="col-span-full text-center text-muted-foreground py-8">Failed to load products.</p>
              : featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
            <p className="text-muted-foreground mt-1">Find exactly what you need</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Running", emoji: "\u{1F3C3}" },
              { name: "Casual", emoji: "\u{1F45F}" },
              { name: "Sports", emoji: "\u26BD" },
              { name: "Sneakers", emoji: "\u{1F45E}" },
              { name: "Formal", emoji: "\u{1F4BC}" },
              { name: "Training", emoji: "\u{1F4AA}" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={"/shop?category=" + cat.name.toLowerCase()}
                className="group flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-md hover:-translate-y-1"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-sm font-medium group-hover:text-primary transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
              <p className="text-muted-foreground mt-1">Fresh drops you haven&apos;t seen yet</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/shop">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
              : error
              ? <p className="col-span-full text-center text-muted-foreground py-8">Failed to load products.</p>
              : newArrivals.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">What Our Customers Say</h2>
              <p className="text-muted-foreground mt-1">Real reviews from real people</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="rounded-xl border border-border/50 bg-card p-6 flex flex-col">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="text-sm font-medium mt-4">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Stay in the Loop</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Subscribe to get notified about new arrivals, exclusive deals, and style inspiration.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-12 rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
              />
              <Button size="lg" className="h-12">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
