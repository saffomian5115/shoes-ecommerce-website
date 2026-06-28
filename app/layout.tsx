import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShapeGridBackground } from "@/components/ui/shape-grid-background";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SM CO. — Premium Footwear",
  description:
    "Discover premium footwear for every step of your journey. Shop running, casual, sports, and sneaker collections.",
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
          <Navbar />
          <main className="flex-1 pb-14 lg:pb-0">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
