import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    variantId: string; 
    quantity: number;
    price: number;
    name: string;
    image: string;
  }[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    lat?: number;
    lng?: number;
  };
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "placed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled" | "return-requested" | "returned";
  paymentProvider: "razorpay" | "stripe" | "cod";
  paymentId?: string;
  trackingId?: string;
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  estimatedDelivery: Date;
  trackingHistory?: {
    status: string;
    location: string;
    description: string;
    timestamp: Date;
  }[];
  returnData?: {
    status: "none" | "requested" | "approved" | "rejected" | "received" | "refunded";
    reason: string;
    requestedAt: Date;
    resolvedAt?: Date;
    images?: string[];
  };
}

const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        variantId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["placed", "packed", "shipped", "out-for-delivery", "delivered", "cancelled", "return-requested", "returned"],
      default: "placed",
    },
    paymentProvider: { type: String, enum: ["razorpay", "stripe", "cod"], default: "cod" },
    paymentId: { type: String },
    trackingId: { type: String },
    currentLocation: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
    },
    estimatedDelivery: { type: Date },
    trackingHistory: [
      {
        status: { type: String },
        location: { type: String },
        description: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    returnData: {
      status: { 
        type: String, 
        enum: ["none", "requested", "approved", "rejected", "received", "refunded"],
        default: "none"
      },
      reason: { type: String },
      requestedAt: { type: Date },
      resolvedAt: { type: Date },
      images: [{ type: String }],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
