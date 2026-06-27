"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal >= 100 ? 0 : 9.99;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Your Cart is Empty</h1>
          <p className="text-muted-foreground">
            Looks like you haven&apos;t added anything yet. Browse our collection and find your perfect pair!
          </p>
          <Button asChild className="mt-4">
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product._id}-${item.selectedSize}-${item.selectedColor}`}
              className="flex gap-4 rounded-lg border border-border/50 bg-card p-4"
            >
              {/* Image */}
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                  src={item.product.images[0] || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="font-medium text-sm hover:text-primary transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      {item.selectedColor && (
                        <span className="flex items-center gap-1">
                          Color: {item.selectedColor}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="font-semibold text-sm">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (item.quantity <= 1) {
                          removeItem(item.product._id);
                        } else {
                          updateQuantity(item.product._id, item.quantity - 1);
                        }
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded border border-border transition-colors hover:bg-muted"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded border border-border transition-colors hover:bg-muted"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border/50 bg-card p-6">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>${(subtotal + shipping).toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full mt-6" size="lg" asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
            <Button variant="outline" className="w-full mt-2" asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
