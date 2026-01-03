"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon,
  Layers,
  Tag,
  X,
  Video
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  _id: string;
  name: string;
}

interface Variant {
  color: string;
  size: string;
  stock: number;
  price: number;
  images: string[];
  sku?: string;
  _id?: string;
}

const NewProductPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    subCategory: "",
    images: [] as string[],
    videoUrl: "",
    modelUrl: "",
    tags: "",
    material: "",
    isExclusive: false,
    minimumTier: "Bronze"
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories`);
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const fetchSubCategories = async (parentId: string) => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories/${parentId}/sub`);
      setSubCategories(data);
    } catch (error) {
      console.error("Failed to fetch subcategories", error);
    }
  };

  const [variants, setVariants] = useState<Variant[]>([
    { color: "", size: "", stock: 0, price: 0, images: [] }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "category") {
       setFormData(prev => ({ ...prev, subCategory: "" }));
       if (value) fetchSubCategories(value);
       else setSubCategories([]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isVariant = false, variantIndex = -1, isVideo = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const data = new FormData();
    Array.from(files).forEach((file) => {
      data.append("images", file);
    });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/upload`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      const uploadedUrls = response.data.images;

      if (isVideo) {
         setFormData(prev => ({ ...prev, videoUrl: uploadedUrls[0] }));
      } else if (isVariant && variantIndex !== -1) {
         const newVariants = [...variants];
         newVariants[variantIndex].images = [...newVariants[variantIndex].images, ...uploadedUrls];
         setVariants(newVariants);
      } else {
         setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload assets");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number, isVariant = false, variantIndex = -1) => {
    if (isVariant && variantIndex !== -1) {
       const newVariants = [...variants];
       newVariants[variantIndex].images = newVariants[variantIndex].images.filter((_, i) => i !== index);
       setVariants(newVariants);
    } else {
       setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    }
  };

  const removeVideo = () => {
     setFormData(prev => ({ ...prev, videoUrl: "" }));
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
    const newVariants = [...variants];
    // @ts-ignore
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants(prev => [...prev, { color: "", size: "", stock: 0, price: Number(formData.price) || 0, images: [] }]);
  };

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.images.length === 0) {
        alert("Please add at least one main product image");
        setLoading(false);
        return;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        brand: formData.brand,
        category: formData.category,
        subCategory: formData.subCategory,
        images: formData.images,
        videoUrl: formData.videoUrl,
        modelUrl: formData.modelUrl,
        tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
        material: formData.material,
        isExclusive: formData.isExclusive,
        minimumTier: formData.minimumTier,
        countInStock: variants.reduce((acc, v) => acc + Number(v.stock), 0),
        variants: variants.map(v => ({
           color: v.color,
           size: v.size,
           stock: Number(v.stock),
           price: Number(v.price) || Number(formData.price),
           images: v.images
        }))
      };

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in as admin");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products`,
        payload,
        config
      );

      router.push("/admin/products");
    } catch (error: any) {
      console.error("Failed to create product:", error);
      alert(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-6">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
           <h1 className="text-3xl font-black tracking-tight">Add New Product</h1>
           <p className="text-muted-foreground text-sm font-medium">Create a new product with variants and images</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Left Column: Info & Variants */}
           <div className="lg:col-span-2 space-y-8">
              {/* Basic Info */}
              <div className="bg-background p-8 rounded-[32px] border border-border shadow-sm space-y-6">
                 <h2 className="text-lg font-black italic flex items-center gap-2">
                    <Tag size={18} /> Basic Information
                 </h2>
                 
                 <div className="space-y-4">
                    <div>
                       <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Product Name</label>
                       <input 
                         name="title" 
                         value={formData.title} 
                         onChange={handleInputChange}
                         className="w-full h-12 px-4 bg-muted border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                         placeholder="e.g. Premium Silk Jacket"
                         required
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Brand</label>
                          <input 
                            name="brand" 
                            value={formData.brand} 
                            onChange={handleInputChange}
                            className="w-full h-12 px-4 bg-muted border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            placeholder="e.g. Gucci"
                            required
                          />
                       </div>
                       <div>
                          <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Category</label>
                          <select 
                            name="category" 
                            value={formData.category} 
                            onChange={handleInputChange}
                            className="w-full h-12 px-4 bg-muted border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
                            required
                          >
                             <option value="">Select Category</option>
                             {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                             ))}
                          </select>
                       </div>
                    </div>

                    <div>
                       <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Sub Category</label>
                       <select 
                         name="subCategory" 
                         value={formData.subCategory} 
                         onChange={handleInputChange}
                         className="w-full h-12 px-4 bg-muted border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
                         disabled={!formData.category}
                       >
                          <option value="">Select Sub Category</option>
                          {subCategories.map(sub => (
                             <option key={sub._id} value={sub._id}>{sub.name}</option>
                          ))}
                       </select>
                    </div>

                    <div>
                       <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Description</label>
                       <textarea 
                         name="description" 
                         value={formData.description} 
                         onChange={handleInputChange}
                         className="w-full h-32 p-4 bg-muted border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                         placeholder="Product details..."
                         required
                       />
                    </div>

                    <div>
                       <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Base Price ($)</label>
                       <input 
                         type="number"
                         name="price" 
                         value={formData.price} 
                         onChange={handleInputChange}
                         className="w-full h-12 px-4 bg-muted border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                         placeholder="0.00"
                         required
                         min="0"
                         step="0.01"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Material</label>
                          <input 
                            name="material" 
                            value={formData.material} 
                            onChange={handleInputChange}
                            className="w-full h-12 px-4 bg-muted border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            placeholder="e.g. 100% Organic Silk"
                          />
                       </div>
                       <div>
                          <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Tags (comma separated)</label>
                          <input 
                            name="tags" 
                            value={formData.tags} 
                            onChange={handleInputChange}
                            className="w-full h-12 px-4 bg-muted border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            placeholder="e.g. spring, silk, sustainable"
                          />
                       </div>
                    </div>

                    <div className="bg-muted/50 p-6 rounded-2xl border border-border space-y-4">
                       <h3 className="text-xs font-black uppercase tracking-widest">Exclusivity & Tier Access</h3>
                       <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">Limit to Members Only</span>
                          <button 
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, isExclusive: !p.isExclusive }))}
                            className={cn(
                               "w-12 h-6 rounded-full transition-all relative",
                               formData.isExclusive ? "bg-primary" : "bg-muted border border-border"
                            )}
                          >
                             <div className={cn(
                                "absolute top-1 w-4 h-4 rounded-full transition-all",
                                formData.isExclusive ? "right-1 bg-white" : "left-1 bg-muted-foreground"
                             )} />
                          </button>
                       </div>
                       
                       {formData.isExclusive && (
                          <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                             <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Minimum Access Tier</label>
                             <div className="flex gap-2">
                                {["Bronze", "Gold", "Black"].map(tier => (
                                   <button
                                     key={tier}
                                     type="button"
                                     onClick={() => setFormData(p => ({ ...p, minimumTier: tier as "Bronze" | "Gold" | "Black" }))}
                                     className={cn(
                                        "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        formData.minimumTier === tier 
                                          ? "bg-foreground text-background" 
                                          : "bg-background border border-border hover:bg-muted"
                                     )}
                                   >
                                      {tier}
                                   </button>
                                ))}
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>

              {/* Variants Section */}
              <div className="bg-background p-8 rounded-[32px] border border-border shadow-sm space-y-6">
                 <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black italic flex items-center gap-2">
                       <Layers size={18} /> Variants
                    </h2>
                    <button 
                      type="button"
                      onClick={addVariant}
                      className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:underline group"
                    >
                       <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Add Variant
                    </button>
                 </div>

                 <div className="space-y-6">
                    {variants.map((variant, idx) => (
                       <div key={idx} className="bg-muted border border-border p-6 rounded-2xl space-y-4 relative group">
                          <button 
                             type="button"
                             onClick={() => removeVariant(idx)}
                             className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          >
                             <Trash2 size={14} />
                          </button>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="flex-1">
                                 <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Color</label>
                                 <input 
                                   value={variant.color}
                                   onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                                   className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                   placeholder="Red"
                                 />
                              </div>
                              <div className="flex-1">
                                 <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Size</label>
                                 <input 
                                   value={variant.size}
                                   onChange={(e) => handleVariantChange(idx, "size", e.target.value)}
                                   className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                   placeholder="XL"
                                 />
                              </div>
                              <div className="flex-1">
                                 <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Stock</label>
                                 <input 
                                   type="number"
                                   value={variant.stock}
                                   onChange={(e) => handleVariantChange(idx, "stock", e.target.value)}
                                   className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                   placeholder="0"
                                 />
                              </div>
                              <div className="flex-1">
                                 <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Price</label>
                                 <input 
                                   type="number"
                                   value={variant.price || formData.price}
                                   onChange={(e) => handleVariantChange(idx, "price", parseFloat(e.target.value))}
                                   className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                   placeholder="Same"
                                 />
                              </div>
                          </div>
                          
                           {/* Variant Images */}
                           <div>
                              <div className="flex items-center justify-between mb-2">
                                 <label className="text-[10px] font-bold uppercase text-muted-foreground">Variant Images</label>
                                 <label className="cursor-pointer text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1">
                                    <Plus size={10} /> Add Image
                                    <input 
                                       type="file" 
                                       multiple 
                                       className="hidden" 
                                       onChange={(e) => handleFileUpload(e, true, idx)} 
                                       accept="image/*"
                                    />
                                 </label>
                              </div>
                              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                 {variant.images && variant.images.map((img, i) => (
                                    <div key={i} className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-border group/img">
                                       <img src={img} alt="" className="w-full h-full object-cover" />
                                       <button 
                                          type="button"
                                          onClick={() => removeImage(i, true, idx)}
                                          className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 opacity-0 group-hover/img:opacity-100 transition-all"
                                       >
                                          <X size={10} />
                                       </button>
                                    </div>
                                 ))}
                                 {variant.images?.length === 0 && <span className="text-xs text-muted-foreground font-medium italic">No images</span>}
                              </div>
                           </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Right Column: Main Media */}
           <div className="space-y-8">
              {/* Video Section */}
              <div className="bg-background p-8 rounded-[32px] border border-border shadow-sm space-y-6">
                 <h2 className="text-lg font-black italic flex items-center gap-2">
                    <Video size={18} /> Cinematic Asset
                 </h2>
                 
                 {!formData.videoUrl ? (
                    <label className="h-40 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted transition-all group">
                       <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, false, -1, true)}
                          accept="video/*"
                        />
                       <div className="w-12 h-12 rounded-full bg-muted group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors mb-3">
                          {uploading ? <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" /> : <Upload size={20} />}
                       </div>
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Upload Runway Video</span>
                    </label>
                 ) : (
                    <div className="relative h-40 rounded-2xl overflow-hidden border border-border group">
                       <video 
                          src={formData.videoUrl} 
                          className="w-full h-full object-cover"
                          muted
                          loop
                          autoPlay
                       />
                       <button 
                          type="button"
                          onClick={removeVideo}
                          className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                       >
                          <Trash2 size={14} />
                       </button>
                    </div>
                 )}
                 <p className="text-[9px] text-muted-foreground text-center font-bold uppercase tracking-widest opacity-60">
                    Recommended: 9:16 or 4:5 Aspect Ratio. MP4.
                 </p>
              </div>

              {/* 3D Model AR Section */}
              <div className="bg-background p-8 rounded-[32px] border border-border shadow-sm space-y-6">
                 <h2 className="text-lg font-black italic flex items-center gap-2">
                    <Layers size={18} /> AR Asset (3D)
                 </h2>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Model URL (.glb, .gltf)</label>
                    <input 
                      name="modelUrl" 
                      value={formData.modelUrl} 
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 bg-muted border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      placeholder="https://example.com/model.glb"
                    />
                 </div>
                 <p className="text-[9px] text-muted-foreground text-center font-bold uppercase tracking-widest opacity-60">
                    Used for the 3D augmented reality viewer.
                 </p>
              </div>

              <div className="bg-background p-8 rounded-[32px] border border-border shadow-sm space-y-6">
                 <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black italic flex items-center gap-2">
                       <ImageIcon size={18} /> Main Media
                    </h2>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    {/* Placeholder for Upload */}
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted transition-all group">
                       <input 
                          type="file" 
                          multiple 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e)}
                          accept="image/*"
                        />
                       <div className="w-12 h-12 rounded-full bg-muted group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors mb-3">
                          {uploading ? <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" /> : <Upload size={20} />}
                       </div>
                       <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Upload</span>
                    </label>

                    {formData.images.map((url, idx) => (
                       <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-border group">
                          <img src={url} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                             type="button"
                             onClick={() => removeImage(idx)}
                             className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                          >
                             <Trash2 size={14} />
                          </button>
                       </div>
                    ))}
                 </div>
                 <p className="text-[10px] text-muted-foreground text-center font-medium">
                    Supported: JPG, PNG, WEBP. Max 10MB per file.
                 </p>
              </div>

              <button 
                type="submit"
                disabled={loading || uploading}
                className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100"
              >
                 {loading ? "Publishing..." : (
                    <>
                       <Save size={20} /> Publish Product
                    </>
                 )}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
};

export default NewProductPage;
