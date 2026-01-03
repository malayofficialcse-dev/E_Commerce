import React from "react";
import Link from "next/link";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw,
  Truck
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted pb-8 border-t border-border pt-20">
      <div className="container mx-auto px-6 pb-12">
        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20 border-b border-border pb-12">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-background rounded-2xl shadow-sm border border-border">
                    <Truck size={24} className="text-primary" />
                </div>
                <div>
                    <h4 className="font-bold text-sm">Free Shipping</h4>
                    <p className="text-xs text-muted-foreground">On orders over $50</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-background rounded-2xl shadow-sm border border-border">
                    <RotateCcw size={24} className="text-primary" />
                </div>
                <div>
                    <h4 className="font-bold text-sm">30 Day Returns</h4>
                    <p className="text-xs text-muted-foreground">Hassle free returns</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-background rounded-2xl shadow-sm border border-border">
                    <ShieldCheck size={24} className="text-primary" />
                </div>
                <div>
                    <h4 className="font-bold text-sm">Secure Payment</h4>
                    <p className="text-xs text-muted-foreground">100% Secure Checkout</p>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-background rounded-2xl shadow-sm border border-border">
                    <Phone size={24} className="text-primary" />
                </div>
                <div>
                    <h4 className="font-bold text-sm">24/7 Support</h4>
                    <p className="text-xs text-muted-foreground">Dedicated assistance</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
             <Link href="/" className="inline-block mb-6">
               <span className="text-3xl font-black tracking-tighter uppercase italic">VELVÈT</span>
             </Link>
             <p className="text-muted-foreground text-sm max-w-sm mb-8 leading-relaxed">
               Redefining modern elegance through curated collections of premium fashion. Join us in our journey of timeless style.
             </p>
             <div className="flex items-center space-x-4">
               <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                 <Instagram size={18} />
               </button>
               <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                 <Facebook size={18} />
               </button>
               <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                 <Twitter size={18} />
               </button>
               <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                 <Youtube size={18} />
               </button>
             </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h5 className="font-black uppercase tracking-widest text-[11px] mb-6 inline-block border-b-2 border-primary pb-1">Shop</h5>
            <ul className="space-y-4">
              {["Men", "Women", "Kids", "Accessories", "New Arrivals"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h5 className="font-black uppercase tracking-widest text-[11px] mb-6 inline-block border-b-2 border-primary pb-1">Support</h5>
            <ul className="space-y-4">
              {["Order Tracking", "Shipping Policy", "Return Policy", "Store Locator", "Help Center"].map((item) => (
                <li key={item}>
                   <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block duration-300">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4">
             <h5 className="font-black uppercase tracking-widest text-[11px] mb-6 inline-block border-b-2 border-primary pb-1">Newsletter</h5>
             <p className="text-sm text-muted-foreground mb-6">Stay ahead of the curve. Receive the latest style drops and exclusive offers.</p>
             <div className="relative">
                 <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full bg-background border border-border h-14 pl-4 pr-14 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
                <button className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                   <ArrowUpRight size={20} />
                </button>
             </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-xs text-muted-foreground font-medium">
             © 2026 VELVÈT LUXE. All Rights Reserved. Designed for Excellence.
           </p>
           <div className="flex items-center space-x-6 text-[10px] uppercase tracking-tighter font-bold text-muted-foreground">
             <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
             <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
             <Link href="#" className="hover:text-primary transition-colors">Cookies</Link>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
