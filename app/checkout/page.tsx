"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useStore } from "@/lib/store-context";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link"; // Added Link importation

export default function CheckoutPage() {
  const { items, clearCart, total } = useCart();
  const { placeOrder } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create Order
    placeOrder({
      customerName: formData.name || "Guest User",
      items: items.map(i => `${i.name} (x${i.quantity})`),
      total: total,
      // @ts-ignore - store context handles linking
      sellerId: "shop1",
    });

    clearCart();
    setLoading(false);
    router.push("/dashboard/customer"); // Redirect to history
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Your bag is empty</h1>
        <Link href="/shop" className="text-primary hover:underline">Go shopping</Link>
      </div>
    );
  }

  return (
    <div className="container max-w-lg px-4 py-10 mx-auto min-h-screen">
      <h1 className="text-3xl font-black mb-8">Checkout</h1>

      <div className="space-y-6">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <h2 className="font-bold text-lg mb-4">Summary</h2>
          <div className="space-y-2 mb-4">
            {items.map(item => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span className="font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Full Name</label>
            <input
              required
              type="text"
              className="w-full p-3 rounded-xl bg-background border border-input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Address</label>
            <input
              required
              type="text"
              className="w-full p-3 rounded-xl bg-background border border-input"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">City</label>
              <input
                required
                type="text"
                className="w-full p-3 rounded-xl bg-background border border-input"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">ZIP Code</label>
              <input
                required
                type="text"
                className="w-full p-3 rounded-xl bg-background border border-input"
                value={formData.zip}
                onChange={e => setFormData({ ...formData, zip: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl text-lg hover:scale-[1.02] transition-transform shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : `Pay ₹${total.toLocaleString('en-IN')}`}
          </button>
          <p className="text-xs text-center text-muted-foreground mt-4">Safe & Secure Payments via Razorpay (Mock)</p>
        </form>
      </div>
    </div>
  );
}
