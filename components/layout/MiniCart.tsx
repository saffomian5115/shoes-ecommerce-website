"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";

export function MiniCart() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { items, removeItem, getSubtotal } = useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative hidden sm:block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
        aria-label="Cart"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <ShoppingBag className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground animate-in zoom-in-50">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 w-80 rounded-xl border border-border/50 bg-popover shadow-lg ring-1 ring-foreground/5 z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
            <p className="text-sm font-medium">
              {totalItems === 0
                ? "Cart is empty"
                : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close mini cart"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Items */}
          {totalItems > 0 ? (
            <>
              <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                {items.slice(0, 5).map((item) => (
                  <div
                    key={`${item.product._id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50 group"
                  >
                    <div className="h-12 w-12 shrink-0 rounded-md bg-muted overflow-hidden relative">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.selectedSize && `${item.selectedSize} · `}Qty:{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold shrink-0">
                        ${(item.product.price * item.quantity).toFixed(0)}
                      </p>
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="p-1 text-muted-foreground/40 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {items.length > 5 && (
                  <p className="text-center text-xs text-muted-foreground py-2">
                    +{items.length - 5} more item
                    {items.length - 5 !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border/40 p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">
                    ${getSubtotal().toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Shipping & taxes calculated at checkout
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href="/cart" onClick={() => setIsOpen(false)}>
                      View Cart
                    </Link>
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link href="/checkout" onClick={() => setIsOpen(false)}>
                      Checkout
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              <ShoppingBag className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">Your cart is empty</p>
              <Button variant="link" size="sm" asChild className="mt-1">
                <Link href="/shop" onClick={() => setIsOpen(false)}>
                  Start Shopping
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
