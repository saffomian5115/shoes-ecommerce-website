"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Check } from "lucide-react";

interface ToastItem {
  id: string;
  name: string;
  image: string;
}

export function useCartToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  function showToast(item: ToastItem) {
    setToasts((prev) => [...prev, item]);
  }

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 2500);
    return () => clearTimeout(timer);
  }, [toasts]);

  return { toasts, showToast };
}

export function CartToast({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id + toast.name}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
            className="flex items-center gap-3 rounded-xl bg-primary text-primary-foreground px-4 py-3 shadow-lg pointer-events-auto"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Check className="h-4 w-4" />
            </div>
            <div className="text-sm">
              <p className="font-medium">Added to Cart</p>
              <p className="text-xs opacity-80 truncate max-w-[180px]">{toast.name}</p>
            </div>
            <ShoppingBag className="h-4 w-4 ml-2 opacity-70" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
