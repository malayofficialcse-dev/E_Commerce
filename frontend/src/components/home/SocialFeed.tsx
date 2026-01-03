"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";

const instagramPosts = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600",
  "https://images.unsplash.com/photo-1549298910-bc81ad219812?w=600",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
];

const SocialFeed = () => {
  return (
    <section className="py-24 border-t border-border overflow-hidden">
      <div className="container mx-auto px-6 mb-12 flex flex-col items-center text-center">
        <Instagram className="text-primary mb-6" size={32} />
        <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-4">Seen on the Streets</h2>
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.2em]">Tag us @VELVETLUXE to be featured</p>
      </div>

      <div className="flex gap-4 animate-marquee whitespace-nowrap">
        {[...instagramPosts, ...instagramPosts].map((src, i) => (
          <div key={i} className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden flex-shrink-0 group">
            <Image 
              src={src} 
              alt="Social Post"
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <Instagram className="text-white" size={32} />
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default SocialFeed;
