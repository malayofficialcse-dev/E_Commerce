import express from "express";
import { getProducts, getProductById, createProduct, getProductBySlug, deleteProduct } from "../controllers/productController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getProducts);
router.get("/slug/:slug", getProductBySlug);
router.route("/:id").get(getProductById).delete(protect, admin, deleteProduct);
router.post("/", protect, admin, createProduct);

export default router;
