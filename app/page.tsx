"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Flame,
  Zap,
  HeadphonesIcon,
  Sparkles,
  ShoppingBag,
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
import { ProductCard } from "@/components/product/ProductCard";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { ProductCarousel } from "@/components/ui/product-carousel";
import { BrandShowcase } from "@/components/ui/brand-showcase";
import { ProductShowcase } from "@/components/ui/ProductShowcase";
import { PromotionalBanner } from "@/components/ui/promotional-banner";
import { testimonials, categories, categoryIcons } from "@/lib/placeholder-data";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

// ─── Category Icon Mapper ───
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  User, UserRound, Baby, Trophy, Briefcase, Shirt,
};

function CategoryIcon({ iconName, className }: { iconName: string; className?: string }) {
  const Icon = iconMap[iconName];
  return Icon ? <Icon className={className} /> : null;
}

// ─── Why Choose Us Features ───
const whyChooseUs = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Worldwide delivery in 3-5 business days on all orders over $100",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day money-back guarantee with free return shipping",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    icon: Gem,
    title: "Authentic Products",
    description: "100% genuine, brand-warranty included with every purchase",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Live chat and email support ready to help you anytime",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
];

// ─── Hero Trust Badges ───
const trustBadges = [
  { icon: Truck, label: "Free Shipping Worldwide" },
  { icon: RotateCcw, label: "30-Day Easy Returns" },
  { icon: ShieldCheck, label: "Secure Payment" },
  { icon: Check, label: "100% Authentic" },
];

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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center min-h-[85vh] py-16 lg:py-0">
            {/* Left Content */}
            <div className="flex-1 space-y-6 lg:pr-12 relative z-10">
              {/* New Collection Chip */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary animate-in fade-in slide-in-from-bottom-2 duration-500">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                New Collection 2026
              </div>

              {/* Headline */}
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                  Step Into{" "}
                  <span className="text-primary">Style</span>
                  <br />
                  <span className="text-muted-foreground/50">Walk With</span>{" "}
                  <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    Comfort
                  </span>
                </h1>
              </div>

              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                Discover premium footwear crafted for every journey. From running tracks to city streets — find your perfect fit.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <Button size="lg" asChild className="group h-12 px-8 text-base shadow-lg hover:shadow-primary/25 transition-all duration-300">
                  <Link href="/shop">
                    Shop Now
                    <ShoppingBag className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base group">
                  <Link href="/shop?category=running">
                    Explore Collection
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-4 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                {trustBadges.map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <badge.icon className="h-4 w-4 text-primary shrink-0" />
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 pt-2 animate-in fade-in duration-700 delay-700">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xs font-medium text-primary"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.8</span>
                    <span className="text-muted-foreground">(12,000+ reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Hero Image with Floating Badge */}
            <div className="flex-1 mt-12 lg:mt-0 relative">
              <div className="relative max-w-2xl mx-auto overflow-hidden">
                {/* Glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl animate-pulse scale-110" />
                {/* Shoe Image — large & dramatic */}
                <div className="relative h-full w-full flex items-center justify-center animate-in zoom-in duration-700 delay-300">
                  <img
                    src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1000&q=80"
                    alt="Featured shoe"
                    className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 scale-110 sm:scale-125 lg:scale-150"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                </div>

                {/* Floating Discount Badge */}
                <div className="absolute top-4 right-4 lg:top-8 lg:right-8 animate-float">
                  <div className="flex h-24 w-24 lg:h-28 lg:w-28 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-xl">
                    <div className="text-center">
                      <span className="block text-xl lg:text-2xl font-bold text-white leading-tight">40%</span>
                      <span className="block text-xs font-semibold text-white/90">OFF</span>
                    </div>
                  </div>
                </div>

                {/* Floating Review Badge */}
                <div className="absolute -bottom-4 left-2 lg:-bottom-6 lg:left-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000">
                  <div className="flex items-center gap-2 rounded-xl bg-background/95 backdrop-blur-sm border border-border/50 px-4 py-2.5 shadow-lg">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs font-medium">520+ Happy Customers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. WHY CHOOSE US ─── */}
      <section className="py-12 lg:py-16 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Why Choose SoleMate?</h2>
            <p className="text-muted-foreground mt-1">We go the extra mile for your comfort</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-border"
              >
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
                    feature.bgColor
                  )}
                >
                  <feature.icon className="h-7 w-7 text-foreground" />
                </div>
                <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 2. CATEGORY GRID ─── */}
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const catStyle = categoryIcons[cat.name] || { iconName: "Shirt", color: "#F8FAFC", hoverColor: "#64748B" };
              return (
                <Link
                  key={cat.name}
                  href={"/shop?category=" + cat.slug}
                  className="group relative flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg overflow-hidden"
                  style={{ "--hover-color": catStyle.hoverColor } as React.CSSProperties}
                >
                  {/* Hover background */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                    style={{ backgroundColor: catStyle.color }}
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
              );
            })}
          </div>

          <div className="text-center mt-6 sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/shop">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── 4. BEST SELLERS ─── */}
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

      {/* ─── 5. BRAND SHOWCASE ─── */}
      <BrandShowcase />

      {/* ─── 6. PROMOTIONAL BANNER ─── */}
      <PromotionalBanner />

      {/* ─── 3. NEW ARRIVALS CAROUSEL ─── */}
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

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : error ? (
            <p className="text-center text-muted-foreground py-8">Failed to load products.</p>
          ) : (
            <ProductCarousel
              autoSlideInterval={4000}
              itemsPerView={{ mobile: 1.3, tablet: 2.3, desktop: 4 }}
            >
              {newArrivals.map((product) => (
                <div key={product._id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </ProductCarousel>
          )}
        </div>
      </section>

      {/* ─── 7. CUSTOMER TESTIMONIALS ─── */}
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
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="h-full w-full object-cover"
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

      {/* ─── 8. NEWSLETTER ─── */}
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
    </>
  );
}
