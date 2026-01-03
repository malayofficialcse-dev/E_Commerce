import mongoose, { Schema, Document } from "mongoose";

export interface IVariant {
  color: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
  images: string[];
  attributes: Map<string, string>;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  brand: string;
  description: string;
  category: mongoose.Types.ObjectId;
  subCategory?: mongoose.Types.ObjectId;
  images: string[];
  variants: IVariant[];
  attributes: Map<string, string>;
  ratings: {
    average: number;
    count: number;
  };
  tags: string[];
  status: "live" | "draft";
  videoUrl?: string; 
  isExclusive: boolean; // Member-only drops
  minimumTier: "Bronze" | "Gold" | "Black"; // Required tier for access
  material: string; // For faceted search
}

const VariantSchema = new Schema({
  color: { type: String, required: true },
  size: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String }],
  attributes: {
    type: Map,
    of: String,
  },
});

const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: "Category" },
    images: [{ type: String, required: true }],
    videoUrl: { type: String }, // New field
    variants: [VariantSchema],
    attributes: {
      type: Map,
      of: String,
    },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    tags: [{ type: String }],
    status: { type: String, enum: ["live", "draft"], default: "draft" },
    isExclusive: { type: Boolean, default: false },
    minimumTier: { 
      type: String, 
      enum: ["Bronze", "Gold", "Black"], 
      default: "Bronze" 
    },
    material: { type: String },
    modelUrl: { type: String }, // For 3D AR Viewer
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
