"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addItem } = useCartStore();
  const inWishlist = isInWishlist(product._id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:border-border">
      {/* Image container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && <Badge className="bg-primary text-primary-foreground text-xs">New</Badge>}
          {discount > 0 && <Badge variant="destructive" className="text-xs">-{discount}%</Badge>}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product._id);
          }}
          className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              inWishlist ? "fill-red-500 text-red-500" : "text-foreground"
            }`}
          />
        </button>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1">
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-medium text-sm leading-tight transition-colors hover:text-primary line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-muted-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-semibold text-base">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <Button
          onClick={() => addItem(product, 1, product.sizes[0] || "", product.colors[0]?.name || "")}
          className="mt-3 w-full text-xs h-9"
          size="sm"
          disabled={!product.inStock}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
}
