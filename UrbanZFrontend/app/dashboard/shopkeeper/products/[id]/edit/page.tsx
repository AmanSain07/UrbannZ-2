"use client";

import { useAuth } from "@/lib/auth-context";
import { useStore } from "@/lib/store-context";
import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, X, UploadCloud, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import {
  fetchProductById,
  updateProductAPI,
  uploadProductImage,
  deleteProductImageAPI,
} from "@/lib/api";

type UploadedImage = { id: number; src: string; order: number };

export default function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { user } = useAuth();
  const { categories, refreshProducts } = useStore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image_url: "",
    tags: "",
    gender: "",
    style: "",
    occasion: "",
    stock_quantity: "0",
    in_stock: true,
  });

  // Load existing product
  useEffect(() => {
    if (!params.id) return;
    fetchProductById(params.id)
      .then((data: any) => {
        setFormData({
          name: data.name || "",
          price: String(data.price || ""),
          description: data.description || "",
          category: String(data.category || ""),
          image_url: data.image_url || "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || ""),
          gender: data.gender || "",
          style: data.style || "",
          occasion: data.occasion || "",
          stock_quantity: String(data.stock_quantity ?? 0),
          in_stock: data.in_stock ?? true,
        });
        setImages(data.images || []);
      })
      .catch(() => setError("Failed to load product."))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const payload: any = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        gender: formData.gender,
        style: formData.style,
        occasion: formData.occasion,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        in_stock: formData.in_stock,
      };
      if (formData.image_url.trim()) payload.image_url = formData.image_url.trim();
      if (formData.category) {
        const matchedCat = categories.find(
          (c: any) => c.slug === formData.category || String(c.id) === formData.category
        );
        payload.category = matchedCat ? matchedCat.id : parseInt(formData.category) || undefined;
      }
      await updateProductAPI(params.id, payload);
      await refreshProducts();
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        router.push("/dashboard/shopkeeper/products");
      }, 1500);
    } catch (err: any) {
      setError(err?.message || "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const uploaded = await uploadProductImage(params.id, file);
      setImages((prev) => [...prev, uploaded]);
    } catch (err: any) {
      setError(err?.message || "Image upload failed.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await deleteProductImageAPI(params.id, imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err: any) {
      setError(err?.message || "Failed to delete image.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/shopkeeper/products" className="p-2 rounded-full hover:bg-secondary/10 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">Update your product details and images.</p>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl text-green-700 dark:text-green-400 font-medium">
          <CheckCircle size={18} /> Changes saved! Redirecting...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Details */}
        <div className="space-y-4 bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
          <h2 className="text-lg font-bold border-b border-border/50 pb-4">Basic Details</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Product Name *</label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select category...</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Category ID or slug"
                  className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none"
                />
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Tags (comma separated)</label>
              <input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="New, Hot, Vintage"
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Gender</label>
              <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none appearance-none cursor-pointer">
                <option value="">Any</option>
                <option>Men</option><option>Women</option><option>Unisex</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Style</label>
              <input value={formData.style} onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                placeholder="Street Style" className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Occasion</label>
              <input value={formData.occasion} onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                placeholder="Casual, Party" className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Stock Quantity</label>
              <input type="number" min="0" value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none font-mono" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold ml-1">Availability</label>
              <button type="button" onClick={() => setFormData({ ...formData, in_stock: !formData.in_stock })}
                className={`w-full p-3 rounded-xl border font-bold text-sm transition-all
                  ${formData.in_stock ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                {formData.in_stock ? "✓ In Stock" : "✗ Out of Stock"} — Click to toggle
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Description</label>
            <textarea required value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none resize-none" />
          </div>
        </div>

        {/* Images Section */}
        <div className="space-y-4 bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
          <h2 className="text-lg font-bold border-b border-border/50 pb-4">Product Images</h2>

          {/* Current images */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {images.map((img) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square bg-secondary/10">
                  <img src={img.src} alt="Product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload new file */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center gap-2 cursor-pointer hover:bg-secondary/5 transition-colors text-muted-foreground"
          >
            {isUploading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <UploadCloud size={20} />
                <span className="text-sm font-medium">Upload image file</span>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

          {/* OR paste URL */}
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Or add image by URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full p-3 rounded-xl bg-secondary/5 border border-border/50 focus:ring-2 focus:ring-primary/50 outline-none"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={() => router.back()}
            className="flex-1 py-4 rounded-xl font-bold hover:bg-secondary/20 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSaving}
            className="flex-[2] py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
            {isSaving ? <Loader2 className="animate-spin" /> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
