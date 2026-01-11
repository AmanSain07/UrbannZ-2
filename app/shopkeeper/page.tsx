"use client";

import { useState } from "react";
import { Upload, Plus, Package, PenTool, Printer, CheckCircle, XCircle, User as UserIcon } from "lucide-react";
import { useStore, CustomDesign } from "@/lib/store-context";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

export default function ShopkeeperDashboard() {
  const { customDesigns, users } = useStore();

  // Simulation Step: Select which shopkeeper view we are in
  const shopkeepers = users.filter(u => u.role === 'shopkeeper');
  const [currentShopId, setCurrentShopId] = useState(shopkeepers[0]?.id || "");

  const currentShop = users.find(u => u.id === currentShopId);

  // Determine specialty based on email/name (Mock Logic)
  const shopType = currentShop?.email.includes('embroidery') ? 'embroidery'
    : currentShop?.email.includes('pod') ? 'pod'
      : 'all';

  // Filter designs based on shop specialty
  const relevantDesigns = customDesigns.filter(d => {
    if (shopType === 'all') return true;
    return d.type === shopType;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Simulation Control Panel */}
        <div className="bg-yellow-100 border-yellow-300 border p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-yellow-800 font-bold">
            <UserIcon size={20} />
            Viewing Dashboard As:
          </div>
          <select
            className="p-2 rounded-lg border border-yellow-300 bg-white font-medium"
            value={currentShopId}
            onChange={(e) => setCurrentShopId(e.target.value)}
          >
            {shopkeepers.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black">Shopkeeper Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, <span className="text-primary font-bold">{currentShop?.name}</span>.
              {shopType !== 'all' && (
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-xs font-bold uppercase">
                  {shopType === 'embroidery' ? <PenTool size={12} /> : <Printer size={12} />}
                  {shopType} Specialist
                </span>
              )}
            </p>
          </div>
          <button className="px-6 py-3 bg-black text-white rounded-full font-bold flex items-center gap-2 hover:bg-black/80 transition-colors">
            <Plus size={18} /> New Drop
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Custom Requests Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Incoming Custom Requests
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">{relevantDesigns.length}</span>
            </h2>

            {relevantDesigns.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-[2rem] border border-dashed text-muted-foreground">
                No active requests for your specialty yet.
              </div>
            ) : (
              <div className="space-y-4">
                {relevantDesigns.map((design) => (
                  <div key={design.id} className="bg-white p-6 rounded-[2rem] shadow-sm flex gap-6 items-start group hover:shadow-md transition-all">
                    <div className="w-24 h-24 rounded-2xl bg-secondary/10 relative overflow-hidden flex-shrink-0">
                      <Image src={design.designUrl} alt="Design" fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">Request #{design.id}</span>
                          <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${design.type === 'embroidery' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                            {design.type}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{design.date}</span>
                      </div>

                      <div className="bg-secondary/5 p-3 rounded-xl text-sm text-balance mb-4 text-muted-foreground">
                        "{design.notes}"
                      </div>

                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-black text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform">
                          Accept Job
                        </button>
                        <button className="px-4 py-2 border border-border text-foreground rounded-xl text-sm font-bold hover:bg-secondary/10 transition-colors">
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Regular Stats / Inventory (Compressed for Demo) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm">
              <h3 className="font-bold mb-4 text-lg">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-2xl">
                  <div className="text-2xl font-black text-green-700">₹12.5k</div>
                  <div className="text-xs font-bold text-green-600/80">Revenue</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <div className="text-2xl font-black text-blue-700">8</div>
                  <div className="text-xs font-bold text-blue-600/80">Pending</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm">
              <h3 className="font-bold mb-4 text-lg">Inventory Status</h3>
              {/* Placeholder for regular inventory */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/5 mb-2">
                <div className="w-10 h-10 bg-primary/20 rounded-lg"></div>
                <div>
                  <div className="font-bold text-sm">Basic Tee</div>
                  <div className="text-xs text-muted-foreground">Stock: 45</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
