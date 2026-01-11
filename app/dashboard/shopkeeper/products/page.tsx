"use client";

import { useStore } from "@/lib/store-context";
import { Plus, Search, Filter, MoreHorizontal, Trash2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

import Image from "next/image";

export default function ShopkeeperProducts() {
  const { products, addProduct, toggleProductStock, deleteProduct } = useStore();
  const [activeActionId, setActiveActionId] = useState<string | number | null>(null);

  const handleAddMockProduct = () => {
    const newProduct = {
      name: "New Product " + Math.floor(Math.random() * 100),
      price: 999,
      category: "clothing",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1503342217505-b0815a046baf?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&q=80"
      ],
      description: "Freshly added mock product",
      tags: [],
      inStock: true,
    };
    // @ts-ignore - mock simplicity
    addProduct(newProduct);
  };

  const toggleActionMenu = (id: string | number) => {
    setActiveActionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6" onClick={() => setActiveActionId(null)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">My Products</h1>
          <p className="text-muted-foreground">Manage your inventory and catalog.</p>
        </div>
        <button
          onClick={handleAddMockProduct}
          className="bg-primary text-white hover:bg-primary/90 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Filters Bar */}
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

      {/* Products Table */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
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
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-secondary/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-lg bg-secondary/10 overflow-hidden relative">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-sm text-foreground">{product.name}</span>
                    </div>
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
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase
                      ${product.inStock !== false ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}
                    `}>
                      {product.inStock !== false ? (
                        <>
                          <CheckCircle2 size={12} /> In Stock
                        </>
                      ) : (
                        <>
                          <XCircle size={12} /> Out of Stock
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <span className="font-medium bg-secondary/20 px-2 py-1 rounded text-xs">{product.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium">
                    ₹{product.price}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleActionMenu(product.id);
                      }}
                      className="p-2 hover:bg-secondary/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {/* Actions Dropdown */}
                    {activeActionId === product.id && (
                      <div className="absolute right-8 top-10 w-48 bg-card border border-border shadow-xl rounded-xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleProductStock(product.id);
                              setActiveActionId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/10 hover:text-foreground rounded-lg transition-colors text-left"
                          >
                            {product.inStock !== false ? <EyeOff size={14} /> : <Eye size={14} />}
                            {product.inStock !== false ? 'Mark Unavailable' : 'Mark Available'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteProduct(product.id);
                              setActiveActionId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors text-left"
                          >
                            <Trash2 size={14} />
                            Delete Product
                          </button>
                        </div>
                      </div>
                    )}
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
