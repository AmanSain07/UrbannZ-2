"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState([
      { label: "Total Revenue", value: "$45,231" },
      { label: "Pending Approvals", value: "12" },
      { label: "Active Shops", value: "8" },
  ]);

  useEffect(() => {
      if (!isLoading && user?.role !== 'admin') {
          router.push('/dashboard');
      }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <div className="container px-4 md:px-6 py-10">
      <h1 className="text-3xl font-black mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-card border border-border rounded-2xl shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-card border border-border rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Pending Design Approvals</h2>
              <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-secondary/10 rounded-xl">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1">
                              <h4 className="font-bold text-sm">Custom Tee Request #{i}</h4>
                              <p className="text-xs text-muted-foreground">Requested by Rahul</p>
                          </div>
                          <button className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">Review</button>
                      </div>
                  ))}
              </div>
          </div>

          <div className="p-6 bg-card border border-border rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Recent Global Orders</h2>
              <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between items-center p-3 border-b border-border/50 last:border-0">
                           <div className="text-sm">
                               <p className="font-bold">Order #992{i}</p>
                               <p className="text-xs text-muted-foreground">2 items • Paid</p>
                           </div>
                           <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">New</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}
