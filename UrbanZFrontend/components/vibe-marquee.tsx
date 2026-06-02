"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Flame, Crown, DollarSign } from "lucide-react";

const SLOGANS = [
  { text: "Find Your Vibe", icon: Sparkles },
  { text: "Wear Your Vibe", icon: Flame },
  { text: "Yahin Mil Jayega", icon: Zap }, // "You'll find it here"
  { text: "Feels Right", icon: Crown },
  { text: "Fits Budget", icon: DollarSign },
];

export default function VibeMarquee() {
  return (
    <div className="relative flex overflow-hidden py-4 bg-primary text-primary-foreground border-y border-white/10 select-none">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />

      <motion.div
        className="flex gap-16 whitespace-nowrap items-center flex-nowrap"
        animate={{ x: "-50%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20, // Adjust speed here
        }}
      >
        {/* Render the slogans enough times to fill the screen and loop smoothly */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-16 items-center">
            {SLOGANS.map((slogan, index) => (
              <div key={index} className="flex items-center gap-3 text-lg md:text-xl font-bold uppercase tracking-wider">
                <slogan.icon className={`w-5 h-5 ${index % 2 === 0 ? 'text-yellow-300' : 'text-accent'}`} />
                <span>{slogan.text}</span>
              </div>
            ))}
          </div>
        ))}
      </motion.div>

      {/* Shadow overlays for smooth fade effect at edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent opacity-0 md:opacity-100 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent opacity-0 md:opacity-100 pointer-events-none" />
    </div>
  );
}
