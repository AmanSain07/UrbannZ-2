"use client";

import { useStore } from "@/lib/store-context";
import { useAuth } from "@/lib/auth-context";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Image as ImageIcon, UploadCloud, X } from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
  const { addProduct } = useStore();
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "clothing",
    description: "",
    image: "",
    tags: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData({ ...formData, image: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addProduct({
        ...formData,
        price: Number(formData.price),
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        sellerId: user?.id || "shop1",
        image: formData.image || "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80"
      });
      router.push("/dashboard/shopkeeper/products");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/shopkeeper/products" className="p-2 rounded-full hover:bg-secondary/10 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">List a new item in your store.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4 bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
          <h2 className="text-lg font-bold border-b border-border/50 pb-4">Basic Details</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Product Name</label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Cyberpunk Bomber Jacket"
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Price (₹)</label>
              <input
                required
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="clothing">Clothing</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
                <option value="tech">Tech</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Tags (comma separated)</label>
              <input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Vintage, Sale, Hot"
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your product..."
              rows={4}
              className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="space-y-4 bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
          <h2 className="text-lg font-bold border-b border-border/50 pb-4">Product Photo</h2>

          {!formData.image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/5 transition-colors"
            >
              <UploadCloud className="w-8 h-8 text-muted-foreground" />
              <div className="text-sm font-bold">Click to upload photo</div>
              <div className="text-xs text-muted-foreground">JPG, PNG or WEBP (Max 5MB)</div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            </div>
          ) : (
            <div className="relative h-64 w-full rounded-xl overflow-hidden bg-secondary/10 border border-border/50 group">
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-4 rounded-xl font-bold hover:bg-secondary/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
