"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";


import Link from "next/link";
import { ShoppingBag, Search, Menu, Heart, User, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "./theme-toggle";

import MagneticButton from "./ui/magnetic-button";
import dynamic from "next/dynamic";

const LogoutModal = dynamic(() => import("./logout-modal"), { ssr: false });


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { items } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const showBackButton = pathname !== "/";
  const cartIconRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMounted(true);
    if (items.length > 0 && cartIconRef.current) {
      gsap.fromTo(cartIconRef.current,
        { scale: 1 },
        { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" }
      );
    }
  }, [items.length]);


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md dark:bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              U
            </div>
            <span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              UrbanZ
            </span>
          </Link>

          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-secondary/20 transition-colors"
              title="Go Back"
            >
              <ArrowLeft className="text-muted-foreground w-5 h-5" />
            </button>
          )}

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground ml-4">
            <MagneticButton>
              <Link href="/" className="hover:text-primary transition-colors hover:font-bold">
                Home
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="/shop" className="hover:text-primary transition-colors hover:font-bold">
                New Drops
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="/shop?category=clothing" className="hover:text-primary transition-colors hover:font-bold">
                Clothing
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="/shop?category=custom" className="hover:text-primary transition-colors hover:font-bold">
                Custom
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="/help" className="hover:text-primary transition-colors hover:font-bold">
                Help
              </Link>
            </MagneticButton>
          </nav>

        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search fits... Yahin Mil Jayega"
              className="h-9 w-64 rounded-full border border-input bg-secondary/20 px-9 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/70"
            />
          </div>

          <ThemeToggle />

          <MagneticButton>
            <Link href="/wishlist">
              <button className="rounded-full size-9 flex items-center justify-center hover:bg-secondary/20 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
            </Link>
          </MagneticButton>


          <MagneticButton>
            <Link href="/cart">
              <button ref={cartIconRef} className="relative rounded-full size-9 flex items-center justify-center hover:bg-secondary/20 transition-colors">
                <ShoppingBag className="h-5 w-5" />

                {isMounted && items.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                    {items.length}
                  </span>
                )}
              </button>
            </Link>
          </MagneticButton>


          <div className="flex items-center gap-2">
            <MagneticButton>
              <Link href={user ? "/dashboard" : "/login"}>
                <button className="rounded-full size-9 flex items-center justify-center hover:bg-secondary/20 transition-colors relative">
                  <User className="h-5 w-5" />
                  {user && (
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-white"></span>
                  )}
                </button>
              </Link>
            </MagneticButton>

            {user && (
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="hidden md:block text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 py-1.5 rounded-full border border-red-100 dark:border-red-900 transition-colors"
              >
                Logout
              </button>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t p-4 space-y-4 bg-background/95 backdrop-blur-sm"
        >
          <nav className="flex flex-col gap-4 text-sm font-medium">
            <Link href="/" className="text-foreground" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/shop" className="text-foreground" onClick={() => setIsOpen(false)}>New Drops</Link>
            <Link href="/shop?category=clothing" className="text-foreground" onClick={() => setIsOpen(false)}>Clothing</Link>
            <Link href="/custom" className="text-foreground" onClick={() => setIsOpen(false)}>Custom</Link>
            <Link href="/help" className="text-foreground" onClick={() => setIsOpen(false)}>Help</Link>
            {user && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsLogoutModalOpen(true);
                }}
                className="text-left text-red-500 font-bold"
              >
                Logout
              </button>
            )}
          </nav>
        </motion.div>
      )}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          logout();
          setIsLogoutModalOpen(false);
        }}
      />
    </header>
  );
}
