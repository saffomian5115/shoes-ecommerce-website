"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, MessageCircle, MessageSquare, Camera, Play, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const footerLinks = {
  "Quick Links": [
    { href: "/shop", label: "All Products" },
    { href: "/shop?category=running", label: "New Arrivals" },
    { href: "/shop?category=running", label: "Best Sellers" },
    { href: "/shop", label: "On Sale" },
  ],
  Categories: [
    { href: "/shop?category=running", label: "Running Shoes" },
    { href: "/shop?category=casual", label: "Casual Shoes" },
    { href: "/shop?category=sports", label: "Sports Shoes" },
    { href: "/shop?category=sneakers", label: "Sneakers" },
    { href: "/shop?category=formal", label: "Formal Shoes" },
  ],
  "Help & Info": [
    { href: "#", label: "Help Center" },
    { href: "#", label: "Size Guide" },
    { href: "#", label: "Shipping Info" },
    { href: "#", label: "Returns & Exchanges" },
    { href: "#", label: "Track Order" },
  ],
};

const socialLinks = [
  { name: "Facebook", href: "#", color: "hover:text-blue-600", icon: MessageCircle },
  { name: "Twitter", href: "#", color: "hover:text-sky-500", icon: MessageSquare },
  { name: "Instagram", href: "#", color: "hover:text-pink-500", icon: Camera },
  { name: "YouTube", href: "#", color: "hover:text-red-600", icon: Play },
];

const paymentMethods = [
  "Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay", "Amex"
];

function AccordionSection({
  title,
  links,
  defaultOpen = false,
}: {
  title: string;
  links: { href: string; label: string }[];
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="lg:hidden border-b border-border/40 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 text-sm font-semibold text-foreground"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="pb-3 space-y-2.5">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/20">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-8">
          {/* Brand - takes 2 cols */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                SC
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight">SOLE</span>
                <span className="text-lg font-light tracking-tight text-primary">MATE</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
              Premium footwear for every step of your journey. Quality, comfort, and style — all in one place. Since 2024.
            </p>
            {/* Contact Info */}
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@solemate.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Fashion Ave, New York, NY 10001</span>
              </div>
            </div>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-300 ${social.color} hover:border-foreground/20 hover:shadow-md`}
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold mb-4 text-foreground">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile Accordion */}
        <div className="lg:hidden space-y-0">
          {/* Brand Info */}
          <div className="pb-4 border-b border-border/40">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs">
                SC
              </div>
              <div>
                <span className="text-base font-bold tracking-tight">SOLE</span>
                <span className="text-base font-light tracking-tight text-primary">MATE</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium footwear for every step of your journey.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <AccordionSection key={title} title={title} links={links} />
          ))}

          {/* Contact on mobile */}
          <div className="py-3 border-b border-border/40">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@solemate.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (800) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Social on mobile */}
          <div className="py-3">
            <h3 className="text-sm font-semibold mb-3 text-foreground">Follow Us</h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-6 border-t border-border/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              We accept
            </p>
            <div className="flex items-center gap-3">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="px-3 py-1.5 rounded-md border border-border/40 bg-background text-xs font-medium text-muted-foreground"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SoleMate. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground/30">|</span>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
