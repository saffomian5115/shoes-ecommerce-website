import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShapeGridBackground } from "@/components/ui/shape-grid-background";
import { SessionProvider } from "@/components/providers/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://smco.com"),
  title: "SM CO. — Premium Footwear",
  description:
    "Discover premium footwear for every step of your journey. Shop running, casual, sports, and sneaker collections.",
  openGraph: {
    title: "SM CO. — Premium Footwear",
    description:
      "Discover premium footwear for every step of your journey.",
    type: "website",
    siteName: "SM CO.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SM CO. — Premium Footwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SM CO. — Premium Footwear",
    description:
      "Discover premium footwear for every step of your journey.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col relative">
        <ShapeGridBackground />
        <div className="relative z-10 flex flex-col min-h-full">
          <SessionProvider>
            <Navbar />
            <main className="flex-1 pb-14 lg:pb-0">{children}</main>
            <Footer />
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
