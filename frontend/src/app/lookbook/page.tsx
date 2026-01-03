"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ShoppingCart, ArrowRight, X, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LookbookItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  products: {
    id: string;
    name: string;
    price: number;
    x: number; // percentage
    y: number; // percentage
    image: string;
    slug: string;
  }[];
}

const LOOKBOOK_DATA: LookbookItem[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1539106604-be47b3ad2648?auto=format&fit=crop&q=80&w=1600",
    title: "Urban Minimalist",
    subtitle: "Spring / Summer 2026",
    products: [
      { id: "p1", name: "Overcoat Noir", price: 450, x: 45, y: 35, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400", slug: "overcoat-noir" },
      { id: "p2", name: "Silk Trousers", price: 280, x: 55, y: 70, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400", slug: "silk-trousers" }
    ]
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600",
    title: "The Riviera Edit",
    subtitle: "Vacation Essentials",
    products: [
      { id: "p3", name: "Linen Blazer", price: 320, x: 50, y: 40, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400", slug: "linen-blazer" },
      { id: "p4", name: "Woven Fedora", price: 95, x: 52, y: 15, image: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=400", slug: "woven-fedora" }
    ]
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1445205170230-053b830c6050?auto=format&fit=crop&q=80&w=1600",
    title: "Classic Tailoring",
    subtitle: "Autumn Collection",
    products: [
      { id: "p5", name: "Wool Suit", price: 890, x: 48, y: 45, image: "https://images.unsplash.com/photo-1594932224828-b4b057b7d6ee?w=400", slug: "wool-suit" }
    ]
  }
];

const LookbookPage = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<any>(null);
  const addItem = useCartStore((state) => state.addItem);

  const handleQuickAdd = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      variantId: `variant-${product.id}`,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      color: "Default",
      size: "M",
      stock: 10
    });
    alert(`Added ${product.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <header className="container mx-auto px-6 mb-20">
           <div className="max-w-4xl">
              <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-8 italic">LOOKBOOK <span className="text-primary not-italic">'26</span></h1>
              <p className="text-xl text-muted-foreground font-medium uppercase tracking-widest max-w-2xl">
                 An editorial exploration of movement, texture, and silence. Shop the curated ensembles directly from the frames.
              </p>
           </div>
        </header>

        <div className="space-y-32">
           {LOOKBOOK_DATA.map((look, index) => (
              <section key={look.id} className="relative group">
                 <div className="container mx-auto px-6 h-[80vh] md:h-screen">
                    <div className={cn(
                       "relative w-full h-full rounded-[60px] overflow-hidden border border-border",
                       index % 2 === 1 ? "md:ml-auto md:w-3/4" : "md:w-3/4"
                    )}>
                       <Image 
                          src={look.image}
                          alt={look.title}
                          fill
                          className="object-cover"
                          priority
                       />
                       
                       {/* Overlays */}
                       <div className="absolute inset-0 bg-foreground/5 transition-colors group-hover:bg-foreground/10" />

                       {/* Hotspots */}
                       {look.products.map((product) => (
                          <div 
                             key={product.id}
                             className="absolute"
                             style={{ left: `${product.x}%`, top: `${product.y}%` }}
                          >
                             <div className="relative">
                                <motion.button
                                   whileHover={{ scale: 1.2 }}
                                   whileTap={{ scale: 0.9 }}
                                   onMouseEnter={() => setHoveredProduct(product)}
                                   onMouseLeave={() => setHoveredProduct(null)}
                                   onClick={() => setActiveItem(product.id)}
                                   className="w-8 h-8 rounded-full bg-background/20 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground hover:bg-primary hover:border-primary hover:text-white transition-all shadow-xl"
                                >
                                   <Plus size={16} />
                                </motion.button>

                                <AnimatePresence>
                                   {hoveredProduct?.id === product.id && (
                                      <motion.div
                                         initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                         animate={{ opacity: 1, scale: 1, y: 0 }}
                                         exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                         className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 bg-background rounded-2xl shadow-2xl p-4 border border-border pointer-events-none z-50"
                                      >
                                         <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                                         </div>
                                         <h4 className="text-xs font-black uppercase tracking-wider mb-1">{product.name}</h4>
                                         <p className="text-sm font-black text-primary">${product.price}</p>
                                      </motion.div>
                                   )}
                                </AnimatePresence>
                             </div>
                          </div>
                       ))}

                       {/* Look Info */}
                       <div className={cn(
                          "absolute bottom-12 text-white z-20",
                          index % 2 === 1 ? "left-12" : "right-12 text-right"
                       )}>
                          <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60 mb-4">{look.subtitle}</p>
                          <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase">{look.title}</h2>
                       </div>
                    </div>
                 </div>

                 {/* Product Popup Drawer (Simple Version) */}
                 <AnimatePresence>
                    {activeItem && (
                       <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                          <motion.div 
                             initial={{ opacity: 0 }} 
                             animate={{ opacity: 1 }} 
                             exit={{ opacity: 0 }}
                             onClick={() => setActiveItem(null)}
                             className="absolute inset-0 bg-background/60 backdrop-blur-sm"
                          />
                          <motion.div 
                             initial={{ scale: 0.9, opacity: 0 }} 
                             animate={{ scale: 1, opacity: 1 }} 
                             exit={{ scale: 0.9, opacity: 0 }}
                             className="relative w-full max-w-3xl bg-background rounded-[40px] overflow-hidden shadow-2xl border border-border grid grid-cols-1 md:grid-cols-2"
                          >
                             <button 
                                onClick={() => setActiveItem(null)}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-red-500 hover:text-white transition-all z-10"
                             >
                                <X size={20} />
                             </button>

                             <div className="relative aspect-square md:aspect-auto">
                                <Image 
                                   src={look.products.find(p => p.id === activeItem)?.image || ""} 
                                   alt="" 
                                   fill 
                                   className="object-cover" 
                                />
                             </div>

                             <div className="p-12 flex flex-col justify-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Editor's Pick</span>
                                <h3 className="text-4xl font-black tracking-tight mb-4">{look.products.find(p => p.id === activeItem)?.name}</h3>
                                <p className="text-2xl font-black mb-8">${look.products.find(p => p.id === activeItem)?.price}.00</p>
                                
                                <p className="text-muted-foreground mb-10 text-sm leading-relaxed">
                                   A cornerstone of the {look.title} collection, this piece exemplifies our commitment to structural elegance and sustainable luxury materials.
                                </p>

                                <div className="flex gap-4">
                                   <button 
                                      onClick={(e) => handleQuickAdd(look.products.find(p => p.id === activeItem), e)}
                                      className="flex-1 h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/25"
                                   >
                                      <ShoppingCart size={18} /> Add To Cart
                                   </button>
                                   <Link 
                                      href={`/product/${look.products.find(p => p.id === activeItem)?.slug}`}
                                      className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center hover:bg-accent transition-all"
                                   >
                                      <ArrowRight size={20} />
                                   </Link>
                                </div>
                             </div>
                          </motion.div>
                       </div>
                    )}
                 </AnimatePresence>
              </section>
           ))}
        </div>

        <section className="container mx-auto px-6 py-40 text-center">
           <h2 className="text-4xl font-black mb-8">MORE COLLECTIONS COMING SOON</h2>
           <Link href="/shop" className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-sm border-b-2 border-primary pb-1 hover:gap-4 transition-all">
              SHOP ALL PRODUCTS <ArrowRight size={20} />
           </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LookbookPage;
