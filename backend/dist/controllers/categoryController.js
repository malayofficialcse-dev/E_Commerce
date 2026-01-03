"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = exports.getSubCategories = exports.getCategories = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const getCategories = async (req, res) => {
    try {
        const categories = await Category_1.default.find({ parent: null }).populate("parent");
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCategories = getCategories;
const getSubCategories = async (req, res) => {
    try {
        const subCategories = await Category_1.default.find({ parent: req.params.parentId });
        res.json(subCategories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getSubCategories = getSubCategories;
const createCategory = async (req, res) => {
    try {
        const { name, slug, description, parent, image, level } = req.body;
        const category = new Category_1.default({ name, slug, description, parent, image, level });
        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createCategory = createCategory;
