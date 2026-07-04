"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const difference = targetDate.getTime() - new Date().getTime();
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function TimerUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-xl bg-background/20 backdrop-blur-sm border border-white/10 shadow-lg">
        <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] sm:text-xs font-medium text-white/70 mt-1.5 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function PromotionalBanner() {
  // Static initial value to match SSR + client hydration
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 7,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7); // 7 days from now

    setTimeLeft(calculateTimeLeft(targetDate));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/4 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

          {/* Shimmer line */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -inset-[100%] animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg]" />
          </div>

          <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Content */}
              <div className="text-center lg:text-left max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm text-white mb-4 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">Limited Time Offer</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
                  Summer Sale
                  <br />
                  <span className="text-yellow-300">Is Live!</span>
                </h2>
                <p className="text-lg text-orange-100/90 mb-6">
                  Up to <span className="font-bold text-white text-xl">50% OFF</span> on Sports Shoes
                </p>

                {/* Countdown Timer */}
                <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6">
                  <TimerUnit value={timeLeft.days} label="Days" />
                  <span className="text-2xl font-bold text-white/50 -mt-6">:</span>
                  <TimerUnit value={timeLeft.hours} label="Hours" />
                  <span className="text-2xl font-bold text-white/50 -mt-6">:</span>
                  <TimerUnit value={timeLeft.minutes} label="Mins" />
                  <span className="text-2xl font-bold text-white/50 -mt-6">:</span>
                  <TimerUnit value={timeLeft.seconds} label="Secs" />
                </div>

                <Button
                  size="lg"
                  asChild
                  className="bg-white text-orange-600 hover:bg-orange-50 hover:scale-105 transition-all duration-300 shadow-xl group h-12 px-8 text-base font-semibold"
                >
                  <Link href="/shop">
                    Shop the Sale
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              {/* Discount Tag */}
              <div className="hidden lg:flex flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-60 animate-pulse" />
                  <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-2xl animate-float">
                    <div className="text-center">
                      <span className="block text-3xl font-bold text-white">50%</span>
                      <span className="block text-sm font-semibold text-white/90">OFF</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
