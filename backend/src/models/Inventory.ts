import mongoose, { Schema, Document } from "mongoose";

export interface IInventory extends Document {
  sku: string;
  variantId: string;
  reservedStock: number;
  availableStock: number;
}

const InventorySchema: Schema = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    variantId: { type: String, required: true },
    reservedStock: { type: Number, default: 0 },
    availableStock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IInventory>("Inventory", InventorySchema);
