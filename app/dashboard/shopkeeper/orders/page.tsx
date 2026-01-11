"use client";

import { useStore } from "@/lib/store-context"; // Mock data access if needed
import { Package, Clock, Truck, CheckCircle } from "lucide-react";

export default function ShopkeeperOrders() {
  const ORDERS = [
    { id: "ORD-001", customer: "Rahul S.", date: "2025-05-15", total: 2499, status: "Pending", items: 1 },
    { id: "ORD-002", customer: "Priya K.", date: "2025-05-14", total: 3999, status: "Shipped", items: 2 },
    { id: "ORD-003", customer: "Amit B.", date: "2025-05-13", total: 899, status: "Delivered", items: 1 },
    { id: "ORD-004", customer: "Sneha M.", date: "2025-05-12", total: 1499, status: "Pending", items: 3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage and fulfill customer orders.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-secondary/5 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {ORDERS.map((order) => (
              <tr key={order.id} className="hover:bg-secondary/5 transition-colors">
                <td className="px-6 py-4 font-mono font-medium">{order.id}</td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
                <td className="px-6 py-4 font-bold">₹{order.total}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold
                    ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'}
                  `}>
                    {order.status === 'Pending' && <Clock size={12} />}
                    {order.status === 'Shipped' && <Truck size={12} />}
                    {order.status === 'Delivered' && <CheckCircle size={12} />}
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm font-bold text-primary hover:underline">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
