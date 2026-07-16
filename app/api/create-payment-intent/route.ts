import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Order } from "@/lib/models/Order";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, shippingAddress } = body;

    if (!items?.length || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate totals server-side (never trust the client!)
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
    const subtotalCents = Math.round(subtotal * 100);
    const shippingCost = subtotal >= 100 ? 0 : 9.99;
    const shippingCents = Math.round(shippingCost * 100);
    const taxCents = Math.round(subtotalCents * 0.08); // 8% tax
    const totalCents = subtotalCents + taxCents + shippingCents;

    await connectToDatabase();

    // Create Stripe PaymentIntent (amount in cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session.user.id,
      },
    });

    // Create order in database
    const order = await Order.create({
      userId: session.user.id,
      items: items.map(
        (item: {
          productId: string;
          name: string;
          image: string;
          price: number;
          quantity: number;
          selectedSize?: string;
          selectedColor?: string;
        }) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize || "",
          selectedColor: item.selectedColor || "",
        })
      ),
      shippingAddress,
      subtotal,
      shippingCost,
      tax: taxCents / 100,
      total: totalCents / 100,
      status: "pending",
      paymentIntentId: paymentIntent.id,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order._id.toString(),
    });
  } catch (error) {
    console.error("Payment intent error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
