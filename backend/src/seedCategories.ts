import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category";

dotenv.config();

const MONGO_URI = process.env.ATLAS_URL || process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

const seedCategories = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for category seeding...");

    // Clear existing categories for a clean global taxonomy
    await Category.deleteMany({});
    console.log("Cleared existing categories.");

    const categories = [
      {
        name: "Men",
        slug: "men",
        description: "Premium fashion and grooming for men",
        level: 0,
        subcategories: [
          { name: "Apparel", slug: "mens-apparel", description: "Shirts, Trousers, Suits" },
          { name: "Footwear", slug: "mens-footwear", description: "Formal, Sneakers, Boots" },
          { name: "Accessories", slug: "mens-accessories", description: "Belts, Wallets, Ties" },
          { name: "Grooming", slug: "mens-grooming", description: "Skincare and Fragrances" },
        ]
      },
      {
        name: "Women",
        slug: "women",
        description: "Designer fashion and beauty for women",
        level: 0,
        subcategories: [
          { name: "Apparel", slug: "womens-apparel", description: "Dresses, Tops, Ethnic Wear" },
          { name: "Footwear", slug: "womens-footwear", description: "Heels, Flats, Sneakers" },
          { name: "Handbags", slug: "handbags", description: "Totes, Clutches, Crossbody" },
          { name: "Jewelry", slug: "jewelry", description: "Fine & Fashion Jewelry" },
        ]
      },
      {
        name: "Kids & Children",
        slug: "kids",
        description: "Fashion and play for the little ones",
        level: 0,
        subcategories: [
          { name: "Boys", slug: "boys-fashion", description: "Sizes 2-14y" },
          { name: "Girls", slug: "girls-fashion", description: "Sizes 2-14y" },
          { name: "Infants", slug: "infant-care", description: "Newborn essentials" },
          { name: "Toys", slug: "toys-games", description: "Educational and Fun" },
        ]
      },
      {
        name: "Electronics",
        slug: "electronics",
        description: "State-of-the-art technology",
        level: 0,
        subcategories: [
          { name: "Mobiles", slug: "mobiles", description: "Smartphones & Tablets" },
          { name: "Laptops", slug: "laptops", description: "Work & Gaming" },
          { name: "Audio", slug: "audio", description: "Headphones & Speakers" },
          { name: "Cameras", slug: "cameras", description: "Professional Gear" },
        ]
      },
      {
        name: "Home & Living",
        slug: "home-living",
        description: "Curated furniture and decor",
        level: 0,
        subcategories: [
          { name: "Furniture", slug: "furniture", description: "Sofas, Beds, Tables" },
          { name: "Decor", slug: "home-decor", description: "Art & Accents" },
          { name: "Lighting", slug: "lighting", description: "Modern Illumination" },
          { name: "Kitchen", slug: "kitchen-dining", description: "Premium Cookware" },
        ]
      },
      {
        name: "Sports & Fitness",
        slug: "sports",
        description: "Active gear for every athlete",
        level: 0,
        subcategories: [
          { name: "Activewear", slug: "activewear", description: "Performance Clothing" },
          { name: "Gym Equipment", slug: "gym-gear", description: "Home Fitness" },
          { name: "Outdoor", slug: "outdoor-gear", description: "Hiking & Camping" },
        ]
      }
    ];

    for (const catData of categories) {
      const parent = await Category.create({
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
        level: catData.level
      });
      console.log(`Created parent category: ${parent.name}`);

      const childrenIds = [];
      for (const sub of catData.subcategories) {
        const child = await Category.create({
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
          parent: parent._id,
          level: 1
        });
        console.log(`Created subcategory: ${child.name} under ${parent.name}`);
        childrenIds.push(child._id);
      }

      parent.children = childrenIds;
      await parent.save();
    }

    console.log("Category seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedCategories();
