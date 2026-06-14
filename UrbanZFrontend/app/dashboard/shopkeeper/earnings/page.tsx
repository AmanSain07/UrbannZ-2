"use client";

import { useEffect, useState } from "react";
import { fetchVendorEarnings, fetchVendorAnalytics } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { DollarSign, Loader2, ArrowDownToLine, CheckCircle2, Clock } from "lucide-react";

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [earningsData, analyticsData] = await Promise.all([
          fetchVendorEarnings(),
          fetchVendorAnalytics()
        ]);
        setEarnings(earningsData);
        setAnalytics(analyticsData);
      } catch (e) {
        console.error("Failed to fetch earnings:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Earnings & Settlements</h1>
        <p className="text-muted-foreground">Track your revenue, commissions, and payouts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm col-span-1 md:col-span-2 bg-gradient-to-br from-green-500/10 to-emerald-500/5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-green-700 uppercase tracking-wider mb-2">Total Lifetime Earnings</h3>
              <p className="text-4xl font-black text-green-600">{formatPrice(analytics?.lifetime_revenue || 0)}</p>
            </div>
            <div className="p-3 bg-green-500/20 text-green-600 rounded-xl"><DollarSign size={24} /></div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Monthly Earnings</h3>
          <p className="text-2xl font-black text-foreground">{formatPrice(analytics?.monthly_revenue || 0)}</p>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-orange-500/30 shadow-sm bg-orange-500/5">
          <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-2 flex items-center gap-2"><Clock size={14}/> Pending Settlement</h3>
          <p className="text-2xl font-black text-orange-500">{formatPrice(analytics?.pending_settlement || 0)}</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50 flex justify-between items-center">
          <h3 className="font-bold text-lg">Transaction History</h3>
          <button className="text-sm font-bold text-primary flex items-center gap-2 hover:underline">
            <ArrowDownToLine size={16} /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-secondary/5 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Order Amount</th>
                <th className="px-6 py-4 text-right text-red-500">Commission (10%)</th>
                <th className="px-6 py-4 text-right text-green-600">Your Earning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {earnings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">No transactions yet.</td>
                </tr>
              ) : (
                earnings.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-muted-foreground">{tx.date}</td>
                    <td className="px-6 py-4 font-mono font-medium text-sm">#{tx.order_id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{tx.product_name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase
                        ${tx.status.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{formatPrice(tx.amount)}</td>
                    <td className="px-6 py-4 text-right text-red-500 font-medium">-{formatPrice(tx.commission)}</td>
                    <td className="px-6 py-4 text-right text-green-600 font-black">{formatPrice(tx.vendor_earning)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
