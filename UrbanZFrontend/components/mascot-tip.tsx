"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";

interface MascotTipProps {
  message: string;
  type?: "tip" | "warning" | "hype";
}

export default function MascotTip({ message, type = "tip" }: MascotTipProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const bgColors = {
    tip: "bg-blue-100 border-blue-200 text-blue-800",
    warning: "bg-yellow-100 border-yellow-200 text-yellow-800",
    hype: "bg-purple-100 border-purple-200 text-purple-800"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 ${bgColors[type]} shadow-sm`}
    >
      <div className="relative w-12 h-12 flex-shrink-0">
        <Image
          src="/mascot.png"
          alt="Mascot"
          fill
          className="object-contain drop-shadow-md hover:scale-110 transition-transform"
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold leading-tight">{message}</p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="p-1 hover:bg-black/5 rounded-full transition-colors"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
