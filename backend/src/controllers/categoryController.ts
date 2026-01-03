import { Request, Response } from "express";
import Category from "../models/Category";

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ parent: null }).populate("parent");
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const subCategories = await Category.find({ parent: req.params.parentId });
    res.json(subCategories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, slug, description, parent, image, level } = req.body;
    const category = new Category({ name, slug, description, parent, image, level });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const getCategoryTree = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ parent: null })
      .populate({
        path: 'children',
        populate: {
          path: 'children'
        }
      });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
