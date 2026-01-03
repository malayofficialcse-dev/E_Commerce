"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
dotenv_1.default.config();
const seedData = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce");
        console.log("Connected to MongoDB for seeding...");
        // Clear existing data
        await Product_1.default.deleteMany({});
        await Category_1.default.deleteMany({});
        // Create Categories
        const electronics = await Category_1.default.create({
            name: "Electronics",
            slug: "electronics",
            description: "Latest gadgets and gear"
        });
        const fashion = await Category_1.default.create({
            name: "Fashion",
            slug: "fashion",
            description: "Premium clothing and accessories"
        });
        // Create Products
        const products = [
            {
                title: "Executive Silk Blazer",
                slug: "executive-silk-blazer",
                brand: "LUXE",
                description: "A premium silk blazer for the modern professional. Elegant cut, breathable fabric.",
                category: fashion._id,
                images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800"],
                variants: [
                    { color: "Black", size: "M", sku: "BLK-S-M", price: 1499, stock: 10 },
                    { color: "Black", size: "L", sku: "BLK-S-L", price: 1499, stock: 5 },
                    { color: "Navy", size: "M", sku: "NVY-S-M", price: 1599, stock: 12 },
                ],
                ratings: { average: 4.8, count: 120 },
                status: "live",
                tags: ["premium", "formal", "silk"]
            },
            {
                title: "Quantum Wireless Headphones",
                slug: "quantum-wireless-headphones",
                brand: "TechFlow",
                description: "Studio quality sound with advanced noise cancellation technology.",
                category: electronics._id,
                images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"],
                variants: [
                    { color: "Silver", size: "Standard", sku: "TECH-Q-SIL", price: 299, stock: 50 },
                    { color: "Black", size: "Standard", sku: "TECH-Q-BLK", price: 299, stock: 30 },
                ],
                ratings: { average: 4.5, count: 500 },
                status: "live",
                tags: ["tech", "wireless", "audio"]
            },
            {
                title: "Limited Edition Chronograph",
                slug: "limited-edition-chronograph",
                brand: "Heritage",
                description: "Precision Swiss movement in a timeless stainless steel design.",
                category: fashion._id,
                images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800"],
                variants: [
                    { color: "Gold", size: "42mm", sku: "WAT-G-42", price: 2499, stock: 2 },
                    { color: "Silver", size: "42mm", sku: "WAT-S-42", price: 2199, stock: 8 },
                ],
                ratings: { average: 4.9, count: 45 },
                status: "live",
                tags: ["luxury", "watch", "swiss"]
            },
            {
                title: "Minimalist Leather Backpack",
                slug: "minimalist-leather-backpack",
                brand: "Urban",
                description: "Handcrafted Italian leather backpack. Perfect for the stylish traveler.",
                category: fashion._id,
                images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800"],
                variants: [
                    { color: "Brown", size: "Large", sku: "BAG-B-L", price: 450, stock: 15 },
                    { color: "Tan", size: "Large", sku: "BAG-T-L", price: 450, stock: 10 },
                ],
                ratings: { average: 4.7, count: 88 },
                status: "live",
                tags: ["leather", "backpack", "travel"]
            }
        ];
        await Product_1.default.insertMany(products);
        console.log("Data seeded successfully!");
        process.exit();
    }
    catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};
seedData();
