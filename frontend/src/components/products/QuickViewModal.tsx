"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Star, Minus, Plus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

interface QuickViewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedColor(product.variants[0].color);
      setSelectedSize(product.variants[0].size);
      setActiveImage(product.variants[0].images?.[0] || product.images[0]);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    const variant = product.variants.find((v: any) => v.color === selectedColor && v.size === selectedSize);
    addItem({
      id: product._id,
      name: product.title,
      price: variant?.price || product.variants[0].price,
      image: activeImage,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      variantId: variant?._id || "default"
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-background rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 bg-background/20 backdrop-blur-md rounded-full hover:bg-background transition-colors"
            >
              <X size={20} />
            </button>

            {/* Left: Gallery */}
            <div className="md:w-1/2 relative bg-muted aspect-[4/5] md:aspect-auto">
              <Image 
                src={activeImage} 
                alt={product.title} 
                fill 
                className="object-cover"
              />
              <div className="absolute bottom-8 left-8 flex gap-3">
                 {product.images.slice(0, 4).map((img: string, i: number) => (
                    <button 
                       key={i} 
                       onClick={() => setActiveImage(img)}
                       className={cn(
                          "w-12 h-12 rounded-xl border-2 overflow-hidden bg-background",
                          activeImage === img ? "border-primary" : "border-transparent"
                       )}
                    >
                       <Image src={img} alt="" fill className="object-cover" />
                    </button>
                 ))}
              </div>
            </div>

            {/* Right: Info */}
            <div className="md:w-1/2 p-12 overflow-y-auto">
               <div className="mb-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">{product.brand}</span>
                  <h2 className="text-3xl font-black tracking-tighter mb-4">{product.title}</h2>
                  <div className="flex items-center gap-4">
                     <span className="text-2xl font-black">${product.variants[0].price}</span>
                     <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-full">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-600">{product.ratings.average}</span>
                     </div>
                  </div>
               </div>

               {/* Variants */}
               <div className="space-y-8 mb-12">
                  <div className="space-y-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Color</span>
                     <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(product.variants.map((v: any) => v.color))).map((color: any) => (
                           <button 
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={cn(
                                 "px-4 py-2 rounded-xl border-2 text-xs font-bold transition-all",
                                 selectedColor === color ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary"
                              )}
                           >
                              {color}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Size</span>
                     <div className="flex flex-wrap gap-2">
                        {["S", "M", "L", "XL"].map((size) => (
                           <button 
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={cn(
                                 "w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xs font-bold transition-all",
                                 selectedSize === size ? "border-primary bg-primary text-white" : "border-border hover:border-primary"
                              )}
                           >
                              {size}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Cart CTA */}
               <div className="flex gap-4">
                  <div className="h-14 px-4 bg-muted rounded-2xl flex items-center gap-6 border border-border">
                     <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-primary transition-colors">
                        <Minus size={16} />
                     </button>
                     <span className="font-bold">{quantity}</span>
                     <button onClick={() => setQuantity(quantity + 1)} className="hover:text-primary transition-colors">
                        <Plus size={16} />
                     </button>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] shadow-xl shadow-primary/25 transition-all"
                  >
                     Add to Cart <ArrowRight size={16} />
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
