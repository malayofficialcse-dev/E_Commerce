"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Eye, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import QuickViewModal from "./QuickViewModal";
import { useCartStore } from "@/store/useCartStore";

import { useCursor } from "@/context/CursorContext";
import Magnetic from "@/components/ui/Magnetic";

interface Product {
  _id: string;
  title: string;
  slug: string;
  brand: string;
  images: string[];
  videoUrl?: string;
  status?: string;
  ratings?: {
    average: number;
    count: number;
  };
  variants?: {
    _id: string;
    color: string;
    size: string;
    price: number;
    images?: string[];
  }[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setCursorType, setCursorLabel } = useCursor();
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (product.variants?.length) {
       const first = product.variants[0];
       addItem({
          id: product._id,
          name: product.title,
          price: first.price,
          image: first.images?.[0] || product.images[0],
          color: first.color,
          size: first.size,
          quantity: 1,
          variantId: first._id
       });
       alert(`Added ${product.title} to cart`);
    }
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/product/${product.slug}`);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onMouseEnter={() => {
           setIsHovered(true);
           setCursorType("view");
           setCursorLabel("EXPLORE");
        }}
        onMouseLeave={() => {
           setIsHovered(false);
           setCursorType("default");
           setCursorLabel("");
        }}
        className="group relative flex flex-col bg-background rounded-[40px] overflow-hidden border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 h-full"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <Link href={`/product/${product.slug}`}>
            <motion.div 
              layoutId={`product-image-${product._id}`}
              className="absolute inset-0 bg-muted flex items-center justify-center"
            >
              {isHovered && product.videoUrl ? (
                 <video 
                    src={product.videoUrl} 
                    autoPlay 
                    muted 
                    loop 
                    className="absolute inset-0 w-full h-full object-cover z-0"
                 />
              ) : product.images?.[0] ? (
                <Image 
                  src={product.images[0]} 
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={cn(
                    "object-cover transition-all duration-1000",
                    isHovered ? "scale-110 blur-[2px] opacity-40" : "scale-100"
                  )}
                />
              ) : (
                <div className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">No Image</div>
              )}
            </motion.div>
          </Link>

          {/* Floating Badges */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
             {product.status === "live" && (
               <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[8px] font-black uppercase tracking-widest rounded-full">New Season</span>
             )}
          </div>

          {/* Hover Actions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 10 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 10 }}
                 className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4"
              >
                  <Magnetic strength={0.2}>
                    <button 
                      onClick={handleQuickAdd}
                      onMouseEnter={() => { setCursorType("pointer"); setCursorLabel(""); }}
                      onMouseLeave={() => { setCursorType("view"); setCursorLabel("EXPLORE"); }}
                      className="w-14 h-14 bg-background text-foreground rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-xl"
                    >
                        <ShoppingCart size={20} />
                    </button>
                  </Magnetic>
                  <div className="flex gap-4">
                    <Magnetic strength={0.3}>
                      <button className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                        <Heart size={18} />
                      </button>
                    </Magnetic>
                    <Magnetic strength={0.3}>
                      <button 
                        onClick={() => setIsQuickViewOpen(true)}
                        className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all"
                      >
                        <Eye size={18} />
                      </button>
                    </Magnetic>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Actions overlay at bottom */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-all duration-500 z-20"
          )}>
            <div className="flex gap-2">
              <Magnetic strength={0.1} className="flex-[2]">
                <button 
                  onClick={handleQuickBuy}
                  onMouseEnter={() => { setCursorType("buy"); setCursorLabel("BUY"); }}
                  onMouseLeave={() => { setCursorType("view"); setCursorLabel("EXPLORE"); }}
                  className="w-full h-12 bg-foreground text-background rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all shadow-xl"
                >
                    Quick Buy <ArrowRight size={14} />
                </button>
              </Magnetic>
              <Magnetic strength={0.2} className="flex-1">
                <button 
                  onClick={handleQuickAdd}
                  className="w-full h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                    <ShoppingCart size={16} />
                </button>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-4">
             <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{product.brand}</p>
                <Link href={`/product/${product.slug}`}>
                   <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors leading-tight">{product.title}</h3>
                </Link>
             </div>
             <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-lg">
                <Star size={10} className="text-primary fill-primary" />
                <span className="text-[9px] font-bold">{product.ratings?.average || 0}</span>
             </div>
          </div>

          <div className="mt-auto pt-6 border-t border-border flex justify-between items-center">
             <div>
                <p className="text-sm font-black tracking-tighter">${product.variants?.[0]?.price || 0}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase opacity-40">{product.variants?.length || 0} Colors/Sizes Available</p>
             </div>
             <div className="flex -space-x-2">
                {Array.from(new Set(product.variants?.map((v) => v.color))).slice(0, 3).map((color, i) => (
                  <div key={i} className="w-5 h-5 rounded-full border-2 border-background shadow-sm" style={{ backgroundColor: color.toLowerCase() }} />
                ))}
             </div>
          </div>
        </div>
      </motion.div>

      <QuickViewModal 
        product={product} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </>
  );
};

export default ProductCard;
