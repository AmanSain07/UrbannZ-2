"use client";

import { PenTool, Check, X } from "lucide-react";

export default function CustomRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Custom Requests</h1>
        <p className="text-muted-foreground">Approve or reject custom design submissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="h-48 bg-secondary/10 flex items-center justify-center text-muted-foreground">
              [Preview Image Placeholder]
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">Custom Hoodie #{100 + i}</h3>
                  <p className="text-sm text-muted-foreground">by User_882</p>
                </div>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">New</span>
              </div>
              <p className="text-sm mb-6">Request details: "Make the logo bigger and add neon outlines."</p>

              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                  <Check size={16} /> Approve
                </button>
                <button className="flex-1 py-2 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200 transition-colors flex items-center justify-center gap-2">
                  <X size={16} /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
