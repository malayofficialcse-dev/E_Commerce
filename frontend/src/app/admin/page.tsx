"use client";

import React from "react";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Order {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  } | string;
  items: {
    product: {
      name: string;
      image: string;
    };
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    visits: 89200 // Mock for now
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/orders");
      const allOrders = response.data.orders || [];

      // Calculate Stats
      const totalRevenue = allOrders.reduce((acc: number, order: Order) => acc + (order.totalAmount || 0), 0);
      const uniqueCustomers = new Set(allOrders.map((o: Order) => typeof o.user === 'string' ? o.user : o.user?._id)).size;

      setStats({
        revenue: totalRevenue,
        orders: allOrders.length,
        customers: uniqueCustomers,
        visits: 89200
      });

      setRecentOrders(allOrders.slice(0, 5));
      setError(null);
    } catch (err: unknown) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to sync dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: "Total Revenue", value: `$${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, trend: "+20.1%", trendUp: true, icon: CreditCard },
    { name: "Total Orders", value: stats.orders.toString(), trend: "+12.5%", trendUp: true, icon: ShoppingBag },
    { name: "Customers", value: stats.customers.toString(), trend: "+4.2%", trendUp: true, icon: Users },
    { name: "Site Visits", value: "89.2k", trend: "+10.1%", trendUp: true, icon: TrendingUp },
  ];

  if (loading) return (
     <div className="p-20 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground font-bold uppercase tracking-tighter text-xs">Syncing High-Performance Systems...</p>
     </div>
  );

  if (error) return (
     <div className="p-20 text-center text-red-500 font-bold border border-red-500/20 rounded-[40px] m-10 bg-red-500/5">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-xs underline uppercase tracking-widest">Retry Connection</button>
     </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="h-10 px-4 bg-muted border border-border rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-accent transition-all">
              <Clock size={16} />
              Last 30 Days
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.name}
            className="p-8 bg-background rounded-[32px] border border-border shadow-sm group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-muted rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  <stat.icon size={24} />
               </div>
               <div className={`flex items-center gap-1 text-xs font-black ${stat.trendUp ? "text-green-500" : "text-red-500"}`}>
                  {stat.trend}
                  {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
               </div>
            </div>
            <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-1">{stat.name}</h3>
            <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Recent Orders */}
         <div className="lg:col-span-2 bg-background p-10 rounded-[40px] border border-border shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-xl font-black italic">Recent Orders</h2>
               <Link href="/admin/orders" className="text-xs font-black uppercase tracking-widest text-primary border-b border-primary">View All</Link>
            </div>

            <div className="space-y-6">
               {recentOrders.map((order) => (
                 <div key={order._id} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                          <Package size={20} className="text-muted-foreground" />
                       </div>
                       <div>
                          <p className="text-sm font-black">Order #{order._id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground font-medium">
                            {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} Items
                          </p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black">${order.totalAmount.toFixed(2)}</p>
                       <p className={`text-[10px] font-black uppercase tracking-widest ${
                         order.orderStatus === 'delivered' ? 'text-green-500' :
                         order.orderStatus === 'cancelled' ? 'text-red-500' : 'text-blue-500'
                       }`}>{order.orderStatus}</p>
                    </div>
                 </div>
               ))}
               {recentOrders.length === 0 && <p className="text-center text-muted-foreground text-sm">No orders yet.</p>}
            </div>
         </div>

         {/* Stock Alerts (Mock for now or fetch products) */}
         <div className="bg-background text-foreground p-10 rounded-[40px] border border-border shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-primary/20 rounded-full blur-[60px]" />
            <h2 className="text-xl font-black italic mb-10 relative z-10">Low Stock Alerts</h2>
            <div className="space-y-8 relative z-10">
               {/* Keeping mock stock alerts for aesthetic structure until product fetch is added */}
               {[
                 { name: "Executive Silk Blazer", color: "Navy", size: "M", stock: 2 },
                 { name: "Minimalist Leather Backpack", color: "Tan", size: "L", stock: 1 },
                 { name: "Urban Comfort Sneaker", color: "White", size: "10", stock: 0 }
               ].map((item, i) => (
                 <div key={i} className="flex gap-4">
                    <div className={`w-2 rounded-full ${item.stock === 0 ? "bg-red-500" : "bg-orange-500"}`} />
                    <div>
                       <p className="text-sm font-bold">{item.name}</p>
                       <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-black">{item.color} • {item.size}</p>
                       <p className={`text-[10px] font-black mt-2 uppercase tracking-widest ${item.stock === 0 ? "text-red-400" : "text-orange-400"}`}>
                          {item.stock === 0 ? "Out of Stock" : `Only ${item.stock} left`}
                       </p>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full h-14 bg-foreground text-background mt-12 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all">
               Restock Inventory
            </button>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
