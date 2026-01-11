"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useTransform, AnimatePresence } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "../products/ProductCard";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

const NewArrivalsCarousel = () => {
  const { data, isLoading } = useProducts({ limit: 10, sort: "newest" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    if (isPaused || isLoading) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft >= scrollWidth - clientWidth - 5) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 350 + 32, behavior: "smooth" });
        }
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [data, isPaused, isLoading]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [data]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -350 - 32 : 350 + 32;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (isLoading) return null;

  return (
    <section className="py-24 bg-muted/10 overflow-hidden">
      <div className="container mx-auto px-6 mb-12 flex justify-between items-end">
        <div>
          <span className="text-primary font-black uppercase tracking-widest text-[10px] mb-2 block">— New Arrivals</span>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic">Fresh Drops</h2>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-14 h-14 rounded-full border border-border flex items-center justify-center transition-all ${
              canScrollLeft ? "hover:bg-foreground hover:text-background" : "opacity-20 cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-14 h-14 rounded-full border border-border flex items-center justify-center transition-all ${
              canScrollRight ? "hover:bg-foreground hover:text-background" : "opacity-20 cursor-not-allowed"
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-8 overflow-x-auto px-[max(1.5rem,calc((100vw-80rem)/2))] no-scrollbar scroll-smooth pb-12"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {data?.products?.map((product: any) => (
          <div 
            key={product._id} 
            className="w-[350px] flex-shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <ProductCard product={product} />
          </div>
        ))}
        
        {/* View All Card at the end */}
        <div 
          className="w-[350px] flex-shrink-0 flex flex-col items-center justify-center bg-background rounded-[40px] border border-dashed border-border group cursor-pointer hover:border-primary transition-all"
          style={{ scrollSnapAlign: "start" }}
        >
           <Link href="/shop" className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowRight size={32} />
              </div>
              <span className="text-sm font-black uppercase tracking-widest">Explore Full Collection</span>
           </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsCarousel;
