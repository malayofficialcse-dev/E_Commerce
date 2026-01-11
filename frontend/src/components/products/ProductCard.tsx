"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";


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


  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05, zIndex: 50 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="group relative flex flex-col bg-background rounded-[40px] overflow-hidden border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 h-full"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <Link href={`/product/${product.slug}`}>
            <motion.div 
              layoutId={`product-image-${product._id}`}
              className="absolute inset-0 bg-muted flex items-center justify-center"
            >
              {product.images?.[0] ? (
                <Image 
                  src={product.images[0]} 
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">No Image</div>
              )}
            </motion.div>
          </Link>

          {/* Floating Badges */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
             {product.status === "live" && (
                <span className="px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-full">New Season</span>
             )}
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

    </>
  );
};

export default ProductCard;
