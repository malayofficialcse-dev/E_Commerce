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
            { title: "iPhone 15 Pro Max", brand: "Apple", price: 1599, img: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800", desc: "Titanium design, A17 Pro chip, and the most powerful iPhone camera system ever." },
            { title: "Galaxy S24 Ultra", brand: "Samsung", price: 1499, img: "https://images.unsplash.com/photo-1707148591060-64359489569e?q=80&w=800", desc: "Experience the next level of mobile with Galaxy AI and the ultimate 200MP camera." },
            { title: "Hasselblad H6D-100c", brand: "Hasselblad", price: 32999, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800", desc: "The ultimate medium format camera for professional high-end photography." },
            { title: "Vertu Signature V", brand: "Vertu", price: 12500, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800", desc: "Hand-crafted luxury mobile phone with sapphire crystal screen and exotic leathers." },
          ];
        case "laptops":
          return [
            { title: "MacBook Pro 16 M3 Max", brand: "Apple", price: 4499, img: "https://images.unsplash.com/photo-1517336714731-289b14296210?q=80&w=800", desc: "The world's most advanced chips for personal computers. 128GB Unified Memory." },
            { title: "Razer Blade 16 Mercury", brand: "Razer", price: 4299, img: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800", desc: "Mini-LED Dual Mode Display with GeForce RTX 4090 power." },
            { title: "ASUS ProArt Studiobook", brand: "ASUS", price: 3999, img: "https://images.unsplash.com/photo-1496181754221-f052159c4717?q=80&w=800", desc: "The ultimate creative laptop with physical dial and 3.2K OLED display." },
          ];
        case "desktops":
          return [
            { title: "Mac Studio Ultra", brand: "Apple", price: 7999, img: "https://images.unsplash.com/photo-1587831990711-23ca64417622?q=80&w=800", desc: "Compact powerhouse with M2 Ultra chip, 192GB memory, and 8TB SSD." },
            { title: "Alienware Aurora R16 Elite", brand: "Alienware", price: 4999, img: "https://images.unsplash.com/photo-1527443224854-5b2505481b31?q=80&w=800", desc: "Unmatched gaming performance with liquid-cooled 14th Gen i9 / RTX 4090." },
          ];
        case "electronics-accessories":
          return [
            { title: "Focal Utopia Headphones", brand: "Focal", price: 4999, img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800", desc: "The ultimate high-fidelity headphones with pure Beryllium 'M'-shaped domes." },
            { title: "Leica Summilux-M 35mm", brand: "Leica", price: 5995, img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=800", desc: "The reference lens for street photography. Legendary sharpness and bokeh." },
            { title: "Devialet Phantom I", brand: "Devialet", price: 3499, img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800", desc: "Implosive sound, zero distortion. A masterpiece of audio engineering." },
          ];
        case "mens-wear":
          return [
            { title: "Bespoke Three-Piece Suit", brand: "SavileRow", price: 4500, img: "https://images.unsplash.com/photo-1594932224491-fa55181e84bb?q=80&w=800", desc: "Hand-tailored from Super 150s Merino wool. The pinnacle of masculine elegance." },
            { title: "Patek Philippe Nautilus", brand: "Patek Philippe", price: 125000, img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800", desc: "Original steel luxury sports watch with blue sunburst dial." },
            { title: "Alligator Skin Loafers", brand: "Gucci", price: 3800, img: "https://images.unsplash.com/photo-1638247025967-b4e38f787b7a?q=80&w=800", desc: "Exotic alligator leather with gold-tone Horsebit hardware." },
          ];
        case "womens-wear":
          return [
            { title: "Haute Couture Gown", brand: "Valentino", price: 18000, img: "https://images.unsplash.com/photo-1483985988355-79d744f4ed3c?q=80&w=800", desc: "One-of-a-kind silk organza gown with hand-embroidered floral motifs." },
            { title: "Hermès Birkin 35 Gold", brand: "Hermès", price: 28500, img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800", desc: "The most iconic handbag in the world. Crafted from Togo leather with gold hardware." },
            { title: "Diamond Riviera Necklace", brand: "Tiffany & Co.", price: 45000, img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800", desc: "Stunning 15-carat total weight of round brilliant diamonds set in platinum." },
          ];
        case "footwear":
          return [
            { title: "Loro Piana Summer Walk", brand: "Loro Piana", price: 950, img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800", desc: "The ultimate casual luxury shoe in refined suede." },
            { title: "Christian Louboutin Kate", brand: "Louboutin", price: 795, img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800", desc: "Classic black patent leather pumps with iconic red soles." },
            { title: "Bespoke Oxford Shoes", brand: "JohnLobb", price: 2100, img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800", desc: "Made-to-measure museum calf leather oxfords." },
          ];
        case "furniture":
          return [
            { title: "Eames Lounge Chair", brand: "Herman Miller", price: 6500, img: "https://images.unsplash.com/photo-1555041469-a286c5959145?q=80&w=800", desc: "Design icon in Santos Palisander veneer and premium black leather." },
            { title: "Cloud Feather Sofa", brand: "Restoration Hardware", price: 12000, img: "https://images.unsplash.com/photo-1530018607912-eff2df114f11?q=80&w=800", desc: "The world's most comfortable sofa, featuring premium goose down cushions." },
          ];
        case "lighting":
          return [
            { title: "Flos Arco Floor Lamp", brand: "Flos", price: 3495, img: "https://images.unsplash.com/photo-1534073828943-f801091bb2a0?q=80&w=800", desc: "Classic Italian architecture-inspired floor lamp with Carrara marble base." },
            { title: "Baccarat Zenith Chandelier", brand: "Baccarat", price: 25000, img: "https://images.unsplash.com/photo-1513506495262-359c247094c1?q=80&w=800", desc: "Majestic 24-light crystal chandelier with legendary clear crystal precision." },
          ];
        case "skincare":
          return [
            { title: "Crème de la Mer Ultra", brand: "La Mer", price: 550, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800", desc: "Miracle Broth-infused luxury cream for deep skin transformation." },
            { title: "Clavis Platinum Serum", brand: "Clé de Peau", price: 800, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800", desc: "Unlocking skin's ultimate potential with precious platinum particles." },
          ];
        case "fragrances":
          return [
            { title: "Roja Parfums Haute Luxe", brand: "Roja Parfums", price: 3500, img: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800", desc: "Gold flakes suspended in the finest perfume oils ever created." },
            { title: "Clive Christian No. 1", brand: "Clive Christian", price: 850, img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800", desc: "The definitive luxury scent, once the world's most expensive perfume." },
          ];
        case "suitcases":
          return [
            { title: "Rimowa Original Trunk", brand: "Rimowa", price: 2200, img: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?q=80&w=800", desc: "High-end anodized aluminum with iconic grooves and TSA locks." },
            { title: "Louis Vuitton Horizon 55", brand: "Louis Vuitton", price: 3400, img: "https://images.unsplash.com/photo-1581553680321-4fffae59fccd?q=80&w=800", desc: "Monogram canvas with titanium accents. The future of luxury travel." },
          ];
        case "backpacks":
          return [
            { title: "Prada Re-Nylon Backpack", brand: "Prada", price: 2100, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800", desc: "Sustainably sourced luxury nylon with Saffiano leather trim." },
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
