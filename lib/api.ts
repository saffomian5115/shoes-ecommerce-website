import type { Product } from "@/types";

export async function fetchProducts(params?: {
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Product[]> {
  const searchParams = new URLSearchParams();
  if (params?.category && params.category !== "All") searchParams.set("category", params.category);
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.minPrice !== undefined) searchParams.set("minPrice", params.minPrice.toString());
  if (params?.maxPrice !== undefined) searchParams.set("maxPrice", params.maxPrice.toString());

  const query = searchParams.toString();
  const res = await fetch(`/api/products${query ? `?${query}` : ""}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products");

  const data = await res.json();
  return data.products;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`/api/products/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch product");
  }

  const data = await res.json();
  return data.product;
}
