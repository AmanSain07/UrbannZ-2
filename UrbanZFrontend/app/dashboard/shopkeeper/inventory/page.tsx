"use client";

import { useEffect, useState } from "react";
import { fetchMyProducts, updateProductAPI } from "@/lib/api";
import { Loader2, Search, AlertTriangle, Package, CheckCircle2, XCircle, Save } from "lucide-react";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import { FALLBACK_IMAGE } from "@/lib/utils";

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchMyProducts();
      setProducts(data?.results || data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (id: number, newStock: number) => {
    setSavingId(id);
    try {
      await updateProductAPI(id, { stock_quantity: newStock, in_stock: newStock > 0 });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock_quantity: newStock, in_stock: newStock > 0 } : p))
      );
    } catch (e) {
      console.error("Failed to update stock", e);
    } finally {
      setSavingId(null);
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const lowStockThreshold = 10;
  const outOfStockCount = products.filter(p => p.stock_quantity === 0 || p.in_stock === false).length;
  const lowStockCount = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= lowStockThreshold).length;

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground">Quickly update your stock levels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Package size={24} /></div>
          <div><div className="text-2xl font-black">{products.length}</div><div className="text-xs font-bold text-muted-foreground uppercase">Total SKUs</div></div>
        </div>
        <div className="bg-card p-4 rounded-2xl border border-orange-500/30 bg-orange-500/5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-500/20 text-orange-500 rounded-xl"><AlertTriangle size={24} /></div>
          <div><div className="text-2xl font-black text-orange-600">{lowStockCount}</div><div className="text-xs font-bold text-orange-600/70 uppercase">Low Stock (≤{lowStockThreshold})</div></div>
        </div>
        <div className="bg-card p-4 rounded-2xl border border-red-500/30 bg-red-500/5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-500/20 text-red-500 rounded-xl"><XCircle size={24} /></div>
          <div><div className="text-2xl font-black text-red-600">{outOfStockCount}</div><div className="text-xs font-bold text-red-600/70 uppercase">Out of Stock</div></div>
        </div>
      </div>

      <div className="bg-card p-4 rounded-2xl border border-border/50 flex items-center shadow-sm">
        <Search className="w-5 h-5 text-muted-foreground ml-2 mr-3" />
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search inventory..." 
          className="w-full bg-transparent border-none outline-none focus:ring-0 text-sm font-medium" 
        />
      </div>

      <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-secondary/5 border-b border-border/50 text-xs uppercase font-semibold text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map(product => {
                const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= lowStockThreshold;
                const isOutOfStock = product.stock_quantity === 0 || product.in_stock === false;
                
                return (
                  <tr key={product.id} className="hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded overflow-hidden relative bg-secondary/10 shrink-0">
                          <ImageWithFallback src={product.image || product.image_url || FALLBACK_IMAGE} alt={product.name} fill className="object-cover" />
                        </div>
                        <span className="font-bold text-sm line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-md"><XCircle size={12}/> Out of Stock</span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md"><AlertTriangle size={12}/> Low Stock</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-md"><CheckCircle2 size={12}/> In Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold">
                      {product.stock_quantity || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          min="0"
                          defaultValue={product.stock_quantity || 0}
                          onBlur={(e) => {
                            if (parseInt(e.target.value) !== product.stock_quantity) {
                              handleStockUpdate(product.id, parseInt(e.target.value));
                            }
                          }}
                          className="w-20 px-2 py-1 bg-secondary/10 border border-border/50 rounded-md font-mono text-sm outline-none focus:border-primary"
                        />
                        {savingId === product.id && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
