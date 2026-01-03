"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { 
  Star, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronDown,
  Video
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { useCartStore } from "@/store/useCartStore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Magnetic from "@/components/ui/Magnetic";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  slug: string;
  images: string[];
  variants: {
    color: string;
    size: string;
    stock: number;
    price?: number;
    images?: string[];
  }[];
  brand: string;
  category: string;
  material: string;
  modelUrl?: string; // 3D model
  countInStock: number;
  videoUrl?: string;
  ratings: {
    average: number;
    count: number;
  };
}

const ProductPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  
  const addItem = useCartStore((state) => state.addItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0); // -1 for 3D model
  const [user, setUser] = useState<{ _id: string } | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/slug/${slug}`);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();

    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [slug]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user || !product) return;
      try {
        const response = await api.get(`/users/${user._id}/wishlist`);
        const wishlist = response.data.wishlist || [];
        const exists = wishlist.some((item: any) => item._id === product._id || item === product._id);
        setInWishlist(exists);
      } catch (error: any) {
        console.error("Failed to check wishlist:", error);
      }
    };
    checkWishlistStatus();
  }, [user, product]);

  useEffect(() => {
    if (product?.variants?.length && !selectedColor) {
       setSelectedColor(product.variants[0].color);
       setSelectedSize(product.variants[0].size);
    }
  }, [product, selectedColor]);

  const getGalleryItems = () => {
     if (!product) return [];
     
     const items: { url: string; type: "image" | "video" }[] = [];

     if (product.videoUrl) {
        items.push({ url: product.videoUrl, type: "video" });
     }

     const specificVariant = product.variants.find(v => v.color === selectedColor && v.size === selectedSize);
     const colorVariant = product.variants.find(v => v.color === selectedColor && v.images && v.images.length > 0);
     
     let imagesToShow: string[] = [];
     if (specificVariant?.images && specificVariant.images.length > 0) {
        imagesToShow = specificVariant.images;
     } else if (colorVariant?.images && colorVariant.images.length > 0) {
        imagesToShow = colorVariant.images;
     } else {
        imagesToShow = product.images;
     }

     imagesToShow.forEach(img => items.push({ url: img, type: "image" }));
     return items;
  };

  const galleryItems = getGalleryItems();

  useEffect(() => {
     setActiveImageIndex(0);
  }, [selectedColor, selectedSize]);

  useEffect(() => {
    if (!galleryItems || galleryItems.length <= 1 || activeImageIndex === -1) return;
    
    const currentItem = galleryItems[activeImageIndex];
    if (currentItem?.type === "video") return;

    const interval = setInterval(() => {
       setActiveImageIndex(prev => (prev + 1) % galleryItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [galleryItems, activeImageIndex]);

  const handleNextImage = () => {
     if (galleryItems.length > 0) {
        setActiveImageIndex(prev => (prev + 1) % galleryItems.length);
     }
  };

  const handlePrevImage = () => {
     if (galleryItems.length > 0) {
        setActiveImageIndex(prev => (prev - 1 + galleryItems.length) % galleryItems.length);
     }
  };

  const toggleWishlist = async () => {
    if (!user) {
      alert("Please login to add to wishlist");
      router.push("/login");
      return;
    }
    
    try {
      if (inWishlist) {
         await api.delete(`/users/${user._id}/wishlist/${product!._id}`);
         setInWishlist(false);
      } else {
         await api.post(`/users/${user._id}/wishlist`, { productId: product!._id });
         setInWishlist(true);
      }
    } catch (error) {
      console.error("Wishlist error", error);
    }
  };

  const getPrice = () => {
     if (!product) return 0;
     const variant = product.variants.find(v => v.color === selectedColor && v.size === selectedSize);
     if (variant?.price) return variant.price;
     
     if (product.variants && product.variants.length > 0) {
        return product.variants[0].price || 0;
     }
     
     return Number(product.price) || 0;
  };

  const handleAddToCart = () => {
    if (!product) return;
    const currentPrice = getPrice();
    const currentVariant = product.variants.find(v => v.color === selectedColor && v.size === selectedSize);

    addItem({
      id: product._id,
      name: product.title,
      price: currentPrice,
      image: galleryItems.find(i => i.type === "image")?.url || "", 
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      variantId: currentVariant ? (currentVariant as any)._id : "default" 
    });
    
    alert("Added to cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 pt-32 grid grid-cols-1 lg:grid-cols-2 gap-20">
           <Skeleton className="aspect-[4/5] w-full rounded-[40px]" />
           <div className="space-y-8">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
           </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="min-h-screen bg-background flex items-center justify-center font-bold">Product not found</div>;

  const price = Number(getPrice() || 0);
  const originalPrice = Number(price * 1.2 || 0);

  return (
    <div className="bg-background min-h-screen text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-28 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-12">
            <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => router.push("/")}>Home</span>
            <ChevronRight size={12} />
            <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => router.push("/shop")}>Shop</span>
            <ChevronRight size={12} />
            <span className="text-foreground">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
           
           {/* Left: Interactive Gallery */}
           <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-6 select-none">
              {/* Thumbnails */}
              {galleryItems.length > 0 && (
                 <div className="lg:w-24 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide">
                    {product.modelUrl && (
                       <button
                          onClick={() => setActiveImageIndex(-1)}
                          className={cn(
                             "relative w-20 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all",
                             activeImageIndex === -1 ? "border-primary ring-2 ring-primary/20" : "border-transparent bg-muted"
                           )}
                       >
                          <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                             <Video size={24} className="text-primary" />
                          </div>
                       </button>
                    )}
                    {galleryItems.map((item, idx) => (
                       <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={cn(
                             "relative w-20 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all",
                             idx === activeImageIndex ? "border-primary ring-2 ring-primary/20" : "border-transparent bg-muted"
                           )}
                       >
                          {item.type === "video" ? (
                             <div className="w-full h-full relative">
                                <video src={item.url} className="w-full h-full object-cover" muted />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                   <div className="w-6 h-6 rounded-full bg-background/20 backdrop-blur-md flex items-center justify-center text-foreground">
                                      <Video size={10} />
                                   </div>
                                </div>
                             </div>
                          ) : (
                              <Image 
                                 src={item.url} 
                                 alt="" 
                                 fill 
                                 className="object-cover" 
                                 sizes="80px"
                              />
                          )}
                       </button>
                    ))}
                 </div>
              )}

              {/* Main Carousel */}
              <div className="flex-1 relative aspect-[4/5] rounded-[40px] overflow-hidden bg-muted border border-border shadow-2xl group">
                 <AnimatePresence mode="wait">
                     <motion.div
                        layoutId={`product-image-${product._id}`}
                        key={activeImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full relative"
                     >
                       {activeImageIndex === -1 && product.modelUrl ? (
                          <model-viewer
                             src={product.modelUrl}
                             alt="3D Model"
                             ar
                             ar-modes="webxr scene-viewer quick-look"
                             camera-controls
                             shadow-intensity="1"
                             auto-rotate
                             className="w-full h-full"
                          ></model-viewer>
                       ) : galleryItems[activeImageIndex] ? (
                          galleryItems[activeImageIndex].type === "video" ? (
                             <video 
                                src={galleryItems[activeImageIndex].url}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                             />
                          ) : (
                             <Image 
                               src={galleryItems[activeImageIndex].url} 
                               alt={product.title}
                               fill
                               className="object-cover"
                               priority
                               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                             />
                          )
                       ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground/30 font-black uppercase tracking-widest text-xs">
                                No Media Available
                            </div>
                       )}
                    </motion.div>
                 </AnimatePresence>

                 {/* Arrows */}
                 {galleryItems.length > 1 && activeImageIndex !== -1 && (
                    <>
                       <button 
                         onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                         className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/10 backdrop-blur-md border border-border/20 text-foreground flex items-center justify-center hover:bg-background transition-all opacity-0 group-hover:opacity-100"
                       >
                          <ChevronLeft size={24} />
                       </button>
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                         className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/10 backdrop-blur-md border border-border/20 text-foreground flex items-center justify-center hover:bg-background transition-all opacity-0 group-hover:opacity-100"
                       >
                          <ChevronRight size={24} />
                       </button>
                       
                       {/* Dot Indicators */}
                       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                          {galleryItems.map((_, idx) => (
                             <div 
                                key={idx} 
                                className={cn(
                                   "h-1.5 rounded-full transition-all duration-300 backdrop-blur-sm",
                                   idx === activeImageIndex ? "w-8 bg-foreground" : "w-1.5 bg-foreground/30" 
                                )}
                             />
                          ))}
                       </div>
                    </>
                 )}

                 {/* Top Actions */}
                 <div className="absolute top-6 right-6 flex flex-col gap-3">
                    {product.modelUrl && (
                       <Magnetic strength={0.3}>
                          <button 
                            onClick={() => setActiveImageIndex(-1)} // Special state for 3D
                            className="w-12 h-12 rounded-full bg-primary text-white backdrop-blur-md border border-primary/20 flex items-center justify-center hover:scale-110 transition-all shadow-xl"
                          >
                             <Video size={20} className="animate-pulse" />
                          </button>
                       </Magnetic>
                    )}
                    <button 
                       onClick={toggleWishlist}
                       className={cn(
                          "w-12 h-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-all",
                          inWishlist ? "bg-primary border-primary text-white" : "bg-background/10 border-border/20 text-foreground hover:bg-background"
                       )}
                    >
                       <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-background/10 backdrop-blur-md border border-border/20 text-foreground flex items-center justify-center hover:bg-background transition-all">
                       <Share2 size={20} />
                    </button>
                 </div>
              </div>
           </div>

           {/* Right: Info */}
           <div className="lg:col-span-5 space-y-8">
              <div className="pb-8 border-b border-border">
                 <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{product.brand}</span>
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-full">
                       <Star size={12} className="text-amber-500 fill-amber-500" />
                       <span className="text-xs font-bold text-amber-600">{product.ratings.average}</span>
                    </div>
                 </div>
                 <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-[1.1] mb-6">{product.title}</h1>
                 <div className="flex items-end gap-3">
                    <span className="text-4xl font-black tracking-tight">${(price || 0).toFixed(2)}</span>
                    {price < originalPrice && (
                       <>
                          <span className="text-lg text-muted-foreground line-through font-bold opacity-50 mb-1">${(originalPrice || 0).toFixed(2)}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-1 rounded-md mb-2">Sale</span>
                       </>
                    )}
                 </div>
              </div>

              {/* Selectors */}
              <div className="space-y-6">
                 {/* Color */}
                 <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Color: <span className="text-foreground">{selectedColor}</span></span>
                    <div className="flex flex-wrap gap-3">
                       {Array.from(new Set(product.variants.map(v => v.color))).map((color) => (
                          <button
                             key={color}
                             onClick={() => setSelectedColor(color)}
                             className={cn(
                                "h-10 px-4 rounded-xl border-2 flex items-center gap-2 transition-all font-bold text-sm",
                                selectedColor === color 
                                   ? "border-primary bg-primary/5 text-primary" 
                                   : "border-border hover:border-muted-foreground/30"
                             )}
                          >
                             <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: color.toLowerCase() }} />
                             {color}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Size */}
                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Size</span>
                       <button className="text-[10px] font-black uppercase tracking-widest text-primary underline">Size Guide</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
                          const variant = product.variants.find(v => v.color === selectedColor && v.size === size);
                          const isAvailable = variant && variant.stock > 0;
                          const isSelected = selectedSize === size;

                          return (
                             <button
                                key={size}
                                disabled={!isAvailable}
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                   "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm border-2 transition-all",
                                    isSelected ? "border-primary bg-primary text-white shadow-lg shadow-primary/25" :
                                    isAvailable ? "border-border hover:border-primary" :
                                    "border-muted bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                                 )}
                             >
                                {size}
                             </button>
                          );
                       })}
                    </div>
                 </div>
              </div>

               {/* CTA */}
               <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                  <div className="h-14 px-4 bg-muted border border-border rounded-2xl flex items-center justify-between min-w-[120px]">
                     <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-primary transition-colors"><Minus size={16} /></button>
                     <span className="font-bold text-foreground">{quantity}</span>
                     <button onClick={() => setQuantity(quantity + 1)} className="hover:text-primary transition-colors"><Plus size={16} /></button>
                  </div>
                  
                  <Magnetic strength={0.1} className="flex-1">
                    <button 
                        onClick={handleAddToCart}
                        className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                    >
                        <ShoppingCart size={18} /> Add To Cart
                    </button>
                  </Magnetic>
                  
                  <Magnetic strength={0.1} className="flex-1">
                    <button 
                      onClick={() => {
                          clearCart();
                          handleAddToCart();
                          router.push("/checkout");
                      }}
                      className="w-full h-14 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                    >
                        Buy Now
                    </button>
                  </Magnetic>
               </div>

              {/* Badges */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex items-center gap-3 p-4 bg-muted rounded-2xl border border-border">
                    <Truck className="text-primary" size={20} />
                    <div className="text-xs">
                       <p className="font-bold text-foreground">Free Shipping</p>
                       <p className="text-muted-foreground">Orders $200+</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-muted rounded-2xl border border-border">
                    <RotateCcw className="text-primary" size={20} />
                    <div className="text-xs">
                       <p className="font-bold text-foreground">Free Returns</p>
                       <p className="text-muted-foreground">30-day guarantee</p>
                    </div>
                 </div>
              </div>

              {/* Details Accordion */}
              <div className="space-y-2 mt-4">
                 {[
                    { id: "details", title: "Details", content: product.description },
                    { id: "shipping", title: "Shipping", content: "Express delivery available. Ships within 24h." },
                    { id: "care", title: "Material & Care", content: "Premium quality materials. Hand wash recommended." }
                  ].map((item) => (
                     <div key={item.id} className="border-b border-border">
                       <button 
                          onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                          className="w-full py-4 flex items-center justify-between text-xs font-black uppercase tracking-widest text-foreground"
                       >
                          {item.title}
                          <ChevronDown size={14} className={cn("transition-transform", openAccordion === item.id && "rotate-180")} />
                       </button>
                       <AnimatePresence>
                          {openAccordion === item.id && (
                             <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                             >
                                <p className="pb-4 text-sm text-muted-foreground font-medium leading-relaxed">{item.content}</p>
                             </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                 ))}
              </div>
           </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
