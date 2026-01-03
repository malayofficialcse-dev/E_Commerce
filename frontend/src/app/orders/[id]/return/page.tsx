"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RotateCcw, 
  ChevronRight, 
  CheckCircle2, 
  Package, 
  Truck, 
  AlertCircle,
  Undo2,
  HelpCircle,
  ThumbsDown,
  Scissors
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import axios from "axios";
import { cn } from "@/lib/utils";
import Image from "next/image";

const ReturnPortalPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    { id: "wrong-size", label: "Imperfect Fit", icon: Scissors, desc: "Size doesn't match expectations." },
    { id: "not-as-described", label: "Aesthetic Variance", icon: ThumbsDown, desc: "Item differs from digital curation." },
    { id: "quality-issue", label: "Artisanal Flaw", icon: AlertCircle, desc: "Unexpected quality discrepancies." },
    { id: "changed-mind", label: "Curated Change", icon: Undo2, desc: "Decided on a different direction." },
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/${id}`);
        setOrder(data.order);
      } catch (error) {
        console.error("Fetch order error", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const handleReasonSelect = (reasonId: string) => {
    setSelectedReason(reasonId);
    setStep(2);
  };

  const handleSubmitReturn = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/${id}/return`, {
        reason: selectedReason
      });
      setStep(3);
    } catch (error) {
      console.error("Return submission error", error);
      alert("Something went wrong. Please contact concierge.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
     <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
     </div>
  );

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />

      <main className="container mx-auto px-6 pt-32 pb-24 max-w-4xl">
         <div className="space-y-12">
            {/* Progress Header */}
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Return Service</p>
                  <h1 className="text-4xl font-black italic uppercase tracking-tighter">Premium Returns Portal</h1>
               </div>
               <div className="flex gap-2">
                  {[1, 2, 3].map((s) => (
                     <div key={s} className={cn("w-12 h-1 bg-muted rounded-full overflow-hidden")}>
                        {s <= step && <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} className="w-full h-full bg-primary" />}
                     </div>
                  ))}
               </div>
            </div>

            <AnimatePresence mode="wait">
               {step === 1 && (
                  <motion.div 
                    key="step-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-12"
                  >
                     <div className="bg-white/[0.02] border border-border p-8 rounded-[40px] flex items-center gap-6">
                        <div className="w-20 h-24 bg-muted rounded-2xl overflow-hidden flex-shrink-0 relative">
                           {order?.items?.[0]?.image && <Image src={order.items[0].image} alt="Order" fill className="object-cover" />}
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Returning from</p>
                           <h3 className="text-xl font-black italic uppercase">Order #{id?.toString().slice(-8).toUpperCase()}</h3>
                           <p className="text-xs text-muted-foreground font-medium">{order?.items?.length} items • Total Refund Value: ${order?.totalAmount.toFixed(2)}</p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-center mb-8">Select Your Reason</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {reasons.map((reason) => (
                              <button
                                key={reason.id}
                                onClick={() => handleReasonSelect(reason.id)}
                                className="group relative p-8 bg-background border-2 border-border rounded-[32px] text-left hover:border-primary transition-all hover:scale-[1.02] overflow-hidden"
                              >
                                 <div className="flex items-start gap-6 relative z-10">
                                    <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                       <reason.icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                       <h4 className="text-lg font-black italic uppercase mb-1">{reason.label}</h4>
                                       <p className="text-xs text-muted-foreground font-medium">{reason.desc}</p>
                                    </div>
                                    <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" />
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>
                  </motion.div>
               )}

               {step === 2 && (
                  <motion.div 
                    key="step-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="max-w-xl mx-auto space-y-12 text-center"
                  >
                     <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <RotateCcw size={40} className="text-primary animate-spin-slow" />
                     </div>
                     <div className="space-y-4">
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Confirm Expedition Return</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                           We will initiate a courier pickup at your registered address or provide a digital shipping label. Our artisans will inspect the items upon arrival.
                        </p>
                     </div>

                     <div className="bg-muted p-8 rounded-[40px] border border-border space-y-6">
                        <div className="flex justify-between text-sm font-black uppercase">
                           <span className="text-muted-foreground tracking-widest">Reason</span>
                           <span className="text-primary">{reasons.find(r => r.id === selectedReason)?.label}</span>
                        </div>
                        <div className="flex justify-between text-sm font-black uppercase">
                           <span className="text-muted-foreground tracking-widest">Method</span>
                           <span>Luxe Courier Express</span>
                        </div>
                        <div className="pt-6 border-t border-border flex justify-between items-center">
                           <span className="text-sm font-black uppercase tracking-widest">Refund to Credit</span>
                           <span className="text-2xl font-black italic">${order?.totalAmount.toFixed(2)}</span>
                        </div>
                     </div>

                     <div className="flex flex-col gap-4">
                        <button 
                          onClick={handleSubmitReturn}
                          disabled={isSubmitting}
                          className="w-full h-16 bg-primary text-white rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-2xl shadow-primary/30 disabled:opacity-50"
                        >
                           {isSubmitting ? "Finalizing Logistics..." : "Initiate Refund Request"} <ChevronRight size={16} />
                        </button>
                        <button 
                          onClick={() => setStep(1)}
                          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        >
                           Modify Selection
                        </button>
                     </div>
                  </motion.div>
               )}

               {step === 3 && (
                  <motion.div 
                    key="step-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl mx-auto text-center space-y-12 py-12"
                  >
                     <div className="relative">
                        <div className="absolute inset-0 bg-green-500 blur-[80px] opacity-10 animate-pulse" />
                        <div className="w-32 h-32 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto relative z-10 shadow-2xl shadow-green-500/20">
                           <CheckCircle2 size={64} />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Return Authenticated</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                           Your return journey has been scheduled. Check your secure communication hub for the priority shipping manifest.
                        </p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-8 bg-muted rounded-[32px] border border-border text-center">
                           <Package size={24} className="mx-auto mb-4 text-primary" />
                           <p className="text-[10px] font-black uppercase tracking-widest mb-1">Pack Items</p>
                           <p className="text-[10px] text-muted-foreground font-bold leading-tight">Use original VelvetLuxe packaging if possible.</p>
                        </div>
                        <div className="p-8 bg-muted rounded-[32px] border border-border text-center">
                           <Truck size={24} className="mx-auto mb-4 text-primary" />
                           <p className="text-[10px] font-black uppercase tracking-widest mb-1">Await Courier</p>
                           <p className="text-[10px] text-muted-foreground font-bold leading-tight">Pickup scheduled within 24-48 hours.</p>
                        </div>
                     </div>

                     <button 
                       onClick={() => router.push(`/orders/${id}`)}
                       className="w-full h-16 bg-foreground text-background rounded-3xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all shadow-xl"
                     >
                        Monitor Return Status
                     </button>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReturnPortalPage;
