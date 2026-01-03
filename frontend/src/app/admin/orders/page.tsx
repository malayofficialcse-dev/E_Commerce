"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Search,
  Navigation,
  ExternalLink,
  MapPin
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AdminOrder {
  _id: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  currentLocation?: {
    address: string;
    lat: number;
    lng: number;
  };
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updateForm, setUpdateForm] = useState({
    orderStatus: "",
    address: "",
    lat: 0,
    lng: 0,
    description: ""
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(data.orders);
    } catch (error) {
      console.error("Fetch orders failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (order: AdminOrder) => {
    setUpdatingOrderId(order._id);
    setUpdateForm({
      orderStatus: order.orderStatus,
      address: order.currentLocation?.address || "",
      lat: order.currentLocation?.lat || 28.6139,
      lng: order.currentLocation?.lng || 77.2090,
      description: ""
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/${updatingOrderId}/status`,
        {
          orderStatus: updateForm.orderStatus,
          currentLocation: {
            address: updateForm.address,
            lat: updateForm.lat,
            lng: updateForm.lng
          },
          description: updateForm.description
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUpdatingOrderId(null);
      fetchOrders();
    } catch {
      alert("Update failed");
    }
  };

  const filteredOrders = orders.filter(o => 
    (filterStatus === "all" || o.orderStatus === filterStatus) &&
    (o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     o.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
     <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
     </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight italic uppercase">Global Logistics</h1>
          <p className="text-muted-foreground text-sm font-medium">Control fulfillment cycles and real-time tracking expedition.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                 type="text" 
                 placeholder="Search Reference..." 
                 className="w-full h-12 bg-muted border border-border rounded-xl pl-12 pr-4 text-sm"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <select 
              className="h-12 bg-muted border border-border rounded-xl px-4 text-[10px] font-black uppercase tracking-widest"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
           >
              <option value="all">All Lifecycles</option>
              <option value="placed">Expedition Started</option>
              <option value="packed">Curation Done</option>
              <option value="shipped">In Transit</option>
              <option value="out-for-delivery">Final Mile</option>
              <option value="delivered">Completed</option>
              <option value="return-requested">Return Signals</option>
           </select>
        </div>
      </div>

      <div className="bg-background rounded-[48px] border-2 border-border overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-muted">
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Reference</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Client Signature</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Stage</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Current Pivot</th>
                     <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Value</th>
                     <th className="px-8 py-6 text-right"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-muted/30 transition-colors group">
                       <td className="px-8 py-6">
                          <div className="flex flex-col">
                             <span className="text-sm font-black italic uppercase tracking-tighter">#{order._id.slice(-8).toUpperCase()}</span>
                             <span className="text-[10px] text-muted-foreground font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                {order.user?.firstName?.[0] || 'G'}
                             </div>
                             <div className="flex flex-col">
                                <span className="text-xs font-black italic">{order.user?.firstName || 'Guest'}</span>
                                <span className="text-[10px] text-muted-foreground font-medium">{order.user?.email || 'Individual'}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className={cn(
                             "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest",
                             order.orderStatus === 'delivered' ? "bg-green-500/10 border-green-500/20 text-green-500" :
                             order.orderStatus === 'return-requested' ? "bg-red-500/10 border-red-500/20 text-red-500 animate-pulse" :
                             order.orderStatus === 'shipped' ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                             "bg-amber-500/10 border-amber-500/20 text-amber-500"
                          )}>
                             <div className="w-1.5 h-1.5 rounded-full bg-current" />
                             {order.orderStatus.replace("-", " ")}
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3 text-xs font-black italic uppercase text-muted-foreground">
                             <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-primary"><Navigation size={12} /></div>
                             <span className="truncate max-w-[180px]">{order.currentLocation?.address || "Awaiting Scan"}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-sm font-black italic text-primary">${order.totalAmount.toFixed(2)}</span>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={() => handleUpdateClick(order)}
                                className="h-10 px-6 bg-foreground text-background rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-black/10"
                             >
                                Update Log
                             </button>
                             <Link href={`/orders/${order._id}`} target="_blank" className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                                <ExternalLink size={16} />
                             </Link>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Update Modal */}
      <AnimatePresence>
         {updatingOrderId && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl">
              <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 30 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 30 }}
                 className="w-full max-w-xl bg-background rounded-[56px] p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] border-2 border-border relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-bl-[200px] -z-10" />
                 
                 <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10">Broadcast Expedition Update</h2>
                 
                 <form onSubmit={handleUpdateSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">Expedition Stage</label>
                          <select 
                             className="w-full h-16 bg-muted border border-border rounded-3xl px-8 focus:ring-2 focus:ring-primary outline-none transition-all font-black italic uppercase text-xs"
                             value={updateForm.orderStatus}
                             onChange={(e) => setUpdateForm({...updateForm, orderStatus: e.target.value})}
                          >
                             <option value="placed">Expedition Started</option>
                             <option value="packed">Curation Done</option>
                             <option value="shipped">In Transit</option>
                             <option value="out-for-delivery">Final Mile</option>
                             <option value="delivered">Completed</option>
                             <option value="return-requested">Return Signal</option>
                             <option value="returned">Return Manifested</option>
                          </select>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">Current Pivot</label>
                          <div className="relative">
                             <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={20} />
                             <input 
                                type="text" 
                                className="w-full h-16 bg-muted border border-border rounded-3xl pl-16 pr-8 focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-xs"
                                placeholder="Terminal Address..."
                                value={updateForm.address}
                                onChange={(e) => setUpdateForm({...updateForm, address: e.target.value})}
                             />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">Expedition Narrative (Public Log)</label>
                       <textarea 
                          className="w-full h-32 bg-muted border border-border rounded-[32px] p-8 focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-xs resize-none"
                          placeholder="Provide context for this update..."
                          value={updateForm.description}
                          onChange={(e) => setUpdateForm({...updateForm, description: e.target.value})}
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">Lat Pivot</label>
                          <input 
                             type="number" step="any"
                             className="w-full h-14 bg-muted border border-border rounded-2xl px-6 outline-none font-bold text-xs"
                             value={updateForm.lat}
                             onChange={(e) => setUpdateForm({...updateForm, lat: parseFloat(e.target.value)})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">Lng Pivot</label>
                          <input 
                             type="number" step="any"
                             className="w-full h-14 bg-muted border border-border rounded-2xl px-6 outline-none font-bold text-xs"
                             value={updateForm.lng}
                             onChange={(e) => setUpdateForm({...updateForm, lng: parseFloat(e.target.value)})}
                          />
                       </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                       <button 
                          type="button" 
                          onClick={() => setUpdatingOrderId(null)}
                          className="flex-1 h-16 bg-muted/50 border border-border rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-accent transition-all"
                       >
                          Abort Update
                       </button>
                       <button 
                          type="submit"
                          className="flex-[2] h-16 bg-foreground text-background rounded-3xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all shadow-2xl shadow-black/20"
                       >
                          Authorize Broadcast
                       </button>
                    </div>
                 </form>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrdersPage;
