"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2, TrendingUp, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.length >= 2) {
      debounceTimer.current = setTimeout(() => fetchResults(query), 300);
    } else {
      setResults(null);
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, fetchResults]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const hasResults =
    results &&
    (results.products.length > 0 || results.suggestions.length > 0);

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="flex items-center gap-2 rounded-full border border-input bg-background px-3 sm:px-4 py-2 text-sm text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground hover:shadow-sm w-full"
        aria-label="Open search"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Search shoes...</span>
        <span className="hidden md:inline text-xs text-muted-foreground/60 ml-auto">
          ⌘K
        </span>
      </button>
    );
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search shoes, brands, categories..."
          className="h-10 pl-10 pr-10 rounded-full border-primary/20 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          autoFocus
        />
        <button
          onClick={() => {
            setIsOpen(false);
            setQuery("");
            setResults(null);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close search"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Dropdown Results */}
      {isFocused && (isLoading || hasResults || query.length >= 2) && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => {
              setIsFocused(false);
              inputRef.current?.blur();
            }}
          />
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-xl border border-border/50 bg-popover shadow-lg ring-1 ring-foreground/5 overflow-hidden z-50 w-[calc(100vw-2rem)] sm:w-auto sm:left-0 sm:right-0 sm:translate-x-0 sm:min-w-0">
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          )}

          {/* AI Suggestions */}
          {!isLoading && results && results.suggestions.length > 0 && (
            <div className="p-3 border-b border-border/40">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                <TrendingUp className="h-3 w-3" />
                AI Suggestions
              </div>
              <div className="flex flex-wrap gap-1.5">
                {results.suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(suggestion);
                    }}
                    className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Results */}
          {!isLoading && results && results.products.length > 0 && (
            <div className="p-2">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                Products
              </p>
              {results.products.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product.slug}`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                    setResults(null);
                  }}
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/50"
                >
                  <div className="h-10 w-10 shrink-0 rounded-md bg-muted overflow-hidden relative">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.category}
                    </p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">
                    ${product.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && results && results.products.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              <p>No products found for &quot;{query}&quot;</p>
              <p className="text-xs mt-1">
                Try different keywords or browse categories
              </p>
            </div>
          )}

          {/* View all results */}
          {!isLoading && results && results.products.length > 0 && (
            <div className="border-t border-border/40 p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-xs"
                asChild
              >
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                    setResults(null);
                  }}
                >
                  View all results
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          )}
          </div>
        </>
      )}
    </div>
  );
}
