"use client";

import { useAuth } from "@/lib/auth-context";
import { useStore } from "@/lib/store-context";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, UploadCloud, GripVertical, Star } from "lucide-react";
import Link from "next/link";
import { createProduct, uploadProductImage } from "@/lib/api";

export default function AddProductPage() {
  const { categories, refreshProducts } = useStore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Images
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [imageType, setImageType] = useState<"upload" | "url">("upload");
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discount_percent: "0",
    stock_quantity: "1",
    category: "",
    brand: "",
    sizes: "",
    colors: "",
    tags: "",
    description: "",
    image_url: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreviews((prev) => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    
    // Reorder
    const newFiles = [...selectedFiles];
    const newPreviews = [...filePreviews];
    
    const [draggedFile] = newFiles.splice(draggedIdx, 1);
    const [draggedPreview] = newPreviews.splice(draggedIdx, 1);
    
    newFiles.splice(idx, 0, draggedFile);
    newPreviews.splice(idx, 0, draggedPreview);
    
    setSelectedFiles(newFiles);
    setFilePreviews(newPreviews);
    setDraggedIdx(idx);
  };

  const handleDragEnd = () => setDraggedIdx(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const payload: any = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        discount_percent: parseInt(formData.discount_percent) || 0,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        in_stock: parseInt(formData.stock_quantity) > 0,
        brand: formData.brand.trim(),
        sizes: formData.sizes ? formData.sizes.split(",").map(t => t.trim()).filter(Boolean) : [],
        colors: formData.colors ? formData.colors.split(",").map(t => t.trim()).filter(Boolean) : [],
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        description: formData.description.trim(),
      };
      
      if (formData.category) {
        const matchedCat = categories.find((c: any) => c.slug === formData.category || String(c.id) === formData.category);
        payload.category = matchedCat ? matchedCat.id : formData.category;
      }
      
      if (imageType === "url" && formData.image_url.trim()) {
        payload.image_url = formData.image_url.trim();
      } else if (imageType === "upload" && filePreviews.length > 0) {
        // Fallback for main image URL if they upload a file (the backend currently sets image_url, but we will rely on images relationship)
      }

      // 1. Create product
      const res = await createProduct(payload);
      const newProduct = res.product || res;

      // 2. Upload images in order
      if (imageType === "upload" && selectedFiles.length > 0 && newProduct?.id) {
        for (const file of selectedFiles) {
          await uploadProductImage(newProduct.id, file);
        }
      }

      await refreshProducts();
      router.push("/dashboard/shopkeeper/products");
    } catch (err: any) {
      setError(err?.message || "Failed to create product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/shopkeeper/products" className="p-2 rounded-full hover:bg-secondary/10 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">List a new item for your store.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <div className="space-y-4 bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
          <h2 className="text-lg font-bold border-b border-border/50 pb-4">Basic Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Product Name *</label>
              <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Category *</label>
              <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none appearance-none cursor-pointer">
                <option value="">Select category...</option>
                {categories.map((cat: any) => <option key={cat.id} value={cat.slug || cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Brand</label>
              <input value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} placeholder="e.g. Nike, UrbanZ"
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Tags (Comma Separated)</label>
              <input value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="Vintage, Hot"
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Description *</label>
            <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4}
              className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none resize-none" />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-4 bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
          <h2 className="text-lg font-bold border-b border-border/50 pb-4">Pricing & Inventory</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Price (₹) *</label>
              <input required type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 font-mono focus:ring-2 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Discount (%)</label>
              <input type="number" min="0" max="100" value={formData.discount_percent} onChange={e => setFormData({ ...formData, discount_percent: e.target.value })}
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 font-mono focus:ring-2 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Stock Quantity *</label>
              <input required type="number" min="0" value={formData.stock_quantity} onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })}
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 font-mono focus:ring-2 outline-none" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Sizes (Comma Separated)</label>
              <input value={formData.sizes} onChange={e => setFormData({ ...formData, sizes: e.target.value })} placeholder="S, M, L, XL"
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Colors (Comma Separated)</label>
              <input value={formData.colors} onChange={e => setFormData({ ...formData, colors: e.target.value })} placeholder="Red, Black, White"
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 outline-none" />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="space-y-4 bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
          <div className="flex border-b border-border/50 pb-2 mb-2 gap-4">
            <button type="button" onClick={() => setImageType("upload")} className={`pb-2 font-bold text-sm border-b-2 ${imageType === "upload" ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}>
              Upload Images
            </button>
            <button type="button" onClick={() => setImageType("url")} className={`pb-2 font-bold text-sm border-b-2 ${imageType === "url" ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}>
              Image URL
            </button>
          </div>

          {imageType === "upload" ? (
            <div className="space-y-4">
              <div onClick={() => fileInputRef.current?.click()} className="w-full h-32 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/5 transition-colors text-muted-foreground">
                <UploadCloud size={28} />
                <span className="text-sm font-medium">Click to upload multiple images</span>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
              
              {filePreviews.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-2 uppercase">Drag & Drop to Reorder</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filePreviews.map((preview, idx) => (
                      <div 
                        key={idx} 
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDragEnd={handleDragEnd}
                        className={`relative h-32 w-full rounded-2xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${draggedIdx === idx ? "opacity-50 border-primary" : "border-border/50"}`}
                      >
                        <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover pointer-events-none" />
                        
                        {/* Cover Image Badge */}
                        {idx === 0 && (
                          <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-black uppercase px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                            <Star size={10} className="fill-white" /> Cover
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <GripVertical className="text-white" />
                          <button 
                            type="button"
                            onClick={() => {
                              const newF = [...selectedFiles]; const newP = [...filePreviews];
                              newF.splice(idx, 1); newP.splice(idx, 1);
                              setSelectedFiles(newF); setFilePreviews(newP);
                            }}
                            className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform"
                          >✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <input type="url" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://example.com/image.jpg"
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none" />
              {formData.image_url && (
                <div className="relative h-48 w-full max-w-sm rounded-xl overflow-hidden bg-secondary/10 border border-border/50">
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => router.back()} className="flex-1 py-4 rounded-xl font-bold hover:bg-secondary/20 transition-colors">Cancel</button>
          <button type="submit" disabled={isLoading} className="flex-[2] py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" /> : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

