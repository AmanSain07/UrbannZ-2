import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/data";

export default function CategoryGrid() {
  return (
    <section className="py-20 relative">
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-4xl font-black tracking-tighter">
            Shop by <span className="text-secondary">Vibe</span>
          </h2>
          <Link href="/shop" className="text-sm font-bold hover:underline flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative group cursor-pointer"
            >
              <Link href={`/shop?category=${cat.id}`}>
                <div className={cn(
                  "h-64 rounded-2xl overflow-hidden relative transition-all duration-500 hover:scale-[1.02] shadow-md border border-white/10",
                  cat.color // Fallback color
                )}>
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />

                  {/* Gradient overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />

                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="inline-block px-4 py-2 rounded-full bg-card/90 text-card-foreground text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm">
                      {cat.name}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                    <div className="w-10 h-10 rounded-full bg-card text-card-foreground flex items-center justify-center shadow-lg">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
