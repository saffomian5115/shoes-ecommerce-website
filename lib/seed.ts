import fs from "fs";
import path from "path";

// Manually read .env.local BEFORE any mongoose imports
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        // Remove surrounding quotes if any
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
  console.log("📄 Loaded .env.local: MONGODB_URI =", process.env.MONGODB_URI ? "✅ Set" : "❌ Not set");
}

async function seed() {
  // Dynamic import so mongoose module-level code runs AFTER env is set
  const { connectToDatabase } = await import("@/lib/mongoose");
  const { Product } = await import("@/lib/models/Product");
  const { products } = await import("@/lib/placeholder-data");

  try {
    await connectToDatabase();
    console.log("✅ Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("🧹 Cleared existing products");

    // Insert placeholder products
    const inserted = await Product.insertMany(
      products.map((p) => ({
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        images: p.images,
        category: p.category,
        sizes: p.sizes,
        colors: p.colors,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isNew: p.isNew,
        isBestSeller: p.isBestSeller,
        inStock: p.inStock,
      }))
    );

    console.log(`✅ Seeded ${inserted.length} products successfully`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
