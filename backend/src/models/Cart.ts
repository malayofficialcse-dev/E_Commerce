import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  variantId: string; // SKU or internal variant ID
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  userId?: mongoose.Types.ObjectId;
  guestSessionId?: string;
  items: ICartItem[];
  coupons?: string[];
  deliveryCharge: number;
  totalAmount: number;
}

const CartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  variantId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const CartSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    guestSessionId: { type: String },
    items: [CartItemSchema],
    coupons: [{ type: String }],
    deliveryCharge: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ICart>("Cart", CartSchema);
