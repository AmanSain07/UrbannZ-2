"use client";

import { useState, useEffect } from "react";
import { User, Store, Mail, Phone, MapPin, Save, Globe, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+91 98765 43210",
    website: "https://urbanz.com/store/",
    description: "Premium streetwear for the modern urban explorer.",
    street: "123, Fashion Street",
    city: "New Delhi",
    pincode: "110016"
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        website: `https://urbanz.com/store/${user.name.toLowerCase().replace(/\s+/g, '')}`
      }));
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    // Mock API call to save settings
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      // In a real app, we would update the backend User model here
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-[100px] md:pb-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your store profile and preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">

        {/* Profile Section */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border/50 pb-4">
            <Store className="w-5 h-5 text-primary" /> Store Profile
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Store Name</label>
              <div className="relative">
                <Store className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-secondary/10 rounded-xl py-2.5 pl-10 pr-4 font-medium border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-secondary/10 rounded-xl py-2.5 pl-10 pr-4 font-medium border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-secondary/10 rounded-xl py-2.5 pl-10 pr-4 font-medium border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  value={formData.website}
                  onChange={e => setFormData({...formData, website: e.target.value})}
                  className="w-full bg-secondary/10 rounded-xl py-2.5 pl-10 pr-4 font-medium border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Store Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-secondary/10 rounded-xl p-4 font-medium border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border/50 pb-4">
            <MapPin className="w-5 h-5 text-primary" /> Pickup Address
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Street Address</label>
              <input
                value={formData.street}
                onChange={e => setFormData({...formData, street: e.target.value})}
                className="w-full bg-secondary/10 rounded-xl py-2.5 px-4 font-medium border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">City</label>
              <input
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                className="w-full bg-secondary/10 rounded-xl py-2.5 px-4 font-medium border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Pincode</label>
              <input
                value={formData.pincode}
                onChange={e => setFormData({...formData, pincode: e.target.value})}
                className="w-full bg-secondary/10 rounded-xl py-2.5 px-4 font-medium border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Security Section (Placeholder) */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 space-y-6 opacity-75 shadow-sm">
          <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border/50 pb-4">
            <Lock className="w-5 h-5 text-primary" /> Security
          </h3>
          <p className="text-sm text-muted-foreground">To change your password or update banking details, please contact Admin support.</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
          {saved && <span className="text-green-600 font-bold text-sm animate-in fade-in">Settings saved successfully!</span>}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
          >
            {loading ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              <>
                <Save size={20} /> Save Changes
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
