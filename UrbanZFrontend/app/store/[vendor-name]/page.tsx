"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import ProductCard from "@/components/product-card";
import { CheckCircle, Star, Zap, Loader2 } from "lucide-react";
import { fetchStoreDetail } from "@/lib/api";
import { FALLBACK_IMAGE } from "@/lib/utils";

export default function StorePage() {
  const params = useParams();
  const slug = params["vendor-name"] as string;
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storeData = await fetchStoreDetail(slug);
        setStore(storeData);
      } catch (e) {
        console.error("Failed to load store:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>;
  
  if (!store) return <div className="text-center py-20 text-xl font-bold">Store not found</div>;

  const storeProducts = store.products || [];

  return (
    <div className="min-h-screen bg-secondary/5 pb-20">
      {/* Store Banner */}
      <div className="h-64 md:h-80 w-full bg-gradient-to-r from-purple-900 to-indigo-900 relative overflow-hidden">
        <ImageWithFallback 
          src={store.banner || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80"} 
          alt={`${store.store_name} Banner`} 
          fill 
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container px-4 max-w-6xl mx-auto -mt-24 relative z-10">
        <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-xl backdrop-blur-xl mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Store Logo */}
            <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden bg-white shadow-lg shrink-0 flex items-center justify-center text-4xl font-black text-primary">
              {store.logo ? (
                 <img src={store.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                store.store_name?.charAt(0).toUpperCase()
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-3">
              <h1 className="text-4xl font-black capitalize">{store.store_name}</h1>
              <p className="text-muted-foreground max-w-2xl">
                {store.description || "Welcome to our store! We offer the best quality streetwear and premium aesthetics designed just for you."}
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs font-bold border border-blue-500/20">
                  <CheckCircle size={14} /> Verified Seller
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-bold border border-amber-500/20">
                  <Star size={14} className="fill-amber-600" /> Top Rated Seller
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-bold border border-green-500/20">
                  <Zap size={14} className="fill-green-600" /> Fast Shipping
                </span>
              </div>
            </div>

            <div className="text-center md:text-right bg-secondary/10 p-4 rounded-2xl w-full md:w-auto">
              <span className="block text-3xl font-black">{storeProducts.length}</span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Products</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black flex items-center gap-2">
            Store Collection
          </h2>
          
          {storeProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {storeProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-secondary/10 rounded-3xl border border-dashed border-border">
              <p className="text-xl font-bold text-muted-foreground">This store hasn't dropped any fits yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
