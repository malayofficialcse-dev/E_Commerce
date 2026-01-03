
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User";
import Product from "./models/Product";
import Category from "./models/Category";
import Order from "./models/Order";

dotenv.config();

const MONGO_URI = process.env.ATLAS_URL || process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const seed = async () => {
    try {
        console.log(`Connecting to MongoDB...`);
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB!");

        // 1. Clear existing data
        console.log("Clearing existing data...");
        await Order.deleteMany({});
        await Product.deleteMany({});
        await Category.deleteMany({});
        console.log("Data cleared.");

        // 2. Seed Admin
        console.log("Seeding Admin...");
        const adminEmail = "maitymalay27747@gmail.com";
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("123456", salt);
        
        await User.findOneAndUpdate(
            { email: adminEmail },
            {
                firstName: "Malay",
                lastName: "Maity",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
                addresses: [{
                   street: "Admin HQ 101",
                   city: "Kolkata",
                   state: "WB",
                   zipCode: "700001",
                   country: "India",
                   phone: "9876543210",
                   isDefault: true
                }],
                wishlist: [],
            },
            { upsert: true, new: true }
        );
        console.log("Admin seeded.");

        // 3. Seed Categories & Subcategories
        console.log("Seeding Categories & Subcategories...");
        const categoriesData = [
            {
                name: "Electronics",
                slug: "electronics",
                description: "Gadgets and tech essentials",
                level: 0,
                subcategories: [
                    { name: "Mobiles", slug: "mobiles", description: "Smartphones and tablets" },
                    { name: "Laptops", slug: "laptops", description: "High-performance notebooks" },
                ]
            },
            {
                name: "Fashion",
                slug: "fashion",
                description: "Premium fashion and clothing",
                level: 0,
                subcategories: [
                    { name: "Men's Wear", slug: "mens-wear", description: "Fashion for him" },
                    { name: "Women's Wear", slug: "womens-wear", description: "Fashion for her" },
                ]
            }
        ];

        const subCategories = [];
        for (const cat of categoriesData) {
            const parent = await Category.create({
                name: cat.name,
                slug: cat.slug,
                description: cat.description,
                level: 0
            });

            const childrenIds = [];
            for (const sub of cat.subcategories) {
                const child = await Category.create({
                    name: sub.name,
                    slug: sub.slug,
                    description: sub.description,
                    parent: parent._id,
                    level: 1
                });
                childrenIds.push(child._id);
                subCategories.push(child);
            }
            parent.children = childrenIds;
            await parent.save();
        }
        console.log("Categories seeded.");

        // 4. Seed Products
        console.log("Seeding Products...");
        const productsRaw = [];
        for (const sub of subCategories) {
            const price = sub.slug.includes("mobiles") ? 999 : 299;
            const img = sub.slug.includes("mobiles") 
                ? "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800"
                : "https://images.unsplash.com/photo-1520975916090-31d041a783b2?w=800";
            
            for (let i = 0; i < 10; i++) {
                const title = `${sub.name} Pro Max ${i + 1}`;
                const slug = `${sub.slug}-${i}-${Date.now()}`;
                productsRaw.push({
                    title,
                    slug,
                    brand: "PremiumBrand",
                    description: "High quality professional product.",
                    category: sub.parent,
                    subCategory: sub._id,
                    images: [img],
                    status: "live",
                    variants: [{
                        color: "Black",
                        size: "M",
                        sku: `SKU-${slug}`,
                        price: price,
                        stock: 100,
                        images: [img]
                    }],
                    ratings: { average: 4.8, count: 15 },
                    material: "Luxury",
                    isExclusive: false
                });
            }
        }
        const createdProducts = await Product.insertMany(productsRaw);
        console.log("Products seeded.");

        // 5. Seed Users
        console.log("Seeding Users...");
        const usersRaw = [];
        for (let i = 0; i < 5; i++) {
            usersRaw.push({
                firstName: "User",
                lastName: `${i}`,
                email: `user${i}${Date.now()}@example.com`,
                password: "password123",
                role: "customer",
                addresses: [{ 
                    street: "123 Street", city: "NYC", state: "NY", zipCode: "10001", country: "USA", phone: "12345", isDefault: true 
                }]
            });
        }
        const createdUsers = await User.insertMany(usersRaw);
        console.log("Users seeded.");

        // 6. Seed Orders
        console.log("Seeding Orders...");
        const ordersRaw = [];
        for (let i = 0; i < 10; i++) {
            const user = createdUsers[i % createdUsers.length];
            const product = createdProducts[i % createdProducts.length];
            const variant = product.variants[0];
            
            ordersRaw.push({
                user: user._id,
                items: [{
                    product: product._id,
                    variantId: variant.sku,
                    quantity: 1,
                    price: Number(variant.price), // Force Number
                    name: String(product.title),
                    image: String(product.images[0])
                }],
                totalAmount: Number(variant.price),
                shippingAddress: {
                    street: "123 Street",
                    city: "NYC",
                    state: "NY",
                    zipCode: "10001",
                    country: "USA",
                    phone: "12345"
                },
                paymentStatus: "paid",
                orderStatus: "delivered",
                paymentProvider: "cod", // Simplest
                estimatedDelivery: new Date(),
                createdAt: new Date()
            });
        }
        await Order.insertMany(ordersRaw);
        console.log("Orders seeded.");

        console.log("ALL DATA SEEDED SUCCESSFULLY!");
        process.exit(0);
    } catch (error) {
        console.error("Critical Failure:", error);
        process.exit(1);
    }
};

seed();
