"use client";

import { Activity, DollarSign, ShoppingBag, Users } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-black">Admin Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Total Revenue", val: "₹12,450", icon: DollarSign, color: "bg-green-500/10 text-green-600 dark:text-green-400" },
            { label: "Active Orders", val: "45", icon: ShoppingBag, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
            { label: "New Users", val: "+120", icon: Users, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
            { label: "Site Activity", val: "High", icon: Activity, color: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
          ].map((stat, i) => (
            <div key={i} className="bg-card p-6 rounded-[2rem] shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-bold">{stat.label}</p>
                <h3 className="text-2xl font-black">{stat.val}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Orders Table Mock */}
        <div className="bg-card p-8 rounded-[2rem] shadow-sm">
          <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-muted-foreground">
                  <th className="pb-4 font-bold">Order ID</th>
                  <th className="pb-4 font-bold">Customer</th>
                  <th className="pb-4 font-bold">Status</th>
                  <th className="pb-4 font-bold">Total</th>
                  <th className="pb-4 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[1, 2, 3, 4, 5].map((order) => (
                  <tr key={order} className="group hover:bg-muted/50 transition-colors">
                    <td className="py-4 font-mono font-medium">#UZ-882{order}</td>
                    <td className="py-4 font-medium">Alex {String.fromCharCode(64 + order)}.</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order % 2 === 0 ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' : 'bg-green-500/10 text-green-700 dark:text-green-400'}`}>
                        {order % 2 === 0 ? 'Processing' : 'Delivered'}
                      </span>
                    </td>
                    <td className="py-4 font-bold">₹12{order}.00</td>
                    <td className="py-4">
                      <button className="text-sm font-bold text-primary hover:underline">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
