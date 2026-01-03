"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Plus, Search, Trash2, MoreVertical, Package } from "lucide-react";
import Image from "next/image";

interface AdminProduct {
  _id: string;
  title: string;
  brand: string;
  price: number;
  countInStock: number;
  slug: string;
  category?: {
    name: string;
  };
  images?: string[];
  variants?: any[];
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products?limit=100`
      );
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
        const token = localStorage.getItem("token");
        await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(prev => prev.filter(p => p._id !== id));
    } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Failed to delete product. Ensure you are an admin.");
    }
  };

  const filteredProducts = products.filter(product => 
     product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Products Inventory</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Manage your {products.length} products</p>
        </div>
        <Link 
            href="/admin/products/new" 
            className="h-12 px-6 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
        >
            <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="bg-background rounded-[32px] border border-border shadow-sm overflow-hidden">
         {/* Search Bar */}
         <div className="p-6 border-b border-border">
            <div className="relative max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
               <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-muted border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
               />
            </div>
         </div>

         {/* Products Table */}
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-muted/50">
                  <tr>
                     <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product</th>
                     <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</th>
                     <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price</th>
                     <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stock</th>
                     <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {loading ? (
                     <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Loading products...</td>
                     </tr>
                  ) : filteredProducts.length === 0 ? (
                     <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No products found.</td>
                     </tr>
                  ) : (
                     filteredProducts.map((product) => (
                        <tr key={product._id} className="group hover:bg-muted transition-colors">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-lg bg-muted relative overflow-hidden flex-shrink-0 border border-border">
                                    {product.images?.[0] ? (
                                       <Image src={product.images[0]} alt={product.title} fill className="object-cover" sizes="48px" />
                                    ) : (
                                       <div className="w-full h-full flex items-center justify-center text-muted-foreground/30"><Package size={16} /></div>
                                    )}
                                 </div>
                                 <div className="truncate max-w-[200px]">
                                    <p className="font-bold text-sm text-foreground line-clamp-1">{product.title}</p>
                                    <p className="text-xs text-muted-foreground font-medium">{product.brand}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-sm font-medium">
                              <span className="px-3 py-1 bg-muted rounded-full text-xs font-bold">
                                 {product.category?.name || "Uncategorized"}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-sm font-black text-foreground">
                              ${product.price}
                           </td>
                           <td className="px-6 py-4 text-sm">
                              <div className="flex flex-col gap-1">
                                 <span className={`font-bold ${product.countInStock === 0 ? 'text-red-500' : 'text-green-600'}`}>
                                    {product.countInStock} Units
                                 </span>
                                 <span className="text-[10px] text-muted-foreground font-medium">
                                    {product.variants?.length || 0} Variants
                                 </span>
                              </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <button 
                                    onClick={() => handleDelete(product._id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                                 <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                    <MoreVertical size={16} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;
