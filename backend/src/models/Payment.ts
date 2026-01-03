import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  transactionId: string;
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  provider: "Razorpay" | "Stripe" | "PayPal";
  amount: number;
  currency: string;
  signature?: string;
  webhookStatus: "pending" | "received" | "processed" | "failed";
  status: "pending" | "success" | "failed";
}

const PaymentSchema: Schema = new Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, enum: ["Razorpay", "Stripe", "PayPal"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    signature: { type: String },
    webhookStatus: { type: String, enum: ["pending", "received", "processed", "failed"], default: "pending" },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", PaymentSchema);
