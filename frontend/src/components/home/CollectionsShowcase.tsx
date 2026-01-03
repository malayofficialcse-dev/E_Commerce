"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";

const collections = [
  {
    title: "The Monochrome Edited",
    subtitle: "Spring '26",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000",
    link: "/shop?q=monochrome",
    size: "large"
  },
  {
    title: "Refined Basics",
    subtitle: "Essential Collection",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1000",
    link: "/shop?q=basic",
    size: "small"
  },
  {
    title: "Luxe Accessories",
    subtitle: "New Arrivals",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
    link: "/shop?category=accessories",
    size: "small"
  }
];

const CollectionsShowcase = () => {
  return (
    <section className="container mx-auto px-6 py-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[800px]">
        {collections.map((col, i) => (
          <motion.div 
            key={col.title}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
            className={`relative group rounded-[60px] overflow-hidden cursor-pointer ${
              col.size === "large" ? "md:col-span-8" : "md:col-span-4"
            }`}
          >
            <Image 
              src={col.image} 
              alt={col.title}
              fill
              sizes={col.size === "large" ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
              className="object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
            
            <div className="absolute inset-0 p-12 flex flex-col justify-end">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <span className="text-primary font-black uppercase tracking-widest text-[10px] mb-4 block">{col.subtitle}</span>
                <h3 className={`text-white font-black leading-none tracking-tighter mb-8 ${
                  col.size === "large" ? "text-5xl md:text-7xl" : "text-3xl md:text-4xl"
                }`}>
                  {col.title.split(' ').map((word, idx) => (
                    <React.Fragment key={idx}>
                      {word} <br />
                    </React.Fragment>
                  ))}
                </h3>
                <Link href={col.link} className="inline-flex items-center gap-4 bg-white text-black px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all">
                  Shop Collection <MoveRight size={16} />
                </Link>
              </motion.div>
            </div>
            
            {/* Hover Floating Element */}
            <div className="absolute top-12 right-12 size-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center -rotate-12 translate-x-32 group-hover:translate-x-0 transition-transform duration-700 delay-100">
               <span className="text-white text-[8px] font-black uppercase tracking-tighter text-center leading-none">Limited <br /> Edition</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CollectionsShowcase;
