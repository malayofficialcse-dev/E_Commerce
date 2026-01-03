import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parent?: mongoose.Types.ObjectId;
  image?: string;
  level: number;
  path?: string;
  children?: mongoose.Types.ObjectId[];
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    image: { type: String },
    level: { type: Number, default: 0 },
    path: { type: String, default: "" }, // comma separated string of IDs for ancestor querying
    children: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", CategorySchema);
