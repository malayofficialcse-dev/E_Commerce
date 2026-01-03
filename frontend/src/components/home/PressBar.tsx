"use client";

import React from "react";
import { motion } from "framer-motion";

const PRESS_LOGOS = [
  "VOGUE", "GQ", "HYPEBEAST", "ESQUIRE", "ELLE", "BAZAAR", "WWD", "FORBES"
];

const PressBar = () => {
  return (
    <section className="w-full py-12 border-y border-border bg-background overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground text-center">As Seen In</p>
      </div>
      
      <div className="relative flex gap-20 overflow-hidden">
        <motion.div 
           initial={{ x: 0 }}
           animate={{ x: "-50%" }}
           transition={{ 
             duration: 30, 
             repeat: Infinity, 
             ease: "linear" 
           }}
           className="flex gap-20 items-center whitespace-nowrap min-w-full"
        >
          {[...PRESS_LOGOS, ...PRESS_LOGOS].map((logo, i) => (
            <span 
              key={i} 
              className="text-4xl md:text-5xl font-black tracking-tighter text-muted-foreground/30 hover:text-foreground transition-colors cursor-default select-none italic"
            >
              {logo}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PressBar;
