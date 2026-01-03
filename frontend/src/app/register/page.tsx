"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import api from "@/lib/api";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/register", formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row-reverse">
      {/* Visual side */}
      <div className="hidden md:flex md:w-1/2 bg-background border-l border-border items-center justify-center p-20 relative overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="relative z-10 text-center">
            <h1 className="text-6xl font-black text-foreground tracking-tighter mb-6">
                JOIN THE <br /> <span className="text-primary">ELITE</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-sm mx-auto leading-relaxed font-medium">
                Experience the pinnacle of luxury shopping. Create your account today.
            </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center md:text-left">
            <Link href="/" className="text-2xl font-black tracking-tighter mb-4 inline-block">
                LUXE<span className="text-primary">STYLE</span>
            </Link>
            <h2 className="text-3xl font-bold mt-4">Create Account</h2>
            <p className="text-muted-foreground mt-2">Start your premium journey with us</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">First Name</label>
                <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                   <input
                     name="firstName"
                     type="text"
                     value={formData.firstName}
                     onChange={handleChange}
                     className="w-full bg-muted border border-border h-14 pl-12 pr-4 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                     placeholder="John"
                     required
                   />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Last Name</label>
                <div className="relative">
                   <input
                     name="lastName"
                     type="text"
                     value={formData.lastName}
                     onChange={handleChange}
                     className="w-full bg-muted border border-border h-14 px-4 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                     placeholder="Doe"
                     required
                   />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                 <input
                   name="email"
                   type="email"
                   value={formData.email}
                   onChange={handleChange}
                   className="w-full bg-muted border border-border h-14 pl-12 pr-4 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                   placeholder="john@example.com"
                   required
                 />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Password</label>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                 <input
                   name="password"
                   type="password"
                   value={formData.password}
                   onChange={handleChange}
                   className="w-full bg-muted border border-border h-14 pl-12 pr-4 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                   placeholder="••••••••"
                   required
                 />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded-sm border-border text-primary focus:ring-primary bg-muted" required />
                <span className="text-muted-foreground">I agree to the <Link href="/terms" className="text-primary font-bold">Terms & Conditions</Link></span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white h-14 rounded-xl font-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-primary/25"
            >
              {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              {!isLoading && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="mt-10 text-center text-muted-foreground">
            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
