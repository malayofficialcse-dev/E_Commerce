"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User as UserIcon, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CreditCard, 
  LogOut,
  ChevronRight,
  Shield
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  _id: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
    // Set mounted after user check to avoid flickering/mismatches
    setIsMounted(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (!isMounted || !user) return null;

  const sections = [
    { title: "Personal Details", icon: UserIcon, desc: "Edit your account information" },
    { title: "Order History", icon: ShoppingBag, desc: "View all your past purchases" },
    { title: "Your Wishlist", icon: Heart, desc: "Check items you've saved" },
    { title: "Manage Addresses", icon: MapPin, desc: "Primary and secondary shipping spots" },
    { title: "Payment Methods", icon: CreditCard, desc: "Securely stored cards and accounts" },
    { title: "Security & Privacy", icon: Shield, desc: "Passwords and data management" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-24">
        <div className="max-w-6xl mx-auto">
           {/* Header Cover Area */}
           <div className="h-48 rounded-[40px] bg-gradient-to-r from-primary/20 to-background group relative overflow-hidden mb-20 border border-border">
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center" />
              
              <div className="absolute -bottom-12 left-12 flex items-end gap-6">
                 <div className="w-32 h-32 rounded-[32px] bg-background border-8 border-background shadow-xl overflow-hidden flex items-center justify-center">
                    <UserIcon size={64} className="text-muted-foreground/30" />
                 </div>
                 <div className="mb-4 pb-2">
                    <h1 className="text-4xl font-black tracking-tighter">{user.firstName} {user.lastName}</h1>
                    <p className="text-sm font-bold text-muted-foreground uppercase opacity-60 tracking-widest">{user.email}</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Profile Menu */}
              <div className="lg:col-span-4 space-y-4">
                 <div className="bg-background border border-border p-8 rounded-[40px] shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">Account Management</h3>
                    <nav className="space-y-4">
                       {sections.map((section) => (
                         <button 
                           key={section.title} 
                           onClick={() => {
                             if (section.title === "Order History") router.push("/orders");
                             if (section.title === "Your Wishlist") router.push("/wishlist");
                           }}
                           className="w-full flex items-center justify-between p-4 bg-muted hover:bg-accent rounded-2xl transition-all group text-left"
                         >
                            <div className="flex items-center gap-4">
                               <div className="p-2 bg-background rounded-xl group-hover:text-primary transition-colors">
                                  <section.icon size={18} />
                               </div>
                               <div>
                                  <p className="text-sm font-black">{section.title}</p>
                                  <p className="text-[10px] text-muted-foreground font-medium">{section.desc}</p>
                               </div>
                            </div>
                            <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                         </button>
                       ))}
                    </nav>

                    <div className="mt-12 pt-8 border-t border-border">
                       <button 
                         onClick={handleLogout}
                         className="w-full h-14 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                        >
                         <LogOut size={18} />
                         Sign Out
                       </button>
                    </div>
                 </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-8 space-y-8">
                 <div className="bg-background border border-border p-10 rounded-[40px] shadow-sm">
                    <h2 className="text-2xl font-black italic mb-8">My Orders</h2>
                    <div className="text-center py-20 grayscale opacity-30">
                       <ShoppingBag size={64} className="mx-auto mb-6" />
                       <p className="font-black uppercase tracking-widest text-xs">No orders yet</p>
                       <p className="text-xs text-muted-foreground mt-2">When you shop, your orders will appear here.</p>
                       <Link href="/shop" className="inline-block mt-8 text-primary font-black uppercase tracking-widest text-xs border-b-2 border-primary">Start Shopping</Link>
                    </div>
                 </div>

                 <div className="bg-foreground text-background p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-60 h-60 bg-primary/20 rounded-full blur-[80px]" />
                    <h2 className="text-2xl font-black italic mb-4 relative z-10">Premium Member Benefits</h2>
                    <p className="text-muted-foreground mb-8 relative z-10 font-medium">As a member of VELVÈT LUXE, you have access to exclusive releases and priority shipping.</p>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                       <div className="p-6 bg-background/5 border border-background/10 rounded-2xl">
                          <p className="text-primary font-black mb-1">FREE</p>
                          <p className="text-[10px] font-black uppercase tracking-widest">Global Express Shipping</p>
                       </div>
                       <div className="p-6 bg-background/5 border border-background/10 rounded-2xl">
                          <p className="text-primary font-black mb-1">EARLY</p>
                          <p className="text-[10px] font-black uppercase tracking-widest">Access to drops</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
