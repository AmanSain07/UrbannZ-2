"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { Plus, Search, Filter, MoreHorizontal, Trash2, Eye, EyeOff, CheckCircle2, XCircle, PackageOpen, Loader2, Pencil } from "lucide-react";
import { FALLBACK_IMAGE } from "@/lib/utils";
import Link from "next/link";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import { fetchMyProducts, deleteProductAPI, toggleProductStockAPI } from "@/lib/api";

type Product = {
  id: number | string;
  name: string;
  price: number;
  category_name?: string;
  image?: string;
  image_url?: string;
  status?: string;
  in_stock?: boolean;
};

export default function ShopkeeperProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeActionId, setActiveActionId] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "in-stock" | "out-of-stock">("all");

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMyProducts();
      const results = data?.results || data || [];
      setProducts(Array.isArray(results) ? results : []);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string | number) => {
    try {
      await deleteProductAPI(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error("Delete error:", e);
    }
    setActiveActionId(null);
  };

  const handleToggleStock = async (id: string | number) => {
    try {
      const res = await toggleProductStockAPI(id);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, in_stock: res.in_stock } : p))
      );
    } catch (e) {
      console.error("Toggle stock error:", e);
    }
    setActiveActionId(null);
  };

  const filtered = useMemo(() =>
    products
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((p) => {
        if (stockFilter === "in-stock") return p.in_stock !== false;
        if (stockFilter === "out-of-stock") return p.in_stock === false;
        return true;
      }),
    [products, searchQuery, stockFilter]
  );

  const inStockCount = products.filter((p) => p.in_stock !== false).length;

  return (
    <div className="space-y-6 pb-20" onClick={() => setActiveActionId(null)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">My Products</h1>
          <p className="text-muted-foreground">Manage your inventory and catalog.</p>
        </div>
        <Link href="/dashboard/shopkeeper/products/add">
          <button className="w-full md:w-auto bg-primary text-white hover:bg-primary/90 px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Plus size={18} /> Add Product
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Catalog", val: products.length, icon: PackageOpen, color: "bg-primary/10 text-primary" },
          { label: "In Stock", val: inStockCount, icon: CheckCircle2, color: "bg-green-500/10 text-green-500" },
          { label: "Out of Stock", val: products.length - inStockCount, icon: XCircle, color: "bg-red-500/10 text-red-500" },
        ].map((s) => (
          <div key={s.label} className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex items-center gap-4">
            <div className={`p-3 ${s.color} rounded-xl`}><s.icon size={24} /></div>
            <div>
              <div className="text-2xl font-black">{s.val}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 flex-shrink-0">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-secondary/10 border-none focus:ring-2 focus:ring-primary/50 outline-none text-sm"
          />
        </div>
        <div className="flex w-full md:w-auto items-center gap-2">
          <Filter className="text-muted-foreground w-4 h-4 hidden md:block" />
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="w-full md:w-auto h-9 px-3 rounded-lg bg-secondary/10 border-none focus:ring-2 focus:ring-primary/50 outline-none text-sm font-medium cursor-pointer"
          >
            <option value="all">All Inventory</option>
            <option value="in-stock">In Stock Only</option>
            <option value="out-of-stock">Out of Stock Only</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto w-full max-w-[100vw]">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-secondary/5 border-b border-border text-xs uppercase text-muted-foreground tracking-wider font-semibold">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Availability</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-muted-foreground">
                      <div className="flex flex-col items-center gap-4">
                        <PackageOpen className="w-12 h-12 opacity-20" />
                        <div>
                          <h3 className="font-bold text-lg text-foreground">No Products Found</h3>
                          <p className="text-sm">{searchQuery ? "Try a different search." : "Add your first product to get started."}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => (
                    <tr key={product.id} className="hover:bg-secondary/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-lg bg-secondary/10 overflow-hidden relative flex-shrink-0">
                            <ImageWithFallback
                              src={product.image || product.image_url || FALLBACK_IMAGE}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <span className="font-bold text-sm text-foreground line-clamp-2">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase
                          ${product.status === "approved" ? "bg-green-100 text-green-800" :
                            product.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"}`}>
                          {product.status || "pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase
                          ${product.in_stock !== false ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}`}>
                          {product.in_stock !== false ? <><CheckCircle2 size={12} /> In Stock</> : <><XCircle size={12} /> Out of Stock</>}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium bg-secondary/20 px-2 py-1 rounded text-xs capitalize whitespace-nowrap">
                          {product.category_name || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium">₹{product.price}</td>
                      <td className="px-6 py-4 text-right relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveActionId((prev) => (prev === product.id ? null : product.id)); }}
                          className="p-2 hover:bg-secondary/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        {activeActionId === product.id && (
                          <div className="absolute right-8 top-10 w-48 bg-card border border-border shadow-xl rounded-xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-1">
                              <Link
                                href={`/dashboard/shopkeeper/products/${product.id}/edit`}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary/10 rounded-lg transition-colors"
                              >
                                <Pencil size={14} /> Edit Product
                              </Link>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleToggleStock(product.id); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/10 hover:text-foreground rounded-lg transition-colors text-left"
                              >
                                {product.in_stock !== false ? <EyeOff size={14} /> : <Eye size={14} />}
                                {product.in_stock !== false ? "Mark Unavailable" : "Mark Available"}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors text-left"
                              >
                                <Trash2 size={14} /> Delete Product
                              </button>
                            </div>

                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
