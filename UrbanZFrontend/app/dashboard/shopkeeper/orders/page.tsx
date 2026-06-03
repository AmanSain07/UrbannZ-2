"use client";

import { useStore } from "@/lib/store-context";
import { Package, Clock, Truck, CheckCircle, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function ShopkeeperOrders() {
  const { orders, updateOrderStatus, isLoading } = useStore();

  // orders are already vendor-specific — store-context fetches via fetchVendorOrders()
  // No hardcoded sellerId filter needed.

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending") return "bg-yellow-100 text-yellow-800";
    if (s === "processing") return "bg-orange-100 text-orange-800";
    if (s === "shipped") return "bg-blue-100 text-blue-800";
    if (s === "delivered") return "bg-green-100 text-green-800";
    if (s === "cancelled") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage and fulfill customer orders.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h3 className="font-bold text-lg">No orders yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Orders from customers will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                {orders.map((order) => {
                  const statusLower = String(order.status).toLowerCase();
                  return (
                    <tr key={order.id} className="hover:bg-secondary/5 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium">#{order.id}</td>
                      <td className="px-6 py-4">{order.customerName || "—"}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
                      <td className="px-6 py-4 font-bold">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusStyle(String(order.status))}`}>
                          {statusLower === "pending" && <Clock size={12} />}
                          {statusLower === "shipped" && <Truck size={12} />}
                          {statusLower === "delivered" && <CheckCircle size={12} />}
                          <span className="capitalize">{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {statusLower === "pending" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "shipped")}
                            className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold hover:bg-blue-200 transition-colors"
                          >
                            Mark Shipped
                          </button>
                        )}
                        {statusLower === "shipped" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "delivered")}
                            className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold hover:bg-green-200 transition-colors"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {(statusLower === "delivered" || statusLower === "cancelled") && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
