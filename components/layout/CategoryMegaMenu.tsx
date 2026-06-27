"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Shirt,
  Footprints,
  Zap,
  Shield,
  Backpack,
  Dumbbell,
} from "lucide-react";

const categories = [
  {
    name: "Men",
    slug: "men",
    icon: Shirt,
    subcategories: [
      { name: "Running Shoes", slug: "running" },
      { name: "Casual Sneakers", slug: "casual" },
      { name: "Formal Shoes", slug: "formal" },
      { name: "Sports Shoes", slug: "sports" },
      { name: "Training Shoes", slug: "training" },
      { name: "Sandals & Slides", slug: "sandals" },
    ],
  },
  {
    name: "Women",
    slug: "women",
    icon: Footprints,
    subcategories: [
      { name: "Running Shoes", slug: "running" },
      { name: "Casual Sneakers", slug: "casual" },
      { name: "Formal Shoes", slug: "formal" },
      { name: "Sports Shoes", slug: "sports" },
      { name: "Training Shoes", slug: "training" },
      { name: "Sandals & Heels", slug: "sandals" },
    ],
  },
  {
    name: "Kids",
    slug: "kids",
    icon: Zap,
    subcategories: [
      { name: "Boys Shoes", slug: "boys" },
      { name: "Girls Shoes", slug: "girls" },
      { name: "School Shoes", slug: "school" },
      { name: "Sports Shoes", slug: "sports" },
      { name: "Sandals", slug: "sandals" },
    ],
  },
  {
    name: "Sports",
    slug: "sports",
    icon: Shield,
    subcategories: [
      { name: "Basketball", slug: "basketball" },
      { name: "Soccer", slug: "soccer" },
      { name: "Tennis", slug: "tennis" },
      { name: "Cricket", slug: "cricket" },
      { name: "Athletics", slug: "athletics" },
    ],
  },
  {
    name: "Casual",
    slug: "casual",
    icon: Backpack,
    subcategories: [
      { name: "Sneakers", slug: "sneakers" },
      { name: "Loafers", slug: "loafers" },
      { name: "Slip-ons", slug: "slip-ons" },
      { name: "Boat Shoes", slug: "boat-shoes" },
      { name: "Espadrilles", slug: "espadrilles" },
    ],
  },
  {
    name: "Formal",
    slug: "formal",
    icon: Dumbbell,
    subcategories: [
      { name: "Oxfords", slug: "oxfords" },
      { name: "Derbys", slug: "derbys" },
      { name: "Loafers", slug: "loafers" },
      { name: "Monk Straps", slug: "monk-straps" },
      { name: "Brogues", slug: "brogues" },
    ],
  },
];

export function CategoryMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Categories
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-[700px] rounded-xl border border-border/50 bg-popover p-5 shadow-lg ring-1 ring-foreground/5 z-50"
          onMouseLeave={() => {
            setIsOpen(false);
            setActiveColumn(null);
          }}
        >
          <div className="grid grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeColumn === category.slug;

              return (
                <div
                  key={category.slug}
                  className="group"
                  onMouseEnter={() => setActiveColumn(category.slug)}
                >
                  {/* Category Header */}
                  <Link
                    href={`/shop?category=${category.slug}`}
                    onClick={() => {
                      setIsOpen(false);
                      setActiveColumn(null);
                    }}
                    className="flex items-center gap-2 mb-2 pb-2 border-b border-border/40 transition-colors hover:text-primary"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold">{category.name}</span>
                  </Link>

                  {/* Subcategories */}
                  <ul className="space-y-0.5">
                    {category.subcategories.map((sub) => (
                      <li key={sub.slug}>
                        <Link
                          href={`/shop?category=${sub.slug}`}
                          onClick={() => {
                            setIsOpen(false);
                            setActiveColumn(null);
                          }}
                          className="block rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:pl-3"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-4 pt-3 border-t border-border/40">
            <Link
              href="/shop"
              onClick={() => {
                setIsOpen(false);
                setActiveColumn(null);
              }}
              className="flex items-center justify-center gap-1 rounded-lg bg-primary/5 px-4 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
            >
              Browse All Categories
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
