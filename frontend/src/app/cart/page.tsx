"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useCartStore } from "@/store/useCartStore";

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-8">
              <Link href="/shop" className="p-2 hover:bg-muted rounded-full transition-colors">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-4xl font-black tracking-tight">Your Bag</h1>
              <span className="text-muted-foreground font-medium ml-2">({items.length} items)</span>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-24 bg-muted rounded-3xl border-2 border-dashed border-border">
                <div className="inline-flex p-6 bg-background rounded-full mb-6">
                  <ShoppingBag size={48} className="text-muted-foreground/30" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Your bag is empty</h2>
                <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added anything to your bag yet.</p>
                <Link href="/shop" className="inline-flex px-8 py-4 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/25">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.variantId}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-6 p-6 bg-background border border-border rounded-3xl group"
                    >
                      <div className="relative w-32 h-40 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill sizes="128px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">No Image</div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-xl font-bold hover:text-primary transition-colors cursor-pointer">
                              {item.name}
                            </h3>
                            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                              <p>Color: <span className="text-foreground font-medium">{item.color}</span></p>
                              <p>Size: <span className="text-foreground font-medium">{item.size}</span></p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id, item.variantId)}
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-end mt-4">
                          <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
                            <button
                              onClick={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                              className="p-2 hover:bg-background rounded-lg transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-10 text-center font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                              className="p-2 hover:bg-background rounded-lg transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <p className="text-2xl font-black">${item.price * item.quantity}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {items.length > 0 && (
            <div className="w-full md:w-96">
              <div className="bg-muted border border-border p-8 rounded-3xl sticky top-32">
                <h2 className="text-2xl font-black mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground font-bold">${totalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimate Shipping</span>
                    <span className="text-foreground font-bold">$0.00</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated Tax</span>
                    <span className="text-foreground font-bold">$0.00</span>
                  </div>
                  <div className="h-px bg-border my-4" />
                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>
                    <span>${totalPrice()}</span>
                  </div>
                </div>
                
                <Link
                  href="/checkout"
                  className="w-full py-5 bg-primary text-white font-black text-center rounded-2xl block hover:scale-[1.02] transition-transform shadow-xl shadow-primary/30"
                >
                  CHECKOUT NOW
                </Link>
                
                <div className="mt-6 flex flex-col gap-4">
                  <p className="text-xs text-muted-foreground text-center">
                    Complimentary Shipping on orders over $1,500
                  </p>
                  <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                     {/* Payment Logos could go here */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CartPage;
