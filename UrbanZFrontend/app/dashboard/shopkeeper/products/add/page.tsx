"use client";

import { useAuth } from "@/lib/auth-context";
import { useStore } from "@/lib/store-context";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { createProduct, uploadProductImage } from "@/lib/api";

export default function AddProductPage() {
  const { user } = useAuth();
  const { categories, refreshProducts } = useStore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [imageType, setImageType] = useState<"url" | "upload">("upload");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image_url: "",
    tags: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const payload: any = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      };
      if (formData.category) {
        const matchedCat = categories.find(
          (c: any) => c.slug === formData.category || String(c.id) === formData.category
        );
        payload.category = matchedCat ? matchedCat.id : formData.category;
      }
      if (imageType === "url" && formData.image_url.trim()) {
        payload.image_url = formData.image_url.trim();
      }

      // 1. Create product
      const res = await createProduct(payload);
      const newProduct = res.product || res;

      // 2. If upload type and selected file, upload it
      if (imageType === "upload" && selectedFile && newProduct?.id) {
        await uploadProductImage(newProduct.id, selectedFile);
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
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/shopkeeper/products" className="p-2 rounded-full hover:bg-secondary/10 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">List a new item — admin will review before it goes live.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4 bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
          <h2 className="text-lg font-bold border-b border-border/50 pb-4">Basic Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Product Name *</label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Cyberpunk Bomber Jacket"
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Price (₹) *</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
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
              {categories.length > 0 ? (
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select category...</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.slug || cat.id}>{cat.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. clothing"
                  className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                />
              )}
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
            <label className="text-sm font-bold ml-1">Description *</label>
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
          <div className="flex border-b border-border/50 pb-2 mb-2 gap-4">
            <button
              type="button"
              onClick={() => setImageType("upload")}
              className={`pb-2 font-bold text-sm border-b-2 transition-all ${imageType === "upload" ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}
            >
              Upload Image File
            </button>
            <button
              type="button"
              onClick={() => setImageType("url")}
              className={`pb-2 font-bold text-sm border-b-2 transition-all ${imageType === "url" ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}
            >
              Paste Image URL
            </button>
          </div>

          {imageType === "upload" ? (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/5 transition-colors text-muted-foreground"
              >
                <UploadCloud size={28} />
                <span className="text-sm font-medium">Select image file to upload</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {filePreview && (
                <div className="relative h-48 w-full rounded-xl overflow-hidden bg-secondary/10 border border-border/50">
                  <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold ml-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                />
                <p className="text-xs text-muted-foreground ml-1">Paste a public image URL for your product photo.</p>
              </div>
              {formData.image_url && (
                <div className="relative h-48 w-full rounded-xl overflow-hidden bg-secondary/10 border border-border/50">
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => router.back()}
            className="flex-1 py-4 rounded-xl font-bold hover:bg-secondary/20 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isLoading}
            className="flex-[2] py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" /> : "Submit for Review"}
          </button>
        </div>
      </form>
    </div>
  );
}

