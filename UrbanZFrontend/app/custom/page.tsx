"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useStore } from "@/lib/store-context"; // Changed from creating own request
import { Upload, Star, Loader2, PenTool, Printer } from "lucide-react"; // Added Icons
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomPage() {
  const { user } = useAuth();
  const { addCustomDesign } = useStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    notes: "",
    designUrl: "https://example.com/mock-design.png",
    type: "print" as "print" | "embroidery",
    tshirtType: "oversized",
    color: "black",
    size: "L",
    placement: "front",
    quantity: 1
  });

  const pricePerPiece = formData.type === "print" ? 499 : 799;
  const total = pricePerPiece * formData.quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to submit a design.");
      router.push("/login?redirect=/custom");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      addCustomDesign({
        userId: user.id,
        designUrl: formData.designUrl,
        notes: `Type: ${formData.tshirtType}, Color: ${formData.color}, Size: ${formData.size}, Placement: ${formData.placement}, Qty: ${formData.quantity}. ${formData.notes}`,
        type: formData.type === "embroidery" ? "embroidery" : "pod"
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to submit design.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="container px-4 md:px-6 py-20 min-h-screen flex items-center justify-center">
        <div className="text-center bg-card p-12 rounded-3xl shadow-xl border border-border">
          <h2 className="text-3xl font-black mb-4 text-primary">Order submitted! We'll confirm within 24 hours ✅</h2>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

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
          
          <div className="mb-8">
            <label className="block font-bold mb-4 text-lg">1. Choose Customization</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "print" })}
                className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${formData.type === "print" ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50"}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.type === "print" ? "bg-primary text-white" : "bg-secondary text-muted-foreground"}`}>
                  <Printer size={24} />
                </div>
                <div className="text-center">
                  <h3 className="font-bold">Print</h3>
                  <p className="text-xs text-muted-foreground">₹499 per piece</p>
                </div>
              </button>

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
                  <p className="text-xs text-muted-foreground">₹799 per piece</p>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div>
              <label className="block font-bold mb-2 text-sm">T-shirt Type</label>
              <select 
                value={formData.tshirtType} 
                onChange={(e) => setFormData({ ...formData, tshirtType: e.target.value })}
                className="w-full p-3 rounded-xl border border-input bg-background"
              >
                <option value="oversized">Oversized</option>
                <option value="regular">Regular Fit</option>
                <option value="hoodie">Hoodie</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-2 text-sm">Color</label>
              <select 
                value={formData.color} 
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full p-3 rounded-xl border border-input bg-background"
              >
                <option value="black">Black</option>
                <option value="white">White</option>
                <option value="grey">Grey</option>
                <option value="navy">Navy Blue</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-2 text-sm">Size</label>
              <select 
                value={formData.size} 
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full p-3 rounded-xl border border-input bg-background"
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-2 text-sm">Quantity</label>
              <input 
                type="number" 
                min="1" 
                value={formData.quantity} 
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="w-full p-3 rounded-xl border border-input bg-background"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block font-bold mb-2 text-sm">Placement</label>
            <select 
              value={formData.placement} 
              onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
              className="w-full p-3 rounded-xl border border-input bg-background"
            >
              <option value="front">Front Center</option>
              <option value="back">Back Center</option>
              <option value="left-chest">Left Chest</option>
              <option value="right-chest">Right Chest</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="block font-bold mb-4 text-lg">2. Upload Design</label>
            <div className="border-2 border-dashed border-border rounded-2xl h-64 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer group">
              <Upload className="w-12 h-12 text-muted-foreground group-hover:text-primary mb-4 transition-colors" />
              <p className="font-bold text-muted-foreground">Click to upload or drag & drop</p>
              <p className="text-xs text-muted-foreground mt-2">(PNG, JPG - Max 10MB)</p>
            </div>
          </div>

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

          <div className="bg-secondary/10 p-6 rounded-2xl mb-8 flex justify-between items-center">
            <span className="font-bold text-lg">Estimated Total:</span>
            <span className="text-3xl font-black">₹{total}</span>
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
