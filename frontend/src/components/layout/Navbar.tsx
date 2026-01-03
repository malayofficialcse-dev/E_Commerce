"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  Heart, 
  MapPin, 
  Phone, 
  Truck, 
  Moon, 
  Sun,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useCartStore } from "@/store/useCartStore";

const Navbar = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = useCartStore((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: "New Arrivals", href: "/shop?category=new" },
    { name: "Women", href: "/shop?category=women" },
    { name: "Men", href: "/shop?category=men" },
    { name: "Lookbook", href: "/lookbook" },
    ...(user ? [{ name: "My Orders", href: "/orders" }] : []),
  ];

  if (!mounted) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500">
      {/* Top Bar - Info bar - Glass Effect */}
      <div className="bg-background/60 backdrop-blur-xl text-foreground text-[11px] py-1.5 px-6 flex justify-between items-center font-medium border-b border-white/5">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Truck size={14} className="text-primary" />
            <span>Free Shipping on orders above $50</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 border-l border-border pl-6">
            <MapPin size={14} />
            <span>Store Locator</span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <span className="hover:underline cursor-pointer">Help</span>
          <span className="hidden sm:inline border-l border-border pl-6">Download Our App</span>
        </div>
      </div>

      {/* Main Header - Glass Effect */}
      <div className="bg-background/80 backdrop-blur-2xl border-b border-white/5 px-6 py-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span className="text-3xl font-black tracking-tighter">
            VELVÈT<span className="text-primary italic">LUXE</span>
          </span>
        </Link>

        {/* Search Bar - Center */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for premium products..." 
            className="w-full h-12 bg-muted/50 border border-border rounded-full pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
        </form>

        {/* Actions - Right */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Enhanced Theme Toggle */}
          <button 
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="group relative flex items-center gap-2 px-4 py-2 bg-muted hover:bg-accent rounded-full transition-all duration-300 border border-border"
            title={resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className="relative w-5 h-5">
              {resolvedTheme === "dark" ? (
                <Sun size={20} className="text-yellow-500 animate-pulse" />
              ) : (
                <Moon size={20} className="text-blue-600" />
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
              {resolvedTheme === "dark" ? "Light" : "Dark"}
            </span>
          </button>
          
          <Link href={user ? "/profile" : "/login"} className="hidden sm:flex items-center space-x-2 text-sm font-bold uppercase tracking-wider px-4 py-2 hover:bg-muted rounded-full transition-colors">
            <User size={20} />
            <span>{user ? user.firstName : "Sign In"}</span>
          </Link>

          {user && user.role === "admin" && (
            <Link href="/admin" className="hidden sm:flex items-center space-x-2 text-sm font-bold uppercase tracking-wider px-4 py-2 bg-foreground text-background rounded-full transition-all hover:scale-105 shadow-xl">
               <span>Admin Dashboard</span>
            </Link>
          )}

          <Link href="/wishlist" className="p-2.5 hover:bg-muted rounded-full transition-colors relative">
            <Heart size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Link>

          <Link href="/cart" className="p-2.5 hover:bg-muted rounded-full transition-colors relative">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-background">
                {totalItems}
              </span>
            )}
          </Link>

          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2.5 hover:bg-muted rounded-full transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Nav Content / Bottom Header - Glass Effect */}
      <div className="hidden md:flex bg-background/90 backdrop-blur-xl border-b border-white/5 justify-center">
        <ul className="flex items-center space-x-10 py-3">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link 
                href={link.href} 
                className="text-xs font-black uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center gap-1 group"
              >
                {link.name}
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 bg-background z-[100] p-8"
          >
            <div className="flex justify-between items-center mb-12">
               <span className="text-2xl font-black italic">VELVÈT</span>
               <button onClick={() => setIsMobileMenuOpen(false)}>
                 <X size={32} />
               </button>
            </div>
            <nav className="flex flex-col space-y-8">
               {navLinks.map((link) => (
                 <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl font-bold tracking-tighter hover:text-primary transition-colors"
                  >
                   {link.name}
                 </Link>
               ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
