"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Trash2, ShoppingCart, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/useCartStore";

interface WishlistItem {
  _id: string;
  title: string;
  slug: string;
  price: number;
  images: string[];
  variants?: {
    _id: string;
    sku: string;
    color: string;
    size: string;
    stock: number;
  }[];
}

interface User {
  _id: string;
  firstName: string;
}

const WishlistPage = () => {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const addToCart = useCartStore((state) => state.addItem);

  const fetchWishlist = React.useCallback(async (userId: string) => {
    try {
      const response = await api.get(`/users/${userId}/wishlist`);
      setWishlist(response.data.wishlist);
    } catch (error: any) {
      console.error("Failed to fetch wishlist:", error);
      if (error.response && error.response.status === 404 && error.response.data?.message === "User not found") {
         localStorage.removeItem("user");
         localStorage.removeItem("token");
         setUser(null);
         router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login?redirect=/wishlist");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchWishlist(parsedUser._id);
  }, [router, fetchWishlist]);

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    try {
      await api.delete(`/users/${user._id}/wishlist/${productId}`);
      setWishlist(prev => prev.filter(item => item._id !== productId));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  const handleAddToCart = (product: WishlistItem) => {
    const variant = product.variants?.[0];
    addToCart({
      id: product._id,
      variantId: variant?._id || variant?.sku || product._id,
      name: product.title,
      image: product.images?.[0] || "",
      price: product.price,
      quantity: 1,
      stock: variant?.stock || 100,
      color: variant?.color || "Default",
      size: variant?.size || "One Size"
    });
  };

  if (loading) {
     return (
        <div className="min-h-screen bg-background flex items-center justify-center">
           <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="container mx-auto px-6 py-32">
        {/* Header */}
        <div className="mb-12">
           <Link href="/profile" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4">
              <ArrowLeft size={16} /> Back to Profile
           </Link>
           <div className="flex items-end justify-between">
              <div>
                 <h1 className="text-4xl font-black tracking-tighter mb-2">My Wishlist</h1>
                 <p className="text-muted-foreground font-medium">Saved items for later</p>
              </div>
              <div className="text-sm font-bold bg-muted px-4 py-2 rounded-full border border-border">
                 {wishlist.length} Items
              </div>
           </div>
        </div>

        {wishlist.length === 0 ? (
           <div className="text-center py-32 bg-muted rounded-[40px] border border-dashed border-border">
              <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
                 <Heart size={32} className="text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-8">Browse our collections and save your favorite items.</p>
              <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl shadow-primary/20">
                 Start Shopping
              </Link>
           </div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {wishlist.map((item) => (
                 <div key={item._id} className="group relative bg-background border border-border rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                    <Link href={`/product/${item.slug}`} className="block relative aspect-[4/5] bg-muted overflow-hidden">
                       {item.images?.[0] ? (
                          <Image 
                             src={item.images[0]} 
                             alt={item.title} 
                             fill 
                             sizes="(max-width: 768px) 100vw, 25vw"
                             className="object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground font-bold">No Image</div>
                       )}
                       
                       {/* Overlay Actions */}
                       <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <button 
                             onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart(item);
                             }}
                             className="w-full h-12 bg-background text-foreground rounded-xl flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest border border-border hover:bg-primary hover:text-white hover:border-primary transition-all shadow-lg"
                          >
                             <ShoppingCart size={14} /> Add to Cart
                          </button>
                       </div>
                    </Link>

                    <div className="p-5">
                       <Link href={`/product/${item.slug}`}>
                          <h3 className="font-bold text-sm mb-1 truncate hover:text-primary transition-colors">{item.title}</h3>
                       </Link>
                       <div className="flex items-center justify-between">
                          <p className="font-black text-lg">${item.price}</p>
                          <button 
                             onClick={() => removeFromWishlist(item._id)}
                             className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;
