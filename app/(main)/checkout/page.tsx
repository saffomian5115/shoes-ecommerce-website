"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getStripeClient } from "@/lib/stripe-client";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Lock,
  ShoppingBag,
  Truck,
  CreditCard,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { ShippingAddress } from "@/types";

const stripePromise = getStripeClient();

const STEPS = [
  { id: "shipping", label: "Shipping", icon: MapPin },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "review", label: "Review", icon: CheckCircle2 },
] as const;

type Step = (typeof STEPS)[number]["id"];

function CheckoutForm() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Shipping form state
  const [shipping, setShipping] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  const subtotal = getSubtotal();
  const shippingCost = subtotal >= 100 ? 0 : 9.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shippingCost + tax;

  const handleShippingSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Basic validation
      const required = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "zipCode",
      ] as const;
      for (const field of required) {
        if (!shipping[field]?.trim()) {
          setError(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
          return;
        }
      }

      if (items.length === 0) {
        setError("Your cart is empty");
        return;
      }

      setIsProcessing(true);

      try {
        // Create payment intent and order
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.product._id,
              name: item.product.name,
              image: item.product.images[0] || "/placeholder.svg",
              price: item.product.price,
              quantity: item.quantity,
              selectedSize: item.selectedSize,
              selectedColor: item.selectedColor,
            })),
            shippingAddress: shipping,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        setClientSecret(data.clientSecret);
        setOrderId(data.orderId);
        setCurrentStep("payment");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsProcessing(false);
      }
    },
    [shipping, items]
  );

  const handleShippingChange = (field: keyof ShippingAddress, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
  };

  if (items.length === 0 && currentStep !== "review") {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Your Cart is Empty</h1>
          <p className="text-muted-foreground">
            Add some items to your cart before checking out.
          </p>
          <Button asChild className="mt-4">
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Steps indicator */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Checkout</h1>
        <div className="flex items-center gap-2">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : STEPS.findIndex((s) => s.id === currentStep) > i
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <step.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px w-8 ${
                    STEPS.findIndex((s) => s.id === currentStep) > i
                      ? "bg-primary"
                      : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {currentStep === "shipping" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="firstName">
                        First Name *
                      </label>
                      <Input
                        id="firstName"
                        value={shipping.firstName}
                        onChange={(e) =>
                          handleShippingChange("firstName", e.target.value)
                        }
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="lastName">
                        Last Name *
                      </label>
                      <Input
                        id="lastName"
                        value={shipping.lastName}
                        onChange={(e) =>
                          handleShippingChange("lastName", e.target.value)
                        }
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="email">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={shipping.email}
                        onChange={(e) =>
                          handleShippingChange("email", e.target.value)
                        }
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="phone">
                        Phone *
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shipping.phone}
                        onChange={(e) =>
                          handleShippingChange("phone", e.target.value)
                        }
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="address">
                      Address *
                    </label>
                    <Input
                      id="address"
                      value={shipping.address}
                      onChange={(e) =>
                        handleShippingChange("address", e.target.value)
                      }
                      placeholder="123 Main Street"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="apartment">
                      Apartment, Suite, etc. (optional)
                    </label>
                    <Input
                      id="apartment"
                      value={shipping.apartment || ""}
                      onChange={(e) =>
                        handleShippingChange("apartment", e.target.value)
                      }
                      placeholder="Apt 4B"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="city">
                        City *
                      </label>
                      <Input
                        id="city"
                        value={shipping.city}
                        onChange={(e) =>
                          handleShippingChange("city", e.target.value)
                        }
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="state">
                        State *
                      </label>
                      <Input
                        id="state"
                        value={shipping.state}
                        onChange={(e) =>
                          handleShippingChange("state", e.target.value)
                        }
                        placeholder="NY"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="zipCode">
                        ZIP Code *
                      </label>
                      <Input
                        id="zipCode"
                        value={shipping.zipCode}
                        onChange={(e) =>
                          handleShippingChange("zipCode", e.target.value)
                        }
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        Continue to Payment
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {currentStep === "payment" && clientSecret && (
            <PaymentStep
              clientSecret={clientSecret}
              onBack={() => setCurrentStep("shipping")}
              onSuccess={(id) => {
                clearCart();
                router.push(`/checkout/${id}`);
              }}
              setError={setError}
            />
          )}

          {currentStep === "review" && (
            <div className="text-center py-12">
              <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
              <p className="text-muted-foreground mb-6">
                Your order has been confirmed and is being processed.
              </p>
              <Button asChild>
                <Link href={orderId ? `/checkout/${orderId}` : "/account/orders"}>
                  View Order Details
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingBag className="h-4 w-4" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items preview */}
              <div className="space-y-3">
                {items.slice(0, 4).map((item) => (
                  <div
                    key={`${item.product._id}-${item.selectedSize}-${item.selectedColor}`}
                    className="flex gap-3"
                  >
                    <div className="h-14 w-14 shrink-0 rounded-md bg-muted overflow-hidden">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                        {item.selectedSize && ` · ${item.selectedSize}`}
                      </p>
                      <p className="text-sm font-semibold mt-0.5">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                {items.length > 4 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{items.length - 4} more item{items.length - 4 !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Security badge */}
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5 shrink-0" />
                <span>Secure checkout powered by Stripe</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PaymentStep({
  clientSecret,
  onBack,
  onSuccess,
  setError,
}: {
  clientSecret: string;
  onBack: () => void;
  onSuccess: (orderId: string) => void;
  setError: (err: string | null) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!stripe || !elements) {
      setError("Stripe not ready yet");
      return;
    }

    setIsProcessing(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || "Payment validation failed");
      setIsProcessing(false);
      return;
    }

    const { error: payError, paymentIntent } =
      await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/processing`,
        },
        redirect: "if_required",
      });

    if (payError) {
      setError(payError.message || "Payment failed");
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      // Fetch order ID from the client secret
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
      });
      const data = await res.json();
      onSuccess(data.order?._id || "processing");
    } else {
      setMessage("Payment is processing. You'll be redirected shortly.");
      // In a real scenario with redirect flow, the return_url handles this
    }

    setIsProcessing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="rounded-lg border border-border p-4 mb-4">
            <PaymentElement />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Shield className="h-3.5 w-3.5" />
            <span>Your payment info is encrypted and secure</span>
          </div>

          {message && (
            <div className="mb-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3 text-sm text-blue-700 dark:text-blue-300">
              {message}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isProcessing}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1"
              size="lg"
              disabled={!stripe || isProcessing}
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  Pay Now
                  <Lock className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
