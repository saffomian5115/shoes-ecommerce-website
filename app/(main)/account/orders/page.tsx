import { connectToDatabase } from "@/lib/mongoose";
import { Order } from "@/lib/models/Order";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/scroll-reveal";
import type { Order as OrderType } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account/orders");
  }

  await connectToDatabase();
  const orders = (await Order.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean()) as OrderType[];

  return (
    <FadeIn>
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {orders.length > 0
              ? `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`
              : "No orders yet"}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/shop">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Looks like you haven&apos;t placed any orders yet. Start shopping to
            see your order history here.
          </p>
          <Button asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/checkout/${order._id}`}
              className="block"
            >
              <div className="rounded-xl border border-border/50 bg-card p-5 hover:shadow-md hover:border-border transition-all duration-200 group">
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-mono">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`${STATUS_COLORS[order.status]} capitalize`}
                      variant="outline"
                    >
                      {order.status}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex gap-3">
                  {order.items.slice(0, 4).map((item, i) => (
                    <div
                      key={i}
                      className="h-14 w-14 shrink-0 rounded-md bg-muted overflow-hidden relative"
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="h-14 w-14 shrink-0 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </p>
                  <p className="font-semibold">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
    </FadeIn>
  );
}
