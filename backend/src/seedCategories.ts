import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

const seedCategories = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    // Clear existing categories for a fresh start (optional, be careful)
    // await Category.deleteMany({});

    const categories = [
      {
        name: "Electronics",
        slug: "electronics",
        description: "Gadgets and tech essentials",
        level: 0,
        subcategories: [
          { name: "Mobiles", slug: "mobiles", description: "Smartphones and tablets" },
          { name: "Laptops", slug: "laptops", description: "High-performance notebooks" },
          { name: "Desktops", slug: "desktops", description: "Workstations and gaming rigs" },
          { name: "Accessories", slug: "electronics-accessories", description: "Cables, chargers, and more" },
        ]
      },
      {
        name: "Apparel",
        slug: "apparel",
        description: "Premium fashion and clothing",
        level: 0,
        subcategories: [
          { name: "Men's Wear", slug: "mens-wear", description: "Fashion for him" },
          { name: "Women's Wear", slug: "womens-wear", description: "Fashion for her" },
          { name: "Footwear", slug: "footwear", description: "Shoes and sneakers" },
        ]
      },
      {
        name: "Home Decor",
        slug: "home-decor",
        description: "Enhance your living space",
        level: 0,
        subcategories: [
          { name: "Furniture", slug: "furniture", description: "Beds, sofas, and tables" },
          { name: "Lighting", slug: "lighting", description: "Lamps and ambiance" },
        ]
      },
      {
        name: "Beauty & Wellness",
        slug: "beauty",
        description: "Self-care and grooming essentials",
        level: 0,
        subcategories: [
          { name: "Skincare", slug: "skincare", description: "Radiant health for your skin" },
          { name: "Fragrances", slug: "fragrances", description: "Signature scents" },
        ]
      },
      {
        name: "Travel & Luggage",
        slug: "travel",
        description: "Gear for your next adventure",
        level: 0,
        subcategories: [
          { name: "Suitcases", slug: "suitcases", description: "Durable travel companions" },
          { name: "Backpacks", slug: "backpacks", description: "Versatile everyday carry" },
        ]
      }
    ];

    for (const catData of categories) {
      // Check if parent exists
      let parent = await Category.findOne({ slug: catData.slug });
      if (!parent) {
        parent = await Category.create({
          name: catData.name,
          slug: catData.slug,
          description: catData.description,
          level: catData.level
        });
        console.log(`Created parent category: ${parent.name}`);
      }

      const childrenIds = [];
      for (const sub of catData.subcategories) {
        let child = await Category.findOne({ slug: sub.slug });
        if (!child) {
          child = await Category.create({
            name: sub.name,
            slug: sub.slug,
            description: sub.description,
            parent: parent._id,
            level: 1
          });
          console.log(`Created subcategory: ${child.name} under ${parent.name}`);
        }
        childrenIds.push(child._id);
      }

      // Update parent with children IDs
      parent.children = childrenIds;
      await parent.save();
    }

    console.log("Seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedCategories();
