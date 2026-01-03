import express from "express";
import { getWishlist, addToWishlist, removeFromWishlist, getUsers } from "../controllers/userController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, admin, getUsers);
router.get("/:userId/wishlist", getWishlist);
router.post("/:userId/wishlist", addToWishlist);
router.delete("/:userId/wishlist/:productId", removeFromWishlist);

export default router;
