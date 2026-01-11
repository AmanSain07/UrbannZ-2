"use client";

import { useState } from "react";
import { User, Store, Mail, Phone, MapPin, Save, Globe, Lock } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      alert("Settings saved!");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 mb-[100px]">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your store profile and preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">

        {/* Profile Section */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border/50 pb-4">
            <Store className="w-5 h-5 text-primary" /> Store Profile
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Store Name</label>
              <div className="relative">
                <Store className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  defaultValue="Clothify Store"
                  className="w-full bg-secondary/20 rounded-xl py-2.5 pl-10 pr-4 font-medium border border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  defaultValue="shop1@urbanz.com"
                  className="w-full bg-secondary/20 rounded-xl py-2.5 pl-10 pr-4 font-medium border border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  defaultValue="+91 98765 43210"
                  className="w-full bg-secondary/20 rounded-xl py-2.5 pl-10 pr-4 font-medium border border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  defaultValue="https://urbanz.com/store/clothify"
                  className="w-full bg-secondary/20 rounded-xl py-2.5 pl-10 pr-4 font-medium border border-transparent focus:border-primary focus:bg-background transition-all outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Store Description</label>
              <textarea
                rows={4}
                defaultValue="Premium streetwear for the modern urban explorer. We specialize in high-quality fabrics and unique designs."
                className="w-full bg-secondary/20 rounded-xl p-4 font-medium border border-transparent focus:border-primary focus:bg-background transition-all outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border/50 pb-4">
            <MapPin className="w-5 h-5 text-primary" /> Pickup Address
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Street Address</label>
              <input
                defaultValue="123, Fashion Street, Hauz Khas Village"
                className="w-full bg-secondary/20 rounded-xl py-2.5 px-4 font-medium border border-transparent focus:border-primary focus:bg-background transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">City</label>
              <input
                defaultValue="New Delhi"
                className="w-full bg-secondary/20 rounded-xl py-2.5 px-4 font-medium border border-transparent focus:border-primary focus:bg-background transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Pincode</label>
              <input
                defaultValue="110016"
                className="w-full bg-secondary/20 rounded-xl py-2.5 px-4 font-medium border border-transparent focus:border-primary focus:bg-background transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Security Section (Placeholder) */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 space-y-6 opacity-75">
          <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border/50 pb-4">
            <Lock className="w-5 h-5 text-primary" /> Security
          </h3>
          <p className="text-sm text-muted-foreground">To change your password or update banking details, please contact Admin support.</p>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>Saving...</>
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
