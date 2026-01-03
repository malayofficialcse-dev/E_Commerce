import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product";
import Category from "./models/Category";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";

const seedProducts = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for product seeding...");

    // Clear existing products for a fresh start
    await Product.deleteMany({});
    console.log("Cleared existing products.");
    const categories = await Category.find({ parent: { $ne: null } });
    if (categories.length === 0) {
      console.log("No subcategories found. Please run seedCategories first.");
      process.exit(1);
    }

    const productsData: any[] = [];

    // Helper to generate a realistic product based on subcategory
    const getProductTemplates = (subCatSlug: string) => {
      switch (subCatSlug) {
        case "mobiles":
          return [
            { title: "iPhone 15 Pro Max", brand: "Apple", price: 1199, img: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800", desc: "Titanium design, A17 Pro chip, and the most powerful iPhone camera system ever." },
            { title: "Galaxy S24 Ultra", brand: "Samsung", price: 1299, img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800", desc: "Experience the next level of mobile with Galaxy AI and the ultimate 200MP camera." },
            { title: "Pixel 8 Pro", brand: "Google", price: 999, img: "https://images.unsplash.com/photo-1598327105666-6f38991b1764?w=800", desc: "The all-pro phone engineered by Google, with a sophisticated design and advanced cameras." },
            { title: "OnePlus 12", brand: "OnePlus", price: 799, img: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800", desc: "Smooth Beyond Belief. Snapdragon 8 Gen 3 and 4th Gen Hasselblad Camera." },
            { title: "Nothing Phone (2)", brand: "Nothing", price: 599, img: "https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=800", desc: "A new era of design. Unique Glyph Interface and powerful performance." },
          ];
        case "laptops":
          return [
            { title: "MacBook Pro 16 M3 Max", brand: "Apple", price: 3499, img: "https://images.unsplash.com/photo-1517336714731-289b14296210?w=800", desc: "The world's most advanced chips for personal computers. Incredible performance and battery life." },
            { title: "Dell XPS 15", brand: "Dell", price: 1899, img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800", desc: "Breathtaking display and desktop-level performance. Masterfully crafted with premium materials." },
            { title: "Razer Blade 16", brand: "Razer", price: 2999, img: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800", desc: "The ultimate gaming laptop. Pure power and premium build for gamers and creators." },
            { title: "ASUS ROG Zephyrus G14", brand: "ASUS", price: 1599, img: "https://images.unsplash.com/photo-1496181754221-f052159c4717?w=800", desc: "Compact power. The world’s most powerful 14-inch gaming laptop." },
            { title: "Lenovo ThinkPad X1 Carbon", brand: "Lenovo", price: 1499, img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800", desc: "The gold standard for business productivity. Ultra-light and incredibly durable." },
          ];
        case "desktops":
          return [
            { title: "Mac Studio", brand: "Apple", price: 1999, img: "https://images.unsplash.com/photo-1587831990711-23ca64417622?w=800", desc: "Compact powerhouse. Transformed by M2 Max and M2 Ultra chips." },
            { title: "Alienware Aurora R16", brand: "Alienware", price: 2499, img: "https://images.unsplash.com/photo-1527443224854-5b2505481b31?w=800", desc: "Immersive gaming performance with legendary Alienware design and Liquid Cooling." },
            { title: "HP Envy Desktop", brand: "HP", price: 999, img: "https://images.unsplash.com/photo-1610433200770-b186fc507005?w=800", desc: "Designed to fuel your creativity. Powerful performance meets elegant design." },
            { title: "MSI Infinite RS", brand: "MSI", price: 3999, img: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800", desc: "Beyond Fast. Equipped with the latest RTX 4090 and Intel i9 internals." },
            { title: "Custom Gaming PC Pro", brand: "Antigravity", price: 1799, img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800", desc: "Hand-built for extreme performance. RGB lighting and optimized airflow." },
          ];
        case "electronics-accessories":
          return [
            { title: "Sony WH-1000XM5", brand: "Sony", price: 399, img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800", desc: "Industry-leading noise cancellation. Exceptional sound quality and crystalline calls." },
            { title: "Keychron Q3 Pro", brand: "Keychron", price: 199, img: "https://images.unsplash.com/photo-1606223122393-040056377c0f?w=800", desc: "A fully customizable mechanical keyboard with QMK/VIA support and premium aluminum body." },
            { title: "Logitech MX Master 3S", brand: "Logitech", price: 99, img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800", desc: "An icon remastered. Precision tracking and quiet clicks for ultimate productivity." },
            { title: "AirPods Pro Gen 2", brand: "Apple", price: 249, img: "https://images.unsplash.com/photo-1588423770d14-b2939227a31d?w=800", desc: "Magic like you’ve never heard. Active Noise Cancellation and Adaptive Transparency." },
            { title: "Samsung 990 Pro 2TB", brand: "Samsung", price: 179, img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800", desc: "Reach maximum performance with PCIe 4.0. Experience long-lasting, industry-leading speed." },
          ];
        case "mens-wear":
          return [
            { title: "Premium Wool Overcoat", brand: "VelvetLuxe", price: 450, img: "https://images.unsplash.com/photo-1520975916090-31d041a783b2?w=800", desc: "Meticulously crafted from Italian wool. A timeless silhouette for the modern gentleman." },
            { title: "Japanese Selvedge Denim", brand: "IndigoSoul", price: 220, img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800", desc: "Sanforized raw denim. Built to fade and last a lifetime." },
            { title: "Cashmere Sweater", brand: "VelvetLuxe", price: 180, img: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=800", desc: "Ultra-soft Mongolian cashmere. Lightweight warmth for all-season layering." },
            { title: "Tailored Linen Shirt", brand: "Riviera", price: 95, img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800", desc: "Breathable European flax linen. Perfect for summer evenings and tropical getaways." },
            { title: "Leather Biker Jacket", brand: "RoughCut", price: 550, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800", desc: "Full-grain cowhide leather with heavy-duty brass hardware. An iconic rebel staple." },
          ];
        case "womens-wear":
          return [
            { title: "Silk Evening Gown", brand: "VelvetLuxe", price: 890, img: "https://images.unsplash.com/photo-1483985988355-79d744f4ed3c?w=800", desc: "Ethereal silk charmeuse. Designed to drape beautifully for unforgettable nights." },
            { title: "Oversized Trench Coat", brand: "Minimalist", price: 320, img: "https://images.unsplash.com/photo-1503342217505-b0a15cc3264c?w=800", desc: "Water-resistant cotton gabardine. A chic staple for transitioning through the seasons." },
            { title: "Knitted Midi Dress", brand: "ComfortZone", price: 140, img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800", desc: "Ribbed organic cotton blend. Contours the body while providing maximum comfort." },
            { title: "Floral Chiffon Blouse", brand: "Flora", price: 85, img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800", desc: "Delicate and airy. Featuring a custom hand-painted floral motif." },
            { title: "High-Rise Palazzo Pants", brand: "Riviera", price: 120, img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800", desc: "Wide-leg silhouette in premium crepe fabric. Sophistication in every step." },
          ];
        case "footwear":
          return [
            { title: "Classic White Sneakers", brand: "SolePure", price: 125, img: "https://images.unsplash.com/photo-1549298910-bc81ad219812?w=800", desc: "Minimalist leather sneakers. Versatile enough for suits or weekend wear." },
            { title: "Leather Chelsea Boots", brand: "CobblerSmith", price: 210, img: "https://images.unsplash.com/photo-1638247025967-b4e38f787b7a?w=800", desc: "Hand-finished Italian leather. Built on a Goodyear welt for lifelong durability." },
            { title: "Performance Running Shoes", brand: "SpeedTech", price: 160, img: "https://images.unsplash.com/photo-1542291026-614216962497?w=800", desc: "Carbon-fiber plate and ultra-responsive foam. Shatter your personal bests." },
            { title: "Strappy Suede Heels", brand: "VelvetLuxe", price: 195, img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800", desc: "Luxurious goat suede. A delicate yet structured design for formal elegance." },
            { title: "Canvas High-Tops", brand: "UrbanStep", price: 65, img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800", desc: "Durable cotton canvas with reinforced stitching. An streetwear essential." },
          ];
        case "furniture":
          return [
            { title: "Mid-Century Modern Sofa", brand: "Haven", price: 1450, img: "https://images.unsplash.com/photo-1555041469-a286c5959145?w=800", desc: "Kiln-dried hardwood frame and top-grain leather. The centerpiece of any living room." },
            { title: "Solid Oak Dining Table", brand: "ForestEdge", price: 899, img: "https://images.unsplash.com/photo-1530018607912-eff2df114f11?w=800", desc: "Expandable surface with a natural oil finish. Crafted to bring people together." },
            { title: "Ergonomic Lounge Chair", brand: "Zenith", price: 650, img: "https://images.unsplash.com/photo-1524758631621-af9fed425ffc?w=800", desc: "Designed for total relaxation. Molded plywood and premium fabric upholstery." },
            { title: "Minimalist Bed Frame", brand: "SleepQuiet", price: 750, img: "https://images.unsplash.com/photo-1505693419148-ad30b35ceb3a?w=800", desc: "Floating design with integrated slatted base. Silence and style for your bedroom." },
            { title: "Marble Coffee Table", brand: "LuxeVibe", price: 420, img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800", desc: "Genuine Carrara marble atop a geometric brass base. Modern luxury defined." },
          ];
        case "lighting":
          return [
            { title: "Articulated Floor Lamp", brand: "Lumen", price: 299, img: "https://images.unsplash.com/photo-1534073828943-f801091bb2a0?w=800", desc: "Adjustable height and warm LED bulb included. Industrial chic for your reading nook." },
            { title: "Crystal Chandelier", brand: "Glimmer", price: 1200, img: "https://images.unsplash.com/photo-1513506495262-359c247094c1?w=800", desc: "Hand-cut K9 crystals. A statement of pure opulence and refraction." },
            { title: "Modern Pendant Light", brand: "Minimal", price: 145, img: "https://images.unsplash.com/photo-1520691528527-19a9411fe984?w=800", desc: "Matte black aluminum with a warm inner glow. Perfect for kitchen islands." },
            { title: "Smart Ambient Lamp", brand: "TechGlow", price: 180, img: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800", desc: "16 million colors and voice control. Set the mood with a single tap." },
            { title: "Geometric Table Lamp", brand: "Sculpt", price: 110, img: "https://images.unsplash.com/photo-1507473885765-e6ed657ba711?w=800", desc: "Concrete base with a frosted glass orb. Diffused light for soft ambiance." },
          ];
        case "skincare":
          return [
            { title: "Hyaluronic Acid Serum", brand: "GlowLab", price: 45, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800", desc: "Deep hydration with multi-molecular weight HA. Plumps and smooths instantly." },
            { title: "Retinol Night Cream", brand: "DermaElite", price: 85, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800", desc: "Advanced 1% pure retinol. Reduces fine lines and improves skin texture overnight." },
            { title: "Vitamin C Brightening Oil", brand: "Lumiere", price: 65, img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800", desc: "Powerful antioxidant blend. Evens skin tone and provides a radiant, healthy glow." },
            { title: "Gentle Foaming Cleanser", brand: "PureBase", price: 28, img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800", desc: "pH-balanced formula with botanical extracts. Cleanses without stripping moisture." },
          ];
        case "fragrances":
          return [
            { title: "Midnight Jasmine Oud", brand: "Essence Royale", price: 210, img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800", desc: "A mysterious blend of night-blooming jasmine and deep Cambodian oud." },
            { title: "Coastal Cedarwood", brand: "AquaNote", price: 145, img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800", desc: "Salt-sprayed cedar and bergamot. Capturing the essence of the rugged coastline." },
            { title: "Vanilla Bourbon Extract", brand: "Gourmand", price: 120, img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800", desc: "Warm, sweet, and smoky. Infused with Madagascar vanilla and aged oak notes." },
          ];
        case "suitcases":
          return [
            { title: "Hard-Shell Polycarbonate Carry-On", brand: "Voyage", price: 295, img: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800", desc: "Unbreakable shell with 360-degree silent spinner wheels. Meets all airline standards." },
            { title: "Aluminum Check-In Trunk", brand: "Horizon", price: 650, img: "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=800", desc: "Aerospace-grade aluminum. Maximum security and style for long-haul travels." },
          ];
        case "backpacks":
          return [
            { title: "Commuter Roll-Top Backpack", brand: "UrbanPace", price: 135, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800", desc: "Waterproof fabric with dedicated 16-inch laptop compartment. Designed for the city." },
            { title: "Tactical Adventure Rucksack", brand: "Pathfinder", price: 180, img: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800", desc: "MIL-SPEC materials with MOLLE attachment points. Ready for any expedition." },
          ];
        default:
          return [];
      }
    };

    const colors = ["Space Gray", "Silver", "Midnight", "Olive", "Mustard", "Classic Black", "Pure White", "Crimson"];
    const sizes = ["S", "M", "L", "XL", "XXL", "One Size", "32", "34", "38", "40", "42"];

    for (const cat of categories) {
      const templates = getProductTemplates(cat.slug);
      console.log(`Generating 50 products for ${cat.name}...`);

      for (let i = 0; i < 50; i++) {
        const template = templates[i % templates.length];
        const productIndex = i + 1;
        const baseTitle = template.title;
        // Add a bit of variation to titles for "real" feel beyond just numbers
        const variations = ["Pro", "Plus", "Ultra", "Classic", "Limited Edition", "Signature", "Heritage", "Modern", "Essential", "Elite"];
        const variantSuffix = variations[i % variations.length];
        const title = i === 0 ? baseTitle : `${baseTitle} - ${variantSuffix} ${productIndex}`;
        
        const slug = `${cat.slug}-${title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, "")}-${i}`;

        // Create variants
        const numVariants = Math.floor(Math.random() * 3) + 1;
        const productVariants = [];
        for (let v = 0; v < numVariants; v++) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          const size = sizes[Math.floor(Math.random() * sizes.length)];
          productVariants.push({
            color,
            size,
            sku: `${slug}-${color.slice(0, 2)}-${size}-${v}`.toLowerCase(),
            price: template.price + (Math.random() * 50 - 25), // varied price
            stock: Math.floor(Math.random() * 100) + 10,
            images: [template.img],
            attributes: new Map([["material", "Premium"], ["origin", "Global"]])
          });
        }

        productsData.push({
          title,
          slug,
          brand: template.brand,
          description: template.desc,
          category: cat.parent,
          subCategory: cat._id,
          images: [template.img],
          variants: productVariants,
          status: "live",
          ratings: {
            average: 4 + Math.random(),
            count: Math.floor(Math.random() * 500) + 10
          },
          tags: [cat.slug, template.brand.toLowerCase(), "premium"],
          material: "Various"
        });
      }
    }

    // Insert in batches
    const batchSize = 100;
    for (let i = 0; i < productsData.length; i += batchSize) {
      const batch = productsData.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(productsData.length / batchSize)}`);
    }

    console.log("Product seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("Product seeding failed:", error);
    process.exit(1);
  }
};

seedProducts();
