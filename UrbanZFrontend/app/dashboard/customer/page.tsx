"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Truck, Clock, CheckCircle, Loader2 } from "lucide-react";
import { fetchMyOrders } from "@/lib/api";

type Order = {
  id: string | number;
  items: any[];
  total: number;
  status: string;
  created_at: string;
};

export default function CustomerDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Auth guard
  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Fetch orders directly
  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    fetchMyOrders()
      .then((data: any) => {
        const results = data?.results || data || [];
        setOrders(Array.isArray(results) ? results : []);
      })
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container px-4 py-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-1">My Orders</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}. Track and manage your purchases.</p>
      </div>

      {ordersLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <h3 className="font-bold text-lg">No orders yet</h3>
          <p className="text-sm mt-1">Your orders will appear here once you make a purchase.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const date = typeof order.created_at === "string"
              ? order.created_at.split("T")[0]
              : "";
            const statusLower = String(order.status).toLowerCase();
            return (
              <div key={order.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-border/50 pb-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Order ID</p>
                    <h3 className="font-mono font-bold text-lg">#{order.id}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Date</p>
                      <p className="font-medium text-sm">{date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Total</p>
                      <p className="font-medium text-sm">₹{parseFloat(order.total as any).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-semibold mb-2">Items ({order.items?.length || 0})</p>
                    {(order.items || []).slice(0, 3).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                        <div className="size-2 bg-primary rounded-full" />
                        {item.product?.name || item.name || `Item ${idx + 1}`} × {item.quantity || 1}
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <p className="text-xs text-muted-foreground">+{order.items.length - 3} more</p>
                    )}
                  </div>

                  <div className="flex-1 md:text-right">
                    <p className="text-sm font-semibold mb-2">Status</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full">
                      {statusLower === "pending" && <Clock size={16} className="text-yellow-500" />}
                      {statusLower === "shipped" && <Truck size={16} className="text-blue-500" />}
                      {(statusLower === "delivered" || statusLower === "completed") && <CheckCircle size={16} className="text-green-500" />}
                      <span className="font-bold text-sm capitalize">{order.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
