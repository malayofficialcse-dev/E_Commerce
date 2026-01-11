import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product";

dotenv.config();

const MONGO_URI = process.env.ATLAS_URL || process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

const clearProducts = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for clearing products...");

    const result = await Product.deleteMany({});
    console.log(`Successfully cleared ${result.deletedCount} products.`);

    console.log("Database is now empty of products.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to clear products:", error);
    process.exit(1);
  }
};

clearProducts();
