"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const paymentIntent = searchParams.get("payment_intent");
    const redirect = searchParams.get("redirect_status");

    if (redirect === "succeeded" || redirect === "processing") {
      // Try to find the order by payment intent
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId: paymentIntent }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.order?._id) {
            router.replace(`/checkout/${data.order._id}`);
          } else {
            router.replace("/account/orders");
          }
        })
        .catch(() => {
          router.replace("/account/orders");
        });
    } else {
      router.replace("/checkout");
    }
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <h1 className="text-2xl font-bold tracking-tight">Processing Payment</h1>
      <p className="text-muted-foreground">
        Please wait while we confirm your payment...
      </p>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        }
      >
        <ProcessingContent />
      </Suspense>
    </div>
  );
}
