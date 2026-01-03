"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  name: string;
  image: string;
  slug: string;
  _id?: string;
}

const CategoryQuickNav = () => {
  const { data: categories, isLoading } = useCategories();

  // Mock categories if none exist (for initial setup)
  const mockCategories = [
    { name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=200", slug: "electronics" },
    { name: "Fashion", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=200", slug: "fashion" },
    { name: "Beauty", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=200", slug: "beauty" },
    { name: "Home", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=200", slug: "home" },
    { name: "Sports", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=200", slug: "sports" },
    { name: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200", slug: "accessories" },
    { name: "Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200", slug: "footwear" },
  ];

  const displayCategories = categories?.length ? categories : mockCategories;

  return (
    <div className="bg-background py-10 overflow-x-auto scrollbar-hide">
      <div className="container mx-auto px-6 whitespace-nowrap flex justify-between items-center min-w-max gap-8 lg:gap-0">
        {isLoading ? (
          [...Array(7)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-3">
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))
        ) : (
          displayCategories.map((category: Category) => (
            <Link 
              key={category.slug} 
              href={`/shop?category=${category._id || category.slug}`}
              className="group flex flex-col items-center space-y-3 min-w-[80px]"
            >
              <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary group-hover:p-1 transition-all duration-300 shadow-md">
                 <Image 
                    src={category.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200"}
                    alt={category.name}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                 />
              </div>
              <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryQuickNav;
