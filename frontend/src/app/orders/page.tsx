"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  ChevronRight, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock,
  ArrowLeft
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import api from "@/lib/api";
import Image from "next/image";
// Removed date-fns import

interface OrderItem {
  image: string;
  name: string;
  // Add other properties if they exist in your API response
}

interface Order {
  _id: string;
  items: OrderItem[];
  createdAt: string; // Assuming date comes as a string from the API
  orderStatus: string;
  totalAmount: number;
  // Add other properties if they exist in your API response
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const parsedUser = JSON.parse(storedUser);

      try {
        const { data } = await api.get(`/orders/user/${parsedUser._id}`);
        setOrders(data.orders);
      } catch (error) {
        console.error("Fetch orders error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "placed": return <Clock className="text-amber-500" size={18} />;
      case "packed": return <Package className="text-blue-500" size={18} />;
      case "shipped": return <Truck className="text-indigo-500" size={18} />;
      case "out-for-delivery": return <Truck className="text-primary" size={18} />;
      case "delivered": return <CheckCircle2 className="text-green-500" size={18} />;
      default: return <Clock size={18} />;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
       <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-24 max-w-5xl">
        <div className="flex items-center gap-4 mb-12">
           <Link href="/shop" className="p-2 hover:bg-muted rounded-full transition-colors">
              <ArrowLeft size={24} />
           </Link>
           <h1 className="text-5xl font-black tracking-tight">Purchase History</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-background rounded-[40px] border border-border shadow-sm">
             <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-muted-foreground/30" />
             </div>
              <h2 className="text-xl font-bold mb-2">No orders found</h2>
              <p className="text-muted-foreground mb-8">You haven&apos;t placed any orders yet.</p>
             <Link href="/shop" className="inline-flex h-14 px-8 bg-primary text-white items-center justify-center font-black rounded-2xl hover:scale-105 transition-all">
                Shop Collection
             </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background p-8 rounded-[32px] border border-border hover:shadow-xl hover:shadow-primary/5 transition-all group"
              >
                <Link href={`/orders/${order._id}`} className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                  {/* Order Images Previews */}
                  <div className="flex -space-x-4">
                      {order.items.slice(0, 3).map((item: { image: string }, i: number) => (
                        <div key={i} className="w-20 h-24 rounded-2xl overflow-hidden border-4 border-background bg-muted shadow-sm relative">
                           <Image src={item.image} alt="" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                      ))}
                     {order.items.length > 3 && (
                        <div className="w-20 h-24 rounded-2xl bg-muted flex items-center justify-center text-xs font-black border-4 border-background shadow-sm">
                           +{order.items.length - 3}
                        </div>
                     )}
                  </div>

                  <div className="flex-1 space-y-2">
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Order ID: #{order._id.slice(-6).toUpperCase()}</span>
                        <div className="h-1 w-1 rounded-full bg-border" />
                        <span className="text-[10px] font-bold text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })}</span>
                     </div>
                     <h3 className="text-xl font-black italic tracking-tight uppercase leading-none">
                        {order.items[0].name} {order.items.length > 1 && `& ${order.items.length - 1} Pieces`}
                     </h3>
                     <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full border border-border">
                           {getStatusIcon(order.orderStatus)}
                           <span className="text-[10px] font-black uppercase tracking-widest">{order.orderStatus.replace("-", " ")}</span>
                        </div>
                        <p className="text-lg font-black italic tracking-tighter">${order.totalAmount.toFixed(2)}</p>
                     </div>
                  </div>

                  <div className="w-14 h-14 rounded-full border-2 border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all text-muted-foreground">
                     <ChevronRight size={24} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrdersPage;
