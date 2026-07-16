import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderId: string }>;
}): Promise<Metadata> {
  const { orderId } = await params;

  return {
    title: "Order Confirmation",
    description: `Your order #${orderId.slice(-8).toUpperCase()} has been confirmed. View your order details at SM CO.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function OrderConfirmationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
