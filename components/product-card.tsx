import { memo } from "react";
import Image from "next/image";

import { formatPrice } from "@/lib/utils";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { useParallax } from "@/hooks/use-parallax";


interface ProductCardProps {
  product: {
    id: number | string;
    name: string;
    price: number;
    image: string;
    tags?: string[];
  };
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const parallaxRef = useParallax({ tilt: 10, perspective: 1000 });

  return (
    <Link href={`/product/${product.id}`} className="group cursor-pointer block h-full">
      <div ref={parallaxRef} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary/10 border border-transparent group-hover:border-border/50 transition-all duration-300 mb-4 transform-gpu">

        <div className="w-full h-full relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        </div>
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.tags.map(tag => (
              <span key={tag} className="px-2.5 py-1 bg-background/95 backdrop-blur-md text-foreground shadow-sm text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between">
          <button className="w-full py-3 bg-background/95 text-foreground font-bold text-sm rounded-xl shadow-lg translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2">
            View Details <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="space-y-1 px-1">
        <h3 className="text-base font-medium text-muted-foreground group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-black text-foreground tracking-tight">{formatPrice(product.price)}</p>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded-md">
            <Star className="w-3 h-3 fill-current" /> 4.9
          </div>
        </div>
      </div>
    </Link>
  );
});

export default ProductCard;
