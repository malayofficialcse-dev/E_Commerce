import { Request, Response } from "express";
import Product from "../models/Product";
import "../models/Category"; // Ensure Category model is registered for populate

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.pageNumber) || 1;
    const sort = String(req.query.sort) || "newest";
    
    const query: any = { status: "live" };

    // 1. Search Logic
    if (req.query.q) {
      query.$or = [
        { title: { $regex: String(req.query.q), $options: "i" } },
        { brand: { $regex: String(req.query.q), $options: "i" } },
        { description: { $regex: String(req.query.q), $options: "i" } }
      ];
    } else if (req.query.keyword) {
       query.title = { $regex: String(req.query.keyword), $options: "i" };
    }

    // 2. Category & Subcategory Logic
    if (req.query.categories) {
       const categoryIds = String(req.query.categories).split(",");
       query.category = { $in: categoryIds };
    }

    if (req.query.subCategories) {
       const subCategoryIds = String(req.query.subCategories).split(",");
       query.subCategory = { $in: subCategoryIds };
    }

    // 3. Price Range Logic
    if (req.query.minPrice || req.query.maxPrice) {
       query["variants.price"] = {};
       if (req.query.minPrice) query["variants.price"].$gte = Number(req.query.minPrice);
       if (req.query.maxPrice) query["variants.price"].$lte = Number(req.query.maxPrice);
    }

    // 4. Sort Logic
    let sortOptions: any = { createdAt: -1 }; // default newest
    if (sort === "price-low") sortOptions = { "variants.price": 1 };
    else if (sort === "price-high") sortOptions = { "variants.price": -1 };
    else if (sort === "popular") sortOptions = { "ratings.average": -1 };

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate("category subCategory");

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if ID is a valid ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const product = await Product.findById(id).populate("category subCategory");
      if (product) {
        res.json(product);
        return;
      }
    }

    // If not valid ObjectId or not found, try by slug just in case frontend omitted /slug/
    const productBySlug = await Product.findOne({ slug: id }).populate("category subCategory");
    if (productBySlug) {
      res.json(productBySlug);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate("category subCategory");
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, subCategory, variants, ...otherData } = req.body;

    // 1. Generate Slug
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // 2. Handle Category (Find by name or create if not exists)
    const Category = (await import("../models/Category")).default;
    let categoryId = category;
    
    const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);
    
    if (category && !isValidObjectId(category)) {
       let catDoc = await Category.findOne({ name: category });
       if (!catDoc) {
          catDoc = await Category.create({ 
             name: category, 
             slug: category.toLowerCase().replace(/ /g, "-"),
             level: 0
          });
       }
       categoryId = catDoc._id;
    }

    // Handle SubCategory
    let subCategoryId = subCategory;
    if (subCategory && !isValidObjectId(subCategory)) {
       let subCatDoc = await Category.findOne({ name: subCategory, parent: categoryId });
       if (!subCatDoc) {
          subCatDoc = await Category.create({ 
             name: subCategory, 
             slug: subCategory.toLowerCase().replace(/ /g, "-"),
             parent: categoryId,
             level: 1
          });
       }
       subCategoryId = subCatDoc._id;
    }

    // 3. Process Variants (Generate SKU)
    const processedVariants = variants.map((v: any) => ({
       ...v,
       sku: v.sku || `${slug}-${v.color}-${v.size}-${Date.now().toString().slice(-4)}`.toLowerCase()
    }));

    const product = new Product({
       ...otherData,
       title,
       slug,
       category: categoryId,
       subCategory: subCategoryId,
       variants: processedVariants,
       status: "live"
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error: any) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
       await product.deleteOne(); 
       res.json({ message: "Product removed" });
    } else {
       res.status(404).json({ message: "Product not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
