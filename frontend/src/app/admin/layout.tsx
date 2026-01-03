"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronRight,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/users", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex text-foreground">
      {/* Sidebar */}
      <aside className="w-72 bg-background border-r border-border flex flex-col fixed inset-y-0 z-50">
        <div className="p-8 border-b border-border">
           <Link href="/admin" className="text-2xl font-black tracking-tighter">
              VELVÈT<span className="text-primary italic">.ADM</span>
           </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/25" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="text-sm font-bold">{item.name}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border">
           <button 
             suppressHydrationWarning
             className="flex items-center gap-3 px-4 py-3.5 w-full text-muted-foreground hover:text-red-500 transition-colors font-bold text-sm"
           >
              <LogOut size={20} />
              <span>Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-40 px-10 flex items-center justify-between">
           <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
              <span>Admin</span>
              <ChevronRight size={14} />
              <span className="text-foreground capitalize">{pathname.split("/").pop() || "Dashboard"}</span>
           </div>

           <div className="flex items-center gap-6">
              <Link href="/admin/products/new" className="h-11 px-6 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
                 <Plus size={18} />
                 Add Product
              </Link>
              <div className="w-10 h-10 rounded-full bg-muted border-2 border-background shadow-sm overflow-hidden">
                 {/* Admin Avatar */}
              </div>
           </div>
        </header>

        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
