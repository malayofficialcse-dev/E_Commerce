import { Request, Response } from "express";
import User from "../models/User";
import Product from "../models/Product";

// Get User Wishlist
export const getWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("wishlist");
    
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error: any) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Add to Wishlist
export const addToWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    // Check if already in wishlist
    if (user.wishlist.includes(productId)) {
      res.status(400).json({ success: false, message: "Product already in wishlist" });
      return;
    }

    user.wishlist.push(productId);
    await user.save();

    const populatedUser = await User.findById(userId).populate("wishlist");

    res.status(200).json({ 
      success: true, 
      message: "Added to wishlist", 
      wishlist: populatedUser?.wishlist 
    });
  } catch (error: any) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Remove from Wishlist
export const removeFromWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    const populatedUser = await User.findById(userId).populate("wishlist");

    res.status(200).json({ 
      success: true, 
      message: "Removed from wishlist", 
      wishlist: populatedUser?.wishlist 
    });
  } catch (error: any) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
// Get All Users (Admin)
export const getUsers = async (req: Request, res: Response): Promise<void> => {
   try {
     const users = await User.find({}).select("-password").sort({ createdAt: -1 });
     res.status(200).json({ success: true, users });
   } catch (error: any) {
     console.error("Get users error:", error);
     res.status(500).json({ success: false, message: "Server error", error: error.message });
   }
};
