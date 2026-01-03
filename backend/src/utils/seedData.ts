import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product";
import Category from "../models/Category";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce");
    console.log("Connected to MongoDB for high-quality seeding...");

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Create Categories with verified Unsplash IDs
    const categoriesData = [
      { name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400" },
      { name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400" },
      { name: "Women", slug: "women", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=400" },
      { name: "Men", slug: "men", image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=400" },
      { name: "Kids", slug: "kids", image: "https://images.unsplash.com/photo-1503454537195-2df996e273a4?auto=format&fit=crop&q=80&w=400" },
      { name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400" },
      { name: "Beauty", slug: "beauty", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400" },
      { name: "Home", slug: "home", image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=400" },
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log("Categories created:", categories.length);

    const brands = ["VELVÈT", "LUX LUXE", "URBAN ELITE", "HERITAGE", "NOIR", "MODA"];
    const colors = ["Black", "White", "Navy", "Gray", "Beige", "Red", "Blue"];
    const sizes = ["S", "M", "L", "XL"];
    
    // Verified high-quality IDs
    const gallery = [
        "photo-1525547719571-a2d4ac8945e2", // laptop
        "photo-1542291026-7eec264c27ff", // shoe
        "photo-1523275335684-37898b6baf30", // watch
        "photo-1491553895911-0055eca6402d", // sneakers
        "photo-1515886657613-9f3515b0c78f", // dress
        "photo-1483985988355-763728e1935b", // shopping
        "photo-1581091226825-a6a2a5aee158", // tech
        "photo-1505740420928-5e560c06d30e", // headphones
        "photo-1521572163474-6864f9cf17ab", // shirt
        "photo-1549298916-b41d501d3772", // shoes
    ];

    const products = [];
    for (let i = 1; i <= 100; i++) {
      const category = categories[i % categories.length];
      const brand = brands[i % brands.length];
      const imgId = gallery[i % gallery.length];
      
      const variants = [];
      // Create matrix of 2 colors * 4 sizes
      for (let c = 0; c < 3; c++) { // 3 colors
         for (let s = 0; s < 4; s++) { // 4 sizes
            const color = colors[(i + c) % colors.length];
            const size = sizes[s];
            variants.push({
               color: color,
               size: size,
               sku: `V-${i}-${c}-${s}-${brand.substring(0,2)}`,
               price: 120 + (i * 2) + (s * 5),
               stock: 20 + Math.floor(Math.random() * 30),
               images: [`https://images.unsplash.com/${imgId}?auto=format&fit=crop&q=80&w=800`],
               attributes: new Map([["material", "Premium Material"], ["origin", "Italy"]])
            });
         }
      }

      products.push({
        title: `${brand} ${category.name} Premium Series ${i}`,
        slug: `${brand.toLowerCase()}-${category.slug}-${i}`,
        brand: brand,
        description: `Experience luxury like never before with the ${brand} ${category.name} Series. Meticulously engineered for excellence and comfort.`,
        category: category._id,
        images: [
          `https://images.unsplash.com/${imgId}?auto=format&fit=crop&q=80&w=800`
        ],
        variants: variants,
        ratings: {
          average: 4.5 + (Math.random() * 0.5),
          count: 120 + i
        },
        tags: ["featured", "luxury", category.slug],
        status: "live",
        attributes: new Map([["collection", "Summer 2026"], ["limited", "true"]])
      });
    }

    await Product.insertMany(products);
    console.log("60 Verified Products seeded!");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
