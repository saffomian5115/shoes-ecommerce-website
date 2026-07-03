"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Heart,
  Star,
  Minus,
  Plus,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  ZoomIn,
  X,
  Package,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { ProductCarousel } from "@/components/ui/product-carousel";
import { fetchProductBySlug, fetchProducts } from "@/lib/api";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const sizeGuide = ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12", "US 13"];

const reviewsPlaceholder = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/80?img=1",
    rating: 5,
    date: "2 weeks ago",
    verified: true,
    size: "US 9",
    color: "Black",
    comment:
      "Absolutely love these shoes! They're incredibly comfortable right out of the box. The cushioning is perfect for my daily runs. Highly recommend!",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/80?img=3",
    rating: 4,
    date: "1 month ago",
    verified: true,
    size: "US 10",
    color: "White",
    comment:
      "Great quality shoes. The fit is true to size and they look even better in person. Only giving 4 stars because I wish there were more color options available.",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    avatar: "https://i.pravatar.cc/80?img=5",
    rating: 5,
    date: "1 month ago",
    verified: true,
    size: "US 8",
    color: "Red",
    comment:
      "Been wearing these for a month now and they still look brand new. The comfort level is unmatched. Best purchase I've made this year!",
  },
];

const trustFeatures = [
  { icon: Truck, label: "Free shipping on orders over $100" },
  { icon: RotateCcw, label: "30-day easy returns" },
  { icon: ShieldCheck, label: "Secure checkout" },
  { icon: Package, label: "Ships within 24 hours" },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Selection state
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const { addItem, toggleWishlist, isInWishlist } = useCartStore();
  const inWishlist = product ? isInWishlist(product._id) : false;

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Fetch product
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);

    Promise.all([fetchProductBySlug(slug), fetchProducts()])
      .then(([prod, allProducts]) => {
        if (!prod) {
          setError(true);
          setLoading(false);
          return;
        }
        setProduct(prod);
        setSelectedSize(prod.sizes[0] || "");
        setSelectedColor(prod.colors[0]?.name || "");
        setSelectedImageIndex(0);

        // Related products: same category, exclude current
        const related = allProducts
          .filter((p) => p.category === prod.category && p._id !== prod._id)
          .slice(0, 4);
        setRelatedProducts(related);

        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  function handleAddToCart() {
    if (!product) return;
    addItem(product, quantity, selectedSize, selectedColor);
  }

  // Escape key handler for modals
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setLightboxOpen(false);
      setSizeGuideOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function handleQuantityChange(delta: number) {
    setQuantity((prev) => Math.max(1, Math.min(99, prev + delta)));
  }

  // ─── Loading State ───
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square rounded-xl bg-muted animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            <div className="h-24 w-full bg-muted rounded animate-pulse" />
            <div className="h-10 w-full bg-muted rounded animate-pulse" />
            <div className="h-10 w-full bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // ─── Error / Not Found ───
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
          <h1 className="text-2xl font-bold tracking-tight mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Sorry, we couldn&apos;t find the product you&apos;re looking for. It may have been removed or the link might be incorrect.
          </p>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images;
  const avgRating = product.rating;
  const totalReviews = product.reviewCount;

  return (
    <>
      {/* ─── BREADCRUMBS ─── */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/shop" className="hover:text-foreground transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>
      </div>

      {/* ─── MAIN PRODUCT SECTION ─── */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ── LEFT: Image Gallery ── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted group">
              <Image
                src={images[selectedImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* Zoom hint */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background shadow-lg"
                aria-label="Zoom image"
              >
                <ZoomIn className="h-4 w-4" />
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-primary text-primary-foreground text-xs px-3 py-1">
                    New Arrival
                  </Badge>
                )}
                {discount > 0 && (
                  <Badge variant="destructive" className="text-xs px-3 py-1">
                    -{discount}% Off
                  </Badge>
                )}
              </div>

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev <= 0 ? images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev >= images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background shadow-lg"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={cn(
                      "relative h-20 w-20 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0",
                      idx === selectedImageIndex
                        ? "border-primary ring-1 ring-primary"
                        : "border-border hover:border-foreground/30"
                    )}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="flex flex-col">
            {/* Category & Stock */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {product.category}
              </span>
              {product.inStock ? (
                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400" />
                  In Stock
                </span>
              ) : (
                <span className="text-xs text-destructive font-medium">Out of Stock</span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.round(avgRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/20"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({totalReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  Save {discount}%
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">
                  Size{" "}
                  {selectedSize && (
                    <span className="text-primary font-medium">— {selectedSize}</span>
                  )}
                </h3>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs text-primary hover:underline"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizeGuide.map((size) => {
                  const isAvailable = product.sizes.includes(size);
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={cn(
                        "h-10 min-w-[3.5rem] px-3 rounded-lg text-sm font-medium border transition-all duration-200",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : isAvailable
                          ? "border-border text-foreground hover:border-foreground/40 hover:bg-muted/50"
                          : "border-border/40 text-muted-foreground/40 line-through cursor-not-allowed bg-muted/20"
                      )}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Selector */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-3">
                Color{" "}
                {selectedColor && (
                  <span className="text-primary font-medium">— {selectedColor}</span>
                )}
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        "group relative flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs transition-all duration-200",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-foreground/30"
                      )}
                    >
                      <span
                        className={cn(
                          "h-5 w-5 rounded-full border-2 transition-all duration-200",
                          isSelected ? "border-primary scale-110" : "border-border"
                        )}
                        style={{ backgroundColor: color.hex }}
                      />
                      <span
                        className={cn(
                          isSelected ? "text-foreground font-medium" : "text-muted-foreground"
                        )}
                      >
                        {color.name}
                      </span>
                      {isSelected && (
                        <Check className="h-3 w-3 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              {/* Quantity */}
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="flex h-12 w-12 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-l-lg disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-12 w-12 items-center justify-center text-sm font-medium border-x border-border">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 99}
                  className="flex h-12 w-12 items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-r-lg disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                size="lg"
                className="flex-1 h-12 text-base"
                disabled={!product.inStock || !selectedSize || !selectedColor}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product._id)}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg border transition-all duration-200",
                  inWishlist
                    ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
                    : "border-border hover:border-foreground/30 hover:bg-muted/50"
                )}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors",
                    inWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground"
                  )}
                />
              </button>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
              {trustFeatures.map((feature) => (
                <div key={feature.label} className="flex items-center gap-2.5">
                  <feature.icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs text-muted-foreground">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── DESCRIPTION / REVIEWS TABS ─── */}
      <div className="border-t border-border/40 bg-muted/10">
        <div className="container mx-auto px-4 py-12">
          {/* Tab Buttons */}
          <div className="flex border-b border-border/40 mb-8">
            <button
              onClick={() => setActiveTab("description")}
              className={cn(
                "pb-3 px-1 text-sm font-medium transition-colors relative",
                activeTab === "description"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Description
              {activeTab === "description" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={cn(
                "pb-3 px-4 text-sm font-medium transition-colors relative",
                activeTab === "reviews"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Reviews ({totalReviews})
              {activeTab === "reviews" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "description" ? (
            <div className="max-w-3xl">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                <h4 className="text-sm font-semibold mt-6 mb-3">Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    Premium quality materials for lasting durability
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    Responsive cushioning for all-day comfort
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    Breathable upper for temperature regulation
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    Durable outsole with superior grip
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    Lightweight construction for easy movement
                  </li>
                </ul>
                <h4 className="text-sm font-semibold mt-6 mb-3">Care Instructions</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    Spot clean with mild soap and water
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    Air dry at room temperature
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    Avoid machine washing and direct sunlight
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl space-y-6">
              {/* Review summary */}
              <div className="flex items-center gap-6 p-4 rounded-xl bg-muted/20 border border-border/40">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{avgRating.toFixed(1)}</div>
                  <div className="flex mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < Math.round(avgRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/20"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{totalReviews} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const percentage =
                      star === 5
                        ? 70
                        : star === 4
                        ? 20
                        : star === 3
                        ? 7
                        : star === 2
                        ? 2
                        : 1;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-muted-foreground">{star}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-yellow-400"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-6 text-right text-muted-foreground">
                          {percentage}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review cards */}
              {reviewsPlaceholder.map((review) => (
                <div
                  key={review.id}
                  className="p-5 rounded-xl border border-border/40 bg-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{review.name}</p>
                          {review.verified && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10">
                              <Check className="h-2.5 w-2.5 text-primary" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{review.date}</span>
                          <span>•</span>
                          <span>Size: {review.size}</span>
                          <span>•</span>
                          <span>Color: {review.color}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3.5 w-3.5",
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/20"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}

              <div className="text-center pt-4">
                <Button variant="outline">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Write a Review
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── RELATED PRODUCTS ─── */}
      {relatedProducts.length > 0 && (
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    You May Also Like
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Related Products</h2>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/shop?category=${product.category}`}>
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <ProductCarousel
              autoSlideInterval={5000}
              itemsPerView={{ mobile: 1.2, tablet: 2.2, desktop: 4 }}
              showDots={true}
            >
              {relatedProducts.map((p) => (
                <div key={p._id} className="h-full">
                  <ProductCard product={p} />
                </div>
              ))}
            </ProductCarousel>
          </div>
        </section>
      )}

      {/* ─── LIGHTBOX ─── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) =>
                prev <= 0 ? images.length - 1 : prev - 1
              );
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div
            className="relative max-w-3xl max-h-[85vh] w-full mx-4 aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedImageIndex] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 75vw"
              priority
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) =>
                prev >= images.length - 1 ? 0 : prev + 1
              );
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Thumbnails in lightbox */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(idx);
                }}
                className={cn(
                  "relative h-14 w-14 rounded-lg overflow-hidden border-2 transition-all",
                  idx === selectedImageIndex
                    ? "border-white ring-1 ring-white"
                    : "border-white/30 hover:border-white/60"
                )}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`View ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── SIZE GUIDE MODAL ─── */}
      {sizeGuideOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSizeGuideOpen(false);
          }}
        >
          <div className="bg-background rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Size Guide</h3>
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close size guide"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-medium">US Size</th>
                    <th className="text-left py-2 px-4 font-medium">EU Size</th>
                    <th className="text-left py-2 pl-4 font-medium">UK Size</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { us: "US 7", eu: "40", uk: "6.5" },
                    { us: "US 8", eu: "41", uk: "7.5" },
                    { us: "US 9", eu: "42.5", uk: "8.5" },
                    { us: "US 10", eu: "44", uk: "9.5" },
                    { us: "US 11", eu: "45", uk: "10.5" },
                    { us: "US 12", eu: "46.5", uk: "11.5" },
                    { us: "US 13", eu: "48", uk: "12.5" },
                  ].map((row) => (
                    <tr key={row.us} className="border-b border-border/40 last:border-0">
                      <td className="py-2.5 pr-4 font-medium">{row.us}</td>
                      <td className="py-2.5 px-4 text-muted-foreground">{row.eu}</td>
                      <td className="py-2.5 pl-4 text-muted-foreground">{row.uk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Fit may vary by style. If you&apos;re between sizes, we recommend going up a size.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
