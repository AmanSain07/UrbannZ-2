"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DollarSign, Package, ShoppingBag, Star, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { fetchVendorAnalytics } from "@/lib/api";

export default function ShopkeeperDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchVendorAnalytics();
        setAnalytics(data);
      } catch (e) {
        console.error("Failed to fetch analytics:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading Dashboard...</div>;
  }

  if (!analytics) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || "Shopkeeper"}!</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
            ● Status: Active
          </span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Products", val: analytics.total_products, icon: ShoppingBag, color: "text-blue-600" },
          { label: "Active Products", val: analytics.active_products, icon: Star, color: "text-green-600" },
          { label: "Out of Stock", val: analytics.out_of_stock_products, icon: AlertTriangle, color: "text-red-500" },
          { label: "Total Orders", val: analytics.total_orders, icon: Package, color: "text-orange-600" },
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

      {/* Revenue & Settlements Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Lifetime Revenue</h3>
          <p className="text-3xl font-black text-green-600">{formatPrice(analytics.lifetime_revenue)}</p>
          <span className="text-xs text-muted-foreground">After 10% commission</span>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Monthly Revenue</h3>
          <p className="text-3xl font-black text-primary">{formatPrice(analytics.monthly_revenue)}</p>
          <span className="text-xs text-muted-foreground">Last 30 days</span>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Pending Settlement</h3>
          <p className="text-3xl font-black text-orange-500">{formatPrice(analytics.pending_settlement)}</p>
          <span className="text-xs text-muted-foreground">From {analytics.pending_orders} pending orders</span>
        </div>
      </div>

      {/* Bottom Area */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-card p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" /> Overview
            </h3>
          </div>
          <div className="flex-1 min-h-64 flex items-center justify-center bg-secondary/5 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground text-sm font-medium">Detailed Revenue Charts Coming Soon</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary to-purple-600 p-6 rounded-3xl text-white shadow-xl flex flex-col justify-center">
          <h3 className="font-bold text-lg mb-2">Ready to grow? 🚀</h3>
          <p className="text-white/90 text-sm leading-relaxed mb-6">
            Keep your inventory updated and fulfill orders quickly to boost your store ranking on UrbanZ.
          </p>
          <Link href="/dashboard/shopkeeper/products/add">
            <button className="w-full py-3 bg-white text-primary rounded-xl font-black hover:bg-white/90 transition-colors shadow-lg">
              Add New Product
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
