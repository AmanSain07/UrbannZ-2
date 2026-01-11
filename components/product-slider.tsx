"use client";

import { motion } from "framer-motion";
import ProductCard from "./product-card";
import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductSliderProps {
  title: string;
  products: any[];
}

export default function ProductSlider({ title, products }: ProductSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (sliderRef.current) {
      setWidth(sliderRef.current.scrollWidth - sliderRef.current.offsetWidth);
    }
  }, [products]);

  return (
    <div className="space-y-4 py-6">
      <div className="flex items-center justify-between px-4 md:px-0">
        <h2 className="text-xl md:text-2xl font-black tracking-tight">{title}</h2>
        <div className="flex gap-2">
          {/* Navigation buttons could go here for desktop */}
        </div>
      </div>

      <motion.div
        ref={sliderRef}
        className="cursor-grab overflow-hidden px-4 md:px-0"
        whileTap={{ cursor: "grabbing" }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          className="flex gap-4"
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[160px] md:min-w-[220px] max-w-[160px] md:max-w-[220px]">
              <ProductCard product={product} />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
