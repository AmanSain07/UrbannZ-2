"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useStore } from "@/lib/store-context";
import { useRouter } from "next/navigation";
import { formatPrice, FALLBACK_IMAGE } from "@/lib/utils";
import Image from "next/image";
import ImageWithFallback from "@/components/ui/image-with-fallback";

export default function AdminDashboard() {
    const { user, isLoading: authLoading } = useAuth();
    const { orders, users, customDesigns, products, updateProductStatus } = useStore();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user?.role !== 'admin') {
            router.push('/dashboard');
        }
    }, [user, authLoading, router]);

    if (authLoading || !user) return null;

    // Calculate Stats
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingproducts = products.filter(p => p.status === 'pending');
    const activeShops = users.filter(u => u.role === 'shopkeeper' && u.status === 'active').length;

    const pendingDesigns = customDesigns.filter(d => d.status === 'pending');
    const recentOrders = orders.slice(0, 5); // Newest first (assuming order is preserved or sorted)

    return (
        <div className="container px-4 md:px-6 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black">Admin Dashboard</h1>
                <div className="text-sm font-bold text-muted-foreground">
                    Welcome back, {user.name}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</h3>
                    <p className="text-3xl font-bold">{formatPrice(totalRevenue)}</p>
                </div>
                <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Pending Product Approvals</h3>
                    <p className="text-3xl font-bold">{pendingproducts.length}</p>
                </div>
                <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Active Shops</h3>
                    <p className="text-3xl font-bold">{activeShops}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-card border border-border rounded-2xl">
                    <h2 className="text-xl font-bold mb-4">Pending Product Approvals</h2>
                    {pendingproducts.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No pending products.</p>
                    ) : (
                        <div className="space-y-4">
                            {pendingproducts.slice(0, 5).map((p) => (
                                <div key={p.id} className="flex items-center gap-4 p-3 bg-secondary/10 rounded-xl">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden relative">
                                        <ImageWithFallback src={Array.isArray(p.image) ? (p.image[0] || FALLBACK_IMAGE) : (p.image || FALLBACK_IMAGE)} alt={p.name} fill className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm">{p.name}</h4>
                                        <p className="text-xs text-muted-foreground">{formatPrice(p.price)}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => updateProductStatus(p.id, 'approved')} className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full hover:bg-green-700">Approve</button>
                                        <button onClick={() => updateProductStatus(p.id, 'rejected')} className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full hover:bg-red-700">Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                    <h2 className="text-xl font-bold mb-4">Recent Global Orders</h2>
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex justify-between items-center p-3 border-b border-border/50 last:border-0 hover:bg-secondary/5 transition-colors rounded-lg">
                                <div className="text-sm">
                                    <p className="font-bold">{order.id}</p>
                                    <p className="text-xs text-muted-foreground">{order.items.length} items • {order.status}</p>
                                </div>
                                <span className="font-mono font-bold text-sm bg-secondary/10 px-2 py-1 rounded">
                                    {formatPrice(order.total)}
                                </span>
                            </div>
                        ))}
                        {recentOrders.length === 0 && <p className="text-muted-foreground text-sm">No orders yet.</p>}
                    </div>
                </div>
            </div>

            {/* User Management Section */}
            <div className="mt-8 p-6 bg-card border border-border rounded-2xl">
                <h2 className="text-xl font-bold mb-4">Manage Shopkeepers</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border/50 text-sm text-muted-foreground">
                                <th className="pb-3 pl-2">Name</th>
                                <th className="pb-3">Email</th>
                                <th className="pb-3">Status</th>
                                <th className="pb-3 text-right pr-2">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {users.filter(u => u.role === 'shopkeeper').map(shop => (
                                <tr key={shop.id} className="text-sm">
                                    <td className="py-3 pl-2 font-medium">{shop.name}</td>
                                    <td className="py-3 text-muted-foreground">{shop.email}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${shop.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {shop.status}
                                        </span>
                                    </td>
                                    <td className="py-3 text-right pr-2">
                                        <button className="text-xs font-bold underline hover:text-primary">
                                            {shop.status === 'active' ? 'Ban' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
