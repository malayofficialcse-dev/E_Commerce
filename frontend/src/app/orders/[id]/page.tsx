"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  ShoppingBag,
  Bell,
  Navigation,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Order {
  _id: string;
  orderStatus: string;
  totalAmount: number;
  estimatedDelivery: string;
  updatedAt: string;
  createdAt: string;
  items: {
    product: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  trackingHistory?: {
    status: string;
    location: string;
    description: string;
    timestamp: string;
  }[];
  returnData?: {
    status: string;
    reason: string;
  };
}

const OrderTrackingPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order);
        
        // Dynamic Distance Calculation
        const statusMap: Record<string, number> = {
          "placed": 840,
          "packed": 720,
          "shipped": 450,
          "out-for-delivery": 12,
          "delivered": 0
        };
        setDistance(statusMap[data.order.orderStatus] || 0);
      } catch (error) {
        console.error("Fetch order error", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const steps = [
    { id: "placed", title: "Expedition Started", desc: "VelvetLuxe Registry Confirmed", icon: CheckCircle2 },
    { id: "packed", title: "Curation Complete", desc: "Inspected by Master Artisans", icon: Package },
    { id: "shipped", title: "In Transit", desc: "Via Priority Express", icon: Truck },
    { id: "out-for-delivery", title: "Incoming", desc: "Arriving at Destination", icon: Navigation },
    { id: "delivered", title: "Handed Over", desc: "Process Finalized", icon: ShieldCheck },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === (order?.orderStatus || "placed"));

  if (loading) return (
     <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        <div className="relative animate-pulse flex flex-col items-center gap-4">
           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Synchronizing...</p>
        </div>
     </div>
  );

  if (!order) return (
     <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black italic mb-4">Expedition Lost</h1>
        <p className="text-muted-foreground mb-8">We couldn&apos;t locate this order in our global logs.</p>
        <button onClick={() => router.push("/shop")} className="px-12 h-14 bg-foreground text-background font-black uppercase tracking-widest text-xs rounded-2xl">Return to Shop</button>
     </div>
  );


  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      <main className="container mx-auto px-6 pt-48 pb-24 max-w-7xl">
         <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column: Map & Primary Tracking */}
            <div className="flex-1 space-y-8">
                {/* Professional Status Tracker */}
                <div className="bg-white/[0.03] border border-white/5 rounded-[60px] p-12 lg:p-16 shadow-2xl relative overflow-hidden">
                   {/* Background Accents */}
                   <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[200px] pointer-events-none" />
                   <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-tr-[150px] pointer-events-none" />

                   <div className="relative space-y-16">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Live Progress</p>
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Current Status: <span className="text-primary">{order.orderStatus.replace("-", " ")}</span></h2>
                         </div>
                         <div className="px-6 py-4 bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/10">
                            <p className="text-[10px] font-black uppercase opacity-40 mb-1">Estimated Arrival</p>
                            <p className="text-xl font-black italic text-white">{new Date(order.estimatedDelivery).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                         </div>
                      </div>

                      {/* Progressive Stepper */}
                      <div className="relative pt-12 pb-8">
                         <div className="absolute top-[60px] left-0 right-0 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                               transition={{ duration: 2, ease: "circOut" }}
                               className="h-full bg-primary shadow-[0_0_20px_var(--primary)]"
                            />
                         </div>

                         <div className="relative flex justify-between">
                            {steps.map((step, i) => {
                               const Icon = step.icon;
                               const isCompleted = i < currentStepIndex;
                               const isCurrent = i === currentStepIndex;
                               
                               return (
                                 <div key={step.id} className="flex flex-col items-center gap-6 group">
                                    <motion.div 
                                      initial={{ scale: 0.8 }}
                                      animate={{ scale: isCurrent ? 1.2 : 1 }}
                                      className={cn(
                                        "w-14 h-14 rounded-[22px] flex items-center justify-center border-2 transition-all duration-500 z-10",
                                        isCompleted || isCurrent ? "bg-primary border-primary text-white shadow-xl shadow-primary/30" : "bg-muted border-white/5 text-muted-foreground/30"
                                      )}
                                    >
                                       <Icon size={24} />
                                       {isCurrent && (
                                         <motion.div 
                                            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 bg-primary rounded-[22px]"
                                         />
                                       )}
                                    </motion.div>
                                    <div className="text-center w-24 md:w-32">
                                       <p className={cn(
                                         "text-[10px] font-black uppercase tracking-widest mb-1 transition-colors",
                                         isCompleted || isCurrent ? "text-primary" : "text-muted-foreground/30"
                                       )}>{step.title}</p>
                                       <p className="text-[9px] font-medium opacity-40 leading-tight hidden md:block">{step.desc}</p>
                                    </div>
                                 </div>
                               );
                            })}
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
                         {[
                           { label: "Transit Distance", value: `${distance} KM`, icon: Navigation },
                           { label: "Security Token", value: `SHP-${order._id.slice(-8).toUpperCase()}`, icon: ShieldCheck },
                           { label: "Total Valuation", value: `$${order.totalAmount.toFixed(2)}`, icon: ShoppingBag }
                         ].map((stat, i) => (
                           <div key={i} className="flex items-center gap-4 p-6 bg-white/[0.02] rounded-[32px] border border-white/5 hover:bg-white/[0.04] transition-colors">
                              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                 <stat.icon size={20} />
                              </div>
                              <div>
                                 <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30">{stat.label}</p>
                                 <p className="text-lg font-black italic tracking-tighter text-white">{stat.value}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

               {/* Timeline / Flight Log */}
               <div className="bg-white/[0.02] border border-border p-10 lg:p-14 rounded-[60px] shadow-sm">
                  <div className="flex items-center justify-between mb-16">
                     <h2 className="text-3xl font-black italic uppercase tracking-tighter">Expedition History</h2>
                     <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Live Logs</span>
                     </div>
                  </div>

                  <div className="space-y-12 relative">
                     <div className="absolute left-[31px] top-4 bottom-4 w-px bg-border group-hover:bg-primary/20 transition-colors" />
                     
                     {(order.trackingHistory || steps).map((step: { status?: string; title?: string; icon?: any; description?: string; desc?: string; location?: string; timestamp?: string }, i: number) => {
                        const isMainStep = !order.trackingHistory;
                        const isActive = isMainStep ? i <= currentStepIndex : true;
                        
                        return (
                          <div key={i} className={cn("flex gap-10 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards", isActive ? "grayscale-0" : "grayscale opacity-20")} style={{ animationDelay: `${i * 100}ms` }}>
                             <div className={cn(
                               "w-16 h-16 rounded-3xl flex items-center justify-center border-2 transition-all duration-700",
                               isActive ? "bg-primary/10 border-primary/20 text-primary shadow-2xl shadow-primary/10" : "bg-muted border-transparent text-muted-foreground/30"
                             )}>
                                {step.icon ? <step.icon size={24} /> : <div className="w-2 h-2 bg-primary rounded-full" />}
                             </div>
                             <div className="flex-1 py-1">
                                <div className="flex items-center justify-between mb-2">
                                   <h3 className="text-lg font-black uppercase tracking-tighter italic">{step.title || step.status}</h3>
                                   <p className="text-[10px] font-bold text-muted-foreground/40">
                                      {new Date(step.timestamp || order.updatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                   </p>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-md">
                                   {step.desc || step.description} — <span className="text-foreground/60">{step.location || "Central Hub"}</span>
                                </p>
                             </div>
                          </div>
                        );
                     })}
                  </div>
               </div>
            </div>

            {/* Right Column: Summaries & Post-Purchase Services */}
            <div className="w-full lg:w-[420px] space-y-8">
               {/* Digital Identity of Order */}
               <div className="bg-background p-10 lg:p-12 rounded-[60px] border-2 border-border shadow-2xl space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] pointer-events-none" />
                  
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-widest text-primary">Priority Shipment</p>
                     <h2 className="text-2xl font-black italic uppercase">Manifest</h2>
                  </div>

                  <div className="space-y-4">
                     {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-5 p-5 bg-muted/50 rounded-3xl border border-border group hover:bg-muted transition-colors">
                           <div className="w-16 h-20 bg-background rounded-2xl flex-shrink-0 relative overflow-hidden ring-1 ring-border group-hover:ring-primary/20 transition-all">
                              <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                           </div>
                           <div className="flex-1 flex flex-col justify-center">
                              <p className="text-xs font-black uppercase italic tracking-tighter mb-1">{item.name}</p>
                              <div className="flex justify-between items-center">
                                 <p className="text-[10px] text-muted-foreground font-bold uppercase">Qty: {item.quantity}</p>
                                 <p className="text-xs font-black italic text-primary">${item.price.toFixed(2)}</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="pt-8 border-t border-border space-y-8">
                     <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-primary flex-shrink-0 shadow-sm"><MapPin size={20} /></div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-white/20 leading-none mb-1">Destination</p>
                           <p className="text-sm font-bold leading-relaxed">{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                        </div>
                     </div>
                  </div>

                  {order.orderStatus === "delivered" ? (
                     <div className="space-y-4 pt-4">
                        <p className="text-[10px] font-black text-center uppercase tracking-widest text-green-500 bg-green-500/10 py-3 rounded-full border border-green-500/20">Delivery Successful</p>
                        <Link 
                          href={`/orders/${id}/return`}
                          className="w-full h-16 bg-foreground text-background rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all shadow-xl"
                        >
                           <RotateCcw size={16} /> Request Premium Return
                        </Link>
                     </div>
                  ) : order.orderStatus === "return-requested" ? (
                     <div className="space-y-4 pt-4">
                        <p className="text-[10px] font-black text-center uppercase tracking-widest text-primary bg-primary/10 py-3 rounded-full border border-primary/20 animate-pulse">Return Pending Verification</p>
                        <button className="w-full h-16 bg-muted text-foreground rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 border border-white/5 cursor-default">
                           <Truck size={16} /> Return Expedition in Progress
                        </button>
                     </div>
                  ) : (
                     <div className="space-y-4 pt-4">
                        <button className="w-full h-16 bg-muted text-foreground/40 rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 cursor-not-allowed border border-white/5">
                           <ShieldCheck size={16} /> Returns Available Post-Delivery
                        </button>
                        <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-tight">Return Policy Applies Within 14 Days</p>
                     </div>
                  )}
               </div>

               {/* Concierge & Support */}
               <div className="p-8 bg-primary/5 rounded-[48px] border border-primary/10 group">
                  <div className="flex items-center gap-5 mb-6">
                     <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform">
                        <Bell size={24} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">White Glove Support</p>
                        <p className="text-xs font-bold leading-relaxed">Need assistance with your expedition?</p>
                     </div>
                  </div>
                  <button className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                     Chat with Specialist
                  </button>
               </div>
            </div>

         </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTrackingPage;
