"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Truck, ShoppingBag, RotateCcw, ShieldCheck, Bell } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import confetti from "canvas-confetti";

const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 70 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#000000", "#ffffff", "#C19A6B"]
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#000000", "#ffffff", "#C19A6B"]
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 overflow-hidden relative">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] animate-pulse delay-700" />
      </div>

      {/* Noise Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

      <Navbar />

      <main className="container mx-auto px-6 pt-48 pb-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
             <motion.div
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
               className="relative mb-16"
             >
                <div className="absolute inset-0 bg-primary blur-[60px] opacity-20 animate-pulse" />
                <div className="relative w-40 h-40 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-2xl overflow-hidden group">
                   <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                   >
                    <Package size={80} className="text-primary opacity-80" strokeWidth={1} />
                   </motion.div>
                </div>
             </motion.div>

             <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="space-y-6 mb-20"
             >
                <h1 className="text-7xl lg:text-9xl font-black tracking-tighter italic uppercase leading-none">
                   Welcome to <br />
                   <span className="text-primary">The Inner Circle</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-white/50 font-medium tracking-tight">
                   Your curated selection has been secured. Our artisans are now processing your pieces for the ultimate unboxing experience.
                </p>
             </motion.div>

             <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[48px] p-10 lg:p-16 relative overflow-hidden group mb-16 text-left"
             >
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" />
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 relative z-10">
                   <div className="space-y-8 flex-1">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Authenticated Order</p>
                         <h2 className="text-3xl font-black tracking-tight uppercase">#{orderId?.toString().slice(-8).toUpperCase() || "PROCESSING"}</h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Est. Arrival</p>
                            <p className="text-xl font-bold italic font-serif">Within 3 — 5 Business Days</p>
                         </div>
                         <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Courier</p>
                            <p className="text-xl font-bold italic font-serif">VelvetLuxe Priority Mail</p>
                         </div>
                      </div>
                   </div>
                   <div className="w-full lg:w-px h-px lg:h-32 bg-white/10" />
                   <div className="space-y-6 w-full lg:w-auto">
                      <Link 
                        href={`/orders/${orderId}`}
                        className="w-full lg:w-64 h-16 bg-white text-black rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-2xl shadow-white/10"
                      >
                         <Truck size={16} /> Track Expedition
                      </Link>
                      <Link 
                        href="/shop"
                        className="w-full lg:w-64 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
                      >
                         <ShoppingBag size={16} /> Continue Discovery
                      </Link>
                   </div>
                </div>
             </motion.div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {[
                  { title: "Sustainably Crafted", desc: "Eco-conscious packaging designed for luxury.", icon: ShieldCheck },
                  { title: "24/7 Concierge", desc: "Our specialists are standing by for your needs.", icon: Bell },
                  { title: "Luxe Returns", desc: "Try pieces at home. Return in two clicks.", icon: RotateCcw }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 + (i * 0.1) }}
                    className="p-8 border border-white/10 rounded-[32px] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group text-center"
                  >
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:text-primary transition-all">
                        <item.icon size={24} />
                     </div>
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-2">{item.title}</h3>
                     <p className="text-[10px] text-white/40 leading-relaxed uppercase font-bold">{item.desc}</p>
                  </motion.div>
                ))}
             </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
