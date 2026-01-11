"use client";

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Mascot() {
  const pathname = usePathname();

  // Don't show the floating mascot on login pages (they have their own embedded version)
  if (pathname === "/login" || pathname === "/internal/admin") {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:block group">
      <div className="relative">
        {/* Chat Bubble on Hover */}
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-popover text-popover-foreground text-xs font-bold p-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-border">
          Welcome to UrbanZ! 😺
          <div className="absolute -bottom-1 right-8 w-2 h-2 bg-popover border-r border-b border-border rotate-45"></div>
        </div>

        <Image
          src="/mascot.png"
          alt="UrbanZ Mascot"
          width={96}
          height={96}
          className="w-24 h-24 object-contain drop-shadow-2xl hover:scale-110 transition-transform cursor-pointer"
          onClick={() => alert("Need help? Check out our Help Center!")}
        />
      </div>
    </div>
  );
}
