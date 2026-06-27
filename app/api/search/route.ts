import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";

// Groq SDK for AI-powered search
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ products: [], suggestions: [] });
  }

  try {
    await connectToDatabase();

    // 1. Fetch matching products from MongoDB (text search)
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    })
      .limit(6)
      .lean();

    // 2. Get AI-powered search suggestions via Groq (if API key is configured)
    let suggestions: string[] = [];
    if (process.env.GROQ_API_KEY) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content:
                "You are a shoe ecommerce search assistant. Given a user's search query, suggest 3-5 relevant search terms or product names they might be looking for. Return ONLY a JSON array of strings, nothing else. Example: [\"running shoes\", \"Nike Air Max\", \"casual sneakers\"]",
            },
            {
              role: "user",
              content: `User searched for: "${query}". Suggest relevant shoe search terms.`,
            },
          ],
          model: "mixtral-8x7b-32768",
          temperature: 0.3,
          max_tokens: 200,
        });

        const content = completion.choices[0]?.message?.content || "[]";
        // Parse the JSON response safely
        try {
          const parsed = JSON.parse(
            content
              .replace(/```json/g, "")
              .replace(/```/g, "")
              .trim()
          );
          if (Array.isArray(parsed)) {
            suggestions = parsed.slice(0, 5);
          }
        } catch {
          suggestions = [];
        }
      } catch {
        // Groq unavailable — just return DB results
        suggestions = [];
      }
    }

    return NextResponse.json({ products, suggestions });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { products: [], suggestions: [], error: "Search failed" },
      { status: 500 }
    );
  }
}
