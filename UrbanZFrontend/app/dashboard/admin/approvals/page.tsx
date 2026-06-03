"use client";

import { useEffect, useState } from "react";
import { fetchVendorApplications, approveVendorApplication, rejectVendorApplication } from "@/lib/api";
import { Clock, CheckCircle, XCircle, Loader2, User, Store, MapPin, Phone } from "lucide-react";

type Application = {
  id: number;
  status: string;
  business_name: string;
  phone: string;
  description: string;
  address: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export default function AdminApprovalsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await fetchVendorApplications();
      const results = data?.results || data || [];
      setApplications(Array.isArray(results) ? results : []);
    } catch {
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: number) => {
    setActionId(id);
    try {
      await approveVendorApplication(id);
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "approved" } : a))
      );
    } catch (e: any) {
      alert(e?.message || "Failed to approve.");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("Reason for rejection (optional):");
    setActionId(id);
    try {
      await rejectVendorApplication(id, reason || undefined);
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "rejected" } : a))
      );
    } catch (e: any) {
      alert(e?.message || "Failed to reject.");
    } finally {
      setActionId(null);
    }
  };

  const filtered = filter === "all" ? applications : applications.filter((a) => a.status === filter);

  const counts = {
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Vendor Approvals</h1>
        <p className="text-muted-foreground">Review and manage vendor applications.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", val: counts.pending, color: "bg-yellow-100 text-yellow-800", icon: Clock },
          { label: "Approved", val: counts.approved, color: "bg-green-100 text-green-800", icon: CheckCircle },
          { label: "Rejected", val: counts.rejected, color: "bg-red-100 text-red-800", icon: XCircle },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className={`p-2 rounded-lg ${s.color}`}><s.icon size={18} /></div>
            <div>
              <p className="text-2xl font-black">{s.val}</p>
              <p className="text-xs font-bold text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors capitalize
              ${filter === f ? "bg-primary text-white" : "bg-secondary/20 text-muted-foreground hover:bg-secondary/40"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-card border border-border/50 rounded-2xl">
          <Store className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <h3 className="font-bold text-lg">No {filter !== "all" ? filter : ""} applications</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div key={app.id} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg">
                      {app.business_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{app.business_name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold capitalize
                        ${app.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          app.status === "approved" ? "bg-green-100 text-green-800" :
                          "bg-red-100 text-red-800"}`}>
                        {app.status === "pending" && <Clock size={10} />}
                        {app.status === "approved" && <CheckCircle size={10} />}
                        {app.status === "rejected" && <XCircle size={10} />}
                        {app.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User size={14} className="flex-shrink-0" />
                      <span>{app.user?.name} — {app.user?.email}</span>
                    </div>
                    {app.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="flex-shrink-0" />
                        <span>{app.phone}</span>
                      </div>
                    )}
                    {app.address && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="flex-shrink-0" />
                        <span>{app.address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="flex-shrink-0" />
                      <span>Applied {app.created_at?.split("T")[0]}</span>
                    </div>
                  </div>

                  {app.description && (
                    <p className="text-sm text-foreground/80 bg-secondary/5 rounded-xl p-3 border border-border/50">
                      {app.description}
                    </p>
                  )}
                </div>

                {app.status === "pending" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(app.id)}
                      disabled={actionId === app.id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {actionId === app.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      disabled={actionId === app.id}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-bold hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      {actionId === app.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
