"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Heart,
  ShoppingBag,
  User,
  X,
  ArrowRight,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: string;
}

interface SearchResult {
  products: SearchProduct[];
  suggestions: string[];
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
  isSearch?: boolean;
  badge?: "cart" | "wishlist";
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search, isSearch: true },
  { href: "/wishlist", label: "Wishlist", icon: Heart, badge: "wishlist" },
  { href: "/cart", label: "Cart", icon: ShoppingBag, badge: "cart" },
  { href: "/account", label: "Account", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const wishlistCount = useCartStore((state) => state.wishlist.length);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  // Close on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setQuery("");
        setResults(null);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [searchOpen]);

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults(null);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (query.length >= 2) {
      debounceTimer.current = setTimeout(() => fetchResults(query), 300);
    } else {
      setResults(null);
    }
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, fetchResults]);

  const hasResults =
    results && (results.products.length > 0 || results.suggestions.length > 0);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <div className="flex items-center justify-around h-14 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const badgeCount =
              item.badge === "cart"
                ? totalItems
                : item.badge === "wishlist"
                  ? wishlistCount
                  : 0;

            // Search item renders as a button to open the overlay
            if (item.isSearch) {
              return (
                <button
                  key={item.href}
                  onClick={() => setSearchOpen(true)}
                  className={cn(
                    "relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors",
                    "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }

            // Other items render as Links
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {badgeCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-medium text-primary-foreground">
                      {badgeCount > 9 ? "9+" : badgeCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Full-screen Search Overlay (Mobile) */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-background lg:hidden">
          {/* Search Header */}
          <div className="flex items-center gap-2 p-3 border-b border-border/40">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search shoes, brands, categories..."
                className="h-11 pl-10 pr-4 rounded-full border-primary/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
            <button
              onClick={() => {
                setSearchOpen(false);
                setQuery("");
                setResults(null);
              }}
              className="shrink-0 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto">
            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            )}

            {/* Suggestions */}
            {!isLoading && results && results.suggestions.length > 0 && (
              <div className="p-4 border-b border-border/40">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-3">
                  <TrendingUp className="h-3 w-3" />
                  AI Suggestions
                </div>
                <div className="flex flex-wrap gap-2">
                  {results.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(suggestion)}
                      className="rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Results */}
            {!isLoading && results && results.products.length > 0 && (
              <div className="p-3">
                <p className="px-2 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Products ({results.products.length})
                </p>
                <div className="space-y-1">
                  {results.products.map((product) => (
                    <Link
                      key={product._id}
                      href={`/product/${product.slug}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setQuery("");
                        setResults(null);
                      }}
                      className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="h-14 w-14 shrink-0 rounded-md bg-muted overflow-hidden">
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.category}
                        </p>
                        <p className="text-sm font-semibold mt-0.5">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!isLoading && query.length >= 2 && results && results.products.length === 0 && (
              <div className="p-8 text-center">
                <Search className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Try different keywords or browse categories
                </p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link
                    href="/shop"
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery("");
                      setResults(null);
                    }}
                  >
                    Browse All Products
                  </Link>
                </Button>
              </div>
            )}

            {/* Initial state */}
            {!isLoading && query.length < 2 && (
              <div className="p-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Popular Categories
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Running", slug: "running", emoji: "🏃" },
                    { name: "Casual", slug: "casual", emoji: "👟" },
                    { name: "Sports", slug: "sports", emoji: "⚽" },
                    { name: "Sneakers", slug: "sneakers", emoji: "👟" },
                    { name: "Formal", slug: "formal", emoji: "👔" },
                    { name: "Sale", slug: "sale", emoji: "🔥" },
                  ].map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setQuery("");
                        setResults(null);
                      }}
                      className="flex items-center gap-3 rounded-xl border border-border/40 p-4 transition-colors hover:bg-muted/50 hover:border-border"
                    >
                      <span className="text-2xl">{cat.emoji}</span>
                      <span className="text-sm font-medium">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
