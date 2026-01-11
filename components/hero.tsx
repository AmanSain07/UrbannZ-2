"use client";

import { useState, useEffect } from "react";
import DemoImage from "./demo-image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { products } from "@/lib/data";

import Image from "next/image";

const HERO_SLIDES = [
  {
    id: 1,
    tag: "✨ Gen-Z's Favorite Marketplace",
    title: (
      <>
        Comfert भी, <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
          Class भी.
        </span>
      </>
    ),
    subtitle: "Perfect Trends, Sirf Aapke Liye. From local drops to your own custom designs.",
    cta: "Explore Trends",
    ctaLink: "/shop",
    imageText: "Featured",
    productName: "Urban Oversized Tee",
    price: "₹999",
    tags: ["NEW DROP", "HOT"],
    color: "from-primary/5 via-background",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    tag: "🎨 Express Yourself",
    title: (
      <>
        Your Vibe, <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-pink-500 to-primary">
          Your Design.
        </span>
      </>
    ),
    subtitle: "Customize your fits with our AI design tool. Be unique, be you.",
    cta: "Start Designing",
    ctaLink: "/custom",
    imageText: "Custom",
    productName: "Custom Hoodie",
    price: "₹1,499",
    tags: ["CUSTOM", "AI"],
    color: "from-secondary/5 via-background",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    tag: "⚡ Lightning Fast",
    title: (
      <>
        Order Now, <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500">
          Wear Tonight.
        </span>
      </>
    ),
    subtitle: "Hyperlocal delivery means no waiting. Get your drip in hours.",
    cta: "Shop Now",
    ctaLink: "/shop",
    imageText: "Fast",
    productName: "Speedy Sneakers",
    price: "₹2,999",
    tags: ["1 HR DELIVERY", "FAST"],
    color: "from-orange-500/5 via-background",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99183646?auto=format&fit=crop&q=80"
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Gradients */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 bg-gradient-to-b ${slide.color} to-background z-0`}
        />
      </AnimatePresence>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="container px-4 md:px-6 z-10 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 text-sm font-semibold text-primary">
                {slide.tag}
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter loading-none mb-4">
                {slide.title}
              </h1>
              <p className="text-lg text-muted-foreground max-w-md text-balance mb-8">
                {slide.subtitle}
              </p>

              <div className="flex gap-4">
                <Link href={slide.ctaLink}>
                  <button className="px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-primary/25">
                    {slide.cta} <ArrowRight size={20} />
                  </button>
                </Link>
                {slide.id === 1 && (
                  <Link href="/custom">
                    <button className="px-8 py-4 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-white/20 font-bold text-lg hover:bg-white/80 dark:hover:bg-white/20 transition-colors">
                      Design Your Own
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          <div className="flex gap-2 mt-8">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? "w-8 bg-primary" : "w-2 bg-primary/20"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Featured Product Card / Carousel Placeholder */}
        <div className="relative hidden md:flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: -5 }}
              transition={{ duration: 0.5 }}
              className="relative w-80 h-[500px] rounded-3xl overflow-hidden glass hover:rotate-2 transition-transform duration-500 cursor-pointer group shadow-2xl"
            >
              {/* Image */}
              <Image
                src={slide.image}
                alt={slide.productName}
                fill
                priority={slide.id === 1}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />

              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h3 className="text-2xl font-bold">{slide.productName}</h3>
                <p className="text-accent font-medium mt-1">{slide.price}</p>
              </div>

              {/* Floating Tags */}
              {slide.tags.map((tag, i) => (
                <div key={tag} className={`absolute top-4 ${i === 0 ? "right-4" : "right-24"} bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/10`}>
                  {tag}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Decorative Elements */}
          <div className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 bg-secondary rounded-full blur-2xl opacity-50" />
          <div className="absolute -z-10 top-10 -left-10 w-40 h-40 bg-accent rounded-full blur-2xl opacity-50" />
        </div>
      </div>
    </section>
  );
}
