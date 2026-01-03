"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import FilterSidebar from "@/components/products/FilterSidebar";
import { useProducts, useCategoryTree } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const ShopPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // States
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")?.split(",").filter(Boolean) || []
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    searchParams.get("subCategories")?.split(",").filter(Boolean) || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 10000
  ]);
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // Sync URL to State (for external changes like Navbar search)
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null && q !== searchQuery) setSearchQuery(q);
  }, [searchParams, searchQuery]);

  // Sync State to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategories.length) params.set("categories", selectedCategories.join(","));
    if (selectedSubCategories.length) params.set("subCategories", selectedSubCategories.join(","));
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 10000) params.set("maxPrice", priceRange[1].toString());
    if (sort !== "newest") params.set("sort", sort);
    if (page > 1) params.set("page", page.toString());

    const newPath = `/shop?${params.toString()}`;
    if (window.location.search !== `?${params.toString()}`) {
       router.replace(newPath);
    }
  }, [searchQuery, selectedCategories, selectedSubCategories, priceRange, sort, page, router]);

  const { data: categoryTree } = useCategoryTree();

  // Helper to find name from tree
  const getCategoryName = (id: string) => {
    if (!categoryTree) return id;
    for (const cat of categoryTree) {
      if (cat._id === id) return cat.name;
      if (cat.children) {
        const sub = cat.children.find((s: any) => s._id === id);
        if (sub) return sub.name;
      }
    }
    return "Category";
  };

  const { data: productData, isLoading } = useProducts({
    q: searchQuery,
    categories: selectedCategories.join(","),
    subCategories: selectedSubCategories.join(","),
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    sort,
    pageNumber: page,
    limit: 12
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-40 pb-24">
        {/* Header Section */}
        <div className="mb-16">
            <h1 className="text-7xl font-black tracking-tighter mb-6 italic">THE COLLECTION</h1>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
               <form onSubmit={handleSearch} className="relative w-full md:w-[450px] group">
                  <input 
                    type="text" 
                    placeholder="Search premium products..." 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                    className="w-full bg-muted/50 border border-border px-8 py-5 rounded-[24px] font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all pr-16 text-sm"
                  />
                  <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-all" size={20} />
               </form>

               <div className="flex items-center gap-6 w-full md:w-auto">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Sort By</span>
                  <div className="relative group">
                     <select 
                        value={sort}
                        onChange={(e) => { setSort(e.target.value); setPage(1); }}
                        className="appearance-none bg-muted/50 border border-border px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-pointer focus:ring-4 focus:ring-primary/10 outline-none pr-16"
                     >
                        <option value="newest">Newest Drops</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="popular">Most Popular</option>
                     </select>
                     <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground transition-transform group-hover:translate-y-[-40%]" size={14} />
                  </div>
               </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
           {/* Sidebar */}
           <div className="hidden md:block w-64 flex-shrink-0">
              <FilterSidebar 
                selectedCategories={selectedCategories}
                setSelectedCategories={(ids: string[]) => { setSelectedCategories(ids); setPage(1); }}
                selectedSubCategories={selectedSubCategories}
                setSelectedSubCategories={(ids: string[]) => { setSelectedSubCategories(ids); setPage(1); }}
                priceRange={priceRange}
                setPriceRange={(range: [number, number]) => { setPriceRange(range); setPage(1); }}
              />
           </div>

           {/* Main Grid */}
           <div className="flex-1">
              {/* Active Filters Display */}
              {(selectedCategories.length > 0 || selectedSubCategories.length > 0 || searchQuery) && (
                 <div className="flex flex-wrap gap-3 mb-12">
                    {searchQuery && (
                       <div className="bg-foreground text-background text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full flex items-center gap-3 shadow-xl shadow-foreground/10 hover:scale-105 transition-transform cursor-default">
                          Search: {searchQuery}
                          <button onClick={() => setSearchQuery("")} className="hover:opacity-50 transition-opacity ml-1">×</button>
                       </div>
                    )}
                    
                    {selectedCategories.map(id => (
                       <div key={id} className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full flex items-center gap-3 hover:bg-primary/20 transition-all cursor-default">
                          {getCategoryName(id)}
                          <button onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== id))} className="hover:text-foreground transition-colors ml-1">×</button>
                       </div>
                    ))}

                    {selectedSubCategories.map(id => (
                       <div key={id} className="bg-muted border border-border text-foreground text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full flex items-center gap-3 hover:border-primary/30 transition-all cursor-default">
                          {getCategoryName(id)}
                          <button onClick={() => setSelectedSubCategories(selectedSubCategories.filter(s => s !== id))} className="hover:text-primary transition-colors ml-1">×</button>
                       </div>
                    ))}

                    <button 
                       onClick={() => { setSelectedCategories([]); setSelectedSubCategories([]); setPriceRange([0, 10000]); setSearchQuery(""); }}
                       className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all underline underline-offset-8 border-l border-border pl-8 ml-4 h-5 mt-2"
                    >
                       Clear All Filters
                    </button>
                 </div>
              )}

              {isLoading ? (
                 <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                       <div key={i} className="space-y-8 animate-pulse">
                          <Skeleton className="aspect-[4/5] w-full rounded-[48px] bg-muted/50" />
                          <div className="space-y-3 px-4">
                             <Skeleton className="h-4 w-3/4 rounded-lg" />
                             <Skeleton className="h-3 w-1/4 rounded-lg" />
                          </div>
                       </div>
                    ))}
                 </div>
              ) : (
                 <>
                    {productData?.products?.length > 0 ? (
                       <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {productData.products.map((product: any) => (
                             <ProductCard key={product._id} product={product} />
                          ))}
                       </div>
                    ) : (
                       <div className="py-24 text-center bg-muted/30 rounded-[40px] border border-dashed border-border">
                          <div className="inline-flex p-6 bg-background rounded-full mb-6">
                            <SlidersHorizontal size={40} className="text-muted-foreground opacity-20" />
                          </div>
                          <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter">No items found</h2>
                          <p className="text-muted-foreground font-medium mb-8">Try adjusting your filters or search keywords.</p>
                          <button 
                             onClick={() => { setSelectedCategories([]); setSelectedSubCategories([]); setPriceRange([0, 10000]); setSearchQuery(""); }}
                             className="px-8 py-4 bg-foreground text-background font-black rounded-2xl hover:scale-105 transition-all text-xs uppercase tracking-widest"
                          >
                             Reset All Filters
                          </button>
                       </div>
                    )}

                    {/* Pagination */}
                    {productData && productData.pages > 1 && (
                       <div className="flex justify-center mt-20 gap-3">
                          {[...Array(productData.pages)].map((_, i) => (
                             <button
                                key={i}
                                onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className={cn(
                                   "w-12 h-12 rounded-2xl font-black transition-all",
                                   page === i + 1
                                      ? "bg-primary text-white shadow-xl shadow-primary/25 scale-110"
                                      : "bg-muted border border-border hover:border-primary text-muted-foreground hover:text-primary"
                                )}
                             >
                                {i + 1}
                             </button>
                          ))}
                       </div>
                    )}
                 </>
              )}
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPage;
