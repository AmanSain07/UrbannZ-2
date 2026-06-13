"use client";

import { useState, useEffect, Suspense } from "react";
import ProductFilter from "@/components/product-filter";
import ProductCard from "@/components/product-card";
import { useStore } from "@/lib/store-context";
import { Loader2 } from "lucide-react";

import { useSearchParams } from "next/navigation";

function ShopContent() {
  const { products: allProducts } = useStore();
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  // Get values using the hook
  const category = searchParams.get('category');
  const price = searchParams.get('price');
  const sortParam = searchParams.get('sort');
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');

  useEffect(() => {
    // Simulate network delay for realism
    setLoading(true);

    // Filter for approved items first
    let result = allProducts.filter(p => p.status === 'approved');

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // 1. Filter by Category — backend returns category_name on products
    if (category) {
      result = result.filter(p =>
        (p as any).category_name?.toLowerCase() === category.toLowerCase() ||
        (p as any).category?.toLowerCase() === category.toLowerCase()
      );
    }

    // 2. Filter by Tag (e.g. Vintage)
    if (tag) {
      result = result.filter(p => p.tags?.some(t => t.toLowerCase() === tag.toLowerCase()));
    }

    // 3. Filter by Price Range
    if (price) {
      const priceFilters = price.split(',');
      result = result.filter(p => {
        return priceFilters.some(filter => {
          if (filter === "Under ₹499") return p.price < 499;
          if (filter === "₹500 - ₹999") return p.price >= 500 && p.price <= 999;
          if (filter === "₹1000 - ₹1999") return p.price >= 1000 && p.price <= 1999;
          if (filter === "Premium") return p.price >= 2000;
          if (filter === "under-499") return p.price < 499;
          return false;
        });
      });
    }

    // 4. Extended Filters (Gender, Occasion, Style, Size)
    // Note: We check if the property exists or if tags contain the value for flexibility
    const extraFilters = ['gender', 'occasion', 'style', 'size'];
    extraFilters.forEach(key => {
      const paramVal = searchParams.get(key);
      if (paramVal) {
        const values = paramVal.split(',').map(v => v.toLowerCase());
        result = result.filter(p => {
          // Check explicit property if exists (cast to any for index access)
          if ((p as any)[key] && values.includes((p as any)[key].toLowerCase())) return true;
          // Check tags
          if (p.tags && p.tags.some(t => values.includes(t.toLowerCase()))) return true;
          // Check category as fallback for gender
          if (key === 'gender' && values.includes('unisex')) return true;
          return false;
        });
      }
    });

    // 5. Sorting
    if (sortParam) {
      if (sortParam === 'new') result.sort((a, b) => Number(b.id) - Number(a.id));
      if (sortParam === 'trending') result = result.filter(p => p.tags?.includes('Hot') || p.tags?.includes('Trending'));
      if (sortParam === 'price_asc') result.sort((a, b) => a.price - b.price);
      if (sortParam === 'price_desc') result.sort((a, b) => b.price - a.price);
    }

    // Special case for 'price_max' query param from View All links
    const priceMax = searchParams.get('price_max');
    if (priceMax) {
      result = result.filter(p => p.price < Number(priceMax));
    }

    setFilteredProducts(result);
    setLoading(false);
  }, [category, price, sortParam, tag, search, allProducts, searchParams]);

  return (
    <div className="container px-4 md:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tighter mb-2">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : tag ? tag : 'All Drops'}
        </h1>
        <p className="text-muted-foreground">Fresh fits for the season.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <ProductFilter />

        <div className="flex-1">
          {loading ? (
            <div className="h-64 flex items-center justify-center w-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-secondary/10 rounded-3xl">
              <p className="text-xl font-bold text-muted-foreground">No fits found here.</p>
              <button
                onClick={() => window.location.href = '/shop'}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
