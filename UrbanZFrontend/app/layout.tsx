import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Providers } from "./providers";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/error-boundary";

const Mascot = dynamic(() => import("@/components/mascot"));
const CustomCursor = dynamic(() => import("@/components/ui/custom-cursor"));


const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "UrbanZ | Gen-Z Hyperlocal Marketplace",
  description: "India's first Gen-Z focused hyperlocal fashion marketplace. The freshest fits, hyperlocal and fast. Comfert bhi, Class bhi.",
  openGraph: {
    title: "UrbanZ | Gen-Z Hyperlocal Marketplace",
    description: "India's first Gen-Z focused hyperlocal fashion marketplace. The freshest fits, hyperlocal and fast. Comfert bhi, Class bhi.",
    url: "https://urbanz.in",
    siteName: "UrbanZ",
    images: [
      {
        url: "https://urbanz.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "UrbanZ - Gen-Z Fashion Marketplace",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UrbanZ | Gen-Z Hyperlocal Marketplace",
    description: "India's first Gen-Z focused hyperlocal fashion marketplace.",
    images: ["https://urbanz.in/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(outfit.variable, "font-sans antialiased bg-background text-foreground min-h-screen flex flex-col")}>
        <ErrorBoundary>
          <Providers>
            <CustomCursor />
            <Navbar />

            <main className="flex-grow">
              {children}
            </main>
            <Mascot />
            <Footer />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
