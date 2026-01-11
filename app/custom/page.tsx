"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useStore } from "@/lib/store-context"; // Changed from creating own request
import { Upload, Star, Loader2, PenTool, Printer } from "lucide-react"; // Added Icons
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomPage() {
  const { user } = useAuth();
  const { addCustomDesign } = useStore(); // Use store
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    notes: "",
    designUrl: "https://example.com/mock-design.png", // Mocked for now
    type: "embroidery" as "embroidery" | "pod" // Default
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to submit a design.");
      router.push("/login?redirect=/custom");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      addCustomDesign({
        userId: user.id,
        designUrl: formData.designUrl,
        notes: formData.notes,
        type: formData.type
      });

      alert("Design submitted! Check your dashboard for updates.");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to submit design.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container px-4 md:px-6 py-20 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-bold mb-4">
            🎨 Your Vibe, Your Rules
          </div>
          <h1 className="text-5xl font-black mb-6">Design Your Own</h1>
          <p className="text-xl text-muted-foreground">
            Upload your art, we'll get it printed/embroidered by top local shops.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl">

          {/* Customization Type Selection */}
          <div className="mb-8">
            <label className="block font-bold mb-4 text-lg">1. Choose Your Style</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "embroidery" })}
                className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${formData.type === "embroidery" ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50"}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.type === "embroidery" ? "bg-primary text-white" : "bg-secondary text-muted-foreground"}`}>
                  <PenTool size={24} />
                </div>
                <div className="text-center">
                  <h3 className="font-bold">Embroidery</h3>
                  <p className="text-xs text-muted-foreground">Premium thread work</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "pod" })}
                className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${formData.type === "pod" ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50"}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.type === "pod" ? "bg-primary text-white" : "bg-secondary text-muted-foreground"}`}>
                  <Printer size={24} />
                </div>
                <div className="text-center">
                  <h3 className="font-bold">Print on Demand</h3>
                  <p className="text-xs text-muted-foreground">High quality prints</p>
                </div>
              </button>
            </div>
          </div>

          {/* Upload Area */}
          <div className="mb-8">
            <label className="block font-bold mb-4 text-lg">2. Upload Design</label>
            <div className="border-2 border-dashed border-border rounded-2xl h-64 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer group">
              <Upload className="w-12 h-12 text-muted-foreground group-hover:text-primary mb-4 transition-colors" />
              <p className="font-bold text-muted-foreground">Click to upload or drag & drop</p>
              <p className="text-xs text-muted-foreground mt-2">(PNG, JPG, AI - Max 10MB)</p>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label className="block font-bold mb-4 text-lg">3. Notes for Shopkeeper</label>
            <textarea
              className="w-full p-4 rounded-xl bg-background border border-input h-32 focus:ring-2 focus:ring-primary outline-none resize-none"
              placeholder="Details about placement, size, thread colors, etc..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 rounded-full bg-primary text-white font-bold text-xl hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit for Approval'}
          </button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By submitting, you agree that you own the rights to this design.
          </p>
        </form>
      </div>
    </div>
  );
}
