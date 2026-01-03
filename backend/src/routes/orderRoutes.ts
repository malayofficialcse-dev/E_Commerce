import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  initiateReturn,
} from "../controllers/orderController";

import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

// Create order
router.post("/", createOrder);

// Get user orders
router.get("/user/:userId", getUserOrders);

// Get order by ID
router.get("/:orderId", getOrderById);

// Update order status
router.patch("/:orderId/status", updateOrderStatus);

// Cancel order
router.patch("/:orderId/cancel", cancelOrder);

// Initiate return
router.post("/:orderId/return", initiateReturn);

// Get all orders (Admin)
router.get("/", protect, admin, getAllOrders);

export default router;
