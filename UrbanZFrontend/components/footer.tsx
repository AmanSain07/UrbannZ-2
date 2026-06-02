"use client";

import Link from "next/link";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="bg-secondary/5 border-t border-border pt-16 pb-8 dark:bg-card">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                U
              </div>
              <span className="text-xl font-bold tracking-tighter">UrbanZ</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              India's first Gen-Z focused hyperlocal fashion marketplace.
              Comfert bhi, Class bhi.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-secondary/10 hover:bg-primary hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-secondary/10 hover:bg-primary hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-secondary/10 hover:bg-primary hover:text-white transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Shop</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/shop?sort=new" className="hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop?sort=trending" className="hover:text-primary transition-colors">Trending</Link></li>
              <li><Link href="/shop?category=clothing" className="hover:text-primary transition-colors">Clothing</Link></li>
              <li><Link href="/shop?category=accessories" className="hover:text-primary transition-colors">Accessories</Link></li>
              <li><Link href="/custom" className="hover:text-primary transition-colors font-medium text-accent">Design Your Own</Link></li>
            </ul>
          </div>

          {/* Business/Seller Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Partner With Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/dashboard/shopkeeper" className="hover:text-primary transition-colors">Seller Login</Link></li>
              <li><Link href="/sell-online" className="hover:text-primary transition-colors">Sell on UrbanZ</Link></li>
              <li><Link href="/advertise" className="hover:text-primary transition-colors">Advertise</Link></li>
              <li><Link href="/business-inquiry" className="hover:text-primary transition-colors">Business Inquiries</Link></li>
            </ul>
          </div>

          {/* Help & Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Need Help?</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/help/returns" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/help/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/help/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>

            <div className="mt-6 space-y-2 text-sm text-foreground">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-primary" />
                <span>support@urbanz.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-primary" />
                <span>+91 999 888 7777</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 UrbanZ Retail Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-2 grayscale opacity-50 relative h-6">
            <div className="relative w-10 h-4">
              <ImageWithFallback src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png" alt="UPI" fill className="object-contain" />
            </div>
            <div className="relative w-10 h-4">
              <ImageWithFallback src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Rupay-Logo.png/800px-Rupay-Logo.png" alt="Rupay" fill className="object-contain" />
            </div>
            <div className="relative w-10 h-6">
              <ImageWithFallback src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" fill className="object-contain" />
            </div>
            <div className="relative w-10 h-4">
              <ImageWithFallback src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" fill className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
