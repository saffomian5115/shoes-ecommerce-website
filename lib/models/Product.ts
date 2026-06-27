import mongoose, { Schema } from "mongoose";

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    images: [{ type: String, required: true }],
    category: { type: String, required: true },
    sizes: [{ type: String }],
    colors: [
      {
        name: { type: String },
        hex: { type: String },
      },
    ],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isNew: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

export const Product =
  mongoose.models.Product ?? mongoose.model("Product", ProductSchema);
