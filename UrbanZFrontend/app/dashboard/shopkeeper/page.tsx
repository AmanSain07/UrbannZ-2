"use client";

import { useStore } from "@/lib/store-context";
import { useAuth } from "@/lib/auth-context";
import { DollarSign, Package, ShoppingBag, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function ShopkeeperDashboard() {
  const { user } = useAuth();
  const { products, orders } = useStore();

  // Filter data for this shopkeeper (assuming shop1 for demo if not strictly filtered by ID in this mock)
  // In a real app we'd filter by user.id. For this local demo, we'll assume logged in shopkeeper owns 'shop1' or all products labeled 'shop1'.
  // But to make it feel alive for ANY shopkeeper, let's filter by the current user's email or ID if we saved it in product.
  // For simplicity in this "mock" local setup, if user is "shop1", we show "shop1" data.

  const shopId = user?.id || "shop1";

  const myProducts = products.filter(p => p.sellerId === shopId || p.sellerId === "shop1"); // Fallback for demo data
  const myOrders = orders.filter(o => o.sellerId === shopId || o.sellerId === "shop1");

  const totalSales = myOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = myOrders.filter(o => o.status === "Pending").length;
  const totalProducts = myProducts.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.storeDetails?.storeName || user?.name || "Shopkeeper"}!</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
            ● Status: Active
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Sales", val: formatPrice(totalSales), icon: DollarSign, color: "text-green-600" },
          { label: "Pending Orders", val: pendingOrders.toString(), icon: Package, color: "text-orange-600" },
          { label: "Products", val: totalProducts.toString(), icon: ShoppingBag, color: "text-blue-600" },
          { label: "Rating", val: "4.8", icon: Star, color: "text-amber-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">{stat.label}</span>
              <stat.icon size={16} className={stat.color} />
            </div>
            <span className="text-2xl font-black">{stat.val}</span>
          </div>
        ))}
      </div>

      {/* Recent Activity / Chart Placeholder */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" /> Sales Overview
            </h3>
            <select className="bg-secondary/20 border-none text-sm rounded-lg px-3 py-1 outline-none">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-secondary/5 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground text-sm font-medium">Chart Visualization Coming Soon</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-purple-600 p-6 rounded-3xl text-white shadow-xl">
          <h3 className="font-bold text-lg mb-2">Pro Tip 💡</h3>
          <p className="text-white/90 text-sm leading-relaxed mb-4">
            Adding high-quality images can increase sales by up to 40%. Try our new AI background remover tool!
          </p>
          <Link href="/dashboard/shopkeeper/products/add">
            <button className="w-full py-2 bg-white/20 backdrop-blur-sm rounded-lg font-bold hover:bg-white/30 transition-colors border border-white/20">
              Upload New Product
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
