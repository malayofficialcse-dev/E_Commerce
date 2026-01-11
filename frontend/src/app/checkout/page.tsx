"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Info,
  Lock,
  Navigation
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

const STEPS = [
  { id: "shipping", title: "Information", icon: MapPin },
  { id: "method", title: "Shipping", icon: Truck },
  { id: "payment", title: "Payment", icon: CreditCard },
];

const CheckoutPage = () => {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ _id: string; email?: string; firstName?: string; lastName?: string } | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
    paymentProvider: "cod"
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setFormData(prev => ({
          ...prev,
          email: parsed.email || "",
          firstName: parsed.firstName || "",
          lastName: parsed.lastName || ""
        }));
      } else {
        router.push("/login?redirect=checkout");
      }
    }
  }, [router]);

  const fillDemoData = () => {
    setFormData(prev => ({
      ...prev,
      street: "42, High Street, South Extension",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110049",
      phone: "+91 98765 43210",
    }));
  };

  if (items.length === 0 && currentStep !== 3) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
         <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-8">
            <ShoppingBag size={40} className="text-muted-foreground/30" />
         </div>
         <h1 className="text-3xl font-black mb-4">Your bag is empty</h1>
         <p className="text-muted-foreground mb-8 max-w-xs mx-auto">Looks like you haven&apos;t added anything to your cart yet.</p>
         <button 
           onClick={() => router.push("/shop")}
           className="px-8 h-14 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
         >
            Back To Shop
         </button>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.phone) {
        alert("Please fill in all details before proceeding.");
        return;
      }
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please login to place an order.");
      router.push("/login?redirect=checkout");
      return;
    }

    if (!formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.phone) {
      alert("Please fill in all shipping details.");
      setCurrentStep(0);
      return;
    }

    setLoading(true);
    try {
      const currentUser = user!; // user is guaranteed to be non-null here due to the check above
      const orderData = {
        userId: currentUser._id,
        items: items.map(item => ({
          product: item.id,
          variantId: item.variantId || "default",
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image: item.image
        })),
        totalAmount: grandTotal,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
          lat: 28.6139, // Mock lat
          lng: 77.2090  // Mock lng
        },
        paymentProvider: formData.paymentProvider
      };

      const { data } = await api.post("/orders", orderData);

      clearCart();
      router.push(`/orders/${data.order._id}`);
    } catch (error: unknown) {
      console.error("Order error", error);
      let message = "Failed to place order. Please check all fields.";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { message: string } } };
        message = axiosError.response?.data?.message || message;
      }
      
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const finalTotal = totalPrice();
  const tax = finalTotal * 0.12;
  const shippingCost = finalTotal > 1500 ? 0 : 50;
  const grandTotal = finalTotal + tax + shippingCost;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-48 pb-24 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Steps & Forms */}
          <div className="lg:col-span-8 space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-between px-2">
               {STEPS.map((step, idx) => (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => idx < currentStep && setCurrentStep(idx)}>
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                        idx === currentStep ? "bg-primary text-white shadow-xl shadow-primary/30" : 
                        idx < currentStep ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                      )}>
                        {idx < currentStep ? <CheckCircle2 size={24} /> : <step.icon size={22} />}
                      </div>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        idx === currentStep ? "text-primary" : "text-muted-foreground opacity-60"
                      )}>{step.title}</span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={cn(
                        "flex-1 h-[2px] mx-4 rounded-full transition-all duration-700",
                        idx < currentStep ? "bg-green-500" : "bg-border"
                      )} />
                    )}
                  </React.Fragment>
               ))}
            </div>

            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step-shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-background p-10 rounded-[40px] border border-border shadow-sm space-y-8"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-black italic mb-2 tracking-tight uppercase">Shipping Destination</h2>
                      <p className="text-muted-foreground text-sm">Please provide your precise location for the runway shipment.</p>
                    </div>
                    <button 
                      onClick={fillDemoData}
                      className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all"
                    >
                      Fill Demo
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Contact Email</label>
                        <input 
                           type="email"
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           className="w-full h-14 bg-muted border border-border rounded-2xl px-6 focus:ring-2 focus:ring-primary outline-none transition-all"
                           placeholder="johndoe@example.com"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Phone Number</label>
                        <input 
                           type="tel"
                           value={formData.phone}
                           onChange={(e) => setFormData({...formData, phone: e.target.value})}
                           className="w-full h-14 bg-muted border border-border rounded-2xl px-6 focus:ring-2 focus:ring-primary outline-none transition-all"
                           placeholder="+91 XXXXX XXXXX"
                        />
                     </div>
                     <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Street Address</label>
                        <input 
                           type="text"
                           value={formData.street}
                           onChange={(e) => setFormData({...formData, street: e.target.value})}
                           className="w-full h-14 bg-muted border border-border rounded-2xl px-6 focus:ring-2 focus:ring-primary outline-none transition-all"
                           placeholder="123 Luxury Avenue, Suite 400"
                        />
                     </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">City</label>
                        <input 
                           type="text"
                           value={formData.city}
                           onChange={(e) => setFormData({...formData, city: e.target.value})}
                           className="w-full h-14 bg-muted border border-border rounded-2xl px-6 focus:ring-2 focus:ring-primary outline-none transition-all"
                           placeholder="New Delhi"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">State / Province</label>
                        <input 
                           type="text"
                           value={formData.state}
                           onChange={(e) => setFormData({...formData, state: e.target.value})}
                           className="w-full h-14 bg-muted border border-border rounded-2xl px-6 focus:ring-2 focus:ring-primary outline-none transition-all"
                           placeholder="Delhi"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Postal Code</label>
                        <input 
                           type="text"
                           value={formData.zipCode}
                           onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                           className="w-full h-14 bg-muted border border-border rounded-2xl px-6 focus:ring-2 focus:ring-primary outline-none transition-all"
                           placeholder="110001"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Country</label>
                        <input 
                           type="text"
                           value={formData.country}
                           onChange={(e) => setFormData({...formData, country: e.target.value})}
                           className="w-full h-14 bg-muted border border-border rounded-2xl px-6 focus:ring-2 focus:ring-primary outline-none transition-all"
                           placeholder="India"
                        />
                     </div>
                  </div>

                  {/* Map Panel */}
                  <div className="relative h-64 bg-[#050505] rounded-3xl overflow-hidden border border-border group transition-all duration-700">
                      <Image 
                        src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000" 
                        alt="Location Map" 
                        fill 
                        className="object-cover opacity-20 grayscale group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="relative">
                            <motion.div 
                              animate={{ scale: [1, 2, 1], opacity: [0.3, 0.1, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-16 h-16 bg-primary rounded-full" 
                            />
                            <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary shadow-[0_0_20px_var(--primary)]" size={32} />
                         </div>
                      </div>
                      
                      <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-between shadow-2xl">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                               <Navigation size={18} />
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified Location</p>
                               <p className="text-sm font-bold truncate max-w-[200px]">{formData.street || "Select on Map..."}</p>
                            </div>
                         </div>
                         <button className="px-4 py-2 bg-background text-foreground text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-muted transition-colors border border-border">Adjust</button>
                      </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step-method"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-background p-10 rounded-[40px] border border-border shadow-sm space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-black italic mb-2 tracking-tight uppercase">Shipping Method</h2>
                    <p className="text-muted-foreground text-sm">Select the velocity of your delivery.</p>
                  </div>

                  <div className="space-y-4">
                     {[
                       { id: "std", name: "Standard Runway", price: "Free", time: "5-7 Business Days", icon: Truck },
                       { id: "exp", name: "Priority Studio", price: "$50.00", time: "2-3 Business Days", icon: Navigation },
                       { id: "ovn", name: "Overnight Editorial", price: "$120.00", time: "Tomorrow by 10 AM", icon: ShoppingBag },
                     ].map((method) => (
                        <div 
                          key={method.id}
                          className={cn(
                            "flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer",
                            method.id === "std" ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-border hover:border-muted-foreground/30"
                          )}
                        >
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center shadow-sm">
                               <method.icon size={20} className={method.id === "std" ? "text-primary" : "text-muted-foreground/30"} />
                             </div>
                             <div>
                               <p className="font-black italic uppercase tracking-tight">{method.name}</p>
                               <p className="text-xs text-muted-foreground">{method.time}</p>
                             </div>
                           </div>
                           <p className="font-black text-lg italic">{method.price}</p>
                        </div>
                     ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step-payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-background p-10 rounded-[40px] border border-border shadow-sm space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-black italic mb-2 tracking-tight uppercase">Payment Authorization</h2>
                    <p className="text-muted-foreground text-sm">Secure and encrypted transaction.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {[
                        { id: "cod", name: "Cash on delivery", desc: "Pay upon arrival" },
                        { id: "stripe", name: "Credit / Debit", desc: "Visa, Mastercard, Amex" },
                        { id: "upi", name: "UPI Transfer", desc: "Instant GPay/PhonePe" },
                     ].map((method) => (
                        <div 
                           key={method.id}
                           onClick={() => setFormData({...formData, paymentProvider: method.id})}
                           className={cn(
                             "p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4",
                             formData.paymentProvider === method.id ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" : "border-border hover:border-muted-foreground/30"
                           )}
                        >
                           <div className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                              formData.paymentProvider === method.id ? "border-primary" : "border-border"
                           )}>
                              {formData.paymentProvider === method.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                           </div>
                           <div>
                              <p className="font-black italic uppercase tracking-tight text-sm">{method.name}</p>
                              <p className="text-[10px] text-muted-foreground font-medium">{method.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="bg-muted p-8 rounded-3xl border border-border space-y-6">
                     <div className="flex items-center gap-3 text-primary mb-2">
                        <Lock size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Bank Grade Security</span>
                     </div>
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Card Number (Optional for COD)</label>
                           <input 
                              type="text"
                              disabled={formData.paymentProvider === "cod"}
                              className="w-full h-14 bg-background border border-border rounded-2xl px-6 focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-30"
                              placeholder="XXXX XXXX XXXX XXXX"
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Expiry Date</label>
                              <input 
                                 type="text"
                                 disabled={formData.paymentProvider === "cod"}
                                 className="w-full h-14 bg-background border border-border rounded-2xl px-6 focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-30"
                                 placeholder="MM / YY"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">CVV</label>
                              <input 
                                 type="text"
                                 disabled={formData.paymentProvider === "cod"}
                                 className="w-full h-14 bg-background border border-border rounded-2xl px-6 focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-30"
                                 placeholder="XXX"
                              />
                           </div>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-6 pt-4">
               <button 
                 onClick={() => currentStep > 0 && setCurrentStep(prev => prev - 1)}
                 disabled={currentStep === 0}
                 className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] hover:text-primary transition-colors disabled:opacity-20"
               >
                 <ArrowLeft size={16} /> Previous Step
               </button>
               <button 
                 onClick={handleNext}
                 disabled={loading}
                 className="h-16 px-12 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 flex items-center gap-3 disabled:opacity-50"
               >
                 {loading ? "Processing..." : (
                   <>
                      {currentStep === 2 ? "Finalize Purchase" : "Continue to Shipping"}
                      <ChevronRight size={18} />
                   </>
                 )}
               </button>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4">
             <div className="bg-background p-10 rounded-[40px] border border-border shadow-xl sticky top-32 space-y-8">
               <div>
                 <h2 className="text-xl font-black italic tracking-tight uppercase">Bag Overview</h2>
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{items.length} Distinct Pieces</p>
               </div>

               <div className="space-y-6 max-h-[300px] overflow-y-auto scrollbar-hide pr-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="w-16 h-20 bg-muted rounded-xl overflow-hidden flex-shrink-0 relative">
                        <Image src={item.image} alt={item.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" sizes="64px" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="text-xs font-bold truncate">{item.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Qty: {item.quantity}</p>
                          <p className="text-xs font-black italic">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>

               <div className="pt-8 border-t border-border space-y-4">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground">${finalTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>GST (12%)</span>
                    <span className="text-foreground">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-foreground">${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between items-end">
                    <div>
                       <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">Total Payable</p>
                       <p className="text-4xl font-black italic tracking-tighter">${grandTotal.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                       <ShieldCheck size={24} className="text-green-500" />
                       <span className="text-[8px] font-bold text-muted-foreground">Secure Checkout</span>
                    </div>
                  </div>
               </div>

               <div className="p-4 bg-muted rounded-2xl flex items-center gap-3">
                  <Info size={16} className="text-muted-foreground/30" />
                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                    By placing your order, you agree to our <span className="underline">Terms of Sale</span> and <span className="underline">Editorial Use License</span>.
                  </p>
               </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
