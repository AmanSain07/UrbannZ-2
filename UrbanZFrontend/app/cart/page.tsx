"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useStore } from "@/lib/store-context";
import { Trash2, ShoppingBag, CreditCard, ArrowRight, CheckCircle2, Truck, Minus, Plus, ShoppingCart, Tag, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ImageWithFallback from "@/components/ui/image-with-fallback";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { placeOrder } = useStore();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  useEffect(() => setIsMounted(true), []);

  const handleWhatsAppOrder = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in all shipping details.");
      return;
    }

    // save order locally first
    placeOrder({
      customerName: formData.name,
      items: items.map(i => `${i.name} (${i.size})`),
      total: total,
      sellerId: "shop1" // Default for now, ideally per item
    });

    // Construct WhatsApp Message
    const orderItems = items.map((i, idx) =>
      `${idx + 1}. ${i.name} - ${i.size} | ${i.color} (Qty: ${i.quantity}) - ₹${i.price}`
    ).join('%0a');

    const totalText = `Total: ₹${total}`;
    const customerDetails = `Name: ${formData.name}%0aPhone: ${formData.phone}%0aAddress: ${formData.address}`;

    const message = `*New Order Request* 🛍️%0a%0a${orderItems}%0a%0a*${totalText}*%0a%0a------------------%0a*Shipping Details:*%0a${customerDetails}%0a%0aMode: *Cash on Delivery (COD)*`;

    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');

    setStep('success');
    clearCart();
  };

  if (!isMounted) return null;

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-20 bg-gray-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 max-w-md px-4 bg-white p-12 rounded-[3rem] shadow-xl"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 animate-bounce">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-black">Order Placed!</h1>
          <p className="text-muted-foreground text-lg">
            Your fresh fits are on the way. <br />Tracking ID: <span className="font-mono font-bold text-black border-b-2 border-primary">#UZ-8821</span>
          </p>
          <div className="p-4 bg-blue-50/50 rounded-2xl text-sm font-medium border border-blue-100">
            Expected Delivery: <span className="font-bold text-blue-700">Today, 4:20 PM</span>
          </div>
          <Link href="/shop" className="block">
            <button className="w-full px-8 py-4 bg-black text-white rounded-full font-bold mt-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              Keep Shopping
            </button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-10 pb-20 bg-gray-50/50">
      <div className="container px-4 md:px-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-black">
            {step === 'cart' ? 'Your Bag' : 'Checkout'}
          </h1>
          <span className="bg-black text-white text-sm font-bold px-3 py-1 rounded-full">
            {items.length} Items
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {step === 'cart' ? (
                <motion.div
                  key="cart-list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {items.length > 0 ? items.map((item, idx) => (
                    <motion.div
                      key={item.productId + item.size + item.color}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white p-3 md:p-4 rounded-[2rem] flex gap-3 md:gap-6 items-center shadow-sm group hover:shadow-md transition-all border border-transparent hover:border-gray-100"
                    >
                      <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl relative overflow-hidden flex-shrink-0 bg-gray-100">
                        <ImageWithFallback src={item.image} alt={item.name} fill className="object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1 md:mb-2">
                          <h3 className="font-bold text-base md:text-xl truncate pr-2 md:pr-4">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.productId, item.size, item.color)}
                            className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold uppercase text-gray-600">Size: {item.size}</span>
                          <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold uppercase text-gray-600">Qty: {item.quantity}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="font-black text-xl">{formatPrice(item.price)}</p>
                          {/* Qty Controls */}
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                            <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-xs hover:bg-gray-100"><Minus size={12} /></button>
                            <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-xs hover:bg-gray-100"><Plus size={12} /></button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
                      <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-xl font-bold text-gray-400">Your bag is empty.</h3>
                      <Link href="/shop" className="text-primary font-bold hover:underline mt-2 inline-block">Start Shopping</Link>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="checkout-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm space-y-8"
                >
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-4">
                      <Truck className="w-5 h-5 text-primary" /> Shipping Info
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase pl-1">Name</label>
                        <input
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase pl-1">Phone</label>
                        <input
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none font-medium"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase pl-1">Address</label>
                        <input
                          placeholder="Address Line 1"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 border-b pb-4 pt-4">
                      <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-4 p-5 rounded-2xl border-2 border-primary bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
                        <div className="w-6 h-6 rounded-full border-[6px] border-primary bg-white shadow-sm" />
                        <div>
                          <span className="font-bold block text-lg">Cash on Delivery (COD)</span>
                          <span className="text-sm text-muted-foreground">Pay when your fit arrives.</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 opacity-60 cursor-not-allowed bg-gray-50">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                        <div>
                          <span className="font-bold block text-lg text-gray-500">Online Payment</span>
                          <span className="text-sm text-muted-foreground">Coming Soon</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] sticky top-24 shadow-lg shadow-gray-200/50 space-y-8 border border-gray-100">
              <h3 className="font-bold text-2xl flex items-center gap-2">
                Order Summary
                <ShoppingCart size={20} className="text-muted-foreground" />
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="text-gray-900">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">Free</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                  <span>Taxes</span>
                  <span className="text-gray-900">₹0</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Promo Code" className="w-full bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm font-bold outline-none ring-primary focus:ring-2 transition-all" />
                </div>
                <button className="bg-black text-white px-4 rounded-xl font-bold text-sm">Apply</button>
              </div>

              <div className="pt-6 border-t border-dashed border-gray-200">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-lg font-bold">Grand Total</span>
                  <span className="text-3xl font-black">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground text-right">Inclusive of all taxes</p>
              </div>

              {step === 'cart' ? (
                <button
                  onClick={() => setStep('checkout')}
                  disabled={items.length === 0}
                  className="w-full py-5 rounded-full bg-black text-white font-bold text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-black/20 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 group"
                >
                  Checkout <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full py-5 rounded-full bg-[#25D366] text-white font-bold text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-green-500/20"
                  >
                    Order via WhatsApp (COD)
                  </button>
                  <button
                    onClick={() => setStep('cart')}
                    className="w-full py-4 rounded-full hover:bg-gray-100 font-bold transition-colors text-gray-600"
                  >
                    Back to Bag
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
                <ShieldCheck size={14} /> Secure Checkout
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

