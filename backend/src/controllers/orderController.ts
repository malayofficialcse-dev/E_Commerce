import { Request, Response } from "express";
import Order from "../models/Order";
import Payment from "../models/Payment";
import User from "../models/User";

// Create Order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentProvider = "cod",
    } = req.body;

    // Calculate estimated delivery (7 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      shippingAddress,
      paymentStatus: paymentProvider === "cod" ? "pending" : "paid",
      orderStatus: "placed",
      paymentProvider,
      estimatedDelivery,
      currentLocation: {
        lat: 28.6139, // Default New Delhi for demo
        lng: 77.2090,
        address: "Sorting Facility, New Delhi"
      }
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Get User Orders
export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Get Order by ID
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// Update Order Status
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { orderStatus, trackingId, currentLocation, description } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingId) order.trackingId = trackingId;
    if (currentLocation) order.currentLocation = currentLocation;

    // Add to tracking history
    if (!order.trackingHistory) order.trackingHistory = [];
    order.trackingHistory.push({
      status: orderStatus || order.orderStatus,
      location: currentLocation?.address || "Logistics Hub",
      description: description || `Order stage updated to ${orderStatus || order.orderStatus}`,
      timestamp: new Date(),
    });

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// Cancel Order
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    if (order.orderStatus === "shipped" || order.orderStatus === "delivered") {
      res.status(400).json({
        success: false,
        message: "Cannot cancel order that has been shipped or delivered",
      });
      return;
    }

    order.orderStatus = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error: any) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};

// Get All Orders (Admin)
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .populate({
        path: "items.product",
        populate: { path: "category" }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Initiate Return
export const initiateReturn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    if (order.orderStatus !== "delivered") {
      res.status(400).json({
        success: false,
        message: "Return can only be initiated for delivered orders",
      });
      return;
    }

    // Update return data
    order.returnData = {
      status: "requested",
      reason,
      requestedAt: new Date(),
    };

    // Keep orderStatus as delivered but add return request flag or change status
    order.orderStatus = "return-requested";
    
    // Add to tracking history
    if (!order.trackingHistory) order.trackingHistory = [];
    order.trackingHistory.push({
      status: "Return Requested",
      location: "Customer Location",
      description: `Return initiated for reason: ${reason}`,
      timestamp: new Date(),
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Return request initiated successfully",
      order,
    });
  } catch (error: any) {
    console.error("Initiate return error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initiate return",
      error: error.message,
    });
  }
};
