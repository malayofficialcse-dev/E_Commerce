"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, ShoppingBag } from "lucide-react";
import { useTheme } from "next-themes";

const Hero = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <section className="h-[85vh] w-full bg-background" />;

  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-background">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920"
          alt="Premium Fashion"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/40 to-transparent" />
      </div>

      <div className="container mx-auto px-6 h-full relative flex items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-2xl text-foreground"
        >
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 bg-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 text-white"
          >
            Spring Summer '26 Collection
          </motion.span>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            REDEFINING <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
              ELEGANCE.
            </span>
          </h1>
          
          <p className="text-muted-foreground text-lg mb-10 max-w-lg font-medium leading-relaxed">
            Experience the pinnacle of craftsmanship. Discover our new season arrivals featuring fine fabrics and bespoke tailoring.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/shop" className="group h-14 px-10 bg-foreground text-background font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-primary hover:text-white transition-all rounded-full">
              Shop The Collection
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            
            <button className="flex items-center gap-4 group">
               <div className="w-14 h-14 rounded-full border border-black/10 dark:border-white/20 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
                  <Play size={20} fill="currentColor" />
               </div>
               <span className="text-xs font-black uppercase tracking-widest border-b border-transparent group-hover:border-black dark:group-hover:border-white transition-all">Watch Film</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 flex items-center space-x-12 border-t border-black/5 dark:border-white/10 pt-10">
             <div>
                <span className="block text-2xl font-black">2.5k+</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">New Arrivals</span>
             </div>
             <div>
                <span className="block text-2xl font-black">40+</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Exclusive Brands</span>
             </div>
             <div>
                <span className="block text-2xl font-black">15</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Global Stores</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Floating element */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute right-20 bottom-20 hidden lg:block"
      >
         <div className="p-6 bg-background/80 backdrop-blur-3xl border border-border text-foreground w-64 shadow-2xl rounded-3xl">
            <div className="flex items-center space-x-2 mb-4">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Live Drops</span>
            </div>
            <p className="text-sm font-bold leading-snug mb-4">Midnight Navy Collection drops in 04:20:15</p>
            <button className="w-full py-3 bg-foreground text-background text-xs font-black uppercase rounded-xl transition-all">Remind Me</button>
         </div>
      </motion.div>
    </section>
  );
};

export default Hero;
