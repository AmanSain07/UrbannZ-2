"use client";

import { useStore } from "@/lib/store-context";
import { useAuth } from "@/lib/auth-context";
import { Search, MoreHorizontal, UserCheck, UserX, Shield, Loader2 } from "lucide-react";
import { useState } from "react";

export default function AdminUsersPage() {
  const { users, updateUserStatus, isLoading } = useStore();
  const { user: me } = useAuth();
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = async (userId: string, currentStatus: "active" | "banned") => {
    setActionLoading(userId);
    try {
      await updateUserStatus(userId, currentStatus === "active" ? "banned" : "active");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage platform users, roles, and permissions.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", val: users.length },
          { label: "Customers", val: users.filter((u) => u.role === "customer").length },
          { label: "Vendors", val: users.filter((u) => u.role === "shopkeeper").length },
          { label: "Banned", val: users.filter((u) => u.status === "banned").length },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold uppercase text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-black mt-1">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-secondary/10 border-none focus:ring-2 focus:ring-primary/50 outline-none text-sm"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-secondary/5 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm">
                    {search ? "No users match your search." : "No users found."}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{u.name}</span>
                        <span className="text-xs text-muted-foreground">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold uppercase
                          ${u.role === "admin" ? "bg-red-100 text-red-800" :
                            u.role === "shopkeeper" ? "bg-purple-100 text-purple-800" :
                            "bg-blue-100 text-blue-800"}`}
                      >
                        {u.role === "admin" && <Shield size={10} />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold
                          ${u.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {u.status === "active" ? <UserCheck size={12} /> : <UserX size={12} />}
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{u.joined}</td>
                    <td className="px-6 py-4 text-right">
                      {/* Don't allow action on self or other admins */}
                      {u.role !== "admin" && u.id !== me?.id ? (
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          disabled={actionLoading === u.id}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors
                            ${u.status === "active"
                              ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40"
                              : "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-950/40"
                            } disabled:opacity-50`}
                        >
                          {actionLoading === u.id ? (
                            <Loader2 size={12} className="animate-spin inline" />
                          ) : u.status === "active" ? "Ban" : "Activate"}
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
