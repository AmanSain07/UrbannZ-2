"use client";

import { useState, useEffect } from "react";
import { fetchVendorStore, updateVendorStore } from "@/lib/api";
import { Loader2, Store, Save, Camera, CheckCircle } from "lucide-react";
import { FALLBACK_IMAGE } from "@/lib/utils";

export default function StoreManagementPage() {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    store_name: "",
    description: "",
    address: "",
    phone: "",
  });
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

  useEffect(() => {
    const loadStore = async () => {
      try {
        const data = await fetchVendorStore();
        if (data) {
          setStore(data);
          setFormData({
            store_name: data.store_name || "",
            description: data.description || "",
            address: data.address || "",
            phone: data.phone || "",
          });
          setLogoPreview(data.logo || "");
          setBannerPreview(data.banner || "");
        }
      } catch (e) {
        console.error("Failed to load store:", e);
      } finally {
        setLoading(false);
      }
    };
    loadStore();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "banner") => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (type === "logo") {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => data.append(key, val));
      if (logoFile) data.append("logo", logoFile);
      if (bannerFile) data.append("banner", bannerFile);
      
      await updateVendorStore(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save store details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-8 max-w-4xl pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Store Management</h1>
          <p className="text-muted-foreground">Customize how your store appears to customers.</p>
        </div>
        {store?.id && (
          <a href={`/store/${store.id}`} target="_blank" rel="noreferrer" className="bg-secondary/20 hover:bg-secondary/30 text-foreground px-4 py-2 rounded-xl font-bold transition-colors">
            View My Store
          </a>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Banner Upload */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-xl font-bold border-b border-border/50 pb-4">Store Appearance</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Store Banner (1200x300 recommended)</label>
            <div className="relative h-48 rounded-2xl overflow-hidden bg-secondary/10 border border-border/50 group cursor-pointer">
              {bannerPreview ? (
                <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                  <Camera size={32} className="mb-2 opacity-50" />
                  <span className="font-medium">Upload Banner Image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white font-bold bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">Change Banner</span>
              </div>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "banner")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="flex items-center gap-6 pt-4">
            <div className="relative size-24 rounded-full overflow-hidden bg-secondary/10 border border-border/50 group cursor-pointer flex-shrink-0">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Store size={32} className="opacity-50" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "logo")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            <div>
              <h4 className="font-bold">Store Logo</h4>
              <p className="text-sm text-muted-foreground">Recommended size: 256x256px. PNG or JPG.</p>
            </div>
          </div>
        </div>

        {/* Store Details */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-xl font-bold border-b border-border/50 pb-4">Store Information</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Store Name</label>
              <input
                required
                value={formData.store_name}
                onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                className="w-full bg-secondary/10 rounded-xl py-3 px-4 font-semibold border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="My Awesome Store"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Business Phone</label>
              <input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-secondary/10 rounded-xl py-3 px-4 font-semibold border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Store Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-secondary/10 rounded-xl py-3 px-4 font-medium border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              placeholder="Tell customers about your brand, what you sell, and your values..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Operating Address / City</label>
            <input
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-secondary/10 rounded-xl py-3 px-4 font-medium border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="e.g. Bandra West, Mumbai"
            />
          </div>

          <div className="flex items-center justify-end pt-4">
            {saved && <span className="text-green-600 font-bold flex items-center gap-1.5 mr-4 animate-in fade-in"><CheckCircle size={18} /> Saved successfully!</span>}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-8 py-3 rounded-full font-bold shadow-lg disabled:opacity-70 transition-all active:scale-95"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {saving ? "Saving..." : "Save Store Details"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
