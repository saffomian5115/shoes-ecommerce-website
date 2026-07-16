import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug })
      .select("name description images price category")
      .lean();

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The product you're looking for could not be found.",
      };
    }

    const title = `${product.name} | SM CO.`;
    const description =
      product.description?.slice(0, 160) ||
      `Shop ${product.name} at SM CO. Premium ${product.category} footwear.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: product.images?.[0]
          ? [{ url: product.images[0], width: 800, height: 800 }]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: product.images?.[0] ? [product.images[0]] : [],
      },
    };
  } catch {
    return {
      title: "Product | SM CO.",
      description: "View product details at SM CO.",
    };
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
