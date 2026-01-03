"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedProducts = () => {
  const { data, isLoading, isError } = useProducts({ pageSize: 4 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {data?.products?.map((product: any) => (
        <ProductCard key={product._id} product={product} />
      ))}
      
      {(!data || data.products.length === 0) && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
             No products found.
          </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
