import express from "express";
import {
  createRazorpayOrder,
  verifyPayment,
  getPaymentDetails,
  refundPayment,
} from "../controllers/paymentController";

const router = express.Router();

// Create Razorpay order
router.post("/razorpay/create-order", createRazorpayOrder);

// Verify payment
router.post("/razorpay/verify", verifyPayment);

// Get payment details
router.get("/razorpay/:paymentId", getPaymentDetails);

// Refund payment
router.post("/razorpay/refund", refundPayment);

export default router;
