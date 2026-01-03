"use client";

import React, { useState } from "react";
import { 
  Save,
  Globe,
  Bell,
  Lock,
  CreditCard
} from "lucide-react";
import { motion } from "framer-motion";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "payments", label: "Payments", icon: CreditCard },
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">Configure store preferences and system settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-foreground text-background shadow-lg"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-background p-8 rounded-[32px] border border-border shadow-sm"
          >
             {activeTab === "general" && (
                <div className="space-y-6">
                   <h2 className="text-lg font-black italic">Store Information</h2>
                   <div className="grid gap-4">
                      <div>
                         <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Store Name</label>
                         <input className="w-full h-12 px-4 bg-muted border border-border rounded-xl" defaultValue="VELVÈT LUXE" />
                      </div>
                      <div>
                         <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Support Email</label>
                         <input className="w-full h-12 px-4 bg-muted border border-border rounded-xl" defaultValue="support@velvetluxe.com" />
                      </div>
                   </div>
                   <div className="pt-4 border-t border-border">
                      <button className="px-6 py-3 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                         <Save size={16} /> Save Changes
                      </button>
                   </div>
                </div>
             )}
             
             {activeTab !== "general" && (
                <div className="py-20 text-center">
                   <p className="text-muted-foreground font-bold">This section is under development.</p>
                </div>
             )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
