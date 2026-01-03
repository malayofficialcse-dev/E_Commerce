"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
      setEmail("");
    }
  };

  return (
    <section className="container mx-auto px-6 py-24">
      <div className="relative h-[500px] rounded-[60px] overflow-hidden bg-foreground flex items-center justify-center p-12">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 opacity-40">
           <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary rounded-full blur-[120px] animate-pulse" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[120px] animation-delay-2000 animate-pulse" />
        </div>

        <div className="relative z-10 max-w-3xl text-center">
           <motion.span 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="text-primary text-xs font-black uppercase tracking-[0.4em] mb-6 block"
           >
             The Inner Circle
           </motion.span>
           
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-white text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none"
           >
             JOIN THE NEW LUXURY <br className="hidden md:block" /> STANDARD.
           </motion.h2>

           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-white/60 text-lg mb-12 font-medium"
           >
             Get exclusive access to preview drops, private events, and <br className="hidden md:block" /> member-only collaborations. No spam, only substance.
           </motion.p>

           <AnimatePresence mode="wait">
             {!isSubmitted ? (
               <motion.form 
                 key="form"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 onSubmit={handleSubmit}
                 className="relative max-w-lg mx-auto"
               >
                 <input 
                   type="email" 
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="Enter your email address..."
                   className="w-full h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 pr-32 text-white outline-none focus:ring-2 focus:ring-primary transition-all font-bold"
                 />
                 <button 
                   type="submit"
                   className="absolute right-2 top-2 bottom-2 px-6 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                 >
                   Join <Send size={14} />
                 </button>
               </motion.form>
             ) : (
               <motion.div 
                 key="success"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center gap-4 text-white"
               >
                 <CheckCircle2 size={40} className="text-primary" />
                 <p className="text-xl font-black italic uppercase tracking-widest">Welcome to the family</p>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Decorative Grid Line */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
      </div>
    </section>
  );
};

export default Newsletter;
