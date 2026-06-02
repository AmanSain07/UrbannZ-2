"use client";

import { useStore } from "@/lib/store-context";
import ProductCard from "@/components/product-card";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useStore();

  return (
    <div className="container px-4 py-10 max-w-6xl mx-auto min-h-screen mb-[200px]">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-500/10 rounded-full">
          <Heart className="w-6 h-6 text-red-500 fill-current" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">My Wishlist</h1>
          <p className="text-muted-foreground">{wishlist.length} items saved for later</p>
        </div>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                title="Remove from Wishlist"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 flex flex-col items-center justify-center bg-secondary/5 rounded-3xl border border-dashed border-border">
          <Heart className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8 text-balance max-w-md">
            Save items you love here. Review them anytime and move them to your bag.
          </p>
          <Link href="/shop">
            <button className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-transform shadow-lg">
              Start Shopping
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
