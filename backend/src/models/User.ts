import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  role: "customer" | "admin";
  loyaltyPoints: number;
  membershipTier: "Bronze" | "Gold" | "Black";
  addresses: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
  }[];
  wishlist: mongoose.Types.ObjectId[];
  googleId?: string;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    phone: { type: String },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    loyaltyPoints: { type: Number, default: 0 },
    membershipTier: { 
      type: String, 
      enum: ["Bronze", "Gold", "Black"], 
      default: "Bronze" 
    },
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    googleId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
