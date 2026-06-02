
"use client";

import { useMemo } from "react"; // Added useMemo
import Hero from "@/components/hero";
// import CategoryGrid from "@/components/category-grid"; // Removed static import
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import ProductSlider from "@/components/product-slider";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store-context";
import Image from "next/image";
import ImageWithFallback from "@/components/ui/image-with-fallback";

const Mascot = dynamic(() => import("@/components/mascot"), { ssr: false });
const CategoryGrid = dynamic(() => import("@/components/category-grid"), { // Added dynamic import
  loading: () => <div className="h-96 w-full animate-pulse bg-muted/20" />
});

export default function Home() {
  const { products } = useStore();

  // Memoize all product filters
  const { trendingProducts, newArrivals, vintageCollection, casualWear, bestSellers, under499 } = useMemo(() => {
    // Filter only approved products
    const activeProducts = products.filter(p => p.status === 'approved');

    return {
      trendingProducts: activeProducts.filter((p) => p.tags && p.tags.includes("Hot")).slice(0, 6),
      newArrivals: activeProducts.filter((p) => p.tags && p.tags.includes("New")).slice(0, 6),
      vintageCollection: activeProducts.filter(p => p.tags?.includes('Vintage')),
      casualWear: activeProducts.filter(p => !p.tags?.includes('Vintage') && p.price < 2000).slice(0, 6),
      bestSellers: activeProducts.filter((p) => p.tags && p.tags.includes("Bestseller")).slice(0, 6),
      under499: activeProducts.filter((p) => p.price < 999).slice(0, 6),
    };
  }, [products]);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Product Row 1: Trending - Immediately visible after Hero */}
      <div className="bg-gradient-to-b from-transparent to-secondary/5 pb-10">
        <div className="container px-4 md:px-0">
          <ProductSlider title="Trending Now 🔥" products={trendingProducts} />
        </div>
      </div>

      <CategoryGrid />

      {/* Product Row 2: New Arrivals */}
      <div className="py-10 bg-secondary/5">
        <div className="container px-4 md:px-0">
          <ProductSlider title="Fresh Drops 💧" products={newArrivals} />
        </div>
      </div>

      {/* Curated Collections / Highlight */}
      <section className="py-20 relative overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-2 mb-8">
            <h2 className="text-3xl font-black">Curated Zones</h2>
            <Sparkles className="w-6 h-6 text-yellow-400 fill-current animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/shop?tag=Vintage" className="relative h-[400px] rounded-[2rem] overflow-hidden group cursor-pointer block">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80"
                alt="Vintage Edit"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-8 left-8 text-white">
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-3 inline-block border border-white/20">Vintage Edit</span>
                <h3 className="text-4xl font-black mb-2">Retro Rewind</h3>
                <p className="font-medium text-white/90 text-lg">Classics never die.</p>
              </div>
            </Link>
            <Link href="/custom" className="relative h-[400px] rounded-[2rem] overflow-hidden group cursor-pointer block">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?auto=format&fit=crop&q=80"
                alt="Custom Custom"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent group-hover:from-purple-900/80 transition-colors" />
              <div className="absolute bottom-8 left-8 text-white">
                <span className="bg-purple-500/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-3 inline-block shadow-lg">Create Your Own</span>
                <h3 className="text-4xl font-black mb-2">Custom Drip</h3>
                <p className="font-medium text-white/90 text-lg">Design it. Own it.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Pro Tip: New Section - Street Style Grid */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-black mb-8 flex items-center gap-2">
            Street Style Inspo 📸 <span className="text-sm font-normal text-muted-foreground ml-2">#UrbanZFits</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px]">
            <div className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group">
              <ImageWithFallback src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80" alt="Street 1" fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="relative rounded-3xl overflow-hidden group">
              <ImageWithFallback src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80" alt="Street 2" fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
            <div className="relative rounded-3xl overflow-hidden group">
              <ImageWithFallback src="https://images.unsplash.com/photo-1529139574466-a302d2d3f9c4?auto=format&fit=crop&q=80" alt="Street 3" fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
            <div className="relative rounded-3xl overflow-hidden group">
              <ImageWithFallback src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80" alt="Street 4" fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
            <div className="relative rounded-3xl overflow-hidden group">
              <ImageWithFallback src="https://images.unsplash.com/photo-1503342217505-b0815a046baf?auto=format&fit=crop&q=80" alt="Street 5" fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
          </div>
        </div>
      </section>

      {/* Product Row 3: Vintage Edit */}
      {vintageCollection.length > 0 && (
        <div className="container px-4 md:px-0 py-10">
          <ProductSlider title="Vintage Edit 📼" products={vintageCollection} />
        </div>
      )}

      {/* Pro Tip: New Section - Brand Spotlight */}
      <section className="py-10">
        <div className="container px-4 md:px-0">
          <div className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden">
            <ImageWithFallback src="https://images.unsplash.com/photo-1536766820879-059fec98ec0a?auto=format&fit=crop&q=80" alt="Spotlight" fill className="object-cover" priority={false} sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent flex items-center p-12">
              <div className="max-w-xl text-white">
                <span className="bg-red-600 text-white font-bold px-4 py-1 rounded-full text-xs uppercase tracking-widest mb-4 inline-block">Brand Spotlight</span>
                <h2 className="text-5xl md:text-7xl font-black mb-6 leading-none">NEON<br />KNIGHTS</h2>
                <p className="text-xl text-white/90 mb-8 max-w-sm">The cyber-streetwear collection that glows in the dark. Limited stock only.</p>
                <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">Shop The Collection</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pro Tip: New Section - Editors' Picks */}
      <div className="py-10 bg-secondary/5">
        <div className="container px-4 md:px-0">
          <ProductSlider title="Editors' Picks 🏆" products={bestSellers} />
        </div>
      </div>

      {/* Product Row 4: Casual Wear */}
      <div className="py-10">
        <div className="container px-4 md:px-0">
          <ProductSlider title="Casual & Comfy ☁️" products={casualWear} />
        </div>
      </div>

      {/* Product Row 5: Under 499 */}
      {under499.length > 0 && (
        <div className="container px-4 md:px-0 py-10 bg-secondary/5">
          <ProductSlider title="Steals Under ₹499 💸" products={under499} />
        </div>
      )}

      {/* Newsletter / Vibe Check */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="rounded-[3rem] bg-gradient-to-br from-primary via-purple-600 to-accent p-10 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />

            {/* Mascot Integration in Newsletter */}
            <div className="absolute -right-10 bottom-0 hidden lg:block opacity-90 hover:scale-110 transition-transform duration-500">
              <Image src="/mascot.png" alt="Mascot" width={256} height={256} className="w-64 drop-shadow-2xl rotate-[-10deg]" />
            </div>

            <h2 className="text-3xl md:text-6xl font-black mb-6 relative z-10 tracking-tight">Don't Miss the Drop</h2>
            <p className="max-w-xl mx-auto text-lg md:text-xl font-medium mb-10 text-white/90 relative z-10">
              Sign up for exclusive access to limited editions and secret sales. No spam, just vibes.
            </p>

            <form className="max-w-md mx-auto relative z-10 flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-8 py-4 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white shadow-inner"
              />
              <button className="px-8 py-4 rounded-full bg-white text-primary font-bold hover:scale-105 transition-transform shadow-lg hover:shadow-xl">
                Join
              </button>
            </form>
          </div>
        </div>
      </section>

      <Mascot />
    </div>
  );
}
