import express from "express";
import { getCategories, getSubCategories, createCategory, getCategoryTree } from "../controllers/categoryController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getCategories);
router.get("/tree", getCategoryTree);
router.get("/:parentId/sub", getSubCategories);
router.post("/", protect, admin, createCategory);

export default router;
