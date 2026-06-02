"use client";

import { useStore } from "@/lib/store-context";
import { Check, X, Search, Filter } from "lucide-react";
import Image from "next/image";

export default function AdminProductsPage() {
  const { products, updateProductStatus } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">All Products</h1>
          <p className="text-muted-foreground">Approve or reject products from shopkeepers.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-secondary/10 border-none focus:ring-2 focus:ring-primary/50 outline-none text-sm"
          />
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/5 border-b border-border text-xs uppercase text-muted-foreground tracking-wider font-semibold">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Shopkeeper</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-lg bg-secondary/10 overflow-hidden relative">
                        <Image src={Array.isArray(product.image) ? (product.image[0] || "/placeholder.png") : (product.image || "/placeholder.png")} alt="" fill className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-sm text-foreground">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {product.sellerId || "Shopkeeper"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase
                       ${product.status === 'approved' ? 'bg-green-100 text-green-800' :
                        product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }
                    `}>
                      {product.status || 'approved'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium">
                    ₹{product.price}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {product.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => updateProductStatus(product.id, 'approved')}
                            className="p-1 px-3 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors flex items-center gap-1"
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button
                            onClick={() => updateProductStatus(product.id, 'rejected')}
                            className="p-1 px-3 bg-red-100 text-red-600 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors flex items-center gap-1"
                          >
                            <X size={14} /> Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium">No actions</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
