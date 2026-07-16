import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "SM CO. — Premium Footwear",
    template: "%s | SM CO.",
  },
  description:
    "Discover premium footwear for every step of your journey. Shop running, casual, sports, and sneaker collections at SM CO.",
  openGraph: {
    title: "SM CO. — Premium Footwear",
    description:
      "Discover premium footwear for every step of your journey. Shop running, casual, sports, and sneaker collections.",
    type: "website",
    siteName: "SM CO.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SM CO. — Premium Footwear",
    description:
      "Discover premium footwear for every step of your journey.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
