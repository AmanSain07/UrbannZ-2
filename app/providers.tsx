"use client";

import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { StoreProvider } from "@/lib/store-context";
import { ThemeProvider } from "next-themes";
import { CursorProvider } from "@/context/cursor-context";
import { ToastProvider } from "@/components/ui/toast";


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <CursorProvider>
                {children}
              </CursorProvider>
            </ThemeProvider>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </StoreProvider>
  );
}
