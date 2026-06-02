"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

type FilterSectionProps = {
  title: string;
  options: string[];
  selected: string[];
  onChange: (value: string) => void;
};

function FilterSection({ title, options, selected, onChange }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-border/50 py-4 last:border-0">
      <button
        className="flex items-center justify-between w-full font-bold text-sm mb-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="space-y-2 mt-2">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onChange(option)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

const FILTERS = {
  gender: ["Men", "Women", "Kids", "Unisex"],
  // season: ["Summer", "Winter", "Monsoon", "Festive"],
  occasion: ["Daily", "Casual", "Party", "Office", "Gym", "Wedding"],
  style: ["Street Style", "Vintage", "Minimal", "Luxury"],
  // size: ["XS", "S", "M", "L", "XL", "XXL"], 
  price: ["Under ₹499", "₹500 - ₹999", "₹1000 - ₹1999", "Premium"],
};

export default function ProductFilter({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    gender: [],
    occasion: [],
    style: [],
    price: [],
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync state with URL on mount/update
  useEffect(() => {
    const newFilters: Record<string, string[]> = {
      gender: [], size: [], price: [] // Add others if needed
    };

    searchParams.forEach((value, key) => {
      if (key in newFilters) {
        newFilters[key] = value.split(',');
      }
    });
    // Also handle category which might be a single string in params but not part of checkbox filters directly here,
    // usually category is a main nav thing, but if we want to filter by it here we can.
    // For now keeping scope to side filters.

    setSelectedFilters(prev => ({ ...prev, ...newFilters }));
  }, [searchParams]);

  const updateURL = (filters: Record<string, string[]>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      } else {
        params.delete(key);
      }
    });

    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const toggleFilter = (category: string, value: string) => {
    const current = selectedFilters[category] || [];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    const newFilters = { ...selectedFilters, [category]: updated };
    setSelectedFilters(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    setSelectedFilters({ gender: [], size: [], price: [] });
    router.push('/shop');
  };

  const FilterContent = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-lg">Filters</h3>
        <button
          onClick={() => {
            setSelectedFilters({ price: [] }); // Reset only active filters
            router.push('/shop');
          }}
          className="text-xs text-primary font-bold hover:underline"
        >
          Reset
        </button>
      </div>

      {Object.entries(FILTERS).map(([key, options]) => (
        <FilterSection
          key={key}
          title={key.charAt(0).toUpperCase() + key.slice(1)}
          options={options}
          selected={selectedFilters[key]}
          onChange={(value) => toggleFilter(key, value)}
        />
      ))}
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full font-bold text-sm mb-4 w-fit"
      >
        <Filter size={16} /> Filters
      </button>

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:block w-64 flex-shrink-0 p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border h-fit", className)}>
        <FilterContent />
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-background border-l border-border z-50 p-6 overflow-y-auto md:hidden shadow-2xl"
            >
              <button onClick={() => setIsMobileOpen(false)} className="absolute top-4 right-4 p-2">
                <X size={24} />
              </button>
              <div className="mt-8">
                <FilterContent />
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-full py-3 bg-primary text-white font-bold rounded-xl mt-8"
              >
                Show Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
