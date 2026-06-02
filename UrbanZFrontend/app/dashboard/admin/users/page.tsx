"use client";

import { Search, MoreHorizontal, UserCheck, UserX, Shield } from "lucide-react";

export default function AdminUsersPage() {
  const MOCK_USERS = [
    { id: 1, name: "Rahul Sharma", email: "rahul@example.com", role: "customer", status: "Active", joined: "May 2025" },
    { id: 2, name: "Clothify Store", email: "owner@clothify.in", role: "shopkeeper", status: "Active", joined: "April 2025" },
    { id: 3, name: "Priya Singh", email: "priya@example.com", role: "customer", status: "Banned", joined: "May 2025" },
    { id: 4, name: "Admin User", email: "admin@urbanz.com", role: "admin", status: "Active", joined: "Jan 2025" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage platform users, roles, and permissions.</p>
      </div>

      {/* Filters */}
      <div className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-secondary/10 border-none focus:ring-2 focus:ring-primary/50 outline-none text-sm"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
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
            {MOCK_USERS.map((u) => (
              <tr key={u.id} className="hover:bg-secondary/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">{u.name}</span>
                    <span className="text-xs text-muted-foreground">{u.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold uppercase
                    ${u.role === 'admin' ? 'bg-red-100 text-red-800' :
                      u.role === 'shopkeeper' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'}
                  `}>
                    {u.role === 'admin' && <Shield size={10} />}
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold
                    ${u.status === 'Active' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {u.status === 'Active' ? <UserCheck size={12} /> : <UserX size={12} />}
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{u.joined}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-secondary/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
