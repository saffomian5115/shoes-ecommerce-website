"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Menu,
  X,
  Globe,
  Home,
  Grid3X3,
  LogIn,
  Phone,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { SearchBar } from "@/components/layout/SearchBar";
import { CategoryMegaMenu } from "@/components/layout/CategoryMegaMenu";
import { UserMenu } from "@/components/layout/UserMenu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MiniCart } from "@/components/layout/MiniCart";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

const currencies = [
  { label: "USD $", value: "usd" },
  { label: "EUR €", value: "eur" },
  { label: "GBP £", value: "gbp" },
  { label: "PKR Rs", value: "pkr" },
];

const languages = [
  { label: "English", value: "en", flag: "🇺🇸" },
  { label: "Urdu", value: "ur", flag: "🇵🇰" },
  { label: "Arabic", value: "ar", flag: "🇸🇦" },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [logoError, setLogoError] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);

  // Close currency dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        currencyRef.current &&
        !currencyRef.current.contains(e.target as Node)
      ) {
        setShowCurrency(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const wishlistCount = useCartStore((state) => state.wishlist.length);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ─── MAIN NAVBAR ─── */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
            {/* Left: Hamburger + Logo + Category Dropdown */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Hamburger — mobile only */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted -ml-2"
                aria-label="Menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-1.5 shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  {logoError ? (
                    <span className="text-xs font-bold">SC</span>
                  ) : (
                    <Image
                      src="/logo.png"
                      alt="SM CO."
                      width={28}
                      height={28}
                      className="object-contain"
                      onError={() => setLogoError(true)}
                    />
                  )}
                </div>
                <span className="hidden sm:inline text-lg font-bold tracking-tight">
                  SM
                </span>
                <span className="hidden sm:inline text-lg font-light tracking-tight text-primary">
                  CO.
                </span>
              </Link>

              {/* Category Dropdown + Search — grouped together */}
              <div className="hidden lg:flex items-center gap-1 ml-2">
                <CategoryMegaMenu />
                <div className="w-64 xl:w-80">
                  <SearchBar />
                </div>
              </div>

              {/* Search on mobile — show as compact */}
              <div className="flex lg:hidden flex-1 max-w-[180px] sm:max-w-[280px] ml-1">
                <SearchBar />
              </div>
            </div>

            {/* Right: Currency + Icons */}
            <div className="flex items-center justify-end gap-0.5 sm:gap-1">
              {/* Currency / Language — Desktop */}
              <div className="relative hidden sm:block" ref={currencyRef}>
                <button
                  onClick={() => setShowCurrency(!showCurrency)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
                  aria-expanded={showCurrency}
                  aria-haspopup="true"
                  aria-label="Currency & Language"
                >
                  <Globe className="h-5 w-5" />
                </button>

                {showCurrency && (
                  <div className="absolute top-full right-0 mt-1 w-44 rounded-lg border border-border/50 bg-popover p-1.5 shadow-lg ring-1 ring-foreground/5 z-50">
                    <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Currency
                    </p>
                    {currencies.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => {
                          setSelectedCurrency(c);
                          setShowCurrency(false);
                        }}
                        className={`flex w-full items-center rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-muted ${
                          selectedCurrency.value === c.value
                            ? "text-primary font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                    <div className="border-t border-border/40 my-1" />
                    <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Language
                    </p>
                    {languages.map((l) => (
                      <button
                        key={l.value}
                        onClick={() => {
                          setSelectedLanguage(l);
                          setShowCurrency(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-muted ${
                          selectedLanguage.value === l.value
                            ? "text-primary font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        <span>{l.flag}</span>
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground animate-in zoom-in-50">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Mini Cart — Desktop hover dropdown */}
              <MiniCart />

              {/* Cart — Mobile link (visible where MiniCart is hidden) */}
              <Link
                href="/cart"
                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted sm:hidden"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground animate-in zoom-in-50">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Account — Desktop only */}
              <div className="hidden sm:block">
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MOBILE HAMBURGER MENU ─── */}
      {isMenuOpen && (
        <div className="lg:hidden border-b border-border/40 bg-background max-h-[calc(100vh-4rem)] overflow-y-auto shadow-lg">
          <div className="container mx-auto px-4 py-3">
            {/* Section: Main */}
            <div className="mb-4">
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Main
              </p>
              <div className="space-y-0.5">
                {[
                  { href: "/", label: "Home", icon: Home },
                  { href: "/shop", label: "Shop All", icon: Grid3X3 },
                  {
                    href: "/wishlist",
                    label: "Wishlist",
                    icon: Heart,
                    count: wishlistCount,
                  },
                  {
                    href: "/cart",
                    label: "Cart",
                    icon: ShoppingBag,
                    count: totalItems,
                  },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="h-5 w-5 text-muted-foreground" />
                      {link.label}
                    </div>
                    {link.count !== undefined && link.count > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                        {link.count}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Section: Categories */}
            <div className="mb-4">
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { name: "Men", slug: "men", emoji: "👔" },
                  { name: "Women", slug: "women", emoji: "👗" },
                  { name: "Kids", slug: "kids", emoji: "👶" },
                  { name: "Sports", slug: "sports", emoji: "⚽" },
                  { name: "Formal", slug: "formal", emoji: "👞" },
                  { name: "Casual", slug: "casual", emoji: "👟" },
                  { name: "Running", slug: "running", emoji: "🏃" },
                  { name: "Sneakers", slug: "sneakers", emoji: "👟" },
                ].map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/shop?category=${cat.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg border border-border/40 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground hover:border-border"
                  >
                    <span className="text-base">{cat.emoji}</span>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Section: Account & Support */}
            <div className="mb-4">
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Account & Support
              </p>
              <div className="space-y-0.5">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <LogIn className="h-5 w-5 text-muted-foreground" />
                  Sign In / Register
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Section: Currency & Language */}
            <div>
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Settings
              </p>
              <div className="space-y-2">
                <div className="space-y-1.5">
                  <p className="px-1 text-xs text-muted-foreground">Currency</p>
                  <div className="flex flex-wrap gap-1.5">
                    {currencies.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setSelectedCurrency(c)}
                        className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                          selectedCurrency.value === c.value
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-border/60 text-muted-foreground hover:border-muted-foreground/30"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="px-1 text-xs text-muted-foreground">Language</p>
                  <div className="flex flex-wrap gap-1.5">
                    {languages.map((l) => (
                      <button
                        key={l.value}
                        onClick={() => setSelectedLanguage(l)}
                        className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                          selectedLanguage.value === l.value
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-border/60 text-muted-foreground hover:border-muted-foreground/30"
                        }`}
                      >
                        {l.flag} {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MOBILE BOTTOM NAV ─── */}
      <MobileBottomNav />
    </header>
  );
}
