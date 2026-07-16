"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  User,
  LogIn,
  UserPlus,
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = status === "authenticated";
  const userName = session?.user?.name || "User";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 rounded-lg px-3 py-2">
        <div className="h-7 w-7 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-16 animate-pulse rounded bg-muted hidden lg:block" />
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      {isLoggedIn ? (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {userName.charAt(0)}
            </div>
            <span className="hidden lg:inline">{userName}</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute top-full right-0 mt-1 w-56 rounded-xl border border-border/50 bg-popover p-1.5 shadow-lg ring-1 ring-foreground/5 z-50">
              <div className="px-3 py-2 border-b border-border/40 mb-1">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>

              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <User className="h-4 w-4" />
                My Account
              </Link>
              <Link
                href="/account/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Package className="h-4 w-4" />
                My Orders
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Heart className="h-4 w-4" />
                Wishlist
              </Link>
              <Link
                href="/account/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </Link>

              <div className="border-t border-border/40 mt-1 pt-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Account"
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <User className="h-5 w-5" />
            <span className="hidden lg:inline">Account</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute top-full right-0 mt-1 w-52 rounded-xl border border-border/50 bg-popover p-2 shadow-lg ring-1 ring-foreground/5 z-50">
              <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
                Welcome to SM
              </p>
              <div className="space-y-1 mt-1">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </Link>
                </Button>
              </div>
              <div className="border-t border-border/40 mt-2 pt-2">
                <Link
                  href="/account/orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Package className="h-3.5 w-3.5" />
                  Track Order
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
