"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShoppingBag,
  ChevronRight,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

// ─── 8 Shoe images for floating cards ───
const shoeCards = [
  { src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=600&fit=crop&q=80", rot: -9, depth: 14 },
  { src: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=600&fit=crop&q=80", rot: -5, depth: 10 },
  { src: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=400&h=600&fit=crop&q=80", rot: -2, depth: 8 },
  { src: "https://images.unsplash.com/photo-1597045566677-8cf032ed8434?w=400&h=600&fit=crop&q=80", rot: 3, depth: 12 },
  { src: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=600&fit=crop&q=80", rot: 0, depth: 6 },
  { src: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=600&fit=crop&q=80", rot: 4, depth: 11 },
  { src: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=600&fit=crop&q=80", rot: 7, depth: 9 },
  { src: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400&h=600&fit=crop&q=80", rot: -4, depth: 13 },
];

const trustBadges = [
  { icon: Truck, label: "Free Shipping" },
  { icon: RotateCcw, label: "30-Day Returns" },
  { icon: ShieldCheck, label: "Secure Payment" },
  { icon: Check, label: "100% Authentic" },
];

export function AnimatedHero() {
  const heroRef = useRef<HTMLElement>(null);
  const sublineRef = useRef<HTMLDivElement>(null);
  const rAFId = useRef<number>(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    mountedRef.current = true;

    // Store cleanup functions
    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      // ── Initial states ──
      gsap.set(".hero-word > span", { y: "105%" });
      gsap.set(".big-letter", { y: 80, opacity: 0 });
      gsap.set(sublineRef.current, { opacity: 0, y: 20 });

      document.querySelectorAll(".shoe-card").forEach((card) => {
        const el = card as HTMLElement;
        const rot = parseFloat(el.dataset.rot || "0");
        el.dataset.restRot = String(rot);
        gsap.set(el, { y: -800, rotation: rot + 25, opacity: 0, scale: 0.7 });
      });

      // ── Intro Timeline ──
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .to(".hero-word > span", { y: "0%", duration: 0.9, stagger: 0.08, ease: "power3.out" }, 0.2)
        .to(".big-letter", { y: 0, opacity: 1, duration: 0.9, stagger: 0.05, ease: "back.out(1.6)" }, 0.45)
        .to(
          ".shoe-card",
          {
            y: 0, opacity: 1, scale: 1,
            rotation: (_i: number, el: Element) => parseFloat((el as HTMLElement).dataset.restRot || "0"),
            duration: 1.1,
            stagger: { each: 0.08, from: "center" },
            ease: "back.out(1.4)",
          },
          0.7
        )
        .to(sublineRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.4);

      // ── Continuous Float ──
      document.querySelectorAll(".shoe-card").forEach((card, i) => {
        const el = card as HTMLElement;
        const rot = parseFloat(el.dataset.restRot || "0");
        gsap.to(el, {
          y: `+=${8 + (i % 3) * 5}`,
          rotation: rot + (i % 2 === 0 ? 1.5 : -1.5),
          duration: 3 + (i % 4) * 0.5,
          delay: 1.8 + i * 0.1,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      // ── Mouse Parallax ──
      let mx = 0, my = 0, tx = 0, ty = 0;

      const handleMouseMove = (e: MouseEvent) => {
        const r = hero.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };

      const handleMouseLeave = () => {
        mx = 0;
        my = 0;
      };

      hero.addEventListener("mousemove", handleMouseMove);
      hero.addEventListener("mouseleave", handleMouseLeave);

      cleanups.push(() => {
        hero.removeEventListener("mousemove", handleMouseMove);
        hero.removeEventListener("mouseleave", handleMouseLeave);
      });

      function parallax() {
        if (!mountedRef.current) return;
        tx += (mx - tx) * 0.05;
        ty += (my - ty) * 0.05;
        document.querySelectorAll(".shoe-card").forEach((card) => {
          const el = card as HTMLElement;
          const d = parseFloat(el.dataset.depth || "8");
          el.style.translate = `${tx * d}px ${ty * d * 0.5}px`;
        });
        rAFId.current = requestAnimationFrame(parallax);
      }
      rAFId.current = requestAnimationFrame(parallax);

      // ── Card Hover 3D Tilt ──
      document.querySelectorAll(".shoe-card").forEach((card) => {
        const el = card as HTMLElement;

        const handleHoverMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(el, {
            rotateX: -py * 16,
            rotateY: px * 16,
            scale: 1.12,
            zIndex: 20,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 700,
            overwrite: "auto",
          });
        };

        const handleHoverLeave = () => {
          gsap.to(el, {
            rotateX: 0, rotateY: 0, scale: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.6)",
            overwrite: "auto",
          });
        };

        el.addEventListener("mousemove", handleHoverMove);
        el.addEventListener("mouseleave", handleHoverLeave);

        cleanups.push(() => {
          el.removeEventListener("mousemove", handleHoverMove);
          el.removeEventListener("mouseleave", handleHoverLeave);
        });
      });

      // ── ScrollTrigger: Card Fan-Out + Text Effects ──
      const st = ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(".big-text", { scale: 1 + 0.15 * p, opacity: 1 - 0.4 * p });
          gsap.set(".hero-heading", { y: -60 * p, opacity: 1 - p * 1.5 });

          const moves = [
            { x: -260, y: -40, rot: -25 },
            { x: -200, y: 20, rot: -18 },
            { x: -120, y: 80, rot: -10 },
            { x: -40,  y: 120, rot: -4 },
            { x: 40,   y: 120, rot: 4 },
            { x: 120,  y: 80,  rot: 12 },
            { x: 200,  y: 20,  rot: 22 },
            { x: 260,  y: -40, rot: 28 },
          ];

          document.querySelectorAll(".shoe-card").forEach((card, i) => {
            const el = card as HTMLElement;
            const m = moves[i];
            const rest = parseFloat(el.dataset.restRot || "0");
            gsap.set(el, { x: m.x * p, y: m.y * p, rotation: rest + m.rot * p });
          });

          gsap.set(sublineRef.current, { opacity: 1 - p * 2 });
        },
      });

      cleanups.push(() => st.kill());
    }, hero);

    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(rAFId.current);
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={heroRef} className="hero-section relative min-h-screen overflow-hidden">
      {/* Grain Overlay */}
      <div className="hero-grain" />

      {/* Large faded background text: BOLD STYLE */}
      <div className="big-text-wrap">
        <div className="big-text">
          {"BOLD STYLE".split("").map((char, i) => (
            <span key={i} className="big-letter">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>

      {/* Animated Heading */}
      <h1 className="hero-heading">
        <span className="hero-word">
          <span>Premium</span>
        </span>
        &nbsp;
        <span className="hero-word">
          <span>Quality,</span>
        </span>
      </h1>

      {/* ── Floating Shoe Cards ── */}
      <div className="cards-row">
        {shoeCards.map((card, i) => (
          <div
            key={i}
            className={`shoe-card card-${i + 1}`}
            data-rot={card.rot}
            data-depth={card.depth}
          >
            <img
              src={card.src}
              alt={`Shoe ${i + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* ── Subline: CTAs + Badges ── */}
      <div ref={sublineRef} className="hero-subline">
        <div className="hero-ctas">
          <Button size="lg" asChild className="hero-cta-btn h-12 px-8 text-base shadow-lg">
            <Link href="/shop">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Shop Now
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="hero-cta-btn h-12 px-8 text-base">
            <Link href="/shop?category=running">
              Explore Collection
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="hero-badges">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="hero-badge">
              <badge.icon className="h-3.5 w-3.5" />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="hero-social">
          <div className="hero-avatars">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="hero-avatar">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <div className="hero-rating">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">4.8</span>
            <span className="text-muted-foreground">(12k+ reviews)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
