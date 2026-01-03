"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const getProducts = async (req, res) => {
    try {
        const pageSize = 12;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: String(req.query.keyword),
                    $options: "i",
                },
            }
            : {};
        const category = req.query.category ? { category: String(req.query.query ? req.query.category : req.query.category) } : {};
        const query = { ...keyword, status: "live" };
        if (req.query.category) {
            query.category = req.query.category;
        }
        const count = await Product_1.default.countDocuments(query);
        const products = await Product_1.default.find(query)
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id).populate("category subCategory");
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ message: "Product not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    try {
        const product = new Product_1.default(req.body);
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createProduct = createProduct;
