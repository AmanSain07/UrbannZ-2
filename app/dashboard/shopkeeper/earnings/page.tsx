"use client";

import { DollarSign, TrendingUp, CreditCard, Calendar, ArrowUpRight, Download } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function EarningsPage() {
  // Mock data for earnings
  const stats = [
    { label: "Total Revenue", value: 125000, change: "+12.5%", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Net Profit", value: 45000, change: "+8.2%", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pending Payouts", value: 12500, change: "Processing", icon: CreditCard, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  const transactions = [
    { id: "TXN-001", date: "2025-06-15", amount: 4500, status: "Completed", type: "Order #ORD-1024" },
    { id: "TXN-002", date: "2025-06-14", amount: 2800, status: "Completed", type: "Order #ORD-1022" },
    { id: "TXN-003", date: "2025-06-12", amount: 12500, status: "Processing", type: "Weekly Payout" },
    { id: "TXN-004", date: "2025-06-10", amount: 3200, status: "Completed", type: "Order #ORD-1018" },
  ];

  return (
    <div className="space-y-8 mb-[100px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Earnings & Payouts</h1>
          <p className="text-muted-foreground">Track your revenue and manage withdrawals.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-bold hover:bg-secondary/80 transition-colors">
          <Download size={18} /> Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-6 bg-card border border-border/50 rounded-2xl shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-black mt-1">{formatPrice(stat.value)}</h3>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="p-6 bg-card border border-border/50 rounded-2xl shadow-sm">
        <h3 className="font-bold text-lg mb-6">Revenue Analytics</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
            <div key={i} className="w-full bg-primary/10 rounded-t-lg hover:bg-primary/20 transition-colors relative group">
              <div
                className="absolute bottom-0 left-0 right-0 bg-primary/80 rounded-t-lg transition-all duration-500"
                style={{ height: `${h}%` }}
              ></div>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {formatPrice(h * 1000)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-muted-foreground font-bold uppercase">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <h3 className="font-bold text-xl">Recent Transactions</h3>
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/20 border-b border-border/50 text-muted-foreground">
              <tr>
                <th className="p-4 font-bold">Transaction ID</th>
                <th className="p-4 font-bold">Type</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="p-4 font-mono font-medium">{txn.id}</td>
                  <td className="p-4 font-medium">{txn.type}</td>
                  <td className="p-4 text-muted-foreground">{txn.date}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${txn.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold">{formatPrice(txn.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
