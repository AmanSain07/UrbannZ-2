"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, LogOut, LayoutDashboard, UserCircle, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { User as UserType } from "@/lib/auth-context";

interface UserDropdownProps {
  user: UserType;
  onLogoutClick: () => void;
}

export default function UserDropdown({ user, onLogoutClick }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDashboardLink = () => {
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "shopkeeper") return "/dashboard/shopkeeper";
    return "/dashboard/customer";
  };

  const userInitials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const avatarSrc = user.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}${user.avatar}`
    : null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full size-10 flex items-center justify-center hover:bg-secondary/20 transition-all border-2 border-transparent hover:border-border relative active:scale-95 overflow-hidden"
      >
        {avatarSrc ? (
          <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary text-white flex items-center justify-center text-xs font-bold">
            {userInitials}
          </div>
        )}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background"></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-64 bg-background border border-border/50 rounded-2xl shadow-xl shadow-black/10 overflow-hidden z-50 backdrop-blur-xl"
          >
            {/* Header info */}
            <div className="p-4 border-b border-border/50 bg-secondary/10">
              <p className="font-bold text-sm truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate font-medium">{user.email}</p>
              <div className="mt-2 inline-flex text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {user.role} Account
              </div>
            </div>

            {/* Links */}
            <div className="p-2 space-y-1">
              <Link href="/profile" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/30 transition-colors text-sm font-semibold cursor-pointer group">
                  <UserCircle size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  My Profile
                </div>
              </Link>
              
              <Link href={getDashboardLink()} onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/30 transition-colors text-sm font-semibold cursor-pointer group">
                  <LayoutDashboard size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  Dashboard
                </div>
              </Link>

              {user.role === 'customer' && (
                <Link href="/dashboard/customer" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/30 transition-colors text-sm font-semibold cursor-pointer group">
                    <Settings size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    Orders & Settings
                  </div>
                </Link>
              )}

              <div className="my-1 border-t border-border/50"></div>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogoutClick();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 transition-colors text-sm font-bold cursor-pointer"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
