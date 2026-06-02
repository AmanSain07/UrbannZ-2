"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DemoImageProps {
  text?: string;
  className?: string;
  textSize?: "sm" | "md" | "lg" | "xl";
}

export default function DemoImage({ text = "Demo", className, textSize = "lg" }: DemoImageProps) {
  const textSizes = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-xl",
    xl: "text-3xl",
  };

  return (
    <div className={cn(
      "w-full h-full bg-secondary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center overflow-hidden relative group",
      className
    )}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent group-hover:opacity-20 transition-opacity duration-500" />

      {/* Frame Corners */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/40" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/40" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/40" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/40" />

      {/* Text Content */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="z-10 text-center"
      >
        <span className={cn(
          "font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors",
          textSizes[textSize]
        )}>
          {text}
        </span>
      </motion.div>
    </div>
  );
}
