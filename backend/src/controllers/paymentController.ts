import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order";
import Payment from "../models/Payment";

// Lazy initialization of Razorpay to avoid startup errors
let razorpay: Razorpay | null = null;

const getRazorpayInstance = (): Razorpay => {
  if (!razorpay) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId === "your_razorpay_id" || keySecret === "your_razorpay_secret") {
      throw new Error(
        "Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env file"
      );
    }

    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpay;
};

// Create Razorpay Order
export const createRazorpayOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await getRazorpayInstance().orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};

// Verify Razorpay Payment
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Create order in database
      const order = await Order.create({
        user: req.body.userId,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        shippingAddress: orderData.shippingAddress,
        paymentStatus: "paid",
        orderStatus: "placed",
        paymentProvider: "razorpay",
        paymentId: razorpay_payment_id,
      });

      // Create payment record
      await Payment.create({
        transactionId: razorpay_payment_id,
        orderId: order._id,
        userId: req.body.userId,
        provider: "Razorpay",
        amount: orderData.totalAmount,
        currency: "INR",
        signature: razorpay_signature,
        status: "success",
        webhookStatus: "processed",
      });

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        orderId: order._id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error: any) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// Get Payment Details
export const getPaymentDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentId } = req.params;

    const payment = await getRazorpayInstance().payments.fetch(paymentId);

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error: any) {
    console.error("Get payment details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment details",
      error: error.message,
    });
  }
};

// Refund Payment
export const refundPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentId, amount } = req.body;

    const refund = await getRazorpayInstance().payments.refund(paymentId, {
      amount: amount * 100, // Convert to paise
    });

    res.status(200).json({
      success: true,
      refund,
    });
  } catch (error: any) {
    console.error("Refund error:", error);
    res.status(500).json({
      success: false,
      message: "Refund failed",
      error: error.message,
    });
  }
};
