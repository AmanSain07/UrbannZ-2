"use client";

import React, { useRef } from "react";
import ProductCard from "./product-card";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductRowProps {
  title: string;
  products: any[];
  viewAllLink?: string;
  className?: string;
}

export default function ProductRow({ title, products, viewAllLink = "/shop", className = "" }: ProductRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className={`py-12 ${className}`}>
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">{title}</h2>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-2">
              <button
                onClick={scrollLeft}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            {viewAllLink && (
              <Link href={viewAllLink} className="text-sm font-bold hover:underline flex items-center gap-1 text-primary">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        <div className="relative group">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {products.map((product) => (
              <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
            <div className="min-w-[100px] flex items-center justify-center snap-start">
              <Link href={viewAllLink || "/shop"} className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group/view">
                <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center group-hover/view:bg-primary group-hover/view:text-white group-hover/view:border-primary transition-all">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm">View All</span>
              </Link>
            </div>
          </div>

          {/* Mobile Swipe Hint */}
          <p className="md:hidden text-xs text-center text-muted-foreground font-medium mt-2 flex items-center justify-center gap-2">
            Swipe to explore <ArrowRight className="w-3 h-3" />
          </p>
        </div>
      </div>
    </div>
  );
}
