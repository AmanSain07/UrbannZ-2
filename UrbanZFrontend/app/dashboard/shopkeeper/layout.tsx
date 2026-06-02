"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  PenTool,
  DollarSign,
  Bell,
  Settings,
  LogOut,
  Store,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function ShopkeeperLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth(); // Added isLoading
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter(); // Added router

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/login"); // Redirect to login if not authenticated
    } else if (user.role !== "shopkeeper" && user.role !== "admin") { // Allow admin to view shopkeeper view for debugging if needed, or strictly restrict. Let's strictly restrict for now unless it's admin.
      // Actually strictly restrict to keep clean
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null; // Prevent flash


  const NAV_ITEMS = [
    { label: "Overview", href: "/dashboard/shopkeeper", icon: LayoutDashboard },
    { label: "Products", href: "/dashboard/shopkeeper/products", icon: ShoppingBag },
    { label: "Orders", href: "/dashboard/shopkeeper/orders", icon: Package },
    { label: "Custom Requests", href: "/dashboard/shopkeeper/custom-requests", icon: PenTool },
    { label: "Earnings", href: "/dashboard/shopkeeper/earnings", icon: DollarSign },
    { label: "Notifications", href: "/dashboard/shopkeeper/notifications", icon: Bell },
    { label: "Settings", href: "/dashboard/shopkeeper/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-secondary/5 dark:bg-background">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-background border-b border-border z-[60] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <Store size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight">Seller Hub</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[65] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
          <div className="size-8 rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <Store size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight">Seller Hub</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-64 pt-16 md:pt-0 min-h-screen">
        <div className="container p-6 md:p-8 max-w-6xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
