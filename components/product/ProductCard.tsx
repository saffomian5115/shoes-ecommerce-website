"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Star, ShoppingBag, Check } from "lucide-react";
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

  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const hasSecondImage = product.images.length > 1;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, product.sizes[0] || "", product.colors[0]?.name || "");
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  }

  return (
    <motion.div
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:border-border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
    >
      {/* Image container with crossfade */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted">
        {/* First image */}
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-700 ${
            isHovered && hasSecondImage ? "opacity-0 scale-110" : "opacity-100 scale-100"
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Second image (crossfade on hover) */}
        {hasSecondImage && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            fill
            className={`object-cover transition-all duration-700 ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && <Badge className="bg-primary text-primary-foreground text-xs">New</Badge>}
          {discount > 0 && <Badge variant="destructive" className="text-xs">-{discount}%</Badge>}
        </div>

        {/* Wishlist button */}
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product._id);
          }}
          className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          whileTap={{ scale: 0.8 }}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              inWishlist ? "fill-red-500 text-red-500" : "text-foreground"
            }`}
          />
        </motion.button>

        {/* View details overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent flex items-end justify-center pb-4"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-white text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
            Quick View
          </span>
        </motion.div>
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

        {/* Add to cart with bounce feedback */}
        <motion.div className="mt-3" layout>
          <Button
            onClick={handleAddToCart}
            className="w-full text-xs h-9 relative overflow-hidden"
            size="sm"
            disabled={!product.inStock}
          >
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span
                  key="added"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  Added!
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Ripple effect on click */}
            <motion.span
              className="absolute inset-0 bg-white/20"
              initial={{ scale: 0, opacity: 0, borderRadius: "50%" }}
              whileTap={{ scale: 2.5, opacity: [0.3, 0], transition: { duration: 0.5 } }}
            />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
