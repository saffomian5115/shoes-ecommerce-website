import { connectToDatabase } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://smco.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Dynamic product pages
  try {
    await connectToDatabase();
    const products = await Product.find({}).select("slug updatedAt").lean();

    const productRoutes: MetadataRoute.Sitemap = products.map(
      (product: { slug: string; updatedAt?: Date }) => ({
        url: `${BASE_URL}/product/${product.slug}`,
        lastModified: product.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })
    );

    return [...staticRoutes, ...productRoutes];
  } catch {
    // Return just static routes if DB is unavailable
    return staticRoutes;
  }
}
