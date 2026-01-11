"use client";

import { useStore } from "@/lib/store-context";
import { formatPrice } from "@/lib/utils";
import { Package, Truck, CheckCircle2, Clock, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const { orders } = useStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Shipped": return "bg-purple-100 text-purple-800";
      case "Delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending": return <Clock size={16} />;
      case "Processing": return <Package size={16} />;
      case "Shipped": return <Truck size={16} />;
      case "Delivered": return <CheckCircle2 size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="container px-4 py-10 max-w-4xl mx-auto min-h-screen mb-[200px]">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-full">
          <Package className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your recent purchases</p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-border/50 pb-4">
                <div>
                  <h3 className="font-bold text-lg">Order #{order.id}</h3>
                  <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold w-fit ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs text-muted-foreground font-bold uppercase">Total Amount</span>
                  <p className="text-xl font-black">{formatPrice(order.total)}</p>
                </div>
                <button className="px-4 py-2 text-sm font-bold border border-input rounded-xl hover:bg-secondary/10 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 flex flex-col items-center justify-center bg-secondary/5 rounded-3xl border border-dashed border-border">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-8 text-balance max-w-md">
              Looks like you haven't splashed any cash yet. Go get some fresh fits!
            </p>
            <Link href="/shop">
              <button className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-transform shadow-lg">
                Shop Now
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
