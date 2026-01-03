"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface VisualStoryProps {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  reversed?: boolean;
}

const VisualStory: React.FC<VisualStoryProps> = ({ 
  image, 
  title, 
  subtitle, 
  description,
  reversed = false 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);

  return (
    <div ref={containerRef} className="container mx-auto px-6 py-40 overflow-hidden relative">
      <div className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-20`}>
        {/* Parallax Image Block */}
        <div className="flex-1 relative h-[700px] w-full group">
           <motion.div 
             style={{ y: y1, scale }}
             className="relative w-full h-full rounded-[60px] overflow-hidden shadow-2xl z-10"
           >
              <Image 
                src={image}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
           </motion.div>
           
           {/* Floating Accent Background */}
           <motion.div 
              style={{ y: y2 }}
              className="absolute -top-10 -left-10 w-full h-full bg-muted rounded-[60px] -z-10"
           />
        </div>

        {/* Text Block */}
        <motion.div 
          style={{ opacity }}
          className="flex-1 space-y-8"
        >
           <span className="text-xs font-black uppercase tracking-[0.5em] text-primary">{subtitle}</span>
           <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic leading-tight uppercase">
              {title}
           </h2>
           <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
              {description}
           </p>
           <div className="pt-8">
              <button className="h-16 px-12 bg-foreground text-background rounded-full font-black uppercase tracking-widest text-xs hover:bg-primary transition-all">
                 Explore Philosophy
              </button>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VisualStory;
