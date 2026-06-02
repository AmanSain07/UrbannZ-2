"use client";

import { useStore } from "@/lib/store-context";
import { Package, Clock, Truck, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function ShopkeeperOrders() {
  const { orders, updateOrderStatus } = useStore();

  // For mock demo, filter orders for 'shop1' or show all if desired
  const myOrders = orders.filter(o => o.sellerId === "shop1");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage and fulfill customer orders.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        {myOrders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No orders yet.</div>
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
                {myOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">{order.id}</td>
                    <td className="px-6 py-4">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
                    <td className="px-6 py-4 font-bold">{formatPrice(order.total)}</td>
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
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Shipped')}
                          className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold hover:bg-blue-200 transition-colors"
                        >
                          Mark Shipped
                        </button>
                      )}
                      {order.status === 'Shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Delivered')}
                          className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold hover:bg-green-200 transition-colors"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
