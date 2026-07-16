"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  ArrowRight,
  Star,
  Flame,
  Zap,
  Sparkles,
  Mail,
  Check,
  X,
  ChevronRight,
  TrendingUp,
  Award,
  Gem,
  User,
  UserRound,
  Baby,
  Trophy,
  Briefcase,
  Shirt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { ProductCarousel } from "@/components/ui/product-carousel";
import { FloatingNewArrivals } from "@/components/ui/floating-new-arrivals";
import { AnimatedHero } from "@/components/hero/AnimatedHero";
import { BrandShowcase } from "@/components/ui/brand-showcase";
import { ProductShowcase } from "@/components/ui/ProductShowcase";
import { PromotionalBanner } from "@/components/ui/promotional-banner";
import { testimonials, categories, categoryIcons } from "@/lib/placeholder-data";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";

// ─── Category Icon Mapper ───
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  User, UserRound, Baby, Trophy, Briefcase, Shirt,
};

function CategoryIcon({ iconName, className }: { iconName: string; className?: string }) {
  const Icon = iconMap[iconName];
  return Icon ? <Icon className={className} /> : null;
}

// ─── Badge System for Best Sellers ───
const bestSellerBadges = [
  { label: "#1 Bestseller", variant: "default" as const, icon: Award, condition: (p: Product, idx: number) => idx === 0 },
  { label: "Top Rated", variant: "secondary" as const, icon: Star, condition: (p: Product) => p.rating >= 4.8 && p.reviewCount > 100 },
  { label: "Trending", variant: "destructive" as const, icon: TrendingUp, condition: (p: Product) => p.rating >= 4.5 && p.isNew },
  { label: "Editor's Pick", variant: "outline" as const, icon: Gem, condition: (p: Product) => p.rating >= 4.7 },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Newsletter state
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState("");

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

  // Sort products with best sellers first (for badge system)
  const sortedProducts = [...products].sort((a, b) => {
    if (a.isBestSeller && !b.isBestSeller) return -1;
    if (!a.isBestSeller && b.isBestSeller) return 1;
    return (b.rating ?? 0) - (a.rating ?? 0);
  });

  const bestSellers = sortedProducts.filter((p) => p.isBestSeller);
  const newArrivals = products.filter((p) => p.isNew);

  // Get the badge for a product based on its index/position
  function getProductBadge(product: Product, idx: number) {
    for (const badge of bestSellerBadges) {
      if (badge.condition(product, idx)) {
        return badge;
      }
    }
    return null;
  }

  // Newsletter handler
  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      setEmailStatus("error");
      return;
    }
    setEmailStatus("success");
    setEmailError("");
    setEmail("");
  }

  return (
    <>
      {/* ─── TOP SALE BANNER ─── */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground">
        <div className="container mx-auto flex items-center justify-center px-4 py-2 text-xs sm:text-sm gap-2">
          <Flame className="h-4 w-4 animate-pulse" />
          <span className="font-semibold">Summer Sale — Up to 50% Off</span>
          <span className="opacity-90 hidden xs:inline">
            | Use code:{" "}
            <span className="font-semibold underline underline-offset-2">SUM50</span>
          </span>
          <Zap className="h-3.5 w-3.5 hidden xs:inline" />
        </div>
      </div>

      {/* ─── 1. HERO SECTION ─── */}
      <AnimatedHero />

      {/* ─── 2. CATEGORY GRID ─── */}
      <ScrollReveal>
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Collections</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Shop by Category</h2>
              <p className="text-muted-foreground mt-1">Find exactly what you need</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/shop">
                View All Categories
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const catStyle = categoryIcons[cat.name] || { iconName: "Shirt", color: "#F8FAFC", hoverColor: "#64748B" };
              return (
                <StaggerItem key={cat.name}>
                <Link
                  href={"/shop?category=" + cat.slug}
                  className="group relative flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg overflow-hidden"
                  style={{ "--hover-color": catStyle.hoverColor } as React.CSSProperties}
                >
                  {/* Hover background */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                    style={{ backgroundColor: catStyle.hoverColor }}
                  />
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center">
                    <CategoryIcon
                      iconName={catStyle.iconName}
                      className="h-8 w-8 sm:h-10 sm:w-10 mb-2 text-foreground/60 transition-transform duration-300 group-hover:scale-110 group-hover:text-white"
                    />
                    <span className="text-sm font-medium group-hover:text-white transition-colors duration-300">
                      {cat.name} Shoes
                    </span>
                    <span className="text-xs text-muted-foreground group-hover:text-white/80 transition-colors duration-300 mt-0.5">
                      {cat.count}+ Products
                    </span>
                  </div>
                  {/* Arrow on hover */}
                  <div className="relative z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </div>
                </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          <div className="text-center mt-6 sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/shop">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ─── 4. BEST SELLERS ─── */}
      <ScrollReveal>
      <section className="py-16 lg:py-20 bg-muted/20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Popular</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Best Sellers</h2>
              <p className="text-muted-foreground mt-1">Hover over a card to see details — click to explore</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/shop">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            </div>
          ) : error ? (
            <p className="text-center text-muted-foreground py-8">Failed to load products.</p>
          ) : bestSellers.length > 0 ? (
            <ProductShowcase
              items={bestSellers.map((p, idx) => ({
                slug: p.slug,
                image: p.images[0],
                name: p.name,
                price: p.price,
                rating: p.rating,
                reviewCount: p.reviewCount,
                badge: getProductBadge(p, idx),
              }))}
            />
          ) : (
            <p className="text-center text-muted-foreground py-8">No best sellers available.</p>
          )}
        </div>
      </section>
      </ScrollReveal>

      {/* ─── 5. BRAND SHOWCASE ─── */}
      <ScrollReveal>
      <BrandShowcase />
      </ScrollReveal>

      {/* ─── 6. PROMOTIONAL BANNER ─── */}
      <ScrollReveal>
      <PromotionalBanner />
      </ScrollReveal>

      {/* ─── 3. NEW ARRIVALS FLOATING SCROLL ─── */}
      {loading ? (
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Fresh Drops</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">New Arrivals</h2>
                <p className="text-muted-foreground mt-1">Fresh drops you haven&apos;t seen yet</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/shop">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          </div>
        </section>
      ) : error ? (
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-center text-muted-foreground py-8">Failed to load products.</p>
          </div>
        </section>
      ) : (
        <FloatingNewArrivals products={newArrivals} />
      )}

      {/* ─── 7. CUSTOMER TESTIMONIALS ─── */}
      <ScrollReveal>
      <section className="py-16 lg:py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Testimonials</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What Our Customers Say</h2>
            <p className="text-muted-foreground mt-1">Real reviews from real people</p>
          </div>

          {/* Testimonial Carousel */}
          <div className="max-w-5xl mx-auto">
            <ProductCarousel
              autoSlideInterval={5000}
              itemsPerView={{ mobile: 1, tablet: 1.5, desktop: 2.5 }}
              showDots={true}
            >
              {testimonials.map((t, idx) => (
                <div key={idx} className="h-full">
                  <div className="rounded-xl border border-border/50 bg-card p-6 sm:p-8 flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"
                          )}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                      &ldquo;{t.comment}&rdquo;
                    </p>

                    {/* Divider */}
                    <div className="border-t border-border/40 my-4" />

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden ring-2 ring-border/50">
                        <Image
                          src={t.avatar}
                          alt={t.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{t.name}</p>
                          {t.verified && (
                            <span className="shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary/10">
                              <Check className="h-2.5 w-2.5 text-primary" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{t.location}</span>
                          <span>•</span>
                          <span>{t.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ProductCarousel>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* ─── 8. NEWSLETTER ─── */}
      <ScrollReveal>
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-8 md:p-12 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-primary/5" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-tr-full bg-primary/5" />

            <div className="relative z-10 max-w-lg mx-auto">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                Join Our Newsletter
              </h2>
              <p className="text-muted-foreground mb-2">
                Subscribe and get{" "}
                <span className="font-bold text-primary">10% OFF</span> on your first order!
              </p>
              <p className="text-xs text-muted-foreground/70 mb-6">
                Plus exclusive updates on new arrivals and deals
              </p>

              {emailStatus === "success" ? (
                <div className="flex items-center justify-center gap-2 py-4 text-green-600 dark:text-green-400">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Thanks for subscribing! Check your email for your 10% OFF code.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailStatus === "error") setEmailStatus("idle");
                      }}
                      placeholder="Enter your email"
                      className={cn(
                        "flex h-12 w-full rounded-lg border bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        emailStatus === "error"
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-input"
                      )}
                    />
                    {emailStatus === "error" && (
                      <div className="absolute -bottom-5 left-0 flex items-center gap-1 text-xs text-red-500">
                        <X className="h-3 w-3" />
                        <span>{emailError}</span>
                      </div>
                    )}
                  </div>
                  <Button type="submit" size="lg" className="h-12 px-8 shrink-0">
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}

              <p className="text-xs text-muted-foreground/60 mt-6 flex items-center justify-center gap-1.5">
                <Check className="h-3 w-3" />
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>
    </>
  );
}
