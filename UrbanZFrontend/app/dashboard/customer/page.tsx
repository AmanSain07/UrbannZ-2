"use client";

import { useStore } from "@/lib/store-context";
import { Package, Truck, Clock, CheckCircle } from "lucide-react";

export default function CustomerDashboard() {
  const { orders } = useStore();

  return (
    <div className="container px-4 py-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your purchases.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-border/50 pb-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Order ID</p>
                <h3 className="font-mono font-bold text-lg">{order.id}</h3>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Date</p>
                  <p className="font-medium text-sm">{order.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Total</p>
                  <p className="font-medium text-sm">₹{order.total}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1 space-y-2">
                <p className="text-sm font-semibold mb-2">Items</p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                    <div className="size-2 bg-primary rounded-full" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex-1 md:text-right">
                <p className="text-sm font-semibold mb-2">Status</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full">
                  {order.status === 'Pending' && <Clock size={16} className="text-yellow-500" />}
                  {order.status === 'Shipped' && <Truck size={16} className="text-blue-500" />}
                  {order.status === 'Delivered' && <CheckCircle size={16} className="text-green-500" />}
                  <span className="font-bold text-sm">{order.status}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50 flex justify-end gap-2">
              <button className="px-4 py-2 text-sm font-medium text-primary hover:bg-secondary/10 rounded-lg transition-colors">
                View Invoice
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-secondary text-foreground hover:bg-secondary/80 rounded-lg transition-colors">
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
