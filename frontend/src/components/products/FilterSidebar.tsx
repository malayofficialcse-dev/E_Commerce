"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategoryTree } from "@/hooks/useProducts";

interface FilterSidebarProps {
  selectedCategories: string[];
  setSelectedCategories: (ids: string[]) => void;
  selectedSubCategories: string[];
  setSelectedSubCategories: (ids: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const FilterSidebar = ({
  selectedCategories,
  setSelectedCategories,
  selectedSubCategories,
  setSelectedSubCategories,
  priceRange,
  setPriceRange
}: FilterSidebarProps) => {
  const { data: categoryTree, isLoading } = useCategoryTree();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCategorySelect = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(item => item !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleSubCategorySelect = (id: string) => {
    if (selectedSubCategories.includes(id)) {
      setSelectedSubCategories(selectedSubCategories.filter(item => item !== id));
    } else {
      setSelectedSubCategories([...selectedSubCategories, id]);
    }
  };

  return (
    <aside className="w-full space-y-10">
      {/* Categories */}
      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Categories</h3>
        <div className="space-y-4">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-6 w-full bg-muted animate-pulse rounded-md" />
            ))
          ) : (
            categoryTree?.map((cat: any) => (
              <div key={cat._id} className="space-y-3">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleCategorySelect(cat._id)}
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                        selectedCategories.includes(cat._id) ? "bg-primary border-primary" : "border-border hover:border-primary"
                      )}
                    >
                      {selectedCategories.includes(cat._id) && <Check size={12} className="text-white" />}
                    </button>
                    <span 
                      onClick={() => toggleCategory(cat._id)}
                      className={cn(
                        "text-sm font-bold cursor-pointer hover:text-primary transition-colors",
                        selectedCategories.includes(cat._id) ? "text-primary" : "text-foreground"
                      )}
                    >
                      {cat.name}
                    </span>
                  </div>
                  {cat.children?.length > 0 && (
                    <button 
                      onClick={() => toggleCategory(cat._id)}
                      className="p-1 hover:bg-muted rounded-md transition-colors"
                    >
                      {expandedCategories.includes(cat._id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                {expandedCategories.includes(cat._id) && cat.children?.length > 0 && (
                  <div className="pl-8 space-y-3">
                    {cat.children.map((sub: any) => (
                      <div key={sub._id} className="flex items-center gap-3 group">
                        <button 
                          onClick={() => handleSubCategorySelect(sub._id)}
                          className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-all",
                            selectedSubCategories.includes(sub._id) ? "bg-primary border-primary" : "border-border hover:border-primary"
                          )}
                        >
                          {selectedSubCategories.includes(sub._id) && <Check size={10} className="text-white" />}
                        </button>
                        <span 
                          onClick={() => handleSubCategorySelect(sub._id)}
                          className={cn(
                            "text-xs font-medium cursor-pointer hover:text-primary transition-colors",
                            selectedSubCategories.includes(sub._id) ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {sub.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Price Range</h3>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="flex-1 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Min</span>
                <input 
                  type="number" 
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                />
             </div>
             <div className="flex-1 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Max</span>
                <input 
                  type="number" 
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                />
             </div>
          </div>
          <div className="flex gap-2">
             <button 
                onClick={() => setPriceRange([0, 10000])}
                className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border hover:bg-muted transition-colors"
             >
                Reset
             </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
