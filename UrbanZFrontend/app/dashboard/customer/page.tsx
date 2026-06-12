"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Truck, Clock, CheckCircle, Loader2, User as UserIcon, Mail, Phone, Save, Lock } from "lucide-react";
import { fetchMyOrders, updateProfile, changePassword } from "@/lib/api";

type Order = {
  id: string | number;
  items: any[];
  total: number;
  status: string;
  created_at: string;
};

export default function CustomerDashboard() {
  const { user, isLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Profile Form State
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });

  // Password Form State
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  // Auth guard
  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/login");
    } else {
      setProfileForm({ name: user.name || "", phone: user.phone || "" });
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

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError(null);
    setProfileSaved(false);
    try {
      await updateProfile({ name: profileForm.name, phone: profileForm.phone });
      await refreshUser();
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err: any) {
      setProfileError(err?.message || "Failed to save profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_new_password) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSaved(false);
    try {
      await changePassword(passwordForm);
      setPasswordSaved(true);
      setPasswordForm({ old_password: "", new_password: "", confirm_new_password: "" });
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err: any) {
      setPasswordError(err?.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const userInitials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="container px-4 py-10 max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Account Dashboard</h1>
          <p className="text-muted-foreground font-medium text-sm">Welcome back, {user.name}. Manage your profile and orders.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="bg-secondary/15 p-1.5 rounded-2xl flex gap-1 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "orders" ? "bg-card text-foreground shadow-sm animate-in fade-in" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            My Orders
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "profile" ? "bg-card text-foreground shadow-sm animate-in fade-in" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Profile Settings
          </button>
        </div>
      </div>

      {activeTab === "orders" ? (
        <div className="space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex items-center gap-6">
            <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">
              {userInitials}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex gap-4 mt-2">
                <span className="text-xs bg-secondary/10 px-2.5 py-1 rounded-full font-bold text-muted-foreground uppercase">
                  {user.role} Account
                </span>
                <span className="text-xs text-muted-foreground font-semibold">
                  Member since: {user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {ordersLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-card border border-dashed border-border/50 rounded-2xl text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-30 animate-pulse" />
              <h3 className="font-bold text-lg text-foreground">No orders yet</h3>
              <p className="text-sm mt-1">Your orders will appear here once you make a purchase.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const date = typeof order.created_at === "string"
                  ? new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                  : "";
                const statusLower = String(order.status).toLowerCase();
                return (
                  <div key={order.id} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-border/50 pb-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Order ID</p>
                        <h3 className="font-mono font-bold text-lg text-foreground">#{order.id}</h3>
                      </div>
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Date</p>
                          <p className="font-semibold text-sm">{date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Total</p>
                          <p className="font-bold text-sm text-primary">₹{parseFloat(order.total as any).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-2">
                        <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-2">Purchased Items ({order.items?.length || 0})</p>
                        {(order.items || []).slice(0, 3).map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
                            <div className="size-1.5 bg-primary rounded-full" />
                            {item.product?.name || item.name || `Item ${idx + 1}`} × {item.quantity || 1}
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <p className="text-xs text-muted-foreground font-bold">+{order.items.length - 3} more items</p>
                        )}
                      </div>

                      <div className="flex-1 md:text-right flex flex-col justify-end items-start md:items-end">
                        <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-2">Order Status</p>
                        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs uppercase ${
                          statusLower === "pending" ? "bg-yellow-500/10 text-yellow-600" :
                          statusLower === "shipped" ? "bg-blue-500/10 text-blue-600" :
                          "bg-green-500/10 text-green-600"
                        }`}>
                          {statusLower === "pending" && <Clock size={14} />}
                          {statusLower === "shipped" && <Truck size={14} />}
                          {(statusLower === "delivered" || statusLower === "completed") && <CheckCircle size={14} />}
                          <span>{order.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 items-start animate-in fade-in slide-in-from-bottom-2 duration-350">
          {/* Left: Quick Profile Summary Card */}
          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col items-center text-center space-y-4 py-4">
              <div className="size-24 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-bold text-4xl shadow-xl shadow-primary/10">
                {userInitials}
              </div>
              <div>
                <h2 className="text-2xl font-black">{user.name}</h2>
                <p className="text-sm text-muted-foreground font-medium">{user.email}</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase bg-primary/10 text-primary">
                {user.role} Account
              </span>
            </div>

            <div className="border-t border-border/50 pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Joined Date</span>
                <span className="font-bold">{user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : "N/A"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Total Purchases</span>
                <span className="font-bold">{orders.length} order(s)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Status</span>
                <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={14} /> Active</span>
              </div>
            </div>
          </div>

          {/* Right: Detailed Settings Forms */}
          <div className="md:col-span-2 space-y-8">
            {/* General Info */}
            <form onSubmit={handleProfileSave} className="space-y-6 bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border/50 pb-4">
                <UserIcon className="w-5 h-5 text-primary" /> General Account Info
              </h3>

              {profileError && (
                <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium">
                  {profileError}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Display Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                    <input
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-secondary/10 rounded-xl py-3 pl-10 pr-4 font-semibold border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="Your display name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                    <input
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-secondary/10 rounded-xl py-3 pl-10 pr-4 font-semibold border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground pl-1">Email Address (Read-only)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                  <input
                    value={user.email}
                    disabled
                    className="w-full bg-secondary/5 rounded-xl py-3 pl-10 pr-4 font-semibold border border-border/30 text-muted-foreground outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {profileSaved && (
                  <span className="flex items-center gap-1.5 text-green-600 font-bold text-sm animate-in fade-in">
                    <CheckCircle size={16} /> Profile Updated Successfully!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="ml-auto flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 active:scale-95"
                >
                  {profileLoading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save Changes</>}
                </button>
              </div>
            </form>

            {/* Password Update */}
            <form onSubmit={handlePasswordSave} className="space-y-6 bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold flex items-center gap-2 border-b border-border/50 pb-4">
                <Lock className="w-5 h-5 text-primary" /> Password Security
              </h3>

              {passwordError && (
                <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium">
                  {passwordError}
                </div>
              )}

              <div className="space-y-4">
                {[
                  { key: "old_password", label: "Current Password" },
                  { key: "new_password", label: "New Password" },
                  { key: "confirm_new_password", label: "Confirm New Password" },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground pl-1">{label}</label>
                    <input
                      type="password"
                      value={(passwordForm as any)[key]}
                      onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                      required
                      className="w-full bg-secondary/10 rounded-xl py-3 px-4 font-semibold border border-border/50 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                {passwordSaved && (
                  <span className="flex items-center gap-1.5 text-green-600 font-bold text-sm animate-in fade-in">
                    <CheckCircle size={16} /> Password changed successfully!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="ml-auto flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 active:scale-95"
                >
                  {passwordLoading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Update Password</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
