"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  MousePointerClick
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

interface MonthlyData {
  name: string;
  total: number;
  count: number;
  [key: string]: string | number | undefined; 
}

interface CategoryData {
  name: string;
  value: number;
  [key: string]: string | number | undefined;
}

interface AnalyticsState {
  revenue: number;
  customers: number;
  orders: number;
  avgOrderValue: number;
  recentGrowth: string;
  monthly: MonthlyData[];
  categories: CategoryData[];
}

const AnalyticsPage = () => {
  const [data, setData] = useState<AnalyticsState>({
    revenue: 0,
    customers: 0,
    orders: 0,
    avgOrderValue: 0,
    recentGrowth: "+12.5%",
    monthly: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: orderRes } = await api.get("/orders");
        
        const orders = orderRes.orders || [];
        
        // 1. Basic Stats
        const totalRevenue = orders.reduce((acc: number, o: any) => acc + (o.totalAmount || 0), 0);
        const uniqueUsers = new Set(orders.map((o: any) => o.user?._id || o.user)).size;
        const avgOrder = orders.length > 0 ? totalRevenue / orders.length : 0;

        // 2. Monthly Data (Trends)
        const monthlyRecords: { [key: string]: { total: number, count: number } } = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const now = new Date();

        for (let i = 11; i >= 0; i--) {
           const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
           const key = `${months[d.getMonth()]} ${d.getFullYear() % 100}`;
           monthlyRecords[key] = { total: 0, count: 0 };
        }

        orders.forEach((o: any) => {
           if (!o.createdAt) return;
           const d = new Date(o.createdAt);
           const key = `${months[d.getMonth()]} ${d.getFullYear() % 100}`;
           if (monthlyRecords[key] !== undefined) {
              monthlyRecords[key].total += (o.totalAmount || 0);
              monthlyRecords[key].count += 1;
           }
        });

        const sortedMonthly = Object.entries(monthlyRecords).map(([name, val]) => ({ 
           name, 
           total: val.total,
           count: val.count
        }));

        // 3. Category Data (Distribution)
        const categoryMap: { [key: string]: number } = {};
        orders.forEach((o: any) => {
           o.items?.forEach((item: any) => {
              const catName = item.product?.category?.name || "Other";
              categoryMap[catName] = (categoryMap[catName] || 0) + (item.price * item.quantity);
           });
        });

        const sortedCategories = Object.entries(categoryMap)
           .map(([name, value]) => ({ name, value }))
           .sort((a, b) => b.value - a.value)
           .slice(0, 5);

        setData({
          revenue: totalRevenue,
          customers: uniqueUsers,
          orders: orders.length,
          avgOrderValue: avgOrder,
          recentGrowth: "+24.8%",
          monthly: sortedMonthly,
          categories: sortedCategories
        });
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch analytics", err);
        setError(err.response?.data?.message || "Failed to connect to the server. Check if the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const metrics = [
    { title: "Total Revenue", value: `$${data.revenue.toLocaleString()}`, change: data.recentGrowth, isPositive: true, icon: DollarSign },
    { title: "Total Customers", value: data.customers.toString(), change: "+5.4%", isPositive: true, icon: Users },
    { title: "Average Order", value: `$${data.avgOrderValue.toFixed(2)}`, change: "+2.1%", isPositive: true, icon: Activity },
    { title: "Total Orders", value: data.orders.toString(), change: "+8.1%", isPositive: true, icon: MousePointerClick },
  ];

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

  if (loading) return (
     <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
           <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Analyzing Market Data...</p>
        </div>
     </div>
  );

  if (error) return (
     <div className="p-10 text-center bg-red-500/10 border border-red-500/20 rounded-[40px] m-10">
        <h2 className="text-xl font-black text-red-500 mb-2">Connection Error</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <button 
           onClick={() => window.location.reload()}
           className="px-6 py-2 bg-red-500 text-white rounded-full font-black text-xs uppercase tracking-widest"
        >
           Retry Connection
        </button>
     </div>
  );

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Analytics Intelligence</h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">Enterprise-grade insights for your luxury brand.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-background rounded-[28px] border border-border shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-muted rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <metric.icon size={20} />
               </div>
               <div className={`flex items-center gap-1 text-xs font-black ${metric.isPositive ? "text-green-500" : "text-red-500"}`}>
                  {metric.change}
                  {metric.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
               </div>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{metric.title}</p>
            <h3 className="text-2xl font-black tracking-tight">{metric.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Revenue Trend Line Chart */}
        <div className="lg:col-span-2 p-8 bg-background rounded-[40px] border border-border shadow-sm min-h-[450px] flex flex-col relative overflow-hidden group">
           <div className="flex justify-between items-center mb-10 relative z-10">
              <h3 className="text-lg font-black tracking-tight uppercase italic">Revenue Momentum</h3>
              <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                 <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Net Sales</span>
              </div>
           </div>
           
           <div className="flex-1 w-full h-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data.monthly}>
                    <defs>
                       <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: '900'}}
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: '900'}}
                       tickFormatter={(v) => `$${v/1000}k`}
                    />
                    <Tooltip 
                       contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '12px' }}
                       itemStyle={{ color: 'var(--foreground)', fontSize: '12px', fontWeight: 'bold' }}
                       labelStyle={{ color: 'var(--muted-foreground)', fontSize: '10px', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Category Pie Chart */}
        <div className="p-8 bg-background text-foreground border border-border rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
           <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-primary/20 rounded-full blur-[60px]" />
           <h3 className="text-lg font-black italic mb-8 relative z-10">Inventory Share</h3>
           
           <div className="flex-1 relative z-10 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={data.categories}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={8}
                       dataKey="value"
                    >
                       {data.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '12px' }}
                    />
                 </PieChart>
              </ResponsiveContainer>
           </div>

           <div className="space-y-4 relative z-10 mt-6">
              {data.categories.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                   </div>
                   <span className="text-[10px] text-muted-foreground font-black">${item.value.toLocaleString()}</span>
                </div>
              ))}
              {data.categories.length === 0 && <p className="text-center text-muted-foreground text-xs mt-10">No category data available.</p>}
           </div>
        </div>

        {/* Orders Bar Chart */}
        <div className="lg:col-span-3 p-8 bg-background rounded-[40px] border border-border shadow-sm min-h-[350px] flex flex-col">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black tracking-tight uppercase italic">Order Volume</h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Transaction velocity per month</p>
           </div>
           <div className="flex-1 w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data.monthly}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: '900'}}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: '900'}}
                    />
                    <Tooltip 
                        cursor={{fill: 'rgba(99, 102, 241, 0.05)'}}
                        contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '12px' }}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
